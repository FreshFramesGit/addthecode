import { defineField, defineType } from 'sanity'
import { ProjectsIcon } from '@sanity/icons'

/**
 * Project Grid — leest cases uit de case-collection met layer-filter.
 *
 * Spec: docs/07b §2-§4. Drielaag: launch / in-flight / heritage.
 * Zet 3 instances onder elkaar op /work voor de drie lagen.
 */
export const projectGridBlock = defineType({
  name: 'projectGridBlock',
  title: 'Project Grid (cases)',
  type: 'object',
  icon: ProjectsIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro (optioneel)', type: 'text', rows: 2 }),
    defineField({
      name: 'layerFilter',
      title: 'Filter op layer',
      type: 'string',
      options: {
        list: [
          { title: 'Launch (volledig)', value: 'launch' },
          { title: 'In-flight (NDA, anoniem)', value: 'in-flight' },
          { title: 'Heritage (FF legacy)', value: 'heritage' },
          { title: 'Featured (handmatig geselecteerd)', value: 'featured' },
          { title: 'Alle', value: 'all' },
        ],
        layout: 'radio',
      },
      initialValue: 'launch',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'maxItems',
      title: 'Max aantal items',
      type: 'number',
      initialValue: 6,
      validation: (r) => r.min(1).max(20),
    }),
    defineField({
      name: 'showFilterChips',
      title: 'Toon filter chips',
      type: 'boolean',
      initialValue: false,
      description: 'Optioneel — alleen op /work top-level. Standaard uit.',
    }),
    defineField({
      name: 'cardLayoutVariant',
      title: 'Card-layout variant',
      type: 'string',
      options: {
        list: [
          { title: 'Default (per layer auto)', value: 'auto' },
          { title: 'Featured 60/40', value: 'featured-60-40' },
          { title: 'Grid 2-kolom', value: 'grid-2' },
          { title: 'Grid 3-kolom', value: 'grid-3' },
          { title: 'Lijst', value: 'list' },
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
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
    select: { enabled: 'enabled', heading: 'heading', filter: 'layerFilter', max: 'maxItems' },
    prepare({ enabled, heading, filter, max }) {
      const title = heading || `Project Grid · ${filter}`
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: `Filter: ${filter} · max ${max}` }
    },
  },
})
