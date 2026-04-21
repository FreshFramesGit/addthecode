import { defineArrayMember, defineField, defineType } from 'sanity'
import { BlockElementIcon } from '@sanity/icons'

/**
 * Hero Standard — hero met 3 layout-varianten.
 *
 * Gebruikt op alle sub-pagina's (work-index, team, approach, services × 3,
 * academy, contact). Layouts uit `docs/08 §2.2`:
 * - text-only: enkel pre-claim + heading + subheading
 * - with-artifact: tekst links, artifact/image rechts (40/60 of 60/40)
 * - split-50-50: gelijke kolommen
 */
export const heroStandardBlock = defineType({
  name: 'heroStandardBlock',
  title: 'Hero — Standard',
  type: 'object',
  icon: BlockElementIcon,
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
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'layoutVariant',
      title: 'Layout variant',
      type: 'string',
      options: {
        list: [
          { title: 'Text only', value: 'text-only' },
          { title: 'With artifact (tekst + beeld)', value: 'with-artifact' },
          { title: 'Split 50/50', value: 'split-50-50' },
        ],
        layout: 'radio',
      },
      initialValue: 'text-only',
    }),
    defineField({
      name: 'artifact',
      title: 'Artifact (beeld)',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.layoutVariant === 'text-only',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Caption (optioneel)',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'ctas',
      title: 'CTAs (max 2)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'heroStandardCta',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'link', title: 'Link', type: 'cmsLink', validation: (r) => r.required() }),
            defineField({
              name: 'variant',
              title: 'Variant',
              type: 'string',
              options: {
                list: [
                  { title: 'Primary', value: 'primary' },
                  { title: 'Secondary', value: 'secondary' },
                  { title: 'Tertiary (link)', value: 'tertiary' },
                ],
                layout: 'radio',
              },
              initialValue: 'primary',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'variant' },
          },
        }),
      ],
      validation: (r) => r.max(2),
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
    defineField({
      name: 'anchorId',
      title: 'Anchor ID',
      type: 'string',
      validation: (r) => r.regex(/^[a-z0-9-]*$/, { name: 'kebab-case' }),
    }),
  ],
  preview: {
    select: {
      enabled: 'enabled',
      heading: 'heading',
      layout: 'layoutVariant',
      media: 'artifact',
    },
    prepare({ enabled, heading, layout, media }) {
      const title = heading || 'Hero — Standard'
      return {
        title: enabled === false ? `🚫 ${title}` : title,
        subtitle: enabled === false ? 'Verborgen' : `Hero · ${layout || 'text-only'}`,
        media,
      }
    },
  },
})
