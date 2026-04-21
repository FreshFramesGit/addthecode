/**
 * seed-defaults.ts — vult de basis-singletons (Component Defaults, Site Settings,
 * Navigation, utility pages) met initiële content uit /docs.
 *
 * Doel: nieuwe Studio in productie-mode kan direct content-fill-in starten zonder
 * een handmatige tour door alle settings.
 *
 * Status: SKELETON (Phase 1.5 — Phase 3 vervolledigt en draait)
 *
 * ── Hoe te draaien (Phase 3):
 *
 *   cd studio
 *   SANITY_API_WRITE_TOKEN=skXXX... npx tsx ../scripts/seed-defaults.ts
 *
 * Of vanuit project-root met sanity-cli sessie:
 *
 *   npx --workspace=studio tsx ../scripts/seed-defaults.ts
 *
 * ── Vereiste env:
 *   SANITY_STUDIO_PROJECT_ID    (al in studio/.env)
 *   SANITY_STUDIO_DATASET       (al in studio/.env)
 *   SANITY_API_WRITE_TOKEN      (Editor-role token uit sanity.io/manage)
 *
 * ── Idempotency:
 *   Gebruikt `createOrReplace` op fixed singleton-IDs. Veilig om herhaaldelijk
 *   te draaien. Bestaande edits worden OVERSCHREVEN — eerst backup maken als
 *   editor al content heeft toegevoegd.
 */

import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId) {
  throw new Error('SANITY_STUDIO_PROJECT_ID env-var ontbreekt.')
}
if (!token) {
  throw new Error(
    'SANITY_API_WRITE_TOKEN env-var ontbreekt. Maak een Editor-role token via sanity.io/manage.'
  )
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-03-29',
  useCdn: false,
})

// ─── Site Settings ──────────────────────────────────────────

async function seedSiteSettings() {
  console.log('▸ Site Settings…')
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'Add the Code',
    siteDescription:
      'Custom design. Custom code. AI-versnelde bouw. Nederlandse studio voor merk-eigen websites en web-apps.',
    tagline: 'Custom design. Custom code. AI-versnelde bouw.',
    languageCode: 'nl',
    timeZone: 'Europe/Amsterdam',
    email: 'hello@addthecode.nl',
    phone: '06 48 77 28 07',
    studioAddress: {
      addressLine1: 'Nieuwe Prinsenkade 4',
      postalCode: '4811 VC',
      city: 'Breda',
      country: 'Nederland',
      openingHours: 'werkdagen 9:00–17:30',
      visitingNote:
        'Op afspraak — loop niet zomaar binnen, dan zitten we meestal in iets wat we niet kunnen onderbreken.',
    },
    enableSitemap: true,
    // ⚠ TODO Phase 3: defaultSeo, favicon, webclip, globalCanonicalUrl invullen
    // ⚠ TODO Phase 4: googleSiteVerificationId
  })
  console.log('  ✓')
}

// ─── Component Defaults ────────────────────────────────────

