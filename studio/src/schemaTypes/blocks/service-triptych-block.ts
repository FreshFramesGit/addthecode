import { defineArrayMember, defineField, defineType } from 'sanity'
import { ThLargeIcon } from '@sanity/icons'

/**
 * Service Triptych — drie service-tiles naast elkaar (Design / Build / Automate).
 *
 * Spec: docs/07a §3 + docs/08 §3.1.
 */
export const serviceTriptychBlock = defineType({
  name: 'serviceTriptychBlock',
  title: 'Service Triptych (3 tiles)',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro (kort)', type: 'text', rows: 2 }),
    defineField({
      name: 'tiles',
      title: 'Tiles (3 stuks)',
      type: 'array',
      validation: (r) => r.length(3).error('Exact 3 tiles vereist (Design / Build / Automate of equivalent).'),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'serviceTile',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'tagline', title: 'Tagline (mono, kort)', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 4, validation: (r) => r.required() }),
            defineField({ name: 'ctaLabel', title: 'CTA label', type: 'string' }),
            defineField({ name: 'ctaLink', title: 'CTA link', type: 'cmsLink' }),
            defineField({
              name: 'icon',
              title: 'Icon (optioneel)',
              type: 'string',
              options: {
                list: [
                  { title: 'Design (color-wheel)', value: 'design' },
                  { title: 'Build (code)', value: 'build' },
                  { title: 'Automate (robot)', value: 'automate' },
                  { title: 'Custom (eigen SVG)', value: 'custom' },
                ],
              },
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'tagline' },
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
    select: { enabled: 'enabled', heading: 'heading' },
    prepare({ enabled, heading }) {
      const title = heading || 'Service Triptych'
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: 'Service Triptych (3 tiles)' }
    },
  },
})
