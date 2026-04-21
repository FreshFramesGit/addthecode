/**
 * POST /api/contact-submit
 *
 * Contact-form endpoint voor Add the Code — schrijft naar Sanity `inquiry`
 * document (archief), met Turnstile + honeypot + per-IP cooldown.
 *
 * Spec: docs/07j §2.
 * Schema: studio/src/schemaTypes/documents/inquiry.ts
 *
 * Voor legacy template `form-submit.ts` (schrijft naar `formSubmission`)
 * zie de andere endpoint; we hergebruiken helpers uit
 * `utils/form-submissions.ts`.
 */

import type { APIRoute } from "astro";
import {
  createInquiry,
  env,
  getClientIp,
  getMissingRequiredEnv,
  hasSanityWriteConfig,
  honeypotTriggered,
  isRateLimited,
  isTurnstileDevBypass,
  isValidEmail,
  json,
  parseBody,
  postWebhook,
  sanitize,
  verifyTurnstile,
} from "../../utils/form-submissions";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const requiredEnv = isTurnstileDevBypass() ? [] : ["TURNSTILE_SECRET_KEY"];
  const missingEnv = getMissingRequiredEnv(requiredEnv);

  if (missingEnv.length > 0 || !hasSanityWriteConfig()) {
    return json(
      { ok: false, error: "Formulier is nog niet geconfigureerd." },
      500,
    );
  }

  const body = await parseBody(request);

  // Honeypot — verborgen veld 'company_url' (zie ContactFormSection.astro)
  if (sanitize(body.company_url) || honeypotTriggered(body)) {
    // Silent success voor bots
    return json({ ok: true });
  }

  const name = sanitize(body.name);
  const email = sanitize(body.email)?.toLowerCase();
  const message = sanitize(body.message);

  if (!name || !email || !message) {
    return json(
      { ok: false, error: "Naam, e-mail en bericht zijn verplicht." },
      400,
    );
  }

  if (!isValidEmail(email)) {
    return json({ ok: false, error: "Vul een geldig e-mailadres in." }, 400);
  }

  // Turnstile check
  const token = sanitize(body["cf-turnstile-response"]) ?? sanitize(body.turnstileToken);
  if (!token && !isTurnstileDevBypass()) {
    return json({ ok: false, error: "Beveiligingscontrole mislukt." }, 400);
  }

  const ip = getClientIp(request);
  const tokenValid = await verifyTurnstile(token ?? "", ip);
  if (!tokenValid) {
    return json({ ok: false, error: "Beveiligingscontrole mislukt." }, 400);
  }

  if (isRateLimited("contact", ip)) {
    return json(
      { ok: false, error: "Te snel achter elkaar verstuurd. Probeer over 30 seconden opnieuw." },
      429,
    );
  }

  try {
    const inquiry = await createInquiry({
      name,
      email,
      company: sanitize(body.company),
      topic: sanitize(body.topic),
      message,
      sourcePage: sanitize(body.sourcePage) ?? sanitize(body.source_page),
    });

    // Optional webhook fanout (bv Resend mail-notificatie naar hello@addthecode.nl)
    await postWebhook("CONTACT_WEBHOOK_URL", {
      source: "contact",
      inquiryId: inquiry?._id,
      name,
      email,
      company: sanitize(body.company),
      topic: sanitize(body.topic),
      message,
    });

    return json({ ok: true, inquiryId: inquiry?._id });
  } catch (error) {
    console.error("Inquiry submission failed:", error);
    return json({ ok: false, error: "Versturen mislukt. Probeer opnieuw." }, 500);
  }
};
