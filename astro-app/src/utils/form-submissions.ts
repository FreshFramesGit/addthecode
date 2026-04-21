import { createClient } from "@sanity/client";

const COOLDOWN_MS = 30_000;
const ipCooldowns = new Map<string, number>();

function normalizeEnvValue(value: string | undefined): string {
  return (value ?? "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/\\n/g, "")
    .replace(/\r?\n/g, "")
    .trim();
}

export function env(key: string): string {
  return normalizeEnvValue(
    (import.meta as any).env?.[key] ||
      (typeof process !== "undefined" ? process.env[key] : undefined),
  );
}

export function sanitize(value: string | undefined | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function json(body: Record<string, any>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export function getMissingRequiredEnv(keys: string[]): string[] {
  return keys.filter((key) => !env(key));
}

export function hasSanityWriteConfig(): boolean {
  const projectId = env("PUBLIC_SANITY_PROJECT_ID") || env("PUBLIC_SANITY_STUDIO_PROJECT_ID");
  const dataset = env("PUBLIC_SANITY_DATASET") || env("PUBLIC_SANITY_STUDIO_DATASET");
  const token = env("SANITY_API_WRITE_TOKEN");
  return Boolean(projectId && dataset && token);
}

export async function parseBody(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const jsonBody = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!jsonBody || typeof jsonBody !== "object") return {};

    return Object.fromEntries(
      Object.entries(jsonBody).map(([key, value]) => [
        key,
        typeof value === "string" ? value : String(value ?? ""),
      ]),
    );
  }

  const formData = await request.formData();
  const body: Record<string, string> = {};
  formData.forEach((value, key) => {
    body[key] = typeof value === "string" ? value : "";
  });
  return body;
}

export function honeypotTriggered(body: Record<string, string>): boolean {
  return Boolean(sanitize(body.website) || sanitize(body._honey));
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "";
  return forwarded.split(",")[0]?.trim().toLowerCase() || "unknown";
}

// Short debounce only. This improves UX for duplicate clicks but is not durable abuse protection.
export function isRateLimited(scope: string, ip: string): boolean {
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const previous = ipCooldowns.get(key) ?? 0;

  if (now - previous < COOLDOWN_MS) {
    return true;
  }

  ipCooldowns.set(key, now);
  return false;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const TURNSTILE_TEST_SECRETS = new Set([
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
  "3x0000000000000000000000000000000AA",
]);

export function isTurnstileDevBypass(): boolean {
  const isDev = (import.meta as any).env?.DEV === true || env("NODE_ENV") === "development";
  if (!isDev) return false;

  const secret = env("TURNSTILE_SECRET_KEY");
  if (!secret) return true;

  return TURNSTILE_TEST_SECRETS.has(secret);
}

export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (isTurnstileDevBypass()) return true;

  const secret = env("TURNSTILE_SECRET_KEY");
  if (!secret || !token) return false;

  const payload = new URLSearchParams({
    secret,
    response: token,
  });

  if (ip && ip !== "unknown") {
    payload.set("remoteip", ip);
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: payload.toString(),
    });

    if (!response.ok) return false;

    const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
    return Boolean(result?.success);
  } catch (error) {
    console.error("Turnstile verification failed:", error);
    return false;
  }
}

function getWriteClient() {
  const projectId = env("PUBLIC_SANITY_PROJECT_ID") || env("PUBLIC_SANITY_STUDIO_PROJECT_ID");
  const dataset = env("PUBLIC_SANITY_DATASET") || env("PUBLIC_SANITY_STUDIO_DATASET");
  const token = env("SANITY_API_WRITE_TOKEN");

  if (!projectId || !dataset || !token) {
    throw new Error("Sanity write client is not configured.");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: "2026-03-29",
    useCdn: false,
    token,
  });
}

export async function createFormSubmission(document: Record<string, any>) {
  const client = getWriteClient();
  return client.create({
    _type: "formSubmission",
    status: "new",
    submittedAt: new Date().toISOString(),
    ...document,
  });
}

/**
 * Add the Code — inquiry (/contact form submission).
 * Spec: docs/07j §2. Fields read-only in Studio, status + notes editable.
 */
export async function createInquiry(fields: {
  name?: string;
  email?: string;
  company?: string;
  topic?: string;
  message?: string;
  sourcePage?: string;
}) {
  const client = getWriteClient();
  return client.create({
    _type: "inquiry",
    status: "new",
    receivedAt: new Date().toISOString(),
    ...fields,
  });
}

/**
 * Add the Code — newsletter subscription.
 * Geschreven bij submit. Brevo-sync gebeurt apart (zie syncToBrevo).
 */
export async function createNewsletterSubscription(fields: {
  email: string;
  source: "footer" | "academy" | "other";
}) {
  const client = getWriteClient();
  return client.create({
    _type: "newsletterSubscription",
    active: true,
    subscribedAt: new Date().toISOString(),
    brevoSyncStatus: "pending",
    ...fields,
  });
}

/**
 * Brevo sync — POST naar Brevo contacts API.
 * Vereist BREVO_API_KEY env-var. Faalt graceful: retourneert null en
 * laat caller brevoSyncStatus op 'failed' zetten.
 *
 * Docs: https://developers.brevo.com/reference/createcontact
 */
export async function syncToBrevo(email: string, listId?: number | null) {
  const apiKey = env("BREVO_API_KEY");
  if (!apiKey) return { ok: false, reason: "no-api-key" as const };

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email,
        listIds: listId ? [listId] : [],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      return { ok: false, reason: "api-error" as const, detail: errorBody };
    }

    const result = (await response.json().catch(() => null)) as { id?: number } | null;
    return { ok: true, brevoId: result?.id?.toString() ?? null };
  } catch (error) {
    console.error("Brevo sync failed:", error);
    return { ok: false, reason: "network-error" as const };
  }
}

/**
 * Update een newsletterSubscription met Brevo sync-resultaat.
 */
export async function updateNewsletterBrevoStatus(
  subscriptionId: string,
  status: "synced" | "failed",
  brevoId?: string | null,
  errorMessage?: string,
) {
  const client = getWriteClient();
  const patch: Record<string, any> = {
    brevoSyncStatus: status,
    lastSyncAttemptAt: new Date().toISOString(),
  };
  if (brevoId) patch.brevoSubscriberId = brevoId;
  if (errorMessage) patch.syncErrorMessage = errorMessage;

  return client.patch(subscriptionId).set(patch).commit();
}

export function buildAttribution(body: Record<string, string>) {
  return {
    source: sanitize(body.utm_source),
    medium: sanitize(body.utm_medium),
    campaign: sanitize(body.utm_campaign),
    term: sanitize(body.utm_term),
    content: sanitize(body.utm_content),
    landingPage: sanitize(body.landing_page),
    referrer: sanitize(body.referrer),
    gclid: sanitize(body.gclid),
    fbclid: sanitize(body.fbclid),
  };
}

export async function postWebhook(envKey: string, payload: Record<string, any>) {
  const url = env(envKey);
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error(`Webhook fanout failed for ${envKey}:`, error);
  }
}
