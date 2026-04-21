import { defineArrayMember, defineField, defineType } from 'sanity'
import { ChartUpwardIcon } from '@sanity/icons'

/**
 * Metrics Strip — KPI's voor case-detail.
 *
 * Spec: docs/07h §10. Bv Bell's "CMS-tijd -85%".
 * Elke metric heeft `verifiedByAlex` boolean — pre-launch QA blokkeert
 * onbevestigde claims.
 */
export const metricsStripBlock = defineType({
  name: 'metricsStripBlock',
  title: 'Metrics Strip',
  type: 'object',
  icon: ChartUpwardIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'metrics',
      title: 'Metrics (3-5 stuks aanbevolen)',
      type: 'array',
      of: [defineArrayMember({ type: 'metric' })],
      validation: (r) => r.min(1).max(6),
    }),
    defineField({
      name: 'sourceNote',
      title: 'Bron-noot',
      type: 'text',
      rows: 2,
      description: 'Bv "Vergeleken met situatie vóór CMS-migratie 2026."',
    }),
    defineField({
      name: 'tone',
      title: 'Tonale zone',
      type: 'string',
      options: { list: ['paper', 'ink', 'claude'], layout: 'radio' },
      initialValue: 'ink',
      description: 'Default Ink — metrics krijgen vaak dramatische zone.',
    }),
    defineField({ name: 'anchorId', title: 'Anchor ID', type: 'string', validation: (r) => r.regex(/^[a-z0-9-]*$/) }),
  ],
  preview: {
    select: { enabled: 'enabled', heading: 'heading', metrics: 'metrics' },
    prepare({ enabled, heading, metrics }) {
      const title = heading || 'Metrics Strip'
      const count = metrics?.length || 0
      const unverified = metrics?.filter((m: any) => !m.verifiedByAlex).length || 0
      const subtitle = unverified > 0 ? `${count} metrics · ⚠ ${unverified} onbevestigd` : `${count} metrics ✓`
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle }
    },
  },
})
