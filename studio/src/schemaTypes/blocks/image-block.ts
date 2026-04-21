import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons'

/**
 * Image section — full-width or contained.
 */
export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      description: 'Turn off to hide this section without deleting it',
      initialValue: true,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() })],
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Full width (no padding)', value: 'fullWidth' },
          { title: 'Container (with padding)', value: 'contained' },
        ],
        layout: 'radio',
      },
      initialValue: 'fullWidth',
    }),
  ],
  preview: {
    select: { title: 'caption', enabled: 'enabled', media: 'image' },
    prepare({ title, enabled, media }) {
      return {
        title: enabled === false ? `🚫 ${title || 'Image'}` : (title || 'Image'),
        subtitle: enabled === false ? 'Hidden' : 'Image section',
        media,
      }
    },
  },
})
