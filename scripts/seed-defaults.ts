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
 *   1. Pagina-singletons (contact, work, team, approach, services x3, academy)
 *   2. Site Settings (refereert nergens naar)
 *   3. Core Team (Alex; essay author-reference)
 *   4. Supporting cases / essays (vullen /work en /academy)
 *   5. Home Page (home grids kunnen direct collection-data tonen)
 *   6. Utility pages (404 / 500 / offline / thank-you)
 *   7. Component Defaults (refereert naar contactPage via cmsLink)
 *   8. Navigation (refereert naar pagina-singletons)
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

function portableTextBody(...paragraphs: string[]) {
  return paragraphs.map((text) => portableTextParagraph([{ text }]))
}

function period(start: string, end?: string, isOngoing = false) {
  return {
    _type: 'period',
    start,
    end,
    isOngoing,
  }
}

function buildWorkIndexContent() {
  return [
    {
      _key: 'work-hero',
      _type: 'heroStandardBlock',
      enabled: true,
      preClaim: 'WERK · DRIE LAGEN',
      heading: 'Werk dat er staat — en werk dat er aan komt.',
      subheading:
        'We zijn eerlijk over waar Add the Code staat. Dit zijn onze launch-case, het werk dat nu in productie is, en het Fresh Frames-oeuvre waar de studio op voortbouwt.',
      layoutVariant: 'text-only',
      ctas: [
        {
          _key: 'work-hero-cta',
          label: 'Plan een gesprek',
          link: cmsLinkToInternalDoc('contactPage'),
          variant: 'primary',
        },
      ],
      tone: 'paper',
    },
    {
      _key: 'work-launch',
      _type: 'projectGridBlock',
      enabled: true,
      preClaim: 'LAAG 01 · LAUNCH · 2026',
      heading: 'Onze eerste launch-case onder de Add the Code-vlag.',
      intro:
        'Eén grote case, artefact-first. Hier laten we zien wat er al live staat en waarom die launch-case het vlaggenschip van de studio is.',
      layerFilter: 'launch',
      maxItems: 1,
      cardLayoutVariant: 'featured-60-40',
      showFilterChips: false,
      tone: 'paper',
    },
    {
      _key: 'work-in-flight',
      _type: 'projectGridBlock',
      enabled: true,
      preClaim: 'LAAG 02 · IN-FLIGHT · 2026',
      heading: 'Werk dat nu loopt.',
      intro:
        'Twee producties waarin we de uitkomst nog niet publiek kunnen delen, maar de werkwijze al wel. Zo blijft zichtbaar dat de studio niet alleen plannen maakt, maar ook midden in lopend werk staat.',
      layerFilter: 'in-flight',
      maxItems: 2,
      cardLayoutVariant: 'grid-2',
      showFilterChips: false,
      tone: 'paper',
      anchorId: 'in-flight',
    },
    {
      _key: 'work-heritage',
      _type: 'projectGridBlock',
      enabled: true,
      preClaim: 'LAAG 03 · STUDIO-HERITAGE · FRESH FRAMES · 2017–2025',
      heading: 'Het oeuvre waar deze studio op verderbouwt.',
      intro:
        'Add the Code is de volgende fase van Fresh Frames. Deze heritage-cases laten zien waar het ambacht vandaan komt: merk-identiteit, digitale producten en systemen die jaren meekunnen.',
      layerFilter: 'heritage',
      maxItems: 3,
      cardLayoutVariant: 'list',
      showFilterChips: false,
      tone: 'paper',
    },
    {
      _key: 'work-ambition',
      _type: 'pitchOpeningBlock',
      enabled: true,
      preClaim: 'WAT WE NU ZOEKEN · Q2 2026',
      heading: 'Wie we nu graag helpen',
      body: portableTextBody(
        'We hebben op dit moment ruimte voor twee tot drie nieuwe opdrachten in 2026. Waar we naar op zoek zijn: merken die klaar zijn om uit een no-code-platform te stappen, data-gedreven producten die een relationeel model verdienen in plaats van spreadsheets, en teams die zelf willen blijven uitbreiden na oplevering.'
      ),
      ctaLabel: 'Plan een gesprek',
      ctaLink: cmsLinkToInternalDoc('contactPage'),
      maxWidth: 'main',
      tone: 'paper',
    },
    {
      _key: 'work-archive',
      _type: 'pitchOpeningBlock',
      enabled: true,
      preClaim: '◌ Studio-heritage',
      heading: 'Fresh Frames blijft het archief, Add the Code bouwt de volgende laag.',
      body: portableTextBody(
        'De heritage-laag is geen verstopte voetnoot. Het is de lijn waar deze studio uit voortkomt. Voor het volledige archief verwijzen we één keer naar Fresh Frames — als context, niet als omweg.'
      ),
      ctaLabel: 'Bekijk het Fresh Frames-archief',
      ctaLink: cmsLinkToExternal('https://freshframes.nl'),
      maxWidth: 'main',
      tone: 'paper',
    },
    {
      _key: 'work-cta',
      _type: 'ctaRefreinBlock',
      enabled: true,
      pageKey: 'work-index',
      tone: 'claude',
    },
  ]
}

function buildTeamPageContent() {
  return [
    {
      _key: 'team-hero',
      _type: 'heroStandardBlock',
      enabled: true,
      preClaim: 'TEAM · BREDA · EST. 2017 (FRESH FRAMES)',
      heading: 'Dit is Add the Code.',
      subheading:
        'De generatie die custom weer betaalbaar maakt — door zelf te blijven coderen, nu met AI als pair-programmer.',
      layoutVariant: 'text-only',
      tone: 'paper',
    },
    {
      _key: 'team-approach',
      _type: 'pitchOpeningBlock',
      enabled: true,
      preClaim: 'WAT ONS DRIJFT',
      heading: 'Complexiteit aangaan — niet wegpoetsen.',
      body: portableTextBody(
        'We zijn een kleine studio uit Breda. Sommigen van ons ontwerpen al sinds 2017 samen onder de vlag Fresh Frames; anderen zijn in de laatste twee jaar aangehaakt toen duidelijk werd dat de verhouding tussen kosten en mogelijkheden bij custom bouwen fundamenteel was veranderd.',
        'Onze overtuiging is simpel: de dingen die moeilijk lijken in software-bouw worden niet minder moeilijk door ze met no-code weg te moffelen. Ze worden leesbaar door ze aan te gaan. AI helpt daarbij; de mens bepaalt.'
      ),
      maxWidth: 'main',
      tone: 'paper',
    },
    {
      _key: 'team-values',
      _type: 'principlesBlock',
      enabled: true,
      heading: 'Hoe we werken, kort',
      principles: [
        {
          _key: 'team-value-01',
          title: 'Maak het eigen',
          description:
            'Elke oplossing krijgt het merk, de stack en het data-model van de klant. Geen templates, geen white-label-componenten, geen sjablonen die je in tien andere sites terugziet.',
        },
        {
          _key: 'team-value-02',
          title: 'Leer door te bouwen',
          description:
            'Elk project leert ons iets dat in het volgende landt. We schrijven het op, we delen het met het team, en soms publiceren we het in een essay. Studio-kennis is samengestelde rente.',
        },
        {
          _key: 'team-value-03',
          title: 'Blijf traceerbaar',
          description:
            'Elke beslissing — ontwerp, architectuur, code — moet door de klant te volgen zijn. In een codebase, in een doc, in een commit-bericht. Ook ons AI-gebruik blijft uitlegbaar.',
        },
      ],
      layoutVariant: 'grid-2',
      tone: 'paper',
    },
    {
      _key: 'team-grid',
      _type: 'teamGridBlock',
      enabled: true,
      heading: 'Het team',
      coreOnly: true,
      showQuotes: true,
      tone: 'paper',
    },
    {
      _key: 'team-timeline',
      _type: 'timelineBlock',
      enabled: true,
      preClaim: 'STUDIO-HERITAGE · FRESH FRAMES · 2017–2026',
      heading: 'De lijn waar Add the Code op verderbouwt.',
      intro:
        'Add the Code is de volgende fase van Fresh Frames. Acht jaar design-werk onder die vlag — merk-identiteiten, digitale producten en een steeds duidelijker gevoel dat design, data en code niet los van elkaar ontworpen moeten worden.',
      items: [
        {
          _key: 'timeline-2017',
          year: '2017',
          label: 'Fresh Frames opgericht',
          description: 'Eerste merk-identiteiten en studio-opdrachten.',
        },
        {
          _key: 'timeline-2019',
          year: '2019',
          label: 'Eerste internationale uitbreiding-opdracht',
          description: 'Merkwerk dat buiten Nederland mee moest kunnen schalen.',
        },
        {
          _key: 'timeline-2021',
          year: '2021',
          label: 'Recornect-partnership begint',
          description: 'Productontwerp, packaging en visuele systemen in meerdere landen.',
        },
        {
          _key: 'timeline-2022',
          year: '2022',
          label: 'Universiteit van Nederland herziening',
          description: 'Accessibility-first huisstijl en richtlijnen voor publieke kennis.',
        },
        {
          _key: 'timeline-2024',
          year: '2024',
          label: 'Eerste AI-experimenten in de studio',
          description: 'Niet als truc, wel als meetbare versnelling in design- en bouwfases.',
          highlight: true,
        },
        {
          _key: 'timeline-2025',
          year: '2025',
          label: 'Add the Code vormt zich als methode',
          description: 'Custom-met-AI als zelfstandige werkwijze, niet als side-project.',
          highlight: true,
        },
        {
          _key: 'timeline-2026',
          year: '2026',
          label: 'Bell Hammerson launch-case live',
          description: 'De eerste publieke launch-case onder de nieuwe vlag.',
          highlight: true,
        },
      ],
      orientation: 'vertical',
      tone: 'paper',
    },
    {
      _key: 'team-recognition',
      _type: 'principlesBlock',
      enabled: true,
      preClaim: 'ERKENNING',
      heading: 'Eerlijk geschaald, niet opgeblazen.',
      principles: [
        {
          _key: 'recognition-partners',
          title: 'Partner-vermeldingen',
          description:
            'Claude Partner Network staat in aanvraag. Zodra de status verandert, passen we dit publiek aan.',
        },
        {
          _key: 'recognition-publications',
          title: 'Gesprekken & publicaties',
          description:
            'Nieuwe essays en publieke gesprekken landen eerst in de Academy; deze sectie groeit mee met echt werk, niet met voornemens.',
        },
        {
          _key: 'recognition-clients',
          title: 'Klant-vermeldingen',
          description:
            'Publieke aanbevelingen tonen we alleen als ze echt en recent zijn. Geen trofeeënmuur, wel krediet waar het hoort.',
        },
        {
          _key: 'recognition-note',
          title: 'Studio-notitie',
          description:
            'We publiceren alleen erkenning die we kunnen onderbouwen. Als iets nog niet publiek is, doen we niet alsof dat wel zo is.',
        },
      ],
      layoutVariant: 'grid-2',
      tone: 'paper',
    },
    {
      _key: 'team-no-cliches',
      _type: 'pitchOpeningBlock',
      enabled: true,
      preClaim: 'WAT JE HIER NIET LEEST',
      body: portableTextBody(
        'Geen "we are passionate about…". We zijn vakmensen; dat zie je aan het werk, niet aan de adjectieven.',
        'Geen "creative thinkers" of "digital disruptors". We zijn een kleine studio in Breda. Dat is genoeg.',
        'Geen team-foto-wall van veertig glimlachende gezichten. Ons team is bewust klein. We noemen wie er echt werkt.',
        'Geen mission statement in één zin. Als we er één hebben, staat die verspreid over deze pagina in hoe we bouwen.'
      ),
      maxWidth: 'main',
      tone: 'paper',
    },
    {
      _key: 'team-cta',
      _type: 'ctaRefreinBlock',
      enabled: true,
      pageKey: 'team',
      tone: 'claude',
    },
  ]
}

