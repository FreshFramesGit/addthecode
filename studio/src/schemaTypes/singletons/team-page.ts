import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'

/**
 * Team Page — /team.
 *
 * Content: hero-standard → pitch-opening (approach-statement) → serviceTriptych (drie values)
 * → teamGrid → timeline (FF history) → recognition sections (per category) → cta-refrein.
 *
 * Spec: docs/07c-team.md
 */
export const teamPage = defineType({
  name: 'teamPage',
  title: 'Team',
  type: 'document',
  icon: UsersIcon,
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
        'Voeg secties toe en sleep ze in de gewenste volgorde. Team-leden worden automatisch uit de collection gelezen door teamGridBlock.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Team' }
    },
  },
})
