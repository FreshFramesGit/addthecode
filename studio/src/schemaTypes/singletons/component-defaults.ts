import { defineField, defineType } from 'sanity'
import { ComponentIcon } from '@sanity/icons'

export const componentDefaults = defineType({
  name: 'componentDefaults',
  title: 'Component Defaults',
  type: 'document',
  icon: ComponentIcon,
  groups: [
    { name: 'cta', title: 'CTA', default: true },
  ],
  fields: [
    // ─── CTA ───
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'object',
      group: 'cta',
      description: 'Default CTA block that appears on detail pages.',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: '' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
        defineField({ name: 'contactName', title: 'Contact person', type: 'string' }),
        defineField({ name: 'contactPhone', title: 'Phone', type: 'string' }),
        defineField({ name: 'contactEmail', title: 'Email', type: 'string' }),
        defineField({ name: 'buttonLabel', title: 'Button text', type: 'string', initialValue: '' }),
        defineField({ name: 'buttonLink', title: 'Button link', type: 'cmsLink' }),
        defineField({
          name: 'photo',
          title: 'Photo',
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Component Defaults' }),
  },
})