function buildApproachPageContent() {
  return [
    {
      _key: 'approach-hero',
      _type: 'heroStandardBlock',
      enabled: true,
      preClaim: 'WERKWIJZE · VIJF FASEN · EEN LOOP',
      heading: 'Elke keuze is traceerbaar, van eerste gesprek tot laatste commit.',
      subheading:
        'Custom-met-AI is geen shortcut. Het is een methodische werkwijze waarin AI één van de pair-programmers is, en wij de architecten.',
      layoutVariant: 'text-only',
      ctas: [
        {
          _key: 'approach-hero-contact',
          label: 'Plan een gesprek',
          link: cmsLinkToInternalDoc('contactPage'),
          variant: 'primary',
        },
        {
          _key: 'approach-hero-work',
          label: 'Bekijk ons werk',
          link: cmsLinkToInternalDoc('workIndexPage'),
          variant: 'secondary',
        },
      ],
      tone: 'paper',
    },
    {
      _key: 'approach-why',
      _type: 'pitchOpeningBlock',
      enabled: true,
      preClaim: 'WAAROM ZO',
      heading: 'Custom werd weer betaalbaar. Onze werkwijze maakt het ook leverbaar.',
      body: portableTextBody(
        'No-code won de vorige jaren omdat custom-ontwikkeling te duur was voor het rendement. AI heeft die rekening veranderd — maar alleen als je weet waar hij in je proces hoort.',
        'De vraag is niet hoeveel AI voor ons kan doen, maar waar AI waarde toevoegt zonder dat we grip verliezen. Dat is een werk-architectuur-vraag, en die beantwoorden we met een loop die we per project toepassen en aanpassen.'
      ),
      maxWidth: 'main',
      tone: 'paper',
    },
    {
      _key: 'approach-loop-label',
      _type: 'preClaimBlock',
      enabled: true,
      text: '◌ De loop',
      showThinkingRing: true,
      tone: 'paper',
    },
    {
      _key: 'approach-phase-01',
      _type: 'phaseBlock',
      enabled: true,
      phaseNumber: '01',
      phaseName: 'Discovery',
      oneLiner: 'Wat proberen we echt op te lossen?',
      body: portableTextBody(
        'We beginnen elk project bij het probleem, niet bij de oplossing. In één tot drie sessies spreken we met het team dat het systeem gaat gebruiken, brengen we de bestaande data in kaart, en formuleren we waar de pijn exact zit.',
        'Dit is ook de fase waarin we beslissen of custom de juiste keuze is — of dat no-code, een template, of een bestaande tool beter past.'
      ),
      aiRole: 'Data-exploratie, snelle schema-verkenningen en interview-samenvattingen.',
      humanResponsibility:
        'Het gesprek met stakeholders, het bepalen van scope en het beslissen of custom past.',
      deliverables: ['probleem-statement', 'data-model-schets', 'scope-voorstel'],
      duration: '1–2 weken',
      tone: 'paper',
    },
    {
      _key: 'approach-phase-02',
      _type: 'phaseBlock',
      enabled: true,
      phaseNumber: '02',
      phaseName: 'Design',
      oneLiner: 'Van merk naar werkend systeem.',
      body: portableTextBody(
        'Tegelijkertijd ontwerpen we drie lagen: de visuele identiteit, het interactie-systeem en het data-model. Deze drie ontwerpen we expliciet samen — ze zijn elkaars randvoorwaarden.',
        'Artefacten zijn net zo belangrijk als schermen. Eén referentie-pagina en een helder tokensysteem zijn waardevoller dan een deck van tachtig losse frames.'
      ),
      aiRole: 'Variant-exploratie, data-model-checks en content-mapping.',
      humanResponsibility:
        'Merkbeslissingen, component-semantiek en de samenhang tussen ontwerp en data.',
      deliverables: ['design-system-tokens', 'component-bibliotheek', 'Sanity-schema', 'hi-fi referentiepagina'],
      duration: '2–5 weken',
      tone: 'paper',
    },
    {
      _key: 'approach-phase-03',
      _type: 'phaseBlock',
      enabled: true,
      phaseNumber: '03',
      phaseName: 'Build',
      oneLiner: 'We coderen. AI helpt. Jij houdt controle.',
      body: portableTextBody(
        'De bouw-fase is waar AI het meest zichtbaar meedoet. Claude, Codex of Cursor schrijven routineuze code, suggereren componenten-patronen en helpen met refactors.',
        'Wij reviewen elke regel, nemen elke architectuur-beslissing en zijn verantwoordelijk voor kwaliteit, performance en security.'
      ),
      aiRole: 'Component-implementatie, query-schrijven, test-generatie en documentatie-drafts.',
      humanResponsibility:
        'Architectuur-beslissingen, code-review, data-model-integriteit en kwaliteitsgrenzen.',
      deliverables: ['werkende code in staging', 'tests', 'deploy-pijplijn'],
      duration: '3–8 weken',
      tone: 'paper',
    },
    {
      _key: 'approach-phase-04',
      _type: 'phaseBlock',
      enabled: true,
      phaseNumber: '04',
      phaseName: 'Ship',
      oneLiner: 'Live gaan is geen einde, maar een checkpoint.',
      body: portableTextBody(
        'Voor we live gaan, lopen we een laatste check-list door: content-migratie, redirects, performance-baseline, a11y-audit en security-review.',
        'Na livegang houden we meekijk-status: log-review, feedback-ronde en kleine fixes zodat het team niet direct alleen staat.'
      ),
      aiRole: 'Test-coverage, performance-analyse en redirect-map-generatie.',
      humanResponsibility:
        'Go/no-go-beslissing, content-validatie en communicatie met team en klant.',
      deliverables: ['live site', 'deploy-documentatie', 'post-launch rapport'],
      duration: '1–2 weken',
      tone: 'paper',
    },
    {
      _key: 'approach-phase-05',
      _type: 'phaseBlock',
      enabled: true,
      phaseNumber: '05',
      phaseName: 'Maintain-as-skill',
      oneLiner: 'We leveren niet alleen de site. We leveren de werkwijze.',
      body: portableTextBody(
        'De oplever-fase eindigt niet bij de live-site. We leveren ook een set skills — gedocumenteerde werkwijzen, AI-prompts met context en custom tools — waarmee jouw team zelf kan publiceren, uitbreiden en voorbereiden.',
        'Wat we leveren is ambacht plus de overdracht ervan. Dat is de reden dat je niet afhankelijk blijft van een retainer om door te bouwen.'
      ),
      aiRole: 'Documentatie-generatie, skill-building voor het klant-team en onboarding-materiaal.',
      humanResponsibility: 'Overdrachts-sessies, skill-curatie en support na oplevering.',
      deliverables: ['skill-set', 'video-walkthroughs', 'support-document'],
      duration: '1–3 weken',
      tone: 'paper',
    },
    {
      _key: 'approach-ai-roles',
      _type: 'principlesBlock',
      enabled: true,
      heading: 'AI-positie per werksoort',
      intro: 'Een eerlijke lijst. Niet alles wat kan met AI, moet met AI.',
      principles: [
        {
          _key: 'ai-role-1',
          title: 'Discovery-interviews',
          description: 'Niet meedoen. Het zijn mensen-gesprekken.',
        },
        {
          _key: 'ai-role-2',
          title: 'Data-exploratie en schema-schetsen',
          description: 'Leidend. AI is hier sneller dan wij, onder supervisie.',
        },
        {
          _key: 'ai-role-3',
          title: 'Merkbeslissingen en visuele identiteit',
          description: 'Niet meedoen. Dit blijft ambacht en smaak.',
        },
        {
          _key: 'ai-role-4',
          title: 'Componenten-implementatie',
          description: 'Ondersteunend. AI suggereert; wij reviewen.',
        },
        {
          _key: 'ai-role-5',
          title: 'Test- en documentatie-generatie',
          description: 'Leidend. AI maakt de eerste versie; wij cureren.',
        },
        {
          _key: 'ai-role-6',
          title: 'Klant-communicatie',
          description: 'Niet meedoen. Relaties blijven mensen-werk.',
        },
      ],
      layoutVariant: 'grid-2',
      tone: 'paper',
    },
    {
      _key: 'approach-deliverables',
      _type: 'principlesBlock',
      enabled: true,
      preClaim: 'OPLEVERING · WAT ER OVERBLIJFT',
      heading: 'Niet alleen een site. Een werkwijze.',
      intro:
        'Veel agencies leveren een werkend systeem op en zijn dan klaar. Wij leveren daarnaast een pakket dat je team zelfstandig houdt — zonder retainer en zonder lock-in.',
      principles: [
        {
          _key: 'deliverable-code',
          title: 'De code',
          description:
            'Volledige broncode, je eigen repository, je eigen account. Nooit afhankelijk van ons om erbij te kunnen.',
        },
        {
          _key: 'deliverable-data',
          title: 'Het data-model',
          description:
            'Gedocumenteerd Sanity-schema plus relationele tabellen in Supabase waar nodig. Inclusief migratie-scripts en seed-data.',
        },
        {
          _key: 'deliverable-skills',
          title: 'De skill-set',
          description:
            'AI-prompts met context, custom skills en korte walkthroughs. Hiermee kan je team zelf blijven publiceren en uitbreiden.',
        },
        {
          _key: 'deliverable-doc',
          title: 'Het oplever-document',
          description:
            'Een compacte overdracht van architectuur-keuzes, trade-offs en escalatiepaden als er iets gebeurt dat de skill-set niet afvangt.',
        },
      ],
      layoutVariant: 'grid-2',
      tone: 'paper',
    },
    {
      _key: 'approach-boundaries',
      _type: 'principlesBlock',
      enabled: true,
      preClaim: 'EERLIJK · GRENZEN',
      heading: 'Wanneer wij niet de juiste studio zijn',
      principles: [
        {
          _key: 'boundary-1',
          title: 'Als je morgen een one-pager nodig hebt',
          description:
            'Voor kortlevende landingspagina’s, events of snelle experimenten is een template in Webflow of Framer sneller en goedkoper.',
        },
        {
          _key: 'boundary-2',
          title: 'Als je geen team hebt dat het werk overneemt',
          description:
            'Skill-delivery werkt alleen als er iemand is die de skills oppakt. Zonder die capaciteit past een full-service retainer vaak beter.',
        },
        {
          _key: 'boundary-3',
          title: 'Als een bestaand platform prima werkt',
          description:
            'We helpen alleen vervangen als het huidige systeem echt in de weg zit. Niet elke rebuild-vraag is automatisch een goede custom-vraag.',
        },
      ],
      layoutVariant: 'grid-2',
      tone: 'paper',
    },
    {
      _key: 'approach-cta',
      _type: 'ctaRefreinBlock',
      enabled: true,
      pageKey: 'approach',
      tone: 'claude',
    },
  ]
}

