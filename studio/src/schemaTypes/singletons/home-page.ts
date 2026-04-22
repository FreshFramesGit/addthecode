import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'pageSettings', title: 'Page settings', default: true },
    { name: 'content', title: 'Sections' },
  ],
  fields: [
    // Page settings
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'pageSettings' }),

    // Sections (pageBuilder)
    defineField({
      name: 'content',
      title: 'Page sections',
      type: 'pageBuilder',
      group: 'content',
      description:
        'Voeg secties toe en sleep ze in de gewenste volgorde. Voorgestelde flow: hero-home → pitch-opening → service-triptych → project-grid → principles → quote-cluster → pitch-opening (approach) → faq → essay-grid → cta-refrein.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home' }
    },
  },
})
