import { defineField, defineType } from 'sanity'
import { TextIcon } from '@sanity/icons'

/**
 * Text section — rich text with optional heading and layout.
 */
export const textBlock = defineType({
  name: 'textBlock',
  title: 'Text',
  type: 'object',
  icon: TextIcon,
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
    }),
    defineField({
      name: 'body',
      title: 'Body text',
      type: 'blockContent',
    }),
    defineField({
      name: 'maxWidth',
      title: 'Max width',
      type: 'string',
      options: {
        list: [
          { title: 'Narrow (640px)', value: 'narrow' },
          { title: 'Medium (960px)', value: 'medium' },
          { title: 'Wide (1200px)', value: 'wide' },
          { title: 'Full', value: 'full' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'dividerLine',
      title: 'Show divider line',
      type: 'boolean',
      initialValue: false,
      description: 'Show a horizontal line below the section.',
    }),
    defineField({
      name: 'backgroundStyle',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'Transparent', value: 'transparent' },
          { title: 'White', value: 'white' },
          { title: 'Dark', value: 'dark' },
        ],
      },
      initialValue: 'transparent',
    }),
  ],
  preview: {
    select: { title: 'heading', enabled: 'enabled' },
    prepare({ title, enabled }) {
      return {
        title: enabled === false ? `🚫 ${title || 'Text block'}` : (title || 'Text block'),
        subtitle: enabled === false ? 'Hidden' : 'Text section',
      }
    },
  },
})
