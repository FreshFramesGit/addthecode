import { defineArrayMember, defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

/**
 * Tag Strip — inline mono-tags strip.
 *
 * Spec: docs/08 §5.2. Gebruikt voor stack-strips (services), case-tags inline,
 * etc. Strings of references naar recognition.
 */
export const tagStripBlock = defineType({
  name: 'tagStripBlock',
  title: 'Tag Strip',
  type: 'object',
  icon: TagIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim (label boven strip)', type: 'string' }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Inline mono-tags. Bv ["Astro", "Sanity", "Vercel", "TypeScript"].',
      validation: (r) => r.min(1).max(20),
    }),
    defineField({
      name: 'showAsLinks',
      title: 'Tags klikbaar (filter-link)',
      type: 'boolean',
      initialValue: false,
      description: 'Maakt tags klikbaar — werkt alleen op pages met filter-support (bv work-index).',
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
    select: { enabled: 'enabled', preClaim: 'preClaim', tags: 'tags' },
    prepare({ enabled, preClaim, tags }) {
      const title = preClaim || 'Tag Strip'
      const count = tags?.length || 0
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: `${count} tags` }
    },
  },
})
