import { defineArrayMember, defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

/**
 * Case — drielaag work-portfolio document.
 *
 * Spec: docs/07b (drielaag), docs/07h (case-template).
 *
 * Drielaag rendering:
 * - layer: 'launch' → volledige template (alle blocks)
 * - layer: 'in-flight' → §6/§7 vervangen door ndaExplainerBlock
 * - layer: 'heritage' → korte template (hero + 2-3 alinea's + 1 artifact + meta)
 *
 * `metrics[].verifiedByAlex` is een soft-warning — pre-launch QA blokkeert publicatie
 * van onbevestigde claims (bv Bell `CMS-tijd -85%`).
 */
export const caseDocument = defineType({
  name: 'case',
  title: 'Case',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'identification', title: 'Identification', default: true },
    { name: 'hero', title: 'Hero (intro)' },
    { name: 'content', title: 'Sections' },
    { name: 'meta', title: 'Meta & relations' },
    { name: 'pageSettings', title: 'SEO' },
  ],
  fields: [
    // ─── Identification ───
    defineField({
      name: 'title',
      title: 'Title (interne titel + nav-label)',
      type: 'string',
      group: 'identification',
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'identification',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'language',
      title: 'Taal',
      type: 'string',
      group: 'identification',
      options: {
        list: [
          { title: 'Nederlands', value: 'nl' },
          { title: 'English', value: 'en' },
        ],
        layout: 'radio',
      },
      initialValue: 'nl',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'layer',
      title: 'Drielaag layer',
      type: 'string',
      group: 'identification',
      options: {
        list: [
          { title: 'Launch (volledige case)', value: 'launch' },
          { title: 'In-flight (NDA, anoniem)', value: 'in-flight' },
          { title: 'Heritage (Fresh Frames legacy)', value: 'heritage' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'ndaStatus',
      title: 'Onder NDA',
      type: 'boolean',
      group: 'identification',
      initialValue: false,
      hidden: ({ parent }) => parent?.layer !== 'in-flight',
      description: 'Aan: case is onder NDA — §6/§7 worden vervangen door ndaExplainerBlock + SEO noIndex aanbevolen.',
    }),
    defineField({
      name: 'status',
      title: 'Publicatie-status',
      type: 'string',
      group: 'identification',
      options: {
        list: [
          { title: 'Draft (nog niet zichtbaar)', value: 'draft' },
          { title: 'Live (zichtbaar op site)', value: 'live' },
          { title: 'Archived (niet meer gepromoot)', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (r) => r.required(),
    }),

    // ─── Hero ───
    defineField({
      name: 'preClaim',
      title: 'Pre-claim (mono-label boven hero)',
      type: 'string',
      group: 'hero',
      description: 'Bv "LAUNCH · CUSTOM-MET-AI · 2026 · LIVE".',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle (outcome-first regel)',
      type: 'text',
      rows: 2,
      group: 'hero',
      description: 'Wat is er gebouwd, in één zin.',
    }),
    defineField({
      name: 'heroArtifact',
      title: 'Hero artifact (60% breedte split)',
      type: 'image',
      options: { hotspot: true },
      group: 'hero',
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() }),
      ],
    }),

    // ─── Meta ───
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      group: 'meta',
      description:
        'Voor in-flight (NDA) cases een gegeneraliseerde omschrijving — bv "Grote Nederlandse retailer".',
    }),
    defineField({
      name: 'period',
      title: 'Period',
      type: 'period',
      group: 'meta',
    }),
    defineField({
      name: 'role',
      title: 'Onze rol',
      type: 'string',
      group: 'meta',
      description: 'Bv "Hoofdaannemer", "Frontend lead", "AI-architect".',
    }),
    defineField({
      name: 'stack',
      title: 'Stack (technische tags)',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'meta',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'tags',
      title: 'Tags (categorieën / themes)',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'meta',
      options: { layout: 'tags' },
      description: 'Bv "custom-met-AI", "headless CMS", "marketing-site".',
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live URL (optioneel)',
      type: 'url',
      group: 'meta',
    }),

    // ─── Content (case-detail blocks) ───
    defineField({
      name: 'content',
      title: 'Page sections',
      type: 'pageBuilder',
      group: 'content',
      description:
        'Voeg secties toe in volgorde van docs/07h §1-§11. Default flow: pitch-opening → meta-block → tag-strip → decision (×N) → phase (×N) → artifact-gallery → metrics-strip → quote-cluster → next-case → cta-refrein.',
    }),

    // ─── Page settings ───
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'pageSettings' }),
  ],
  preview: {
    select: {
      title: 'title',
      layer: 'layer',
      status: 'status',
      ndaStatus: 'ndaStatus',
      media: 'heroArtifact',
    },
    prepare({ title, layer, status, ndaStatus, media }) {
      const statusBadge = status === 'live' ? '●' : status === 'draft' ? '○' : '⊘'
      const ndaBadge = ndaStatus ? ' 🔒' : ''
      return {
        title: `${statusBadge} ${title || 'Untitled case'}${ndaBadge}`,
        subtitle: `${layer || '?'} · ${status || 'draft'}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Recently updated',
      name: 'updatedDesc',
      by: [{ field: '_updatedAt', direction: 'desc' }],
    },
    {
      title: 'Period (newest first)',
      name: 'periodDesc',
      by: [{ field: 'period.start', direction: 'desc' }],
    },
    {
      title: 'Layer + status',
      name: 'layerStatus',
      by: [
        { field: 'layer', direction: 'asc' },
        { field: 'status', direction: 'asc' },
      ],
    },
  ],
})