function buildServiceDesignContent() {
  return [
    {
      _key: 'service-design-hero',
      _type: 'heroStandardBlock',
      enabled: true,
      preClaim: 'SERVICE · DESIGN',
      heading: 'Vormgeving van merkeigen digitale ervaringen.',
      subheading:
        'Geen sjabloon-thema’s, geen Webflow-sections-die-iedereen-herkent. We ontwerpen systemen die exact bij jouw merk en jouw publiek passen.',
      layoutVariant: 'text-only',
      ctas: [
        {
          _key: 'svc-design-contact',
          label: 'Plan een gesprek',
          link: cmsLinkToInternalDoc('contactPage'),
          variant: 'primary',
        },
        {
          _key: 'svc-design-work',
          label: 'Bekijk ons werk',
          link: cmsLinkToInternalDoc('workIndexPage'),
          variant: 'secondary',
        },
      ],
      tone: 'paper',
    },
    {
      _key: 'service-design-parts',
      _type: 'principlesBlock',
      enabled: true,
      heading: 'Vijf onderdelen van een Design-traject',
      principles: [
        {
          _key: 'design-part-01',
          title: 'Merk-verfijning of merk-vorming',
          description:
            'We starten vanuit het merk dat er al is — of dat nog moet ontstaan. Typografie, kleur, stem en visuele taal worden bewust vastgelegd.',
        },
        {
          _key: 'design-part-02',
          title: 'Interactie-systeem',
          description:
            'Componenten, patronen, states en motion-principes. Geen losse schermen, maar een systeem dat in code kan blijven staan.',
        },
        {
          _key: 'design-part-03',
          title: 'Data-model-schetsen',
          description:
            'Al tijdens Design bouwen we de data-architectuur mee. Een pagina gaat dus niet alleen over schermen, maar ook over wat erachter bestaat.',
        },
        {
          _key: 'design-part-04',
          title: 'Referentie-pagina in hi-fi',
          description:
            'Eén pagina volledig uitgewerkt in hoge detail. Die is de blueprint voor alle andere — geen deck van tachtig half-uitgewerkte schermen.',
        },
        {
          _key: 'design-part-05',
          title: 'Design-system-tokens',
          description:
            'Kleur, typografie, spacing en motion worden code-ready vastgelegd. Geen re-interpretatie door de developer.',
        },
      ],
      layoutVariant: 'stack',
      tone: 'paper',
    },
    {
      _key: 'service-design-loop',
      _type: 'pitchOpeningBlock',
      enabled: true,
      heading: 'Design is fase 02 van onze loop.',
      body: portableTextBody(
        'In de praktijk betekent dat twee tot vijf weken, afhankelijk van de scope. AI doet mee met variant-exploratie, data-model-checks en content-mapping — niet met merkbeslissingen of component-semantiek.'
      ),
      ctaLabel: 'Lees de volledige werkwijze',
      ctaLink: cmsLinkToInternalDoc('approachPage'),
      maxWidth: 'main',
      tone: 'paper',
    },
    {
      _key: 'service-design-example',
      _type: 'projectGridBlock',
      enabled: true,
      preClaim: 'VOORBEELD · STERK DESIGN-GEDREVEN',
      heading: 'Recornect als heritage-case.',
      intro:
        'Een case waarin merk-identiteit, 3D product-visualisaties en internationale overdraagbaarheid samenkwamen.',
      layerFilter: 'heritage',
      maxItems: 1,
      cardLayoutVariant: 'featured-60-40',
      tone: 'paper',
    },
    {
      _key: 'service-design-budget',
      _type: 'pitchOpeningBlock',
      enabled: true,
      heading: 'De vorm van een Design-budget',
      body: portableTextBody(
        'Design-opdrachten bij ons beginnen meestal bij één merk-refresh of één product-lancering, niet bij een uur-tarief. De variabelen die het budget bepalen: de diepte van de merk-laag, de complexiteit van het interactie-systeem en de omvang van het data-model dat eronder zit.',
        'We geven je na een discovery-gesprek een helder voorstel. Geen “vanaf €X”-framing — dat zegt weinig over wat er echt nodig is.'
      ),
      maxWidth: 'main',
      tone: 'paper',
    },
    {
      _key: 'service-design-fit',
      _type: 'principlesBlock',
      enabled: true,
      heading: 'Design als apart traject, of geïntegreerd?',
      principles: [
        {
          _key: 'design-fit-apart',
          title: 'Design als apart traject past als',
          description:
            'Je al een technisch team hebt en vooral een merk- of systeem-slag wil maken. Wij leveren tokens, richting en referentie-pagina’s; je team neemt het over.',
        },
        {
          _key: 'design-fit-combined',
          title: 'Design + Build samen past als',
          description:
            'Je van tekentafel tot live-site één studio wil houden, zodat design-beslissingen niet in de bouw-fase verwateren. Dit is onze voorkeursroute.',
        },
      ],
      layoutVariant: 'grid-2',
      tone: 'paper',
    },
    {
      _key: 'service-design-cta',
      _type: 'ctaRefreinBlock',
      enabled: true,
      pageKey: 'services-design',
      tone: 'claude',
    },
  ]
}

