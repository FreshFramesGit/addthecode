import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

/**
 * Team Member — medewerker / collaborator.
 *
 * Spec: docs/07c §4. Core team (Alex + 2-3 leden) + collaborators.
 */
export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'language',
      title: 'Taal (bio-versie)',
      type: 'string',
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
      name: 'role',
      title: 'Rol',
      type: 'string',
      description: 'Bv "Founder & Hoofdaannemer", "Frontend Engineer", "Design lead".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'isCore',
      title: 'Core team',
      type: 'boolean',
      initialValue: false,
      description: 'Aan: getoond op /team in core-grid. Uit: alleen als author-attributie of in collaborator-lijst.',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Volgorde (lager = eerder)',
      type: 'number',
      initialValue: 100,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'portrait',
      title: 'Portret',
      type: 'image',
      options: { hotspot: true },
      description: '1:1 ratio aanbevolen. Desaturated-natural treatment per docs/05-beeldtaal.',
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Bio (Portable Text)',
      type: 'blockContent',
      description: 'Korte bio — 2-4 alinea\'s.',
    }),
    defineField({
      name: 'quote',
      title: 'Persoonlijk citaat',
      type: 'object',
      fields: [
        defineField({ name: 'text', title: 'Citaat', type: 'text', rows: 3 }),
        defineField({
          name: 'context',
          title: 'Context (optioneel)',
          type: 'string',
          description: 'Bv "Over werken met AI" — alleen tonen als er een specifieke context is.',
        }),
      ],
    }),
    defineField({
      name: 'email',
      title: 'Email (optioneel)',
      type: 'email',
      description: 'Alleen tonen voor core team-members.',
    }),
    defineField({
      name: 'links',
      title: 'Externe links (optioneel)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'externalLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: ['LinkedIn', 'GitHub', 'X / Twitter', 'Personal site', 'Other'],
              },
            }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'portrait', isCore: 'isCore' },
    prepare({ title, subtitle, media, isCore }) {
      return {
        title: isCore ? `★ ${title}` : title,
        subtitle,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    {
      title: 'Core first',
      name: 'coreFirst',
      by: [
        { field: 'isCore', direction: 'desc' },
        { field: 'displayOrder', direction: 'asc' },
      ],
    },
  ],
})
