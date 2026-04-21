import { defineArrayMember, defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'

/**
 * Artifact Gallery — static thumbs van project-artefacten.
 *
 * Spec: docs/07h §7. Geen carousel default — bewust statisch (`docs/04 §3.3`).
 */
export const artifactGalleryBlock = defineType({
  name: 'artifactGalleryBlock',
  title: 'Artifact Gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro (optioneel)', type: 'text', rows: 2 }),
    defineField({
      name: 'items',
      title: 'Artefacten',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'artifactItem',
          fields: [
            defineField({
              name: 'image',
              title: 'Beeld',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() }),
              ],
              validation: (r) => r.required(),
            }),
            defineField({ name: 'title', title: 'Titel', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption (toelichting)', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'title', media: 'image' },
            prepare: ({ title, media }) => ({ title: title || 'Artifact', media }),
          },
        }),
      ],
    }),
    defineField({
      name: 'layoutVariant',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid 3-kolom (default)', value: 'grid-3' },
          { title: 'Grid 2-kolom', value: 'grid-2' },
          { title: 'Vertical stack', value: 'stack' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid-3',
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
      const title = heading || 'Artifact Gallery'
      const count = items?.length || 0
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: `${count} artefacten` }
    },
  },
})
