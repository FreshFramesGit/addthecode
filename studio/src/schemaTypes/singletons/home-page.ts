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
      description: 'Add sections and drag them into the desired order.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home' }
    },
  },
})
