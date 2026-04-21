import { defineField, defineType } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

/**
 * Inquiry — contact-form submission archief.
 *
 * Spec: docs/07j §2.
 *
 * Editor-rights: status + notes mag bewerkt; alle andere velden read-only
 * (afgedwongen via sanity.config.ts actions filter — niet hier).
 */
export const inquiry = defineType({
  name: 'inquiry',
  title: 'Inquiry',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      readOnly: true,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'email',
      readOnly: true,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'company',
      title: 'Bedrijf',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'topic',
      title: 'Onderwerp',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'message',
      title: 'Bericht',
      type: 'text',
      rows: 8,
      readOnly: true,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'receivedAt',
      title: 'Ontvangen op',
      type: 'datetime',
      readOnly: true,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sourcePage',
      title: 'Source pagina',
      type: 'string',
      readOnly: true,
      description: 'Bv "/contact" of "/work/bell" — waar het formulier zat.',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Nieuw', value: 'new' },
          { title: 'In behandeling', value: 'in-progress' },
          { title: 'Beantwoord', value: 'replied' },
          { title: 'Gearchiveerd', value: 'archived' },
          { title: 'Spam', value: 'spam' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'notes',
      title: 'Interne notities',
      type: 'text',
      rows: 4,
      description: 'Bewerkbaar — voor follow-up tracking.',
    }),
  ],
  preview: {
    select: { name: 'name', email: 'email', topic: 'topic', status: 'status', receivedAt: 'receivedAt' },
    prepare({ name, email, topic, status, receivedAt }) {
      const statusBadge =
        status === 'new'
          ? '🆕'
          : status === 'in-progress'
            ? '⏳'
            : status === 'replied'
              ? '✅'
              : status === 'spam'
                ? '🚫'
                : '⊘'
      const dateStr = receivedAt ? new Date(receivedAt).toLocaleDateString('nl-NL') : '?'
      return {
        title: `${statusBadge} ${name || 'Anoniem'} · ${topic || 'Geen topic'}`,
        subtitle: `${email} · ${dateStr}`,
      }
    },
  },
  orderings: [
    {
      title: 'Recently received (newest first)',
      name: 'receivedDesc',
      by: [{ field: 'receivedAt', direction: 'desc' }],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [
        { field: 'status', direction: 'asc' },
        { field: 'receivedAt', direction: 'desc' },
      ],
    },
  ],
})
