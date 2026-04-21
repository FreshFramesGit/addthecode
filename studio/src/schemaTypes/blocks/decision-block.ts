import { defineArrayMember, defineField, defineType } from 'sanity'
import { SplitVerticalIcon } from '@sanity/icons'

/**
 * Decision Block — beslissing met opties (pros/cons) en gekozen pad.
 *
 * Spec: docs/07h §6 (case-detail). Maakt traceerbaar waarom een keuze is gemaakt.
 */
export const decisionBlock = defineType({
  name: 'decisionBlock',
  title: 'Decision (case)',
  type: 'object',
  icon: SplitVerticalIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim (mono-label)', type: 'string' }),
    defineField({
      name: 'question',
      title: 'Vraag / dilemma',
      type: 'string',
      description: 'Bv "Bouwen of inkopen?" of "Eén CMS of headless splitsen?".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'options',
      title: 'Opties',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'decisionOption',
          fields: [
            defineField({ name: 'label', title: 'Optie', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'pros', title: 'Pros (Portable Text)', type: 'blockContent' }),
            defineField({ name: 'cons', title: 'Cons (Portable Text)', type: 'blockContent' }),
            defineField({
              name: 'chosen',
              title: 'Gekozen optie',
              type: 'boolean',
              initialValue: false,
              description: 'Markeer welke optie uiteindelijk gekozen is.',
            }),
          ],
          preview: {
            select: { title: 'label', chosen: 'chosen' },
            prepare: ({ title, chosen }) => ({ title: chosen ? `✓ ${title}` : title }),
          },
        }),
      ],
      validation: (r) => r.min(2).max(4),
    }),
    defineField({
      name: 'conclusion',
      title: 'Conclusie / motivatie',
      type: 'blockContent',
      description: 'Waarom deze keuze, met retrospectief inzicht.',
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
    select: { enabled: 'enabled', question: 'question' },
    prepare({ enabled, question }) {
      const title = question || 'Decision'
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: 'Decision (case)' }
    },
  },
})
