/**
 * seed-defaults.ts — vult basis-singletons + homepage met initiële content.
 *
 * Doel: nieuwe Studio in productie of een vers-gebootstrapt project kan
 * direct content-fill-in starten. Reproduceerbare fixture-seed voor de
 * homepage-pipeline (Phase 2 verification gate).
 *
 * ── Hoe te draaien:
 *
 *   cd studio
 *   SANITY_API_WRITE_TOKEN=skXXX... npx tsx ../scripts/seed-defaults.ts
 *
 * ── Vereiste env (uit studio/.env):
 *   SANITY_STUDIO_PROJECT_ID
 *   SANITY_STUDIO_DATASET
 *   SANITY_API_WRITE_TOKEN  (Editor-role token uit sanity.io/manage)
 *
 * ── Idempotency:
 *   Gebruikt `createOrReplace` op fixed singleton-IDs. Veilig om herhaaldelijk
 *   te draaien. Bestaande edits worden OVERSCHREVEN.
 *
 * ── Volgorde (belangrijk voor cmsLink-references):
 *   1. Utility pages (404 / 500 / offline / thank-you)
 *   2. Pagina-singletons (contact, work, team, approach, services x3, academy)
 *   3. Site Settings (refereert nergens naar)
 *   4. Component Defaults (refereert naar contactPage via cmsLink)
 *   5. Navigation (refereert naar pagina-singletons)
 *   6. Home Page (refereert naar approachPage, contactPage)
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

// ─── Helper: cmsLink builder ─────────────────────────────────

/** Maak een cmsLink-object dat naar een interne singleton wijst (via _id). */
function cmsLinkToInternalDoc(docId: string) {
  return {
    _type: 'cmsLink',
    linkKind: 'internalPage',
    internalPage: { _type: 'reference', _ref: docId },
  }
}

/** Maak een cmsLink-object voor een externe URL. */
function cmsLinkToExternal(url: string) {
  return {
    _type: 'cmsLink',
    linkKind: 'external',
    externalUrl: url,
  }
}

/** Maak een Portable Text-blok van een enkele alinea met optionele inline italic. */
function portableTextParagraph(parts: Array<{ text: string; italic?: boolean }>) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 10),
    style: 'normal',
    markDefs: [],
    children: parts.map((part, i) => ({
      _type: 'span',
      _key: `${Math.random().toString(36).slice(2, 8)}-${i}`,
      text: part.text,
      marks: part.italic ? ['em'] : [],
    })),
  }
}

// ─── 1. Utility pages ────────────────────────────────────────

async function seedUtilityPages() {
  console.log('▸ Utility pages (404 / 500 / offline / thank-you)…')

  await client.createOrReplace({
    _id: 'notFoundPage',
    _type: 'notFoundPage',
    heading: '404 — Deze route bestaat niet',
    ctaLabel: 'Terug naar home',
    ctaLink: cmsLinkToInternalDoc('homePage'),
  })

  await client.createOrReplace({
    _id: 'errorPage',
    _type: 'errorPage',
    heading: 'Er ging iets mis aan onze kant',
    ctaLabel: 'Terug naar home',
    ctaLink: cmsLinkToInternalDoc('homePage'),
  })

  await client.createOrReplace({
    _id: 'offlinePage',
    _type: 'offlinePage',
    heading: 'Geen verbinding',
    ctaLabel: 'Probeer opnieuw',
    ctaLink: cmsLinkToInternalDoc('homePage'),
  })

  await client.createOrReplace({
    _id: 'thankYouPage',
    _type: 'thankYouPage',
    heading: 'Bedankt — bericht ontvangen',
    ctaLabel: 'Terug naar home',
    ctaLink: cmsLinkToInternalDoc('homePage'),
  })

  console.log('  ✓')
}

// ─── 2. Pagina-singletons (shells) ───────────────────────────

