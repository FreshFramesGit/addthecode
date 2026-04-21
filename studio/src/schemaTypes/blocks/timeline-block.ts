import { defineArrayMember, defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

/**
 * Timeline — verticale of horizontale tijdlijn met jaren + highlights.
 *
 * Spec: docs/07c §5 (Fresh Frames history 2017–2026).
 */
export const timelineBlock = defineType({
  name: 'timelineBlock',
  title: 'Timeline',
  type: 'object',
  icon: CalendarIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro (optioneel)', type: 'text', rows: 2 }),
    defineField({
      name: 'items',
      title: 'Timeline items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'timelineItem',
          fields: [
            defineField({ name: 'year', title: 'Jaar', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'label', title: 'Label / korte beschrijving', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'description',
              title: 'Beschrijving (optioneel)',
              type: 'text',
              rows: 2,
              description: 'Optionele uitleg — getoond op hover/expand.',
            }),
            defineField({
              name: 'highlight',
              title: 'Highlight (markeer als major-milestone)',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'year', highlight: 'highlight' },
            prepare: ({ title, subtitle, highlight }) => ({
              title: highlight ? `★ ${title}` : title,
              subtitle,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'orientation',
      title: 'Oriëntatie',
      type: 'string',
      options: {
        list: [
          { title: 'Verticaal (default)', value: 'vertical' },
          { title: 'Horizontaal', value: 'horizontal' },
        ],
        layout: 'radio',
      },
      initialValue: 'vertical',
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
      const title = heading || 'Timeline'
      const count = items?.length || 0
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: `${count} items` }
    },
  },
})
