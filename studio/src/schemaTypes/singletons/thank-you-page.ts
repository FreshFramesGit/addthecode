import { defineField, defineType } from 'sanity'
import { CheckmarkCircleIcon } from '@sanity/icons'

export const thankYouPage = defineType({
  name: 'thankYouPage',
  title: 'Thank you',
  type: 'document',
  icon: CheckmarkCircleIcon,
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
      initialValue: 'Thank you!',
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
      return { title: 'Thank you' }
    },
  },
})
