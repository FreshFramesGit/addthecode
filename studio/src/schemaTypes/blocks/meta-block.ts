import { defineArrayMember, defineField, defineType } from 'sanity'
import { ThListIcon } from '@sanity/icons'

/**
 * Meta Block — sleutel-waarde tabel voor case meta-info.
 *
 * Spec: docs/07h §2 (Client / Period / Stack / Role / Status).
 */
export const metaBlock = defineType({
  name: 'metaBlock',
  title: 'Meta block (label/value tabel)',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'heading', title: 'Heading (optioneel)', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Meta items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'metaItem',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'value', title: 'Waarde', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'href',
              title: 'Link (optioneel)',
              type: 'cmsLink',
              description: 'Maak waarde klikbaar als nuttig (bv link naar live URL).',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        }),
      ],
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
      const title = heading || 'Meta block'
      const count = items?.length || 0
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: `${count} items` }
    },
  },
})