function buildServiceBuildContent() {
  return [
    {
      _key: 'service-build-hero',
      _type: 'heroStandardBlock',
      enabled: true,
      preClaim: 'SERVICE · BUILD',
      heading: 'Bouw van custom digitale producten — code die je zelf bezit.',
      subheading:
        'Astro, Sanity, Supabase en Vercel. Een stack op open standaarden, een data-model dat past bij je werkelijkheid, en code waar je geen vendor-lock-in aan opbouwt.',
      layoutVariant: 'text-only',
      ctas: [
        {
          _key: 'svc-build-contact',
          label: 'Plan een gesprek',
          link: cmsLinkToInternalDoc('contactPage'),
          variant: 'primary',
        },
        {
          _key: 'svc-build-work',
          label: 'Bekijk ons werk',
          link: cmsLinkToInternalDoc('workIndexPage'),
          variant: 'secondary',
        },
      ],
      tone: 'paper',
    },
    {
      _key: 'service-build-stack',
      _type: 'principlesBlock',
      enabled: true,
      heading: 'De stack en waarom',
      principles: [
        {
          _key: 'build-stack-astro',
          title: 'Astro',
          description:
            'Snelle pagina’s, weinig JavaScript naar de browser en een ontwikkelervaring waarin AI-tools productief mee kunnen schrijven.',
        },
        {
          _key: 'build-stack-sanity',
          title: 'Sanity',
          description:
            'Structured content, schema-first en leesbaar genoeg om mee te versioneren. Het CMS hangt het model niet in de weg.',
        },
        {
          _key: 'build-stack-supabase',
          title: 'Supabase',
          description:
            'Postgres als fundament, met genoeg ruimte voor relationele modellen en interne tooling zonder vendor-lock-in op data.',
        },
        {
          _key: 'build-stack-vercel',
          title: 'Vercel',
          description:
            'Past bij Astro en monorepo’s, met preview-omgevingen per pull request en een deploy-laag die niet in de weg zit.',
        },
      ],
      layoutVariant: 'grid-2',
      tone: 'paper',
    },
    {
      _key: 'service-build-scope',
      _type: 'principlesBlock',
      enabled: true,
      heading: 'Vijf onderdelen van een Build-traject',
      principles: [
        {
          _key: 'build-part-01',
          title: 'Architectuur en stack-setup',
          description:
            'Monorepo of single-repo, deploy-strategie, environment-management en secrets-beheer. De eerste week bepaalt veel van wat daarna goed of slecht gaat.',
        },
        {
          _key: 'build-part-02',
          title: 'Implementatie van het design-system',
          description:
            'Design-tokens naar code, component-library volgens jouw ontwerp en accessibility-baseline direct ingebakken.',
        },
        {
          _key: 'build-part-03',
          title: 'Content-modellering en migratie',
          description:
            'Sanity-schema’s, bestaande content migreren en audience- of segmentatie-logica in structured content vangen.',
        },
        {
          _key: 'build-part-04',
          title: 'Integraties',
          description:
            'APIs, webhooks, authenticatie en externe databronnen krijgen een stabiele laag ertussen zodat leverancier-wissel mogelijk blijft.',
        },
        {
          _key: 'build-part-05',
          title: 'Performance, a11y en security',
          description:
            'Core Web Vitals, WCAG AA, content-security-policies en rate-limiting zijn geen check-list achteraf maar ontwerpcriterium vanaf fase 02.',
        },
      ],
      layoutVariant: 'stack',
      tone: 'paper',
    },
    {
      _key: 'service-build-deliverables',
      _type: 'principlesBlock',
      enabled: true,
      preClaim: 'OPLEVERING · WAT ER OVERBLIJFT',
      heading: 'Wat er overblijft als we klaar zijn',
      principles: [
        {
          _key: 'build-deliverable-code',
          title: 'De code',
          description:
            'Volledige broncode, je eigen repository en je eigen account. Nooit afhankelijk van ons om erbij te kunnen.',
        },
        {
          _key: 'build-deliverable-data',
          title: 'Het data-model',
          description:
            'Gedocumenteerde schema’s, relationele tabellen waar nodig en de migratie-scripts waarmee je het model opnieuw kunt draaien.',
        },
        {
          _key: 'build-deliverable-skills',
          title: 'De skill-set',
          description:
            'AI-prompts met context, custom skills voor Claude Code en walkthroughs waarmee jouw team doorbouwt.',
        },
        {
          _key: 'build-deliverable-doc',
          title: 'Het oplever-document',
          description:
            'Een compacte overdracht van architectuur-keuzes, trade-offs en support-paden als er later iets verandert.',
        },
      ],
      layoutVariant: 'grid-2',
      tone: 'paper',
    },
    {
      _key: 'service-build-skills-link',
      _type: 'pitchOpeningBlock',
      enabled: true,
      body: portableTextBody(
        'De meest ondergewaardeerde deliverable uit een Build-traject is vaak niet de site zelf, maar de skill-set waarmee jouw team daarna verder kan. Daarover schrijven we uitgebreider in de Academy.'
      ),
      ctaLabel: 'Lees verder in de Academy',
      ctaLink: cmsLinkToInternalDoc('academyIndexPage'),
      maxWidth: 'main',
      tone: 'paper',
    },
    {
      _key: 'service-build-example',
      _type: 'projectGridBlock',
      enabled: true,
      preClaim: 'VOORBEELD · BUILD-FIRST',
      heading: 'Bell Hammerson als launch-case.',
      intro:
        'Monorepo met Astro, één Sanity-bron, een sync-laag voor Eventbrite en drie publieken die uit één model worden gevoed.',
      layerFilter: 'launch',
      maxItems: 1,
      cardLayoutVariant: 'featured-60-40',
      tone: 'paper',
    },
    {
      _key: 'service-build-budget',
      _type: 'pitchOpeningBlock',
      enabled: true,
      heading: 'De vorm van een Build-budget',
      body: portableTextBody(
        'Build-opdrachten worden per project gebudgetteerd, niet per uur. De variabelen zijn de complexiteit van het data-model, het aantal integraties en hoeveel van fase 05 — skill-delivery — je mee wilt nemen.',
        'Een kleine marketing-site zit in een ander budget dan een multi-site platform met sync-laag. Dat zeggen we in het eerste gesprek eerlijk.'
      ),
      maxWidth: 'main',
      tone: 'paper',
    },
    {
      _key: 'service-build-fit',
      _type: 'principlesBlock',
      enabled: true,
      heading: 'Build apart, of Design + Build samen?',
      principles: [
        {
          _key: 'build-fit-apart',
          title: 'Build als apart traject past als',
          description:
            'Je ontwerp al klaar hebt en een team zoekt dat het netjes implementeert. We reviewen technische haalbaarheid, maar tekenen niet opnieuw.',
        },
        {
          _key: 'build-fit-combined',
          title: 'Design + Build samen past als',
          description:
            'Je de hele boog van merk-ontwerp tot oplevering bij één studio wil houden, zodat design, data-model en code één consistent object worden.',
        },
      ],
      layoutVariant: 'grid-2',
      tone: 'paper',
    },
    {
      _key: 'service-build-cta',
      _type: 'ctaRefreinBlock',
      enabled: true,
      pageKey: 'services-build',
      tone: 'claude',
    },
  ]
}

