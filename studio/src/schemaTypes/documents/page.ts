import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

/**
 * Generic page document type (free/dynamic pages).
 * Editors can create new pages with a page builder (drag-and-drop sections).
 */
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'pageSettings', title: 'Page settings', default: true },
    { name: 'content', title: 'Sections' },
  ],
  fields: [
    // Page settings
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      group: 'pageSettings',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'pageSettings',
      options: { source: 'title' },
      validation: (r) => r.required(),
      description: 'The URL becomes /page-name (e.g. "/about")',
    }),
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
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }) {
      return { title: title || 'New page', subtitle: slug ? `/${slug}` : '' }
    },
  },
  orderings: [
    { title: 'Title A–Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
})
