import { defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'

/**
 * Academy Index — /academy.
 *
 * Essay-bibliotheek met categorie-filtering. Essays worden via essayGridBlock
 * uit de essay-collection gelezen.
 *
 * Spec: docs/07i-academy.md
 */
export const academyIndexPage = defineType({
  name: 'academyIndexPage',
  title: 'Academy (index)',
  type: 'document',
  icon: BookIcon,
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
        'Voeg secties toe en sleep ze in de gewenste volgorde. Standaard: hero-standard → essayGrid (featured first + alle) → newsletter-form → cta-refrein.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Academy (index)' }
    },
  },
})