async function seedPageShells() {
  console.log('▸ Pagina-singletons (shells — content komt later via Studio)…')

  const pageDocs = [
    {
      _id: 'contactPage',
      _type: 'contactPage',
      seo: { title: 'Contact — Add the Code', description: 'Plan een gesprek met Alex.' },
    },
    {
      _id: 'workIndexPage',
      _type: 'workIndexPage',
      seo: {
        title: 'Werk — drielaag van launch tot heritage',
        description: 'Cases waarin we aan custom code werkten.',
      },
    },
    {
      _id: 'teamPage',
      _type: 'teamPage',
      seo: {
        title: 'Team — Add the Code',
        description: 'De mensen achter Add the Code, sinds 2017 als Fresh Frames.',
      },
    },
    {
      _id: 'approachPage',
      _type: 'approachPage',
      seo: {
        title: 'Werkwijze — Discovery, Design, Build, Ship, Maintain',
        description: 'Onze vijf-fasen-methode.',
      },
    },
    {
      _id: 'serviceDesignPage',
      _type: 'serviceDesignPage',
      seo: { title: 'Custom design — Add the Code', description: 'Merk-eigen design service.' },
    },
    {
      _id: 'serviceBuildPage',
      _type: 'serviceBuildPage',
      seo: { title: 'Custom code — Add the Code', description: 'Astro / Sanity / Vercel build.' },
    },
    {
      _id: 'serviceAutomatePage',
      _type: 'serviceAutomatePage',
      seo: {
        title: 'AI-versnelde bouw — Add the Code',
        description: 'Claude als bouw-partner, niet als product.',
      },
    },
    {
      _id: 'academyIndexPage',
      _type: 'academyIndexPage',
      seo: { title: 'Academy — Add the Code', description: 'Essays over custom-code en AI.' },
    },
  ]

  for (const doc of pageDocs) {
    await client.createOrReplace(doc as any)
  }

  console.log(`  ✓ (${pageDocs.length} pagina-shells)`)
}

// ─── 3. Site Settings ────────────────────────────────────────

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
    // ⚠ TODO Phase 4: defaultSeo, favicon, webclip, globalCanonicalUrl, GSC ID
  })
  console.log('  ✓')
}

// ─── 4. Component Defaults ───────────────────────────────────

