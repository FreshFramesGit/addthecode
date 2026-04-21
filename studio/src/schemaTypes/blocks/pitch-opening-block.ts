import { defineField, defineType } from 'sanity'
import { TextIcon } from '@sanity/icons'

/**
 * Pitch Opening — 1-2 alinea's positionering-tekst.
 *
 * Spec: docs/07a §2 (home), docs/07e/f/g §2 (services intro).
 */
export const pitchOpeningBlock = defineType({
  name: 'pitchOpeningBlock',
  title: 'Pitch Opening (alinea)',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim (mono-label)', type: 'string' }),
    defineField({
      name: 'body',
      title: 'Body (Portable Text)',
      type: 'blockContent',
      description: '1-2 alinea\'s. Ondersteunt inline emphasis (Claude-orange highlight, mono inline).',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'maxWidth',
      title: 'Max breedte',
      type: 'string',
      options: { list: ['small', 'main', 'full'], layout: 'radio' },
      initialValue: 'main',
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
    select: { enabled: 'enabled', preClaim: 'preClaim' },
    prepare({ enabled, preClaim }) {
      const title = preClaim || 'Pitch Opening'
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: 'Pitch Opening (alinea)' }
    },
  },
})