function buildServiceAutomateContent() {
  return [
    {
      _key: 'service-automate-hero',
      _type: 'heroStandardBlock',
      enabled: true,
      preClaim: 'SERVICE · AUTOMATE',
      heading: 'Benutten van AI om fragile processen te vervangen.',
      subheading:
        'Relationele data-modellen, interne agents en domein-specifieke skills die brekende scripts en gespreide spreadsheets opvolgen.',
      layoutVariant: 'text-only',
      ctas: [
        {
          _key: 'svc-automate-contact',
          label: 'Plan een gesprek',
          link: cmsLinkToInternalDoc('contactPage'),
          variant: 'primary',
        },
        {
          _key: 'svc-automate-work',
          label: 'Bekijk ons werk',
          link: cmsLinkToInternalDoc('workIndexPage'),
          variant: 'secondary',
        },
      ],
      tone: 'paper',
    },
    {
      _key: 'service-automate-what',
      _type: 'pitchOpeningBlock',
      enabled: true,
      heading: 'Niet workflow-automation. Niet Zapier-ketens.',
      body: portableTextBody(
        'Onder Automate vallen bij ons drie soorten werk: data-modellen opschonen, interne tools bouwen waarin AI meewerkt zonder de beslisser te zijn, en skill-delivery zodat het team daarna zelf verder kan.',
        'Wat we niet doen: lange ketens van integraties tussen SaaS-tools zonder onderliggend model. Dat lost symptomen op; wij richten ons op de oorzaak.'
      ),
      maxWidth: 'main',
      tone: 'paper',
    },
    {
      _key: 'service-automate-types',
      _type: 'principlesBlock',
      enabled: true,
      heading: 'Drie typen werk',
      principles: [
        {
          _key: 'automate-type-01',
          title: 'Data-model-sanering',
          description:
            'We brengen entiteiten en relaties in kaart, bouwen een Postgres-schema in Supabase en migreren de data met AI als converter en ons als reviewer.',
        },
        {
          _key: 'automate-type-02',
          title: 'Interne tools met AI',
          description:
            'Tools waar AI één van de actoren is, maar nooit de beslisser. Dat leggen we als design-keuze vast in de architectuur.',
        },
        {
          _key: 'automate-type-03',
          title: 'Skill-delivery',
          description:
            'Gedocumenteerde AI-werkwijzen, custom skills en prompt-bibliotheken die het team na oplevering zelf blijft gebruiken.',
        },
      ],
      layoutVariant: 'stack',
      tone: 'paper',
    },
    {
      _key: 'service-automate-skills',
      _type: 'pitchOpeningBlock',
      enabled: true,
      heading: 'Skills als opleveringsbestand',
      body: portableTextBody(
        'Een skill is voor ons: een werkwijze waarvan we de context zo hebben geformaliseerd dat een AI-tool hem consistent uitvoert. Daarmee blijft de versnelling die wij tijdens het bouwen hadden ook na oplevering beschikbaar voor jouw team.'
      ),
      ctaLabel: 'Lees verder in de Academy',
      ctaLink: cmsLinkToInternalDoc('academyIndexPage'),
      maxWidth: 'main',
      tone: 'paper',
    },
    {
      _key: 'service-automate-example',
      _type: 'projectGridBlock',
      enabled: true,
      preClaim: 'VOORBEELD · IN-FLIGHT',
      heading: 'Een migratie waarin spreadsheet-sprawl plaatsmaakt voor één model.',
      intro:
        'Een productie-app waarin mensen, rollen, projecten en klanten van losse spreadsheets naar één relationele bron van waarheid zijn verhuisd.',
      layerFilter: 'in-flight',
      maxItems: 1,
      cardLayoutVariant: 'featured-60-40',
      tone: 'paper',
    },
    {
      _key: 'service-automate-budget',
      _type: 'pitchOpeningBlock',
      enabled: true,
      heading: 'De vorm van een Automate-budget',
      body: portableTextBody(
        'Automate-opdrachten variëren het sterkst in omvang. Een data-model-sanering voor een team van tien kan in vier weken; een volledige interne tool-suite voor een team van vijftig eerder in maanden.',
        'We budgetteren per project, met duidelijke mijlpalen en go/no-go-momenten na discovery en na een eerste werkende versie.'
      ),
      maxWidth: 'main',
      tone: 'paper',
    },
    {
      _key: 'service-automate-fit',
      _type: 'principlesBlock',
      enabled: true,
      heading: 'Past dit bij jouw vraag?',
      principles: [
        {
          _key: 'automate-fit-yes',
          title: 'Automate past als',
          description:
            'Je team structureel tijd verliest aan losse spreadsheets, brekende scripts en data die nergens centraal samenkomt.',
        },
        {
          _key: 'automate-fit-no',
          title: 'Automate past niet als',
          description:
            'Je vooral iets “met AI” wilt doen zonder concreet proces-probleem, of als de schaal zo klein is dat een goede spreadsheet nog steeds de juiste keuze is.',
        },
      ],
      layoutVariant: 'grid-2',
      tone: 'paper',
    },
    {
      _key: 'service-automate-cta',
      _type: 'ctaRefreinBlock',
      enabled: true,
      pageKey: 'services-automate',
      tone: 'claude',
    },
  ]
}

function buildAcademyIndexContent() {
  return [
    {
      _key: 'academy-hero',
      _type: 'heroStandardBlock',
      enabled: true,
      preClaim: 'ACADEMY · ESSAYS & STANDPUNTEN',
      heading: 'Wat we publiceren — en waarom het geen blog is.',
      subheading:
        'Geen SEO-content, geen “10 tips voor…”, geen funnel-denken. Alleen essays over custom-bouwen met AI, retrospectieven op werk dat we deden en standpunten over hoe dit vak verandert.',
      layoutVariant: 'text-only',
      ctas: [
        {
          _key: 'academy-hero-work',
          label: 'Bekijk ons werk',
          link: cmsLinkToInternalDoc('workIndexPage'),
          variant: 'secondary',
        },
        {
          _key: 'academy-hero-contact',
          label: 'Plan een gesprek',
          link: cmsLinkToInternalDoc('contactPage'),
          variant: 'primary',
        },
      ],
      tone: 'paper',
    },
    {
      _key: 'academy-intro',
      _type: 'pitchOpeningBlock',
      enabled: true,
      body: portableTextBody(
        'De studio publiceert gemiddeld één essay per maand. Als er niets nieuws te zeggen is, publiceren we niet. We schrijven over economische verschuivingen in ontwikkeling, over werkwijze-beslissingen die we zelf hebben gemaakt, en over wat AI-tools ons wel en niet hebben opgeleverd.'
      ),
      maxWidth: 'main',
      tone: 'paper',
    },
    {
      _key: 'academy-tags',
      _type: 'tagStripBlock',
      enabled: true,
      preClaim: 'Categorieën bij launch',
      tags: ['ESSAY', 'CASE-REFLECTIE', 'EXPLAINER', 'WERKWIJZE', 'STANDPUNT'],
      showAsLinks: false,
      tone: 'paper',
    },
    {
      _key: 'academy-grid',
      _type: 'essayGridBlock',
      enabled: true,
      preClaim: 'FLAGSHIP · ESSAY + RECENT',
      heading: 'Flagship en recente stukken uit de Academy.',
      intro:
        'Hier staat het essay dat onze positie het scherpst uitlegt, plus de stukken die laten zien hoe die positie in de praktijk landt.',
      categoryFilter: 'all',
      maxItems: 6,
      showFeaturedFirst: true,
      showFilterChips: false,
      tone: 'paper',
    },
    {
      _key: 'academy-newsletter',
      _type: 'newsletterFormBlock',
      enabled: true,
      preClaim: 'NIEUWE ESSAYS',
      overrideIntro: 'Nieuwe essays in je inbox, ongeveer één per maand.',
      overrideHelperLine: 'Geen marketing. Afmelden vanuit elke mail.',
      source: 'academy',
      tone: 'paper',
    },
    {
      _key: 'academy-cta',
      _type: 'ctaRefreinBlock',
      enabled: true,
      pageKey: 'academy-index',
      tone: 'claude',
    },
  ]
}

