import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons'

/**
 * Hero section — video background or image with text overlay.
 */
export const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      description: 'Turn off to hide this section without deleting it',
      initialValue: true,
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
    }),
    defineField({
      name: 'mediaType',
      title: 'Background type',
      type: 'string',
      options: {
        list: [
          { title: 'Video', value: 'video' },
          { title: 'Image', value: 'image' },
          { title: 'None (color only)', value: 'none' },
        ],
        layout: 'radio',
      },
      initialValue: 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (MP4)',
      type: 'url',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'image',
      title: 'Background image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType !== 'image',
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() })],
    }),
    defineField({
      name: 'posterImage',
      title: 'Poster / Fallback image',
      type: 'image',
      description: 'Shown as fallback for video or while the video is loading.',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA button text',
      type: 'string',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA link',
      type: 'cmsLink',
    }),
    defineField({
      name: 'overlay',
      title: 'Dark overlay',
      type: 'boolean',
      initialValue: true,
      description: 'Semi-transparent overlay over the background for readability.',
    }),
  ],
  preview: {
    select: { title: 'heading', enabled: 'enabled', media: 'posterImage' },
    prepare({ title, enabled, media }) {
      return {
        title: enabled === false ? `🚫 ${title || 'Hero'}` : (title || 'Hero'),
        subtitle: enabled === false ? 'Hidden' : 'Hero section',
        media,
      }
    },
  },
})
