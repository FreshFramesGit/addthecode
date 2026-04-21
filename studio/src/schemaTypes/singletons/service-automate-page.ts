import { defineField, defineType } from 'sanity'
import { RobotIcon } from '@sanity/icons'

/**
 * Service · Automate — /services/automate.
 *
 * Op deze pagina wordt Claude expliciet genoemd als tool (zie CLAUDE.md §10).
 *
 * Spec: docs/07g-services-automate.md
 */
export const serviceAutomatePage = defineType({
  name: 'serviceAutomatePage',
  title: 'Service · Automate',
  type: 'document',
  icon: RobotIcon,
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
        'Voeg secties toe en sleep ze in de gewenste volgorde. Voorgestelde flow per docs/07g: hero-standard → pitch-opening → tile-grid (oplevering) → cases-strip → faq → cta-refrein.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Service · Automate' }
    },
  },
})