async function seedComponentDefaults() {
  console.log('▸ Component Defaults (CTA-refrein varianten + newsletter + expectation-steps)…')
  await client.createOrReplace({
    _id: 'componentDefaults',
    _type: 'componentDefaults',

    // CTA-refrein varianten — bron: docs/09-microcopy §11
    ctaRefreins: [
      {
        _key: 'primary',
        key: 'primary',
        statement: 'Klaar om weer met eigen code te bouwen?',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: { linkKind: 'internalPage', anchorId: '' /* TBD: ref naar contactPage */ },
      },
      {
        _key: 'work-index',
        key: 'work-index',
        statement: 'Custom is terug — laten we het samen terugbouwen.',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: { linkKind: 'internalPage' },
      },
      {
        _key: 'case-detail',
        key: 'case-detail',
        statement: 'Eén vraag: wat probeer je nu op te lossen?',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: { linkKind: 'internalPage' },
      },
      {
        _key: 'team',
        key: 'team',
        statement: 'Weer merkeigen. Weer bezitbaar. Weer betaalbaar.',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: { linkKind: 'internalPage' },
      },
      {
        _key: 'services-design',
        key: 'services-design',
        statement: 'Van template terug naar merk? Plan een gesprek.',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: { linkKind: 'internalPage' },
      },
      {
        _key: 'services-build',
        key: 'services-build',
        statement: 'Klaar om weer met eigen code te bouwen?',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: { linkKind: 'internalPage' },
      },
      {
        _key: 'services-automate',
        key: 'services-automate',
        statement: 'Eén vraag: wat probeer je nu op te lossen?',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: { linkKind: 'internalPage' },
      },
      {
        _key: 'academy-index',
        key: 'academy-index',
        statement: 'Custom is terug — laten we het samen terugbouwen.',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: { linkKind: 'internalPage' },
      },
      {
        _key: 'essay-detail',
        key: 'essay-detail',
        statement: 'Eén vraag: wat probeer je nu op te lossen?',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: { linkKind: 'internalPage' },
      },
      {
        _key: 'approach',
        key: 'approach',
        statement: 'Klaar om weer met eigen code te bouwen?',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: { linkKind: 'internalPage' },
      },
    ],

    // Newsletter copy — bron: docs/09-microcopy §2.2
    newsletter: {
      intro: 'Eens per maand een essay over custom-code en AI-versnelde bouw.',
      placeholder: 'jij@bedrijf.nl',
      buttonLabel: 'Aanmelden',
      buttonLabelSubmitting: 'Aanmelden…',
      helperLine: 'Ongeveer één per maand. Afmelden vanuit elke mail.',
      successMessage:
        '◌ Ingeschreven. De volgende essay verschijnt binnen ±30 dagen in je inbox.',
      errorMessage:
        'Er ging iets mis. Probeer het over even opnieuw, of stuur je adres naar hello@addthecode.nl.',
    },

    // Expectation steps (/contact §3) — bron: docs/07j §3
    expectationSteps: {
      heading: '◌  Wat er gebeurt nadat je verstuurt',
      steps: [
        {
          _key: 'step-01',
          stepNumber: '01',
          label: 'Binnen één werkdag: een eerste reactie',
          description:
            'Alex stuurt een kort bericht terug. Meestal met één of twee vervolgvragen om beter te begrijpen waar je staat, of met een voorstel voor een kennismakings-gesprek.',
        },
        {
          _key: 'step-02',
          stepNumber: '02',
          label: 'Kennismakings-gesprek (30–45 minuten, vrijblijvend)',
          description:
            'Online of op onze studio in Breda. We praten over de situatie, wat er op tafel ligt, en of een vervolg zinvol is. Geen sales-pitch, geen slides.',
        },
        {
          _key: 'step-03',
          stepNumber: '03',
          label: 'Voorstel (binnen één week na het gesprek)',
          description:
            'Als er een vervolg past, krijg je een voorstel met scope, aanpak en budget-kader. Helder, op één of twee pagina\'s. Geen 40-pagina\'s-pitch-doc.',
        },
      ],
    },
  })
  console.log('  ✓')
}

// ─── Navigation ────────────────────────────────────────────

async function seedNavigation() {
  console.log('▸ Navigation (skeleton — content-fill in Phase 3)…')
  // TODO Phase 3: vul navigation-links per docs/06-sitemap-en-IA §1
  console.log('  ⏭  (skip — TODO Phase 3)')
}

// ─── Utility pages ─────────────────────────────────────────

async function seedUtilityPages() {
  console.log('▸ Utility pages (404 / 500 / offline / thank-you — minimal seed)…')

  await client.createOrReplace({
    _id: 'notFoundPage',
    _type: 'notFoundPage',
    heading: '404 — Deze route bestaat niet',
    ctaLabel: 'Terug naar home',
  })

  await client.createOrReplace({
    _id: 'errorPage',
    _type: 'errorPage',
    heading: 'Er ging iets mis aan onze kant',
    ctaLabel: 'Terug naar home',
  })

  await client.createOrReplace({
    _id: 'offlinePage',
    _type: 'offlinePage',
    heading: 'Geen verbinding',
    ctaLabel: 'Probeer opnieuw',
  })

  await client.createOrReplace({
    _id: 'thankYouPage',
    _type: 'thankYouPage',
    heading: 'Bedankt — bericht ontvangen',
    ctaLabel: 'Terug naar home',
  })

  console.log('  ✓')
}

// ─── Main ──────────────────────────────────────────────────

async function main() {
  console.log(`Seed-defaults — Sanity ${projectId}/${dataset}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await seedSiteSettings()
  await seedComponentDefaults()
  await seedNavigation()
  await seedUtilityPages()

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Klaar. Open Sanity Studio om de seeds te bekijken/aanpassen.')
}

main().catch((err) => {
  console.error('FOUT:', err)
  process.exit(1)
})
