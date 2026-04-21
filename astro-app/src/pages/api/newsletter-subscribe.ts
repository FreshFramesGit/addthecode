/**
 * POST /api/newsletter-subscribe
 *
 * Newsletter subscription endpoint voor Add the Code.
 *
 * Flow:
 *  1. Valideer email + honeypot + (optioneel) Turnstile + cooldown
 *  2. Schrijf naar Sanity `newsletterSubscription` (Sanity-first archive)
 *  3. Sync naar Brevo (optioneel, als BREVO_API_KEY ingesteld)
 *  4. Update sync-status in Sanity
 *
 * Sanity is het primaire archief — als Brevo faalt, blijft de inzending
 * bewaard met `brevoSyncStatus: 'failed'` en een error-message voor
 * handmatige recovery.
 *
 * Spec: docs/09-microcopy §2.2.
 * Schema: studio/src/schemaTypes/documents/newsletter-subscription.ts
 */

import type { APIRoute } from "astro";
import {
  createNewsletterSubscription,
  env,
  getClientIp,
  hasSanityWriteConfig,
  honeypotTriggered,
  isRateLimited,
  isValidEmail,
  json,
  parseBody,
  sanitize,
  syncToBrevo,
  updateNewsletterBrevoStatus,
} from "../../utils/form-submissions";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!hasSanityWriteConfig()) {
    return json(
      { ok: false, error: "Newsletter is nog niet geconfigureerd." },
      500,
    );
  }

  const body = await parseBody(request);

  if (honeypotTriggered(body) || sanitize(body.company_url)) {
    return json({ ok: true });
  }

  const email = sanitize(body.email)?.toLowerCase();

  if (!email || !isValidEmail(email)) {
    return json({ ok: false, error: "Vul een geldig e-mailadres in." }, 400);
  }

  const ip = getClientIp(request);
  if (isRateLimited("newsletter", ip)) {
    return json(
      { ok: false, error: "Te snel achter elkaar verstuurd. Probeer over 30 seconden opnieuw." },
      429,
    );
  }

  const source = (sanitize(body.source) as "footer" | "academy" | "other") ?? "other";

  // 1. Create Sanity document (primary storage)
  let subscriptionId: string | undefined;
  try {
    const sub = await createNewsletterSubscription({ email, source });
    subscriptionId = sub?._id;
  } catch (error) {
    console.error("Newsletter Sanity write failed:", error);
    return json({ ok: false, error: "Versturen mislukt. Probeer opnieuw." }, 500);
  }

  // 2. Sync to Brevo (optional — skipped if no BREVO_API_KEY)
  const listIdStr = env("BREVO_LIST_ID");
  const listId = listIdStr ? Number(listIdStr) : null;
  const brevoResult = await syncToBrevo(email, listId);

  // 3. Update sync-status in Sanity
  if (subscriptionId) {
    try {
      if (brevoResult.ok) {
        await updateNewsletterBrevoStatus(
          subscriptionId,
          "synced",
          brevoResult.brevoId ?? null,
        );
      } else if (brevoResult.reason !== "no-api-key") {
        // no-api-key = Brevo niet geconfigureerd, blijf 'pending'
        await updateNewsletterBrevoStatus(
          subscriptionId,
          "failed",
          null,
          brevoResult.reason ?? "unknown",
        );
      }
    } catch (error) {
      console.error("Newsletter Brevo-status update failed:", error);
      // Niet-kritiek — de subscription bestaat al
    }
  }

  return json({ ok: true, subscriptionId });
};
