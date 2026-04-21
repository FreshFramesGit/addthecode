/**
 * seed-flagship-essay.ts — "Custom is terug — wat AI daaraan verandert".
 *
 * Spec: docs/07i Deel B (flagship essay, referentie-instantie voor essay-template).
 *
 * Vereist dat seed-defaults.ts al gedraaid is (gebruikt team-alex author-reference).
 *
 * ── Hoe te draaien:
 *
 *   cd studio
 *   SANITY_API_WRITE_TOKEN=skXXX... npx tsx ../scripts/seed-flagship-essay.ts
 *
 * Body gebruikt blockContent Portable Text met:
 *  - h2-style voor §-kopjes (Opening, Het probleem, Wat er veranderd is, ...)
 *  - h3-style voor genummerde sub-items in "Wat we terugkrijgen"
 *  - blockquote-style voor pull-quotes en side-notes
 *  - inline em (italic) en strong (bold) voor emphasis
 */

import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId) throw new Error('SANITY_STUDIO_PROJECT_ID ontbreekt.')
if (!token) throw new Error('SANITY_API_WRITE_TOKEN ontbreekt.')

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-03-29',
  useCdn: false,
})

// ─── Portable Text helpers ──────────────────────────────────

function key() {
  return Math.random().toString(36).slice(2, 10)
}

function pt(
  parts: Array<{ text: string; italic?: boolean; bold?: boolean }>,
  style: 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote' = 'normal',
) {
  return {
    _type: 'block',
    _key: key(),
    style,
    markDefs: [],
    children: parts.map((p, i) => {
      const marks: string[] = []
      if (p.italic) marks.push('em')
      if (p.bold) marks.push('strong')
      return {
        _type: 'span',
        _key: `${key()}-${i}`,
        text: p.text,
        marks,
      }
    }),
  }
}

function p(text: string) {
  return pt([{ text }])
}

function h2(text: string) {
  return pt([{ text }], 'h2')
}

function h3(text: string) {
  return pt([{ text }], 'h3')
}

function quote(text: string) {
  return pt([{ text }], 'blockquote')
}

// ─── Flagship essay ─────────────────────────────────────────

