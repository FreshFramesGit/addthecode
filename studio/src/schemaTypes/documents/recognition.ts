import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons'

/**
 * Recognition — awards, talks, partners, clients.
 *
 * Spec: docs/07c §6.
 */
export const recognition = defineType({
  name: 'recognition',
  title: 'Recognition',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'string',
      options: {
        list: [
          { title: 'Award', value: 'award' },
          { title: 'Talk / spreker-optreden', value: 'talk' },
          { title: 'Partner', value: 'partner' },
          { title: 'Client (logo-strip)', value: 'client' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'year',
      title: 'Jaar',
      type: 'number',
      validation: (r) => r.required().integer().min(2000).max(2100),
    }),
    defineField({
      name: 'description',
      title: 'Beschrijving (optioneel)',
      type: 'text',
      rows: 2,
      description: 'Bv. context bij award, of waar de talk werd gegeven.',
    }),
    defineField({
      name: 'url',
      title: 'URL (optioneel)',
      type: 'url',
      description: 'Link naar award-pagina, talk-recording, partner-site, etc.',
    }),
    defineField({
      name: 'image',
      title: 'Logo / beeld (optioneel)',
      type: 'image',
      options: { hotspot: true },
      description:
        'Voor partner/client: logo. Voor award: badge/medal. Voor talk: event-logo of foto.',
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'displayOrder',
      title: 'Volgorde (lager = eerder)',
      type: 'number',
      initialValue: 100,
    }),
  ],
  preview: {
    select: { title: 'title', category: 'category', year: 'year', media: 'image' },
    prepare({ title, category, year, media }) {
      return {
        title,
        subtitle: `${category} · ${year}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Year (newest first)',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
    {
      title: 'Display order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'year', direction: 'desc' },
      ],
    },
  ],
})
