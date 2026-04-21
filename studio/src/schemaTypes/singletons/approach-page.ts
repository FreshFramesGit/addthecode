import { defineField, defineType } from 'sanity'
import { CircleIcon } from '@sanity/icons'

/**
 * Approach Page — /approach.
 *
 * Content: hero-standard → pitch-opening (why-this-method) → The Loop diagram
 * (custom blok of artifact) → 5 × phase-blocks (Discovery/Design/Build/Ship/Maintain)
 * → cta-refrein.
 *
 * Spec: docs/07d-approach.md
 */
export const approachPage = defineType({
  name: 'approachPage',
  title: 'Approach',
  type: 'document',
  icon: CircleIcon,
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
        'Voeg secties toe en sleep ze in de gewenste volgorde. phase-block wordt hier en op case-pagina\'s hergebruikt.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Approach' }
    },
  },
})
