import { defineArrayMember, defineField, defineType } from 'sanity'
import { ListIcon } from '@sanity/icons'

/**
 * Phase Block — project-fase met details.
 *
 * Spec: docs/07d §3 (approach: Discovery/Design/Build/Ship/Maintain),
 * docs/07h §5 (case-detail per fase).
 *
 * Gedeeld tussen approach-pagina en case-detail.
 */
export const phaseBlock = defineType({
  name: 'phaseBlock',
  title: 'Phase (approach / case)',
  type: 'object',
  icon: ListIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({
      name: 'phaseNumber',
      title: 'Fase nummer',
      type: 'string',
      description: 'Bv "01", "02".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'phaseName',
      title: 'Fase naam',
      type: 'string',
      description: 'Bv "Discovery", "Design", "Build".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'oneLiner',
      title: 'One-liner pitch',
      type: 'string',
      description: 'Korte regel die de fase samenvat.',
    }),
    defineField({
      name: 'body',
      title: 'Body (Portable Text)',
      type: 'blockContent',
      description: 'Wat gebeurt er in deze fase.',
    }),
    defineField({
      name: 'aiRole',
      title: 'AI-rol in deze fase',
      type: 'text',
      rows: 2,
      description: 'Wat doet AI hier wel/niet.',
    }),
    defineField({
      name: 'humanResponsibility',
      title: 'Mens-verantwoordelijkheid',
      type: 'text',
      rows: 2,
      description: 'Wat blijft per definitie menselijk werk.',
    }),
    defineField({
      name: 'deliverables',
      title: 'Deliverables',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'duration',
      title: 'Duur (optioneel)',
      type: 'string',
      description: 'Bv "1-2 weken", alleen tonen op approach-pagina.',
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
    select: { enabled: 'enabled', number: 'phaseNumber', name: 'phaseName' },
    prepare({ enabled, number, name }) {
      const title = `${number || '?'} · ${name || 'Phase'}`
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: 'Phase block' }
    },
  },
})
