import { defineArrayMember, defineField, defineType } from 'sanity'
import { ClockIcon } from '@sanity/icons'

/**
 * Heritage Strip — korte tijdlijn-strip met items als "2017 · Fresh Frames opgericht".
 *
 * Spec: docs/08 §5.3, docs/07c §5.
 */
export const heritageStripBlock = defineType({
  name: 'heritageStripBlock',
  title: 'Heritage Strip',
  type: 'object',
  icon: ClockIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Bv. "2017 · Fresh Frames opgericht", "2026 · Add the Code lancering".',
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
    select: { enabled: 'enabled', heading: 'heading', items: 'items' },
    prepare({ enabled, heading, items }) {
      const title = heading || 'Heritage Strip'
      const count = items?.length || 0
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: `${count} items` }
    },
  },
})
