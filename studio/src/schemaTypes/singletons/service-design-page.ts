import { defineField, defineType } from 'sanity'
import { ColorWheelIcon } from '@sanity/icons'

/**
 * Service · Design — /services/design.
 *
 * Spec: docs/07e-services-design.md
 */
export const serviceDesignPage = defineType({
  name: 'serviceDesignPage',
  title: 'Service · Design',
  type: 'document',
  icon: ColorWheelIcon,
  groups: [
    { name: 'pageSettings', title: 'Page settings', default: true },
    { name: 'content', title: 'Sections' },
  ],
  fields: [
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'pageSettings' }),
    defineField({
      name: 'content',
      title: 'Page sections',
      type: 'pageBuilder',
      group: 'content',
      description:
        'Voeg secties toe en sleep ze in de gewenste volgorde. Voorgestelde flow per docs/07e: hero-standard → pitch-opening → tile-grid (oplevering) → cases-strip → faq → cta-refrein.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Service · Design' }
    },
  },
})
