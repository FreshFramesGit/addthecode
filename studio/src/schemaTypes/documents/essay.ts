import { defineArrayMember, defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'

/**
 * Essay — academy-bibliotheek document.
 *
 * Spec: docs/07i.
 *
 * `featured: true` markeert flagship essay (eerste, grote card op /academy).
 * Categorie-enum stuurt filter-chips op /academy.
 */
export const essayDocument = defineType({
  name: 'essay',
  title: 'Essay',
  type: 'document',
  icon: BookIcon,
  groups: [
    { name: 'identification', title: 'Identification', default: true },
    { name: 'hero', title: 'Hero' },
    { name: 'content', title: 'Body' },
    { name: 'meta', title: 'Meta' },
    { name: 'pageSettings', title: 'SEO' },
  ],
  fields: [
    // ─── Identification ───
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'identification',
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'identification',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'language',
      title: 'Taal',
      type: 'string',
      group: 'identification',
      options: {
        list: [
          { title: 'Nederlands', value: 'nl' },
          { title: 'English', value: 'en' },
        ],
        layout: 'radio',
      },
      initialValue: 'nl',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'string',
      group: 'identification',
      options: {
        list: [
          { title: 'Principle (positionering / waarden)', value: 'principle' },
          { title: 'Practice (werkwijze / how-to)', value: 'practice' },
          { title: 'Analyse (industry / observatie)', value: 'analyse' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Publicatie-status',
      type: 'string',
      group: 'identification',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Live', value: 'live' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'featured',
      title: 'Featured (flagship)',
      type: 'boolean',
      group: 'identification',
      initialValue: false,
      description: 'Aan: getoond als grote eerste card op /academy.',
    }),

    // ─── Hero ───
    defineField({
      name: 'preClaim',
      title: 'Pre-claim (mono-label boven hero)',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'dek',
      title: 'Dek (intro onder titel)',
      type: 'text',
      rows: 3,
      group: 'hero',
      description: '~50-80 woorden die het essay-belofte schetsen.',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured image (optioneel)',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() }),
      ],
    }),

    // ─── Meta ───
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'reference',
      to: [{ type: 'teamMember' }],
      group: 'meta',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publicatiedatum',
      type: 'datetime',
      group: 'meta',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Leestijd (handmatig)',
      type: 'string',
      group: 'meta',
      description: 'Bv "8 min" of "18 min". v1: handmatig — kan later computed via word-count.',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'meta',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'relatedEssays',
      title: 'Gerelateerde essays',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'essay' }] })],
      group: 'meta',
      validation: (r) => r.max(3),
      description: 'Max 3 — getoond in "Lees ook" sectie aan einde van essay.',
    }),

    // ─── Content ───
    defineField({
      name: 'body',
      title: 'Body (Portable Text)',
      type: 'blockContent',
      group: 'content',
      description:
        'Hoofdtekst van het essay. Ondersteunt Callouts (side-note / pull-quote / diagram-text / warning) en inline emphasis (Claude-orange highlight, mono inline).',
    }),

    // ─── Page settings ───
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'pageSettings' }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      status: 'status',
      featured: 'featured',
      author: 'author.name',
      media: 'featuredImage',
    },
    prepare({ title, category, status, featured, author, media }) {
      const statusBadge = status === 'live' ? '●' : status === 'draft' ? '○' : '⊘'
      const featuredBadge = featured ? ' ★' : ''
      return {
        title: `${statusBadge} ${title || 'Untitled essay'}${featuredBadge}`,
        subtitle: `${category || '?'} · ${author || 'no author'}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Published (newest first)',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Title (A-Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
