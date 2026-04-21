import type { APIRoute } from "astro";
import {
  buildAttribution,
  createFormSubmission,
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

function prefersJson(request: Request): boolean {
  const contentType = request.headers.get("content-type") ?? "";
  const accept = request.headers.get("accept") ?? "";
  return contentType.includes("application/json") || accept.includes("application/json");
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const wantsJson = prefersJson(request);
  const requiredEnv = isTurnstileDevBypass() ? [] : ["TURNSTILE_SECRET_KEY"];
  const missingEnv = getMissingRequiredEnv(requiredEnv);

  if (missingEnv.length > 0 || !hasSanityWriteConfig()) {
    return json({ ok: false, error: "Formulier is nog niet geconfigureerd." }, 500);
  }

  const body = await parseBody(request);

  if (!sanitize(body.name) || !sanitize(body.email)) {
    return json({ ok: false, error: "Naam en e-mail zijn verplicht." }, 400);
  }

  if (honeypotTriggered(body)) {
    return wantsJson ? json({ ok: true }) : redirect("/thank-you", 303);
  }

  const token = sanitize(body.turnstileToken);
  if (!token && !isTurnstileDevBypass()) {
    return json({ ok: false, error: "Beveiligingscontrole mislukt." }, 400);
  }

  const ip = getClientIp(request);
  const isValidToken = await verifyTurnstile(token ?? "", ip);
  if (!isValidToken) {
    return json({ ok: false, error: "Beveiligingscontrole mislukt." }, 400);
  }

  if (isRateLimited("contact", ip)) {
    return json({ ok: false, error: "Probeer het over een halve minuut opnieuw." }, 429);
  }

  const email = sanitize(body.email)?.toLowerCase() ?? "";
  if (!isValidEmail(email)) {
    return json({ ok: false, error: "Vul een geldig e-mailadres in." }, 400);
  }

  const project = sanitize(body.project) ?? sanitize(body.message);
  const budgetBucket = sanitize(body.budgetBucket) ?? sanitize(body.budget_bucket);

  try {
    const submission = await createFormSubmission({
      source: "contact",
      name: sanitize(body.name),
      email,
      phone: sanitize(body.phone),
      organization: sanitize(body.organization),
      role: sanitize(body.role),
      intent: sanitize(body.intent),
      project,
      budgetBucket,
      timing: sanitize(body.timing),
      utm: buildAttribution(body),
    });

    // Sanity inbox is the primary storage. External webhook/ESP fanout is optional.
    await postWebhook("CONTACT_WEBHOOK_URL", {
      source: "contact",
      submissionId: submission?._id,
      name: sanitize(body.name),
      email,
      intent: sanitize(body.intent),
      organization: sanitize(body.organization),
      project,
      budgetBucket,
      utm: buildAttribution(body),
    });

    return wantsJson ? json({ ok: true }) : redirect("/thank-you", 303);
  } catch (error) {
    console.error("Contact submission failed:", error);
    return json({ ok: false, error: "Versturen mislukt. Probeer opnieuw." }, 500);
  }
};
