import { defineArrayMember, defineField, defineType } from 'sanity'
import { CheckmarkCircleIcon } from '@sanity/icons'

/**
 * Principles Block — genummerde principles-lijst.
 *
 * Spec: docs/07a §5 ("Vijf principes"), docs/07c values-pattern.
 *
 * Items zijn genummerd op render-tijd (01, 02, 03 etc.) — geen losse
 * stepNumber-veld want volgorde = nummer.
 */
export const principlesBlock = defineType({
  name: 'principlesBlock',
  title: 'Principles (genummerde lijst)',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'preClaim', title: 'Pre-claim', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro (optioneel)', type: 'text', rows: 2 }),
    defineField({
      name: 'principles',
      title: 'Principles',
      type: 'array',
      validation: (r) =>
        r.min(3).max(7).warning('Aanbevolen 3-7 principes (5 is target voor home).'),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'principleItem',
          fields: [
            defineField({
              name: 'title',
              title: 'Titel (kort statement)',
              type: 'string',
              description: 'Bv "Craft visible, speed implied".',
              validation: (r) => r.required().max(80),
            }),
            defineField({
              name: 'description',
              title: 'Toelichting',
              type: 'text',
              rows: 3,
              description: '1-2 zinnen die het principe uitleggen.',
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: 'title' },
          },
        }),
      ],
    }),
    defineField({
      name: 'layoutVariant',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Genummerde stack (default)', value: 'stack' },
          { title: '2-kolom grid', value: 'grid-2' },
        ],
        layout: 'radio',
      },
      initialValue: 'stack',
    }),
    defineField({
      name: 'tone',
      title: 'Tonale zone',
      type: 'string',
      options: { list: ['paper', 'ink', 'claude'], layout: 'radio' },
      initialValue: 'paper',
    }),
    defineField({
      name: 'anchorId',
      title: 'Anchor ID',
      type: 'string',
      validation: (r) => r.regex(/^[a-z0-9-]*$/),
    }),
  ],
  preview: {
    select: { enabled: 'enabled', heading: 'heading', principles: 'principles' },
    prepare({ enabled, heading, principles }) {
      const title = heading || 'Principles'
      const count = principles?.length || 0
      return {
        title: enabled === false ? `🚫 ${title}` : title,
        subtitle: `${count} principes`,
      }
    },
  },
})
