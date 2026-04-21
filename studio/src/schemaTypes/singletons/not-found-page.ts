import { defineField, defineType } from 'sanity'
import { CloseCircleIcon } from '@sanity/icons'

export const notFoundPage = defineType({
  name: 'notFoundPage',
  title: '404',
  type: 'document',
  icon: CloseCircleIcon,
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
      initialValue: '404 — Page not found',
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
      initialValue: 'Back to home',
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
      return { title: '404' }
    },
  },
})
