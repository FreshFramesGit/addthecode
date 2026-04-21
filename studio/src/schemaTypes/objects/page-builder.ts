import { defineType, defineArrayMember } from 'sanity'

/**
 * Page Builder array — drag-and-drop sections.
 * All block types available for pages.
 */
export const pageBuilder = defineType({
  name: 'pageBuilder',
  title: 'Page sections',
  type: 'array',
  of: [
    // Content
    defineArrayMember({ type: 'heroBlock' }),
    defineArrayMember({ type: 'textBlock' }),

    // Media
    defineArrayMember({ type: 'imageBlock' }),

    // Action
    defineArrayMember({ type: 'ctaBlock' }),
    defineArrayMember({ type: 'contactBlock' }),
  ],
})
