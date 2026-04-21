import { defineField, defineType } from 'sanity'

/**
 * Metric — single KPI binnen een metrics-strip op case-detail.
 *
 * `verifiedByAlex` boolean is een soft-warning gate: pre-launch QA-script toont
 * alle metrics waar deze false is. Voorkomt dat onbevestigde claims (zoals Bell's
 * `CMS-TIJD -85%`) live gaan zonder verificatie.
 *
 * Gebruikt door: metricsStripBlock.
 */
export const metric = defineType({
  name: 'metric',
  title: 'Metric',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Korte naam — bv "CMS-tijd", "Build-tijd", "Bezoeken/maand".',
      validation: (r) => r.required().max(40),
    }),
    defineField({
      name: 'value',
      title: 'Waarde',
      type: 'string',
      description: 'Getal of formule — bv "-85%", "+312", "≤2.5s LCP".',
      validation: (r) => r.required().max(20),
    }),
    defineField({
      name: 'source',
      title: 'Bron / context',
      type: 'string',
      description:
        'Optionele uitleg waar de waarde vandaan komt — bv "vergelijking voor/na CMS-migratie 2026".',
    }),
    defineField({
      name: 'verifiedByAlex',
      title: 'Geverifieerd door Alex',
      type: 'boolean',
      initialValue: false,
      description:
        'Vink aan zodra de claim gecheckt is. Onbevestigde metrics worden gemarkeerd in pre-launch QA en vóór publicatie geblokkeerd.',
    }),
  ],
  preview: {
    select: { label: 'label', value: 'value', verified: 'verifiedByAlex' },
    prepare({ label, value, verified }) {
      const status = verified ? '✓' : '⚠ onbevestigd'
      return { title: `${value} ${label}`, subtitle: status }
    },
  },
})
