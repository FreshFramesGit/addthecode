import { defineField, defineType } from 'sanity'
import { LaunchIcon } from '@sanity/icons'

/**
 * CTA section — photo + text + action button.
 */
export const ctaBlock = defineType({
  name: 'ctaBlock',
  title: 'Call to Action',
  type: 'object',
  icon: LaunchIcon,
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      description: 'Turn off to hide this section without deleting it',
      initialValue: true,
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: '',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'contactName',
      title: 'Contact person name',
      type: 'string',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button text',
      type: 'string',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button link',
      type: 'cmsLink',
    }),
    defineField({
      name: 'backgroundStyle',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Dark', value: 'dark' },
          { title: 'Transparent', value: 'transparent' },
        ],
      },
      initialValue: 'transparent',
    }),
  ],
  preview: {
    select: { title: 'heading', enabled: 'enabled', media: 'photo' },
    prepare({ title, enabled, media }) {
      return {
        title: enabled === false ? `🚫 ${title || 'CTA'}` : (title || 'CTA'),
        subtitle: enabled === false ? 'Hidden' : 'Call to Action',
        media,
      }
    },
  },
})
