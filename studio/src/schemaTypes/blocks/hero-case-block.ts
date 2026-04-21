import { defineArrayMember, defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

/**
 * Hero Case — 60/40 split hero voor case-detail pagina's (`docs/07h §1`).
 *
 * Niet in pageBuilder — wordt automatisch geprepended door de Astro
 * case-page template (`/work/[slug].astro`) op basis van case-document velden.
 *
 * Editor-use: binnen case-document zelf (embedded object, niet via pageBuilder).
 */
export const heroCaseBlock = defineType({
  name: 'heroCaseBlock',
  title: 'Hero — Case (intern)',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'preClaim',
      title: 'Pre-claim (mono-label)',
      type: 'string',
      description:
        'Bv "LAUNCH · CUSTOM-MET-AI · 2026 · LIVE" — drielaag-layer + stack + jaar + status.',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle (kort onder hero-title)',
      type: 'text',
      rows: 2,
      description: 'Outcome-first regel die in één zin zegt wat er is gebouwd.',
    }),
    defineField({
      name: 'artifact',
      title: 'Artifact (hero-beeld)',
      type: 'image',
      options: { hotspot: true },
      description:
        '60/40 split: de artifact krijgt 60% breedte op desktop. Aspect-ratio idealiter 4:3 of vierkant.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description:
        'Case-tags — bv ["custom-met-AI", "CMS-architectuur", "Astro", "Sanity"]. Max 6.',
      validation: (r) => r.max(6),
    }),
    defineField({
      name: 'tone',
      title: 'Tonale zone',
      type: 'string',
      options: {
        list: [
          { title: 'Paper (licht)', value: 'paper' },
          { title: 'Ink (donker)', value: 'ink' },
          { title: 'Claude (oranje)', value: 'claude' },
        ],
        layout: 'radio',
      },
      initialValue: 'paper',
    }),
  ],
  preview: {
    select: { enabled: 'enabled', subtitle: 'subtitle', media: 'artifact' },
    prepare({ enabled, subtitle, media }) {
      const title = subtitle || 'Hero — Case'
      return {
        title: enabled === false ? `🚫 ${title.slice(0, 40)}` : title.slice(0, 40),
        subtitle: enabled === false ? 'Verborgen' : 'Hero — Case',
        media,
      }
    },
  },
})