async function seedFlagshipEssay() {
  console.log('▸ Flagship essay — "Custom is terug"…')

  const body = [
    // ─── Opening ───
    p(
      'In 2019 heb ik een merk geholpen om hun website te verhuizen van custom Rails naar een no-code-platform. Het was destijds een verstandige beslissing. De klant was wekelijks afhankelijk van twee developers voor kleine content-wijzigingen; hun budget was structureel te klein voor een engineering-team; en het nieuwe platform gaf hun marketing-lead de knoppen die ze nodig had. Zes maanden later publiceerde ze in één uur wat eerst twee dagen kostte.',
    ),
    p(
      'Dezelfde week had ik nog drie gesprekken met andere merken waarin ik in wezen hetzelfde advies gaf: je wil géén custom. Custom is te duur voor het rendement. Neem een platform. Je team komt eerder in beweging. Die adviezen sloegen aan. De jaren 2020–2024 waren, in dat opzicht, de no-code-jaren.',
    ),
    pt([
      { text: 'Ik denk niet dat ik fout zat. Ik denk wel dat de onderliggende rekensom die ik toen maakte, vandaag niet meer klopt.' },
    ]),

    // ─── § Het probleem dat no-code oploste ───
    h2('Het probleem dat no-code oploste'),
    p(
      'Het is goed om eerst scherp te hebben welk probleem no-code oploste. Dat probleem was niet "websites maken zonder programmeren" — dat was altijd al kunstmatig geframed. Het probleem was eenvoudiger en belangrijker: de kosten van een maatwerk-bouw waren niet in verhouding tot wat een middelgroot merk ermee kon doen.',
    ),
    p(
      'Een typisch custom-project in 2019 kostte een middelgrote klant iets tussen de 80.000 en 200.000 euro voor bouw, plus 30.000 per jaar in onderhoud. Voor dat geld kreeg je eigen code, een eigen stack, en het merk-profiel dat je wilde. Maar je kreeg ook: een team dat langdurig nodig bleef, upgrades die regelmatig moesten plaatsvinden, en een bouw-tijd van zes tot twaalf maanden voordat je iets draaiend had.',
    ),
    p(
      'No-code deed twee dingen tegelijkertijd: het sloopte de eerste rekening en het maakte de tweede rekening (onderhoud) bijna verdwijnend klein. Voor 15.000–40.000 per jaar kreeg je een snel-leverbare, grafisch-editable site. De trade-off zat elders — in vendor-lock-in, in data-model-beperkingen, en in de langetermijn-eigendoms-vraag die zich pas veel later aandiende.',
    ),

    // ─── § Wat er veranderd is in 2024–2026 ───
    h2('Wat er veranderd is in 2024–2026'),
    p(
      'Dat er iets is veranderd, is voor iedereen die met code werkt tastbaar. Een goed getrainde ontwikkelaar schrijft nu in een dag hoeveelheid werkende code die in 2022 één tot twee weken kostte. Niet omdat AI het werk overneemt — dat doet het niet op een niveau waar je als studio op kan bouwen — maar omdat AI een samenwerkingspartner is geworden in de delen van het bouwproces die tijd-intensief waren en intellectueel vrij laagwaardig.',
    ),

    // ─── Pull-quote ───
    quote(
      'Het zijn niet de architectuur-beslissingen die AI beter maakt. Het zijn de dertig tussenstappen eronder.',
    ),

    p(
      'Het zijn niet de architectuur-beslissingen die AI beter maakt. Het zijn de dertig tussenstappen die een architectuur-beslissing implementeren: de boilerplate-code, de test-coverage, de migratie-scripts, de documentatie, de eerste versie van een component-library. Werk dat je moet doen om een idee naar productie te krijgen, maar waarvan je als bouwer niet leert door het twaalf keer te herhalen.',
    ),
    p(
      'In de gevallen waar wij dit nu meten — in onze eigen studio en in vergelijkbare studios waarmee we praten — hebben deze versnellingen de effectieve kosten van custom-bouwen tussen de 30% en 60% verlaagd, afhankelijk van het type project. Voor een middelgrote klant betekent dat een traject van 80.000 euro nu 40.000 euro kost. Soms lager. En de levertijd is meestal gehalveerd.',
    ),

    // ─── § Wat we terugkrijgen ───
    h2('Wat we terugkrijgen'),
    p(
      'Stel dat dat klopt. Stel dat custom-bouwen ineens bereikbaar is voor merken die het de laatste zes jaar moesten laten liggen. Wat krijg je dan terug dat je met no-code niet had?',
    ),
    pt([{ text: 'Vijf dingen, als ik het nauwkeurig opschrijf.' }]),

    // Sub 1
    h3('1. Eigendom van de stack'),
    p(
      'Je eigen code, in je eigen repository, in je eigen account. Je kunt morgen stoppen met de studio die het bouwde en iemand anders inhuren; de codebase is leesbaar genoeg en gedocumenteerd genoeg dat dat kan. Geen "platform heeft onze prijzen verhoogd en we zitten vast".',
    ),

    // Sub 2
    h3('2. Diepte in je data-model'),
    p(
      'No-code-platformen hebben schema-beperkingen die je pas voelt als je bedrijf groeit. Je hebt een klant-entiteit die eigenlijk een persoon én een organisatie is; je hebt producten die in verschillende contexten anders heten; je hebt historische data die je wil archiveren zonder te wissen. Custom geeft je de vrijheid om deze werkelijkheid precies zo in je model te leggen als jouw bedrijf functioneert.',
    ),

    // Sub 3
    h3('3. Performance als design-keuze'),
    p(
      'Je kunt beslissingen maken over waar je edge-rendering doet, wat er statisch is, welke bundles je laadt. Op de kleine schaal maakt dat weinig uit. Op schaal — bij tien duizend bezoekers per dag, bij grote content-catalogi — wordt dit het verschil tussen "onze site is snel" en "onze site is stuk".',
    ),

    // Sub 4
    h3('4. Integraties zonder compromis'),
    p(
      'Je kunt aan elke externe API of data-bron koppelen op jouw voorwaarden, met jouw retry-logica, jouw transformatie-laag, jouw error-states. Niet wat een platform-partner beschikbaar heeft gesteld in zijn native connectors.',
    ),

    // Sub 5
    h3('5. Een merk dat niet-als-een-template aanvoelt'),
    p(
      'Dit is de zachte. Maar merk-mensen voelen het als je op een generiek section-template kijkt. Custom geeft je het recht om typografie, motion, micro-interacties en overgangen zo te ontwerpen dat je merk in de details leeft.',
    ),

    // ─── § Wat er níet terugkomt ───
    h2('Wat er níet terugkomt'),
    p(
      'Ik heb collega\'s in de no-code-wereld die dit stuk waarschijnlijk zullen zien als anti-no-code-manifest. Dat is het niet. Er zijn hele categorieën werk waar no-code de juiste keuze blijft — en waar wij zelf naar verwijzen.',
    ),
    p(
      'Kortlevende landingspagina\'s, events, interne tools voor kleine teams, experimenten die je over vier maanden weer wegschrijft: voor al deze gevallen is een template-gebaseerde oplossing sneller, goedkoper en pragmatischer. Wij werken niet aan die opdrachten, en we raden ze ook niet af — we verwijzen je door naar studios die dat werk goed doen.',
    ),
    p(
      'Wat terugkomt, is een strategische keuze die tussen 2020 en 2024 bijna niet maakbaar was: het vermogen om bewust te kiezen dat jouw digitale product eigen moet zijn, voor een prijs die past bij een middelgroot bedrijf.',
    ),

    // ─── Side-note ───
    quote(
      'Sommige lezers zullen opmerken dat ook de no-code-platformen AI-features hebben geïntegreerd. Dat klopt, en die zijn nuttig. Maar ze veranderen de onderliggende eigendoms-economica niet — je bouwt nog steeds op een gehuurde stack.',
    ),

    // ─── § Wat dit voor ons betekent ───
    h2('Wat dit voor ons betekent'),
    p(
      'Add the Code bestaat omdat wij denken dat bovenstaande beweging geen voorbijgaand fenomeen is. De instrumenten — Claude, Codex, Cursor, en wat erna komt — zullen nog beter worden. Custom-bouwen zal nóg betaalbaar worden. Dat is een kant op die niet makkelijk terugdraait.',
    ),
    pt([
      { text: 'Maar het betekent iets van ons als studio. Het betekent dat onze waarde minder zit in ' },
      { text: '"wij kunnen dit coderen en jij niet"', italic: true },
      { text: ' en meer in ' },
      {
        text: '"wij kunnen dit ontwerpen, wij kennen de trade-offs, wij dragen de architectuur-verantwoordelijkheid, en wij leveren het zo op dat jij erop door kunt bouwen"',
        italic: true,
      },
      { text: '. AI versnelt de bouw. Maar hij neemt de oordeelsvorming niet over. Niet nu, en niet snel.' },
    ]),
    p(
      'Als onze belofte in één zin moet: wij geven je custom terug, tegen een prijs die past, met een werkwijze die eerlijk is over waar AI meedoet en waar mensen dat doen. En als je dat gesprek met ons wil voeren — daar zijn we voor.',
    ),

    // ─── Slot ───
    h2('Slot'),
    p(
      'Dit essay is niet het einde van het gesprek — het is het begin van een serie. In de komende maanden schrijf ik over skill-delivery als opleveringsbestand, over wanneer we AI in ons proces níet inzetten, en over de retrospectieven van cases waarin onze nieuwe werkwijze concreet zichtbaar werd. Volg mee via de nieuwsbrief, of kom direct praten.',
    ),
    pt([
      { text: 'Lees de Bell-launch-case — onze eerste project onder de Add the Code-vlag →', italic: true },
    ]),
  ]

  await client.createOrReplace({
    _id: 'essay-custom-is-terug',
    _type: 'essay',
    title: 'Custom is terug — wat AI daaraan verandert',
    slug: { _type: 'slug', current: 'custom-is-terug' },
    language: 'nl',
    category: 'principle', // positionering-essay
    status: 'live',
    featured: true, // flagship
    preClaim: 'ESSAY · 2026-04-15 · 12 MIN · ALEX DE GRAAF',
    dek:
      'Tien jaar lang leek custom-ontwikkelen een luxe. Dat was een financiële verwarring, niet een technische. Nu die wordt opgeheven, staat het vak voor een echte keuze.',
    publishedAt: '2026-04-15T09:00:00.000Z',
    readTime: '12 min',
    author: { _type: 'reference', _ref: 'team-alex' },
    tags: ['custom-met-AI', 'economica', 'positionering', 'no-code'],
    body,
    seo: {
      title: 'Custom is terug — wat AI daaraan verandert',
      description:
        'Flagship essay: tien jaar lang leek custom-ontwikkelen een luxe. Nu AI de bouw-tijd halveert, staat het vak voor een echte keuze. Door Alex de Graaf.',
    },
  })

  console.log('  ✓ (essay-custom-is-terug geseed, featured=true)')
}

async function main() {
  console.log(`Seed flagship essay — Sanity ${projectId}/${dataset}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  await seedFlagshipEssay()
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Klaar. /academy/custom-is-terug rendert nu end-to-end.')
  console.log('De essay verschijnt als flagship-tegel op /academy (showFeaturedFirst=true).')
}

main().catch((err) => {
  console.error('FOUT:', err)
  process.exit(1)
})
