import { defineField, defineType } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

/**
 * Contact section — contact info + image.
 */
export const contactBlock = defineType({
  name: 'contactBlock',
  title: 'Contact',
  type: 'object',
  icon: EnvelopeIcon,
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
      initialValue: 'Contact',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'officeImage',
      title: 'Office image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'showContactInfo',
      title: 'Show contact info',
      type: 'boolean',
      initialValue: true,
      description: 'Pulls email, phone, and address from Site settings.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA button text',
      type: 'string',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA link',
      type: 'cmsLink',
    }),
  ],
  preview: {
    select: { title: 'heading', enabled: 'enabled', media: 'officeImage' },
    prepare({ title, enabled, media }) {
      return {
        title: enabled === false ? `🚫 ${title || 'Contact'}` : (title || 'Contact'),
        subtitle: enabled === false ? 'Hidden' : 'Contact section',
        media,
      }
    },
  },
})
