import { defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'

/**
 * Essay Grid — leest essays uit de essay-collection.
 *
 * Spec: docs/07i (academy index) en docs/07a (home featured essay-strip).
 */
export const essayGridBlock = defineType({
  name: 'essayGridBlock',
  title: 'Essay Grid',
  type: 'object',
  icon: BookIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro (optioneel)', type: 'text', rows: 2 }),
    defineField({
      name: 'categoryFilter',
      title: 'Filter op categorie',
      type: 'string',
      options: {
        list: [
          { title: 'Alle', value: 'all' },
          { title: 'Principle', value: 'principle' },
          { title: 'Practice', value: 'practice' },
          { title: 'Analyse', value: 'analyse' },
          { title: 'Featured (handmatig geselecteerd)', value: 'featured' },
        ],
        layout: 'radio',
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'maxItems',
      title: 'Max aantal items',
      type: 'number',
      initialValue: 9,
      validation: (r) => r.min(1).max(30),
    }),
    defineField({
      name: 'showFeaturedFirst',
      title: 'Toon featured-essay als eerste card (groot)',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showFilterChips',
      title: 'Toon filter chips',
      type: 'boolean',
      initialValue: false,
      description: 'Standaard alleen aan op /academy.',
    }),
    defineField({
      name: 'tone',
      title: 'Tonale zone',
      type: 'string',
      options: { list: ['paper', 'ink', 'claude'], layout: 'radio' },
      initialValue: 'paper',
    }),
    defineField({ name: 'anchorId', title: 'Anchor ID', type: 'string', validation: (r) => r.regex(/^[a-z0-9-]*$/) }),
  ],
  preview: {
    select: { enabled: 'enabled', heading: 'heading', filter: 'categoryFilter' },
    prepare({ enabled, heading, filter }) {
      const title = heading || `Essay Grid · ${filter}`
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: `Filter: ${filter}` }
    },
  },
})
