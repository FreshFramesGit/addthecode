import { defineField, defineType } from 'sanity'

/**
 * Period — date range met optional "present" voor lopende projecten.
 *
 * Gebruikt door: case.period.
 */
export const period = defineType({
  name: 'period',
  title: 'Period',
  type: 'object',
  fields: [
    defineField({
      name: 'start',
      title: 'Start (datum)',
      type: 'date',
      options: { dateFormat: 'YYYY-MM' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'end',
      title: 'Einde (datum, leeg = lopend)',
      type: 'date',
      options: { dateFormat: 'YYYY-MM' },
      description: 'Leeg laten als project nog loopt — wordt dan gerenderd als "heden".',
    }),
    defineField({
      name: 'isOngoing',
      title: 'Lopend project',
      type: 'boolean',
      initialValue: false,
      description: 'Markeer expliciet als lopend (overrides `end` veld in rendering).',
    }),
  ],
  preview: {
    select: { start: 'start', end: 'end', ongoing: 'isOngoing' },
    prepare({ start, end, ongoing }) {
      const startStr = start ? start.slice(0, 7) : '?'
      const endStr = ongoing ? 'heden' : end ? end.slice(0, 7) : '?'
      return { title: `${startStr} → ${endStr}` }
    },
  },
})