async function seedComponentDefaults() {
  console.log('▸ Component Defaults (CTA-refrein varianten + newsletter + expectation-steps)…')

  // Alle CTA's wijzen primair naar contactPage (refereerbaar nu utility-pages
  // + page-shells geseed zijn).
  const contactLink = cmsLinkToInternalDoc('contactPage')

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
        buttonLink: contactLink,
      },
      {
        _key: 'work-index',
        key: 'work-index',
        statement: 'Custom is terug — laten we het samen terugbouwen.',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: contactLink,
      },
      {
        _key: 'case-detail',
        key: 'case-detail',
        statement: 'Eén vraag: wat probeer je nu op te lossen?',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: contactLink,
      },
      {
        _key: 'team',
        key: 'team',
        statement: 'Weer merkeigen. Weer bezitbaar. Weer betaalbaar.',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: contactLink,
      },
      {
        _key: 'services-design',
        key: 'services-design',
        statement: 'Van template terug naar merk? Plan een gesprek.',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: contactLink,
      },
      {
        _key: 'services-build',
        key: 'services-build',
        statement: 'Klaar om weer met eigen code te bouwen?',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: contactLink,
      },
      {
        _key: 'services-automate',
        key: 'services-automate',
        statement: 'Eén vraag: wat probeer je nu op te lossen?',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: contactLink,
      },
      {
        _key: 'academy-index',
        key: 'academy-index',
        statement: 'Custom is terug — laten we het samen terugbouwen.',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: contactLink,
      },
      {
        _key: 'essay-detail',
        key: 'essay-detail',
        statement: 'Eén vraag: wat probeer je nu op te lossen?',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: contactLink,
      },
      {
        _key: 'approach',
        key: 'approach',
        statement: 'Klaar om weer met eigen code te bouwen?',
        buttonLabel: 'Plan een gesprek →',
        buttonLink: contactLink,
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

// ─── 5. Navigation ───────────────────────────────────────────

async function seedNavigation() {
  console.log('▸ Navigation (main + footer per docs/06)…')
  await client.createOrReplace({
    _id: 'navigation',
    _type: 'navigation',
    mainNav: [
      {
        _key: 'work',
        label: 'Werk',
        link: cmsLinkToInternalDoc('workIndexPage'),
      },
      {
        _key: 'approach',
        label: 'Werkwijze',
        link: cmsLinkToInternalDoc('approachPage'),
      },
      {
        _key: 'services',
        label: 'Diensten',
        link: cmsLinkToInternalDoc('serviceDesignPage'),
        children: [
          {
            _key: 'svc-design',
            label: 'Design',
            link: cmsLinkToInternalDoc('serviceDesignPage'),
          },
          {
            _key: 'svc-build',
            label: 'Build',
            link: cmsLinkToInternalDoc('serviceBuildPage'),
          },
          {
            _key: 'svc-automate',
            label: 'Automate',
            link: cmsLinkToInternalDoc('serviceAutomatePage'),
          },
        ],
      },
      {
        _key: 'team',
        label: 'Team',
        link: cmsLinkToInternalDoc('teamPage'),
      },
      {
        _key: 'academy',
        label: 'Academy',
        link: cmsLinkToInternalDoc('academyIndexPage'),
      },
      {
        _key: 'contact',
        label: 'Contact',
        link: cmsLinkToInternalDoc('contactPage'),
      },
    ],
    footerNav: [
      { _key: 'fnav-work', label: 'Werk', link: cmsLinkToInternalDoc('workIndexPage') },
      { _key: 'fnav-approach', label: 'Werkwijze', link: cmsLinkToInternalDoc('approachPage') },
      {
        _key: 'fnav-design',
        label: 'Custom design',
        link: cmsLinkToInternalDoc('serviceDesignPage'),
      },
      {
        _key: 'fnav-build',
        label: 'Custom code',
        link: cmsLinkToInternalDoc('serviceBuildPage'),
      },
      {
        _key: 'fnav-automate',
        label: 'AI-versnelde bouw',
        link: cmsLinkToInternalDoc('serviceAutomatePage'),
      },
      { _key: 'fnav-team', label: 'Team', link: cmsLinkToInternalDoc('teamPage') },
      { _key: 'fnav-academy', label: 'Academy', link: cmsLinkToInternalDoc('academyIndexPage') },
      { _key: 'fnav-contact', label: 'Contact', link: cmsLinkToInternalDoc('contactPage') },
    ],
  })
  console.log('  ✓')
}

// ─── 6. Home Page ────────────────────────────────────────────

async function seedHomePage() {
  console.log('▸ Home Page (hero variant C + 9 secties per docs/07a)…')

  const blocks = [
    // ─── 1. Hero (variant C, 3-delig) ───
    {
      _key: 'hero-home',
      _type: 'heroHomeBlock',
      enabled: true,
      preClaim: '◌ Fresh Frames · sinds 2017 · Breda',
      headlineParts: [
        'Custom design.',
        'Custom code.',
        'AI-versnelde bouw.',
      ],
      subClaim:
        'We bouwen merk-eigen websites en web-apps die weer van jou zijn — door ambacht aan code te koppelen, niet door templates te configureren.',
      ctas: [
        {
          _key: 'cta-primary',
          label: 'Plan een gesprek',
          variant: 'primary',
          link: cmsLinkToInternalDoc('contactPage'),
        },
        {
          _key: 'cta-secondary',
          label: 'Bekijk ons werk',
          variant: 'secondary',
          link: cmsLinkToInternalDoc('workIndexPage'),
        },
      ],
      showThinkingRing: true,
      tone: 'paper',
    },

    // ─── 2. Pitch-opening ───
    {
      _key: 'pitch',
      _type: 'pitchOpeningBlock',
      enabled: true,
      preClaim: '◌ Wat we doen',
      body: [
        portableTextParagraph([
          { text: 'Wij maken sites en apps waarin elk detail een keuze is. Geen ' },
          { text: 'templates die je merk afzwakken', italic: true },
          {
            text: ', geen frameworks die de structuur dicteren. We tekenen, we coderen, en we laten AI ons werk versnellen — zonder de regie weg te geven.',
          },
        ]),
      ],
      maxWidth: 'main',
      tone: 'paper',
    },

    // ─── 3. Service triptych ───
    {
      _key: 'services',
      _type: 'serviceTriptychBlock',
      enabled: true,
      preClaim: '◌ Drie diensten',
      heading: 'Design, code en versnelling — onder één dak.',
      tiles: [
        {
          _key: 'tile-design',
          title: 'Custom design',
          tagline: 'IDENTITEIT',
          description:
            'Visueel systeem dat past bij hoe je markt jou herkent. Geen agency-blueprint, wel een eigen toon.',
          ctaLabel: 'Lees meer',
          ctaLink: cmsLinkToInternalDoc('serviceDesignPage'),
          icon: 'design',
        },
        {
          _key: 'tile-build',
          title: 'Custom code',
          tagline: 'ARCHITECTUUR',
          description:
            'Astro, Sanity, Vercel — een stack waar jij eigenaar van blijft. Niet vendor-locked.',
          ctaLabel: 'Lees meer',
          ctaLink: cmsLinkToInternalDoc('serviceBuildPage'),
          icon: 'build',
        },
        {
          _key: 'tile-automate',
          title: 'AI-versnelde bouw',
          tagline: 'VERSNELLING',
          description:
            'Claude als bouw-partner, niet als product. We versnellen onze eigen code-flow zodat jij sneller live gaat.',
          ctaLabel: 'Lees meer',
          ctaLink: cmsLinkToInternalDoc('serviceAutomatePage'),
          icon: 'automate',
        },
      ],
      tone: 'paper',
    },

    // ─── 4. Werk-uitlichting (featured launch case) ───
    {
      _key: 'featured-work',
      _type: 'projectGridBlock',
      enabled: true,
      preClaim: '◌ Recent werk',
      heading: 'Eén launch-case, eerlijk uitgelicht.',
      layerFilter: 'launch',
      maxItems: 1,
      cardLayoutVariant: 'featured-60-40',
      showFilterChips: false,
      tone: 'paper',
    },

    // ─── 5. Vijf principes (docs/03 §1) ───
    {
      _key: 'principles',
      _type: 'principlesBlock',
      enabled: true,
      preClaim: '◌ Onze principes',
      heading: 'Vijf regels waarop elke beslissing toetsbaar is.',
      principles: [
        {
          _key: 'p-1',
          title: 'Craft visible, speed implied.',
          description:
            'Ambacht is zichtbaar; snelheid vertellen we niet maar laten we voelen in flow en antwoordtijd. Geen "5× sneller"-claims op de site zelf.',
        },
        {
          _key: 'p-2',
          title: "Borrow Anthropic's warmth, keep our signal.",
          description:
            "We lenen Claude's warme oranje en de paper-ink-basis, maar Add the Code heeft een eigen secundair signaal (Teal) en eigen typografie (FK Display). Herkenbaar zonder Anthropic te imiteren.",
        },
        {
          _key: 'p-3',
          title: 'Every motion means something.',
          description:
            'Een beweging zonder functie is decoratie, en decoratie voelt op een AI-site snel als trucage. De Thinking Ring beweegt omdat er gedacht wordt — niet omdat er een element verschijnt.',
        },
        {
          _key: 'p-4',
          title: 'Tokens voor alles, uitzonderingen zijn uitzonderingen.',
          description:
            'Kleuren, afstanden, radii en fonts komen uit een vaste set. Wat niet in de set past, verdient twee keer een gesprek.',
        },
        {
          _key: 'p-5',
          title: 'Grid bends, not breaks.',
          description:
            'Het 12-koloms grid draagt 95% van de pagina. Per sectie mag één element bewust uitbreken — gecontroleerd, met reden, nooit chaos.',
        },
      ],
      layoutVariant: 'stack',
      tone: 'paper',
    },

    // ─── 6. Quote-cluster ───
    {
      _key: 'quotes',
      _type: 'quoteClusterBlock',
      enabled: true,
      preClaim: '◌ Wat klanten zeggen',
      heading: null,
      primaryQuote: {
        quote:
          'Dit is de eerste site waarin we het gevoel hebben dat we weer eigenaar zijn van de code, niet huurder van een template.',
        name: 'TBD — Recornect',
        role: 'Productmanager',
        company: 'Recornect',
      },
      secondaryQuotes: [
        {
          quote:
            'De CMS-tijd is met 85% gedaald. Wat een uur kostte is nu in tien minuten klaar.',
          name: 'TBD — Bell Hammerson',
          role: 'Hoofd Communicatie',
          company: 'Bell Hammerson',
        },
        {
          quote:
            'AI versnelt hun code-flow op een manier die je niet als trucage voelt — alles blijft onderhoudbaar.',
          name: 'TBD — Universiteit van Nederland',
          role: 'Tech-lead',
          company: 'UvN',
        },
      ],
      tone: 'paper',
    },

    // ─── 7. Approach-teaser (pitchOpening met CTA) ───
    {
      _key: 'approach-teaser',
      _type: 'pitchOpeningBlock',
      enabled: true,
      preClaim: '◌ Onze werkwijze',
      heading: 'Discovery, Design, Build, Ship, Maintain.',
      body: [
        portableTextParagraph([
          {
            text: 'Vijf fases die elkaar opvolgen, met een Loop die ze verbindt. We weten waar AI helpt en waar mensen blijven beslissen — en die scheiding maken we expliciet, niet impliciet.',
          },
        ]),
      ],
      ctaLabel: 'Lees onze werkwijze',
      ctaLink: cmsLinkToInternalDoc('approachPage'),
      maxWidth: 'main',
      tone: 'paper',
    },

    // ─── 8. Essays-teaser ───
    {
      _key: 'essays',
      _type: 'essayGridBlock',
      enabled: true,
      preClaim: '◌ Recente essays',
      heading: 'Lezen over hoe we werken.',
      categoryFilter: 'all',
      maxItems: 3,
      showFeaturedFirst: true,
      showFilterChips: false,
      tone: 'paper',
    },

    // ─── 9. CTA-refrein (primary) ───
    {
      _key: 'cta-refrein',
      _type: 'ctaRefreinBlock',
      enabled: true,
      pageKey: 'primary',
      tone: 'claude',
    },
  ]

  await client.createOrReplace({
    _id: 'homePage',
    _type: 'homePage',
    seo: {
      title: 'Add the Code — Custom design, custom code, AI-versnelde bouw',
      description:
        'Nederlandse studio voor merk-eigen websites en web-apps. Astro, Sanity, Vercel — geen templates, wel ambacht.',
    },
    content: blocks,
  })
  console.log(`  ✓ (${blocks.length} blocks)`)
}

// ─── Main ──────────────────────────────────────────────────

async function main() {
  console.log(`Seed-defaults — Sanity ${projectId}/${dataset}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // Volgorde matters: utility + page-shells eerst zodat cmsLink-references
  // naar die docs in componentDefaults + navigation + homePage werken.
  await seedUtilityPages()
  await seedPageShells()
  await seedSiteSettings()
  await seedComponentDefaults()
  await seedNavigation()
  await seedHomePage()

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Klaar. Open Sanity Studio om de seeds te bekijken/aanpassen.')
  console.log('Astro homepage zou nu end-to-end moeten renderen op /.')
}

main().catch((err) => {
  console.error('FOUT:', err)
  process.exit(1)
})
