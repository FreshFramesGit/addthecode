import { defineField, defineType } from 'sanity'
import { WarningOutlineIcon } from '@sanity/icons'

/**
 * Offline Page — service-worker fallback / network-error.
 *
 * Spec: docs/09-microcopy §4.3.
 */
export const offlinePage = defineType({
  name: 'offlinePage',
  title: 'Offline',
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
      initialValue: 'Geen verbinding',
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
      initialValue: 'Probeer opnieuw',
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
      return { title: 'Offline' }
    },
  },
})
