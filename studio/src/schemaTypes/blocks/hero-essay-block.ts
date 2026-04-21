import { defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'

/**
 * Hero Essay — hero voor /academy/[slug] pagina's (`docs/07i Deel B §1`).
 *
 * Niet in pageBuilder — wordt automatisch geprepended door de Astro essay-page
 * template op basis van essay-document velden (title, dek, author, publishedAt,
 * readTime, featuredImage).
 *
 * Editor-use: binnen essay-document zelf (embedded object, niet via pageBuilder).
 */
export const heroEssayBlock = defineType({
  name: 'heroEssayBlock',
  title: 'Hero — Essay (intern)',
  type: 'object',
  icon: BookIcon,
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
      description: 'Bv "ESSAY · PRACTICE · 18 min lezen · April 2026".',
    }),
    defineField({
      name: 'dek',
      title: 'Dek (onder titel)',
      type: 'text',
      rows: 3,
      description: 'Kort intro-stuk onder de title — zet essay-belofte in context (~50-80 woorden).',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured image (optioneel)',
      type: 'image',
      options: { hotspot: true },
      description: 'Optioneel — alleen als een beeld bij het essay past. Anders tekst-only hero.',
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
    select: { enabled: 'enabled', dek: 'dek', media: 'featuredImage' },
    prepare({ enabled, dek, media }) {
      const title = dek ? dek.slice(0, 50) : 'Hero — Essay'
      return {
        title: enabled === false ? `🚫 ${title}` : title,
        subtitle: enabled === false ? 'Verborgen' : 'Hero — Essay',
        media,
      }
    },
  },
})
