import { defineField, defineType } from 'sanity'
import { InfoOutlineIcon } from '@sanity/icons'

/**
 * Callout Block — inline emphasis-blok met type-variant.
 *
 * Spec: docs/08 §5.4. Gebruikt als pageBuilder-element of inline binnen Portable Text
 * (in essay-body).
 */
export const calloutBlock = defineType({
  name: 'calloutBlock',
  title: 'Callout',
  type: 'object',
  icon: InfoOutlineIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({
      name: 'kind',
      title: 'Soort callout',
      type: 'string',
      options: {
        list: [
          { title: 'Side-note (terloops)', value: 'side-note' },
          { title: 'Pull-quote (uitvergroot citaat)', value: 'pull-quote' },
          { title: 'Diagram-text (toelichting bij beeld)', value: 'diagram-text' },
          { title: 'Warning (let op)', value: 'warning' },
        ],
        layout: 'radio',
      },
      initialValue: 'side-note',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body (Portable Text)',
      type: 'blockContent',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Attributie (alleen voor pull-quote)',
      type: 'string',
      hidden: ({ parent }) => parent?.kind !== 'pull-quote',
      description: 'Naam + functie/bedrijf van de bron, bv "Anna de Wit · Hoofd Productontwikkeling".',
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
    select: { enabled: 'enabled', kind: 'kind' },
    prepare({ enabled, kind }) {
      const title = `Callout · ${kind || 'side-note'}`
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: 'Callout' }
    },
  },
})
