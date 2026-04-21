import { defineArrayMember, defineField, defineType } from 'sanity'
import { CommentIcon } from '@sanity/icons'

/**
 * Quote Cluster — 1 primair citaat + max 2 secundaire citaten.
 *
 * Spec: docs/08 §5.5.
 */
export const quoteClusterBlock = defineType({
  name: 'quoteClusterBlock',
  title: 'Quote Cluster',
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading (optioneel)', type: 'string' }),
    defineField({
      name: 'primaryQuote',
      title: 'Primair citaat',
      type: 'quoteAttribution',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'secondaryQuotes',
      title: 'Secundaire citaten (max 2)',
      type: 'array',
      of: [defineArrayMember({ type: 'quoteAttribution' })],
      validation: (r) => r.max(2),
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
    select: { enabled: 'enabled', primary: 'primaryQuote.quote' },
    prepare({ enabled, primary }) {
      const title = primary ? `"${primary.slice(0, 40)}…"` : 'Quote Cluster'
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: 'Quote Cluster' }
    },
  },
})