function buildContactPageContent() {
  return [
    {
      _key: 'contact-hero',
      _type: 'heroStandardBlock',
      enabled: true,
      preClaim: 'CONTACT · DIRECT · GEEN TICKETING',
      heading: 'Laten we praten.',
      subheading:
        'Plan een kennismaking, stuur één regel, of bel direct. Wat je voor je ligt hebt — een vraag, een rebuild of een automatiserings-probleem — we nemen het serieus en reageren binnen één werkdag.',
      layoutVariant: 'text-only',
      tone: 'paper',
    },
    {
      _key: 'contact-form',
      _type: 'contactFormBlock',
      enabled: true,
      preClaim: '◌ Vertel kort waar het over gaat',
      heading: 'Stuur één bericht, dan nemen we het vanaf daar over.',
      intro: portableTextBody(
        'Minimum-viable velden, geen intake-formulier van twintig vragen. Hoe concreter je bent, hoe beter we kunnen reageren — maar als je het nog niet scherp hebt, mag dat ook.'
      ),
      topicOptions: [
        'Een nieuw project',
        'Een rebuild of migratie',
        'Een automatiserings-vraag',
        'Alleen een oriënterend gesprek',
        'Iets anders',
      ],
      requireCompany: false,
      submitLabel: 'Verstuur →',
      successMessage:
        '◌ Verstuurd. Alex leest je bericht vandaag nog. Je krijgt vóór het einde van de eerstvolgende werkdag antwoord op het door jou ingevulde e-mailadres.',
      errorMessage:
        'Er is iets misgegaan bij verzenden. Stuur een bericht direct naar hello@addthecode.nl, dan komt het zeker binnen.',
      tone: 'paper',
    },
    {
      _key: 'contact-expectations',
      _type: 'expectationStepsBlock',
      enabled: true,
      overrideHeading: '◌ Wat er gebeurt nadat je verstuurt',
      tone: 'paper',
    },
    {
      _key: 'contact-direct',
      _type: 'directChannelsBlock',
      enabled: true,
      heading: 'Liever direct?',
      layoutVariant: 'grid-2x2',
      channels: [
        {
          _key: 'direct-general',
          kind: 'email',
          label: 'E-mail',
          value: 'hello@addthecode.nl',
          helperLine: 'Algemeen',
        },
        {
          _key: 'direct-alex',
          kind: 'email',
          label: 'Direct Alex',
          value: 'alex@freshframes.nl',
          helperLine: 'Founder',
        },
        {
          _key: 'direct-phone',
          kind: 'phone',
          label: 'Telefoon',
          value: '06 48 77 28 07',
          helperLine: 'Werkdagen 9:00–17:30',
        },
        {
          _key: 'direct-studio',
          kind: 'address',
          label: 'Studio',
          value: 'Nieuwe Prinsenkade 4 · 4811 VC Breda',
          helperLine: 'Op afspraak — loop niet zomaar binnen.',
        },
      ],
      tone: 'paper',
    },
    {
      _key: 'contact-faq',
      _type: 'faqBlock',
      enabled: true,
      heading: 'Drie vragen die vaak vooraf komen',
      enableJsonLd: true,
      items: [
        {
          _key: 'faq-team',
          question: 'Werken jullie ook met bestaande leveranciers of in-house teams?',
          answer: portableTextBody(
            'Ja, regelmatig. We zijn vaak de partij die een stuk architectuur of een specifieke vaardigheid aandraagt naast een bestaand team. Dat werkt goed zolang de verantwoordelijkheden helder zijn.'
          ),
        },
        {
          _key: 'faq-retainer',
          question: 'Hebben jullie een retainer-model?',
          answer: portableTextBody(
            'Nee. We werken per project, met een duidelijk einde. Na oplevering hebben we een support-window voor kleine dingen; daarna ben je welkom om met nieuwe vragen terug te komen.'
          ),
        },
        {
          _key: 'faq-start',
          question: 'Hoe snel kunnen jullie beginnen?',
          answer: portableTextBody(
            'Meestal tussen twee en zes weken na akkoord op het voorstel, afhankelijk van onze lopende projecten. We doen geen “we beginnen morgen”-beloftes die we niet kunnen waarmaken.'
          ),
        },
      ],
      tone: 'paper',
    },
    {
      _key: 'contact-fallback',
      _type: 'pitchOpeningBlock',
      enabled: true,
      preClaim: '◌ Nog niet klaar om te mailen?',
      heading: 'Kijk dan eerst even verder.',
      body: portableTextBody(
        'Bekijk ons werk, lees hoe de werkwijze in elkaar zit, of begin met de flagship-essay over waarom custom weer terug is. Als je daarna nog steeds twijfelt, is één regel mailen genoeg.'
      ),
      ctaLabel: 'Bekijk ons werk',
      ctaLink: cmsLinkToInternalDoc('workIndexPage'),
      maxWidth: 'main',
      tone: 'paper',
    },
  ]
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

// ─── 2. Pagina-singletons ────────────────────────────────────

async function seedPageShells() {
  console.log('▸ Pagina-singletons (met representatieve page-builder content)…')

  const pageDocs = [
    {
      _id: 'contactPage',
      _type: 'contactPage',
      seo: { title: 'Contact — Add the Code', description: 'Plan een gesprek met Alex.' },
      content: buildContactPageContent(),
    },
    {
      _id: 'workIndexPage',
      _type: 'workIndexPage',
      seo: {
        title: 'Werk — drielaag van launch tot heritage',
        description: 'Cases waarin we aan custom code werkten.',
      },
      content: buildWorkIndexContent(),
    },
    {
      _id: 'teamPage',
      _type: 'teamPage',
      seo: {
        title: 'Team — Add the Code',
        description: 'De mensen achter Add the Code, sinds 2017 als Fresh Frames.',
      },
      content: buildTeamPageContent(),
    },
    {
      _id: 'approachPage',
      _type: 'approachPage',
      seo: {
        title: 'Werkwijze — Discovery, Design, Build, Ship, Maintain',
        description: 'Onze vijf-fasen-methode.',
      },
      content: buildApproachPageContent(),
    },
    {
      _id: 'serviceDesignPage',
      _type: 'serviceDesignPage',
      seo: { title: 'Custom design — Add the Code', description: 'Merk-eigen design service.' },
      content: buildServiceDesignContent(),
    },
    {
      _id: 'serviceBuildPage',
      _type: 'serviceBuildPage',
      seo: { title: 'Custom code — Add the Code', description: 'Astro / Sanity / Vercel build.' },
      content: buildServiceBuildContent(),
    },
    {
      _id: 'serviceAutomatePage',
      _type: 'serviceAutomatePage',
      seo: {
        title: 'AI-versnelde bouw — Add the Code',
        description: 'Claude als bouw-partner, niet als product.',
      },
      content: buildServiceAutomateContent(),
    },
    {
      _id: 'academyIndexPage',
      _type: 'academyIndexPage',
      seo: { title: 'Academy — Add the Code', description: 'Essays over custom-code en AI.' },
      content: buildAcademyIndexContent(),
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

// ─── 6. Core Team (Alex) ────────────────────────────────────

async function seedCoreTeam() {
  console.log('▸ Core team (Alex de Graaf als team_member)…')
  await client.createOrReplace({
    _id: 'team-alex',
    _type: 'teamMember',
    name: 'Alex de Graaf',
    slug: { _type: 'slug', current: 'alex-de-graaf' },
    language: 'nl',
    role: 'Founder · Hoofdaannemer',
    isCore: true,
    displayOrder: 1,
    email: 'alex@freshframes.nl',
    bio: [
      portableTextParagraph([
        {
          text: 'Ontwerpt en bouwt sinds 2017 onder de vlag Fresh Frames. Met Add the Code bouwt hij de volgende fase: custom-met-AI — merk-eigen websites en web-apps die klanten weer van zichzelf kunnen maken, zonder template-configuratie.',
        },
      ]),
      portableTextParagraph([
        {
          text: 'Schrijft maandelijks over dit vak op ',
        },
        { text: 'addthecode.nl/academy', italic: true },
        { text: '. Werkt vanuit Breda en online.' },
      ]),
    ],
    quote: {
      text: 'Onze waarde zit niet in "wij kunnen dit coderen en jij niet" — die zit in oordeelsvorming. AI versnelt de bouw, maar architectuur-keuzes blijven mens-werk.',
      context: 'Over de rol van AI in het bouwproces',
    },
    links: [
      {
        _key: 'linkedin',
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com/in/alex-de-graaf/',
      },
    ],
  })
  console.log('  ✓ (Alex geseed als team-alex)')
}

// ─── 7. Supporting portfolio docs ───────────────────────────

async function seedSupportingCases() {
  console.log('▸ Supporting cases (/work layers buiten Bell)…')

  const contactLink = cmsLinkToInternalDoc('contactPage')

  const docs = [
    {
      _id: 'case-relational-model',
      _type: 'case',
      language: 'nl',
      title: 'Bedrijfsstructuur als relationeel model, niet als spreadsheet',
      slug: { _type: 'slug', current: 'relationeel-model' },
      layer: 'in-flight',
      ndaStatus: true,
      status: 'live',
      preClaim: 'IN-FLIGHT · AUTOMATE · UNDER-NDA',
      subtitle:
        'Een productie-app die dertien spreadsheets terugbracht tot één relationeel model voor mensen, rollen, projecten en klanten.',
      client: 'Mediabedrijf onder NDA',
      period: period('2026-04-01', undefined, true),
      role: 'Architectuur, migratie en interne tooling',
      stack: ['supabase', 'custom-ui', 'ai-migratie'],
      tags: ['in-flight', 'automate', 'under-nda'],
      seo: {
        title: 'In-flight case — relationeel model',
        description: 'Onder NDA: hoe een spreadsheet-landschap naar één model is verhuisd.',
        noIndex: true,
      },
      content: [
        {
          _key: 'rel-model-intro',
          _type: 'pitchOpeningBlock',
          enabled: true,
          preClaim: '◌ Wat we wel kunnen delen',
          body: portableTextBody(
            'De kern van dit traject zat niet in een nieuw scherm, maar in een nieuw model. Mensen, rollen, projecten en klanten stonden op dertien plekken tegelijk geregistreerd; de eerste winst zat in het terugbrengen naar één relationele bron van waarheid.',
            'AI draaide de eerste migratie-conversies. Daarna hebben we samen met het team het schema aangescherpt tot iets waar zij zelf verder op kunnen bouwen.'
          ),
          maxWidth: 'main',
          tone: 'paper',
        },
        {
          _key: 'rel-model-nda',
          _type: 'ndaExplainerBlock',
          enabled: true,
          preClaim: '◌ Onder NDA',
          heading: 'Wat we nu nog niet kunnen delen',
          body: portableTextBody(
            'De klant werkt al met het systeem, maar publicatie van screenshots en operationele details wachten tot hun eigen communicatiemoment. Wat we wel kunnen zeggen: het project is live, het model wordt intern gebruikt, en de skill-set voor het team draait mee in de oplevering.'
          ),
          expectedReleaseDate: 'Q3 2026',
          contactCta: {
            label: 'Vraag naar de werkwijze',
            link: contactLink,
          },
          tone: 'paper',
        },
        {
          _key: 'rel-model-meta',
          _type: 'metaBlock',
          enabled: true,
          heading: 'Wat we publiek kunnen zeggen',
          items: [
            { _key: 'rel-model-meta-1', label: 'Stack', value: 'Supabase · custom UI · AI-migratie' },
            { _key: 'rel-model-meta-2', label: 'Status', value: 'In productie' },
            { _key: 'rel-model-meta-3', label: 'Focus', value: 'Model-sanering en interne tooling' },
            { _key: 'rel-model-meta-4', label: 'Periode', value: 'Q2 2026 → heden' },
          ],
          tone: 'paper',
        },
      ],
    },
    {
      _id: 'case-skill-delivery-suite',
      _type: 'case',
      language: 'nl',
      title: 'Custom skills die het team zelf blijft gebruiken',
      slug: { _type: 'slug', current: 'skill-delivery-suite' },
      layer: 'in-flight',
      ndaStatus: true,
      status: 'live',
      preClaim: 'IN-FLIGHT · AUTOMATE · SKILL-DELIVERY',
      subtitle:
        'Een interne tool-suite waarin AI drafts voorbereidt en het team de beslisser blijft — met een skill-set als expliciet opleverbestand.',
      client: 'Content-team onder NDA',
      period: period('2026-02-01', undefined, true),
      role: 'Skill-architectuur en delivery',
      stack: ['custom-skills', 'supabase', 'claude-api'],
      tags: ['in-flight', 'automate', 'skill-delivery'],
      seo: {
        title: 'In-flight case — skill delivery',
        description: 'Onder NDA: interne tools en skills als overdraagbare werkwijze.',
        noIndex: true,
      },
      content: [
        {
          _key: 'skill-suite-intro',
          _type: 'pitchOpeningBlock',
          enabled: true,
          preClaim: '◌ Wat we wel kunnen delen',
          body: portableTextBody(
            'Dit project draait om een team dat honderden content-updates per maand verwerkt. In plaats van één tool op te leveren die alleen wij begrijpen, bouwen we aan een suite waarin het team zelf doorwerkt met een set vaste skills.',
            'De AI-laag doet voorstellen en voorbereidingen. De redactionele en operationele keuze blijft menselijk.'
          ),
          maxWidth: 'main',
          tone: 'paper',
        },
        {
          _key: 'skill-suite-nda',
          _type: 'ndaExplainerBlock',
          enabled: true,
          heading: 'Waarom deze case nog anoniem blijft',
          body: portableTextBody(
            'De tool-suite raakt interne processen die de klant eerst zelf wil stabiliseren voordat er publiek over gecommuniceerd wordt. Daarom laten we nu alleen het patroon zien, niet de organisatie erachter.'
          ),
          expectedReleaseDate: 'najaar 2026',
          contactCta: {
            label: 'Bespreek skill-delivery',
            link: contactLink,
          },
          tone: 'paper',
        },
      ],
    },
    {
      _id: 'case-recornect',
      _type: 'case',
      language: 'nl',
      title: 'Design voor de-escalatie, internationaal uitgebreid',
      slug: { _type: 'slug', current: 'recornect' },
      layer: 'heritage',
      ndaStatus: false,
      status: 'live',
      preClaim: 'HERITAGE · DESIGN · INTERNATIONAL · 2021–2024',
      subtitle:
        'Merk-identiteit, 3D product-visualisaties en packaging voor een forensische-psychiatrie productlijn die in Nederland, de VS en Duitsland moest blijven kloppen.',
      client: 'Recornect',
      period: period('2021-01-01', '2024-12-31'),
      role: 'Merk-identiteit, packaging en sales-site design',
      stack: ['brand-identity', '3d-viz', 'print'],
      tags: ['heritage', 'design', 'international'],
      content: [
        {
          _key: 'recornect-intro',
          _type: 'pitchOpeningBlock',
          enabled: true,
          body: portableTextBody(
            'Deze case laat zien hoe design functioneel kan zijn zonder klinisch te worden. Het werk moest rust uitstralen in een context waar de-escalatie geen abstract begrip is, maar een producteis.',
            'Tegelijkertijd moest het systeem uitbreidbaar blijven naar meerdere landen. De identiteit mocht dus niet zo lokaal zijn dat hij in de VS of Duitsland opnieuw gebouwd moest worden.'
          ),
          maxWidth: 'main',
          tone: 'paper',
        },
        {
          _key: 'recornect-quote',
          _type: 'calloutBlock',
          enabled: true,
          kind: 'pull-quote',
          body: portableTextBody(
            'Ons merk moest naar de VS en Duitsland mee, zonder in elk land opnieuw te beginnen. Dat is precies wat er gebouwd is.'
          ),
          attribution: 'Managing Director, Recornect',
          tone: 'paper',
        },
        {
          _key: 'recornect-meta',
          _type: 'metaBlock',
          enabled: true,
          heading: 'Kern van de case',
          items: [
            { _key: 'recornect-meta-1', label: 'Deliverables', value: 'identiteit · packaging · sales-site' },
            { _key: 'recornect-meta-2', label: 'Focus', value: 'de-escalatie en internationale schaal' },
            { _key: 'recornect-meta-3', label: 'Rol', value: 'Design lead' },
          ],
          tone: 'paper',
        },
        {
          _key: 'recornect-cta',
          _type: 'ctaRefreinBlock',
          enabled: true,
          pageKey: 'case-detail',
          tone: 'claude',
        },
      ],
    },
    {
      _id: 'case-universiteit-van-nederland',
      _type: 'case',
      language: 'nl',
      title: 'Accessibility-first huisstijl voor publieke kennis',
      slug: { _type: 'slug', current: 'universiteit-van-nederland' },
      layer: 'heritage',
      ndaStatus: false,
      status: 'live',
      preClaim: 'HERITAGE · DESIGN · ACCESSIBILITY · 2022',
      subtitle:
        'Een huisstijl-herziening waarin contrast, typografie-hiërarchie en redactionele toegankelijkheid het ontwerp mede bepaalden.',
      client: 'Universiteit van Nederland',
      period: period('2022-01-01', '2022-12-31'),
      role: 'Huisstijl, web-design en richtlijnen',
      stack: ['brand-system', 'a11y', 'editorial'],
      tags: ['heritage', 'design', 'accessibility'],
      content: [
        {
          _key: 'uvn-intro',
          _type: 'pitchOpeningBlock',
          enabled: true,
          body: portableTextBody(
            'Toegankelijkheid was hier geen eindcontrole, maar een ontwerp-input. De vraag was niet hoe we een stijl zo mooi mogelijk konden maken en hem daarna “toegankelijk genoeg” kregen, maar hoe vorm en toegankelijkheid vanaf het begin dezelfde keuze konden zijn.',
            'Dat leverde een systeem op dat publiek werkt zonder strak of klinisch aan te voelen.'
          ),
          maxWidth: 'main',
          tone: 'paper',
        },
        {
          _key: 'uvn-quote',
          _type: 'calloutBlock',
          enabled: true,
          kind: 'pull-quote',
          body: portableTextBody(
            'Ze ontwerpen alsof toegankelijkheid en vormgeving nooit gescheiden hadden moeten worden.'
          ),
          attribution: 'Creative Director, Universiteit van Nederland',
          tone: 'paper',
        },
        {
          _key: 'uvn-meta',
          _type: 'metaBlock',
          enabled: true,
          heading: 'Kern van de case',
          items: [
            { _key: 'uvn-meta-1', label: 'Deliverables', value: 'huisstijl · web-design · richtlijnen' },
            { _key: 'uvn-meta-2', label: 'Focus', value: 'WCAG AA zonder klinische uitstraling' },
            { _key: 'uvn-meta-3', label: 'Rol', value: 'Design lead' },
          ],
          tone: 'paper',
        },
        {
          _key: 'uvn-cta',
          _type: 'ctaRefreinBlock',
          enabled: true,
          pageKey: 'case-detail',
          tone: 'claude',
        },
      ],
    },
    {
      _id: 'case-merkidentiteit-schaal',
      _type: 'case',
      language: 'nl',
      title: 'Merkidentiteit die van lancering naar schaal kon meegroeien',
      slug: { _type: 'slug', current: 'merkidentiteit-schaal' },
      layer: 'heritage',
      ndaStatus: false,
      status: 'live',
      preClaim: 'HERITAGE · BRAND · 2023',
      subtitle:
        'Een merk-systeem waarin campagnes, productpagina’s en een groeiend digitaal platform onder één visuele logica bleven werken.',
      client: 'Fresh Frames-archief',
      period: period('2023-01-01', '2023-12-31'),
      role: 'Merk-systeem en digitale vertaling',
      stack: ['brand-system', 'digital-design', 'campaign'],
      tags: ['heritage', 'brand', 'system'],
      content: [
        {
          _key: 'brand-scale-intro',
          _type: 'pitchOpeningBlock',
          enabled: true,
          body: portableTextBody(
            'Sommige heritage-cases zijn vooral belangrijk omdat ze laten zien hoe een merk niet opnieuw uitgevonden hoeft te worden zodra het digitale werk serieuzer wordt. Deze case hoort in die categorie.',
            'De winst zat in samenhang: één visuele taal die campagnes, productpagina’s en langere trajecten kon dragen zonder telkens opnieuw te beginnen.'
          ),
          maxWidth: 'main',
          tone: 'paper',
        },
        {
          _key: 'brand-scale-meta',
          _type: 'metaBlock',
          enabled: true,
          heading: 'Kern van de case',
          items: [
            { _key: 'brand-scale-meta-1', label: 'Deliverables', value: 'merk-systeem · digitale vertaling · campagne-assets' },
            { _key: 'brand-scale-meta-2', label: 'Focus', value: 'schaal zonder rebrand' },
            { _key: 'brand-scale-meta-3', label: 'Rol', value: 'Design & system thinking' },
          ],
          tone: 'paper',
        },
      ],
    },
  ]

  for (const doc of docs) {
    await client.createOrReplace(doc as any)
  }

  console.log(`  ✓ (${docs.length} supporting cases)`)
}

async function seedSupportingEssays() {
  console.log('▸ Supporting essays (/academy grid naast flagship)…')

  const docs = [
    {
      _id: 'essay-skills-als-opleveringsbestand',
      _type: 'essay',
      language: 'nl',
      title: 'Skills als opleveringsbestand',
      slug: { _type: 'slug', current: 'skills-als-opleveringsbestand' },
      category: 'practice',
      status: 'live',
      featured: false,
      preClaim: 'WERKWIJZE · 2026-04-18 · 8 MIN · ALEX DE GRAAF',
      dek:
        'De meest ondergewaardeerde deliverable uit ons werk is geen document en geen website, maar een skill die het klantteam blijft gebruiken.',
      author: { _type: 'reference', _ref: 'team-alex' },
      publishedAt: '2026-04-18T09:00:00.000Z',
      readTime: '8 min',
      tags: ['skill-delivery', 'werkwijze', 'ai'],
      body: portableTextBody(
        'Veel opleveringen eindigen met een repository, een inlog en een korte call. Dat is meestal niet genoeg. Het team moet daarna zelf verder, en precies daar verdwijnt de meeste studio-kennis normaal gesproken uit beeld.',
        'Wij leveren daarom steeds vaker een skill-set mee: vastgelegde AI-werkwijzen, context, voorbeelddata, do’s en don’ts. Niet als abstract prompt-document, maar als iets dat in het werk zelf kan blijven draaien.',
        'Zo wordt de versnelling die wij tijdens het bouwen hadden niet een privé-voordeel van de studio, maar een onderdeel van de oplevering.',
        'Een skill is voor ons alleen waardevol als hij een echte taak afvangt: categoriseren, voorbereiden, structureren, checken. Niet als gimmick, wel als overdraagbaar gereedschap.',
        'Dat maakt het verschil tussen “we hebben jullie site opgeleverd” en “we hebben jullie team geholpen om met dezelfde scherpte door te bouwen”.'
      ),
      seo: {
        title: 'Skills als opleveringsbestand — Add the Code',
        description: 'Waarom een skill-set vaak waardevoller is dan alleen een repository of overdrachtsdocument.',
      },
    },
    {
      _id: 'essay-spreadsheet-naar-relationeel-model',
      _type: 'essay',
      language: 'nl',
      title: 'Van Google Sheet-spaghetti naar iets dat klopt',
      slug: { _type: 'slug', current: 'spreadsheet-naar-relationeel-model' },
      category: 'analyse',
      status: 'live',
      featured: false,
      preClaim: 'CASE-REFLECTIE · 2026-04-10 · 9 MIN · ALEX DE GRAAF',
      dek:
        'Hoe we een bedrijf dat met dertien kolom-verschillende spreadsheets werkte hebben verhuisd naar één relationeel model — en wat dat over de oude manier zegt.',
      author: { _type: 'reference', _ref: 'team-alex' },
      publishedAt: '2026-04-10T09:00:00.000Z',
      readTime: '9 min',
      tags: ['analyse', 'supabase', 'data-model'],
      body: portableTextBody(
        'Spreadsheet-sprawl ontstaat zelden omdat teams van chaos houden. Het ontstaat omdat een spreadsheet snel genoeg werkt tot het bedrijf verandert.',
        'Vanaf dat moment krijg je kopieën, uitzonderingen en mensen die elk hun eigen versie van de waarheid onderhouden. De eerste stap van een migratie is daarom niet bouwen, maar begrijpen welke werkelijkheid er eigenlijk verstopt zit in al die tabbladen.',
        'Als die entiteiten en relaties eenmaal scherp zijn, kun je een model bouwen dat langer meegaat dan het tijdelijke proces waar de spreadsheets ooit voor ontstonden.',
        'AI helpt hier goed bij de eerste conversie en bij het vinden van patronen. Maar juist omdat de brondata rommelig is, blijft menselijk oordeel noodzakelijk op de plekken waar het model definitief wordt.',
        'De winst is zelden alleen tijd. De echte winst is dat het team weer één plek krijgt waar beslissingen vandaan komen.'
      ),
      seo: {
        title: 'Van Google Sheet-spaghetti naar iets dat klopt — Add the Code',
        description: 'Een reflectie op model-sanering, migratie en waarom spreadsheets zelden het echte probleem zijn.',
      },
    },
    {
      _id: 'essay-waar-ai-niet-hoort',
      _type: 'essay',
      language: 'nl',
      title: 'Waar AI niet hoort in ons proces',
      slug: { _type: 'slug', current: 'waar-ai-niet-hoort' },
      category: 'principle',
      status: 'live',
      featured: false,
      preClaim: 'STANDPUNT · 2026-04-05 · 6 MIN · ALEX DE GRAAF',
      dek:
        'Een lijst van werk-soorten waarin we AI bewust niet inzetten. Niet omdat het niet kan, maar omdat het de verkeerde laag zou versnellen.',
      author: { _type: 'reference', _ref: 'team-alex' },
      publishedAt: '2026-04-05T09:00:00.000Z',
      readTime: '6 min',
      tags: ['principle', 'ai', 'grenzen'],
      body: portableTextBody(
        'Elke nieuwe AI-tool lokt dezelfde vraag uit: waar kunnen we hem nog meer inzetten? Voor ons is de belangrijkere vraag precies andersom: waar willen we hem juist niet hebben?',
        'Discovery-interviews zijn daar het eerste voorbeeld van. Dat zijn geen samenvattingen die sneller kunnen, maar gesprekken waarin spanning, twijfel en nuance het werk zijn.',
        'Merkbeslissingen horen ook in die categorie. AI kan varianten geven, maar niet bepalen wat een merk geloofwaardig maakt of welke afwijking betekenisvol is.',
        'Klant-communicatie laten we eveneens menselijk. Niet omdat AI geen nette mail kan schrijven, maar omdat relaties niet beter worden van een extra tussenlaag.',
        'Grenswerk is geen anti-AI-houding. Het is precies wat maakt dat de plekken waar we AI wel inzetten ook echt waardevol blijven.'
      ),
      seo: {
        title: 'Waar AI niet hoort in ons proces — Add the Code',
        description: 'Een standpunt over de grenzen van AI in discovery, merkbeslissingen en klant-communicatie.',
      },
    },
  ]

  for (const doc of docs) {
    await client.createOrReplace(doc as any)
  }

  console.log(`  ✓ (${docs.length} supporting essays)`)
}

// ─── 8. Home Page ────────────────────────────────────────────

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

  // Volgorde matters: docs moeten bestaan voordat cmsLink-references ernaar wijzen.
  await seedPageShells()
  await seedSiteSettings()
  await seedCoreTeam()
  await seedSupportingCases()
  await seedSupportingEssays()
  await seedHomePage()
  await seedUtilityPages()
  await seedComponentDefaults()
  await seedNavigation()

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Klaar. Open Sanity Studio om de seeds te bekijken/aanpassen.')
  console.log('Astro homepage zou nu end-to-end moeten renderen op /.')
}

main().catch((err) => {
  console.error('FOUT:', err)
  process.exit(1)
})
