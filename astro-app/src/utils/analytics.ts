/**
 * Analytics helpers — centraal punt voor dataLayer-events.
 *
 * Alle business-events lopen via deze module, niet via direct
 * `dataLayer.push` of `gtag()` calls in components.
 *
 * Reden:
 *  1. Type-safety op event-namen + parameters
 *  2. Eén plek om Consent Mode-checks te veranderen
 *  3. Eén plek om events te swappen wanneer we van GA4 naar iets anders gaan
 *
 * Consent Mode v2: events worden ALTIJD gepusht naar dataLayer. GA4 in
 * GTM beslist zelf op basis van current consent-state of het event
 * doorvalt naar Google. Wij hoeven dus niet te checken of consent
 * granted is — Consent Mode regelt dat.
 */

type GtagFn = (...args: unknown[]) => void

interface DataLayerWindow extends Window {
  dataLayer?: unknown[]
  gtag?: GtagFn
}

function getDataLayer(): unknown[] | null {
  if (typeof window === 'undefined') return null
  const w = window as DataLayerWindow
  return w.dataLayer ?? null
}

/**
 * Push raw event naar dataLayer. Gebruik de specifieke helpers
 * hieronder ipv deze direct aan te roepen.
 */
function pushEvent(eventName: string, params: Record<string, unknown> = {}): void {
  const dl = getDataLayer()
  if (!dl) return // geen dataLayer = geen GTM geladen = geen-tracking-mode (jij)
  dl.push({ event: eventName, ...params })
}

// ─── Specifieke business-events ─────────────────────────────────────

/**
 * Contact form succesvol verstuurd.
 * Markeer als Key Event in GA4 → telt als conversion.
 */
export function trackContactFormSubmit(params: {
  topic?: string
  has_company?: boolean
}): void {
  pushEvent('contact_form_submit', {
    contact_topic: params.topic ?? 'unknown',
    has_company: params.has_company ?? false,
  })
}

/**
 * Newsletter aanmelding succesvol.
 * Markeer als Key Event in GA4 → telt als conversion.
 */
export function trackNewsletterSignup(params: { source: string }): void {
  pushEvent('newsletter_signup', {
    signup_source: params.source, // 'footer' | 'academy' | etc.
  })
}

/**
 * Klik op een primaire CTA-knop ("Plan een gesprek", etc.).
 * Niet als conversion — wel om de funnel te begrijpen.
 */
export function trackCtaClick(params: {
  label: string
  location: string // page-path of section-naam
}): void {
  pushEvent('cta_click', {
    cta_label: params.label,
    cta_location: params.location,
  })
}

/**
 * Case-detail pagina geopend. Met case-meta voor segmentatie.
 */
export function trackCaseView(params: {
  slug: string
  layer: 'launch' | 'in-flight' | 'heritage' | string
  client?: string
}): void {
  pushEvent('case_view', {
    case_slug: params.slug,
    case_layer: params.layer,
    case_client: params.client ?? 'unknown',
  })
}

/**
 * Essay-detail 75% gescrolld = "leesintentie".
 * Wordt 1x per page-load fired (idempotent via flag).
 */
export function trackEssayReadComplete(params: {
  slug: string
  category?: string
}): void {
  pushEvent('essay_read_complete', {
    essay_slug: params.slug,
    essay_category: params.category ?? 'unknown',
  })
}
