import { defineField, defineType } from 'sanity'
import { WarningOutlineIcon } from '@sanity/icons'

/**
 * Error Page — /500.
 *
 * Spec: docs/09-microcopy §4.2.
 */
export const errorPage = defineType({
  name: 'errorPage',
  title: '500',
  type: 'document',
  icon: WarningOutlineIcon,
  groups: [
    { name: 'pageSettings', title: 'Page settings', default: true },
    { name: 'content', title: 'Content' },
  ],
  fields: [
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'pageSettings' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      group: 'content',
      initialValue: 'Er ging iets mis aan onze kant',
    }),
    defineField({
      name: 'body',
      title: 'Body text',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA button text',
      type: 'string',
      group: 'content',
      initialValue: 'Terug naar home',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA link',
      type: 'cmsLink',
      group: 'content',
    }),
  ],
  preview: {
    prepare() {
      return { title: '500 (server error)' }
    },
  },
})
