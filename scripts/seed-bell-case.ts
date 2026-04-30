/**
 * seed-bell-case.ts — Bell Hammerson launch-case.
 *
 * Spec: docs/07h (case-template met Bell als referentie-instantie),
 * docs/07b §2.1 (work-index card).
 *
 * Vereist dat seed-defaults.ts al gedraaid is (gebruikt team-alex reference).
 *
 * ── Hoe te draaien:
 *
 *   cd studio
 *   SANITY_API_WRITE_TOKEN=skXXX... npx tsx ../scripts/seed-bell-case.ts
 *
 * Metrics zijn gemarkeerd met `verifiedByAlex: false` — pre-launch QA
 * blokkeert publicatie tot Alex ze bevestigt. Placeholder-images moeten
 * vóór launch vervangen door echte artefact-stills (zie open punten
 * docs/07h §17 en CLAUDE.md §6).
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

// ─── Bell case ──────────────────────────────────────────────

async function seedBellCase() {
  console.log('▸ Bell Hammerson — launch case (11 secties)…')

  const content = [
    // ─── §2 Het probleem ───
    {
      _key: 'problem',
      _type: 'pitchOpeningBlock',
      enabled: true,
      preClaim: '◌ Het probleem',
      heading: 'Drie publieken bedienen vanuit één agenda.',
      body: [
        pt([
          {
            text: 'Bell Hammerson bedient drie verschillende publieken met overlappende agenda\'s: lokale comedy-club-bezoekers, internationale fans van zijn solo-werk, en Engelstalige boekers in EU-venues. Tot 2026 ging dat via één WordPress-site met een lange lijst. Shows moesten in drie toonvarianten in drie kolommen bestaan; dat kostte structureel te veel CMS-tijd en leidde tot foute en gedupliceerde data.',
          },
        ]),
      ],
      maxWidth: 'main',
      tone: 'paper',
    },

    // ─── Problem quote ───
    {
      _key: 'problem-quote',
      _type: 'quoteClusterBlock',
      enabled: true,
      primaryQuote: {
        quote:
          'Ik had het gevoel dat ik de helft van m\'n tijd aan m\'n eigen website besteedde in plaats van aan comedy.',
        name: 'Bell Hammerson',
        role: 'Comedian',
        company: null,
      },
      tone: 'paper',
    },

    // ─── §3 De oplossing in één beeld ───
    {
      _key: 'solution-image',
      _type: 'pitchOpeningBlock',
      enabled: true,
      preClaim: '◌ De oplossing in één beeld',
      heading: 'Eén Sanity-bron. Eén sync-laag. Drie publieken. Nul handwerk.',
      body: [
        pt([
          { text: 'Horizontaal: ' },
          { text: 'Eventbrite-bron', italic: true },
          {
            text: ' stroomt via een AI-geassisteerde schema-mapping naar een enkele ',
          },
          { text: 'Sanity-singleton', italic: true },
          {
            text: ' (het hart van het systeem). Van daar vertakken drie pijlen naar drie site-outputs: de comedy-club NL, de solo-tour internationaal, en de Engelstalige bookers-site. Elke output trekt zijn eigen content-slice op basis van audience-rules.',
          },
        ]),
        pt([
          {
            text: 'Het diagram zelf staat als artefact in de galerij onderaan deze pagina — inclusief de audience-rule-tabel.',
          },
        ]),
      ],
      maxWidth: 'main',
      tone: 'paper',
    },

    // ─── §4 Drie beslissingen ───
    {
      _key: 'decision-1',
      _type: 'decisionBlock',
      enabled: true,
      preClaim: '◌ Architectuur · Data-bron',
      question: 'Één Sanity-singleton of drie losse projects?',
      options: [
        {
          _key: 'opt-a',
          label: 'A — Drie losse Sanity-projects',
          pros: [pt([{ text: 'Volledig gescheiden permissions. Eenvoudiger site-per-site scaling.' }])],
          cons: [pt([{ text: 'Drie keer content invoeren. Geen cross-audience queries mogelijk.' }])],
          chosen: false,
        },
        {
          _key: 'opt-b',
          label: 'B — Eén Sanity-singleton met audience-slices',
          pros: [
            pt([
              {
                text: 'Één bron van waarheid. Cross-audience queries mogelijk. Eén plek om content te bewerken.',
              },
            ]),
          ],
          cons: [
            pt([
              { text: 'Complexer schema-design upfront. Audience-toegang vereist hooks.' },
            ]),
          ],
          chosen: true,
        },
      ],
      conclusion: [
        pt([
          {
            text: 'We kozen B omdat "één show kan aan meerdere publieken toegewezen zijn" een echte realiteit was — de solo-tour passeert soms de comedy-club. Drie losse projects hadden dat onmogelijk gemaakt zonder kopieer-werk, en dat was precies de pijn die de klant had.',
          },
        ]),
      ],
      tone: 'paper',
    },
    {
      _key: 'decision-2',
      _type: 'decisionBlock',
      enabled: true,
      preClaim: '◌ Migratie · AI-rol',
      question: 'AI-geassisteerde of handmatige schema-mapping?',
      options: [
        {
          _key: 'opt-a',
          label: 'A — Handmatige schema-mapping',
          pros: [pt([{ text: 'Volledig gecontroleerd. Deterministisch.' }])],
          cons: [pt([{ text: 'Drie tot vier dagen werk voor het model alleen.' }])],
          chosen: false,
        },
        {
          _key: 'opt-b',
          label: 'B — AI-geassisteerde mapping met review',
          pros: [
            pt([
              { text: 'Eerste iteratie in uren. Meer ruimte voor schema-discussie.' },
            ]),
          ],
          cons: [
            pt([
              { text: 'Vereist expliciete review-stap. Niet elke edge-case wordt gevangen.' },
            ]),
          ],
          chosen: true,
        },
      ],
      conclusion: [
        pt([
          {
            text: 'We lieten Claude de eerste versie van het Sanity-schema genereren vanuit een voorbeeld-set Eventbrite-events. Dat kostte drie uur. De volgende twee dagen waren we bezig de schema\'s aan te scherpen, edge-cases te vangen (solo-tour-events zonder venue-data bijvoorbeeld) en het model te valideren. Netto sneller — en het bevrijdde tijd voor de audience-slice-architectuur.',
          },
        ]),
      ],
      tone: 'paper',
    },
    {
      _key: 'decision-3',
      _type: 'decisionBlock',
      enabled: true,
      preClaim: '◌ Infrastructuur · Deploy-strategie',
      question: 'Drie sites als monorepo of gescheiden deploys?',
      options: [
        {
          _key: 'opt-a',
          label: 'A — Drie gescheiden Astro-projects',
          pros: [pt([{ text: 'Volledige isolatie. Per-site caching eenvoudiger.' }])],
          cons: [
            pt([{ text: 'Drie keer dependency-management. Drie deploys.' }]),
          ],
          chosen: false,
        },
        {
          _key: 'opt-b',
          label: 'B — Monorepo met shared components + drie builds',
          pros: [
            pt([
              {
                text: 'Eén plek voor componenten-lib. Shared design-tokens. Drie targeted builds.',
              },
            ]),
          ],
          cons: [
            pt([
              { text: 'Workspace-tooling setup vooraf. Strikte boundary-discipline nodig.' },
            ]),
          ],
          chosen: true,
        },
      ],
      conclusion: [
        pt([
          {
            text: 'Monorepo (pnpm workspaces) met één design-system package en drie site-packages. Elke site heeft eigen content-query (eigen audience-slice), eigen routing, eigen Vercel-project — maar deelt componenten en tokens. Een kleur-verschuiving of typografie-tweak wordt in één plek gemaakt en landt automatisch op alle drie de sites.',
          },
        ]),
      ],
      tone: 'paper',
    },

    // ─── §5 Hoe we bouwden — 5 fasen ───
    {
      _key: 'phase-01',
      _type: 'phaseBlock',
      enabled: true,
      phaseNumber: '01',
      phaseName: 'Discovery',
      oneLiner: 'Scope uitzetten, audiences definiëren, probleem vaststellen.',
      body: [
        pt([
          {
            text: 'Twee sessies met Bell en zijn management. Eventbrite-export geanalyseerd. Audience-definities vastgesteld. Scope: drie sites, één sync, minimum-viable skill-set voor Bell\'s team.',
          },
        ]),
      ],
      aiRole: 'Eventbrite-export analyse (event-distributie, venue-frequenties, titel-patronen per audience).',
      humanResponsibility:
        'Alle gesprekken, scope-afbakening, audience-definitie, problem-statement.',
      deliverables: ['Audience-model (3 publics)', 'Scope-document', 'Migratie-plan'],
      duration: 'week 1–2',
      tone: 'paper',
    },
    {
      _key: 'phase-02',
      _type: 'phaseBlock',
      enabled: true,
      phaseNumber: '02',
      phaseName: 'Design',
      oneLiner: 'Merk-verfijning + drie site-templates + schema-architectuur.',
      body: [
        pt([
          {
            text: 'Merk-verfijning (voortzetting van bestaande Bell-identiteit, geen rebrand). Drie site-templates ontworpen met gedeelde component-kit. Sanity-schema-versies uitgewerkt met audience-slice-model. Sync-laag-architectuur geschetst.',
          },
        ]),
      ],
      aiRole: 'Schema-variant-exploratie, content-mapping-drafts, type-variant-checks.',
      humanResponsibility:
        'Merk-keuzes, visuele hiërarchie, component-taal, data-model-semantiek, audience-model-semantiek.',
      deliverables: ['Design-system package', '3 site-templates', 'Sanity-schema v1'],
      duration: 'week 3–5',
      tone: 'paper',
    },
    {
      _key: 'phase-03',
      _type: 'phaseBlock',
      enabled: true,
      phaseNumber: '03',
      phaseName: 'Build',
      oneLiner: 'Monorepo, sync-laag, drie Astro-sites — geïmplementeerd.',
      body: [
        pt([
          {
            text: 'Monorepo opgezet. Design-system-package gebouwd. Drie Astro-sites geïmplementeerd. Supabase-backed sync-laag. Eventbrite-webhook geïntegreerd. Sanity-singleton met audience-rules.',
          },
        ]),
      ],
      aiRole:
        'Component-implementaties, query-schrijven, Supabase-function-drafts, test-generatie, documentatie-drafts.',
      humanResponsibility:
        'Architectuur (monorepo, deploy-strategie, permissions), code-review, performance-tuning, a11y-audit, security-review.',
      deliverables: ['3 werkende sites (staging)', 'Sync-laag', 'Webhook-integratie'],
      duration: 'week 6–10',
      tone: 'paper',
    },
    {
      _key: 'phase-04',
      _type: 'phaseBlock',
      enabled: true,
      phaseNumber: '04',
      phaseName: 'Ship',
      oneLiner: 'Staged launch met redirects en twee-weken monitoring.',
      body: [
        pt([
          {
            text: 'Staged launch: comedy-club eerst, dan solo, dan bookings. Redirects van oude WP-site per audience gemapped. Post-launch twee-weken-monitoring.',
          },
        ]),
      ],
      aiRole: 'Redirect-map-generatie, test-coverage-analyse, performance-baseline.',
      humanResponsibility:
        'Go/no-go, content-validatie, klant-communicatie, live-launch-coördinatie.',
      deliverables: ['3 live sites', 'Redirect-map', 'Monitoring-rapport'],
      duration: 'week 11',
      tone: 'paper',
    },
    {
      _key: 'phase-05',
      _type: 'phaseBlock',
      enabled: true,
      phaseNumber: '05',
      phaseName: 'Maintain-as-skill',
      oneLiner: 'Skill-set overgedragen zodat Bell\'s team zelf blijft uitbreiden.',
      body: [
        pt([
          {
            text: 'Skill-set opgeleverd: één "publiceer show"-skill, één "maak audience-variant"-skill, één "check sync-status"-skill. Walkthrough-video\'s voor Bell\'s management.',
          },
        ]),
      ],
      aiRole: 'Prompt-curatie voor skills, documentatie-drafts, onboarding-video-scripts.',
      humanResponsibility:
        'Overdrachts-sessies, skill-semantiek, support-window-beleid, escalatie-pad.',
      deliverables: ['3 skills', 'Walkthrough-video\'s', 'Overdrachts-document'],
      duration: 'vanaf week 13 · ongoing',
      tone: 'paper',
    },

    // ─── §6 Wat het nu doet — metrics ───
    {
      _key: 'metrics',
      _type: 'metricsStripBlock',
      enabled: true,
      preClaim: '◌ Wat het nu doet',
      heading: 'Meetbaar, eerlijk, zonder multipliers.',
      metrics: [
        {
          _key: 'm-cms',
          label: 'CMS-tijd',
          value: '-85%',
          source: 'Bell\'s content-team-logboek, pre- vs. post-launch (jan vs. apr 2026)',
          verifiedByAlex: false,
        },
        {
          _key: 'm-sync',
          label: 'Sync-latency',
          value: '< 30s',
          source: 'Supabase-function-logs, median over 14 dagen na launch',
          verifiedByAlex: false,
        },
        {
          _key: 'm-truth',
          label: 'One-source-of-truth',
          value: 'true',
          source: 'Architectuur-conclusie na decisionBlock 1',
          verifiedByAlex: true,
        },
      ],
      sourceNote:
        'We publiceren alleen metrics die we zelf kunnen verifiëren. Conversion- of engagement-uplifts komen niet op deze pagina tot de meetperiode voldoende lang is.',
      tone: 'ink',
    },

    // ─── §7 Grote klant-quote ───
    {
      _key: 'big-quote',
      _type: 'quoteClusterBlock',
      enabled: true,
      preClaim: null,
      primaryQuote: {
        quote:
          'Drie publieken, drie sites, één bron. Voor het eerst kan ik zelf switchen welke show waar live staat — zonder eerst iemand te hoeven bellen.',
        name: 'Bell Hammerson',
        role: 'Comedian',
        company: '2026-04',
      },
      tone: 'paper',
    },

    // ─── §8 Artefact-galerij ───
    // NOTE: images zijn placeholders (geen asset-refs). Editor voegt echte
    // artefact-stills toe per docs/07h §8.
    {
      _key: 'artifacts',
      _type: 'artifactGalleryBlock',
      // DISABLED + items leeg tot echte Bell-screenshots beschikbaar zijn.
      // Schema vereist image per item — items met image:null breken publish
      // ondanks `enabled:false` (Sanity-validatie loopt voor alle docs ongeacht
      // render-state). Alex: voeg items toe in Studio mét image, zet daarna
      // enabled:true. Captions/titels staan in docs/07h §8 voor referentie.
      enabled: false,
      preClaim: '◌ Artefacten uit het proces',
      heading: 'Zes artefacten die de diepte van het werk laten zien.',
      intro:
        'Geen mood-board — werkelijke artefacten uit het bouwproces. Editor: voeg items toe in Studio (Bell-screenshots uploaden, captions plaatsen).',
      items: [],
      layoutVariant: 'grid-3',
      tone: 'paper',
    },

    // ─── §9 Meta-blok ───
    {
      _key: 'meta',
      _type: 'metaBlock',
      enabled: true,
      heading: 'Meta',
      items: [
        {
          _key: 'meta-stack',
          label: 'Stack',
          value: 'Astro · Sanity · Supabase · Vercel · Eventbrite API',
          href: null,
        },
        {
          _key: 'meta-deliverables',
          label: 'Deliverables',
          value: '1 Sanity-schema · 3 sites · 1 sync-laag · 3-skill-set',
          href: null,
        },
        {
          _key: 'meta-periode',
          label: 'Periode',
          value: 'Q1–Q2 2026 (12 weken)',
          href: null,
        },
        {
          _key: 'meta-team',
          label: 'Team',
          value: 'Alex de Graaf (architectuur & design). Team-leden 2+3 te vullen.',
          href: null,
        },
        {
          _key: 'meta-klant',
          label: 'Klant-rol',
          value: 'Bell Hammerson (vision). Manager-naam te vullen.',
          href: null,
        },
        {
          _key: 'meta-ai',
          label: 'AI-rol',
          value: 'Pair-programmer in fase 02–05. Niet in discovery.',
          href: null,
        },
        {
          _key: 'meta-status',
          label: 'Status',
          value: 'Live sinds 2026-04-15',
          href: null,
        },
      ],
      tone: 'paper',
    },

    // §10 Next-case: niet in seed — nog geen tweede case. Editor voegt toe
    // zodra in-flight of tweede case is ingevoerd.

    // §11 CTA-refrein: automatisch geprepended door /work/[slug].astro als
    // editor niet zelf een ctaRefreinBlock plaatst.
  ]

  await client.createOrReplace({
    _id: 'case-bell',
    _type: 'case',
    title: 'Bell Hammerson',
    slug: { _type: 'slug', current: 'bell' },
    language: 'nl',
    layer: 'launch',
    ndaStatus: false,
    status: 'live',
    client: 'Bell Hammerson',
    role: 'Hoofdaannemer · architectuur, design, build',
    period: {
      start: '2026-01-01',
      end: '2026-04-15',
      isOngoing: false,
    },
    stack: ['Astro', 'Sanity', 'Supabase', 'Vercel', 'Eventbrite API'],
    tags: ['custom-met-AI', 'CMS-architectuur', 'audience-slicing', 'monorepo'],
    // liveUrl weglaten tot Alex bevestigd of we de live domeinen tonen
    preClaim: 'LAUNCH · CUSTOM-MET-AI · 2026 · LIVE',
    subtitle: 'Eén API, drie publieken, nul handwerk.',
    // heroArtifact leeg — editor voegt sync-architectuur-diagram toe
    seo: {
      title: 'Bell Hammerson — Eén API, drie publieken, nul handwerk',
      description:
        'Launch-case: een Eventbrite-synclaag die drie doelgroep-sites voedt. AI-geassisteerde schema-mapping, monorepo-architectuur, skill-delivery.',
    },
    content,
  })

  console.log(`  ✓ (${content.length} blocks — editor vult nog artefact-images in)`)
}

async function main() {
  console.log(`Seed Bell-case — Sanity ${projectId}/${dataset}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  await seedBellCase()
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Klaar. /work/bell rendert nu end-to-end.')
  console.log('⚠ Metrics verifiedByAlex=false — pre-launch QA blokkeert publicatie.')
  console.log('⚠ Artefact-images zijn leeg — vul in Studio vóór launch.')
}

main().catch((err) => {
  console.error('FOUT:', err)
  process.exit(1)
})
