import { defineField, defineType } from 'sanity'
import { ArrowRightIcon } from '@sanity/icons'

/**
 * Next Case — recommendation aan einde van case-detail.
 *
 * Spec: docs/07h §11. Twee refs: recommended (primair) + alternative (optioneel).
 */
export const nextCaseBlock = defineType({
  name: 'nextCaseBlock',
  title: 'Next Case (recommendation)',
  type: 'object',
  icon: ArrowRightIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'Volgende case' }),
    defineField({
      name: 'recommendedCase',
      title: 'Aanbevolen case',
      type: 'reference',
      to: [{ type: 'case' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'recommendationReason',
      title: 'Waarom (optioneel)',
      type: 'text',
      rows: 2,
      description: 'Korte reden waarom deze logisch volgt — bv "Andere kant van dezelfde stack-keuze."',
    }),
    defineField({
      name: 'alternativeCase',
      title: 'Alternatieve case (optioneel)',
      type: 'reference',
      to: [{ type: 'case' }],
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
    select: { enabled: 'enabled', recommended: 'recommendedCase.title' },
    prepare({ enabled, recommended }) {
      const title = recommended ? `→ ${recommended}` : 'Next Case'
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: 'Next Case' }
    },
  },
})
