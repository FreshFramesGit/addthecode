import { defineArrayMember, defineField, defineType } from 'sanity'
import { HelpCircleIcon } from '@sanity/icons'

/**
 * FAQ Block — vraag-antwoord sectie.
 *
 * Spec: docs/07j §5 (contact), home + services voor AEO-vragen.
 * Genereert FAQPage JSON-LD voor SEO/AEO als `enableJsonLd: true`.
 */
export const faqBlock = defineType({
  name: 'faqBlock',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Vragen',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({ name: 'question', title: 'Vraag', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'answer',
              title: 'Antwoord',
              type: 'blockContent',
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: 'question' },
            prepare: ({ title }) => ({ title: `V · ${title?.slice(0, 60) || ''}` }),
          },
        }),
      ],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'enableJsonLd',
      title: 'Genereer FAQPage JSON-LD',
      type: 'boolean',
      initialValue: true,
      description: 'Voor SEO/AEO. Aanbevolen aan op home, contact en services-pagina\'s.',
    }),
    defineField({
      name: 'tone',
      title: 'Tonale zone',
      type: 'string',
      options: { list: ['paper', 'ink', 'claude'], layout: 'radio' },
      initialValue: 'paper',
    }),
    defineField({ name: 'anchorId', title: 'Anchor ID', type: 'string', validation: (r) => r.regex(/^[a-z0-9-]*$/) }),
  ],
  preview: {
    select: { enabled: 'enabled', heading: 'heading', items: 'items' },
    prepare({ enabled, heading, items }) {
      const title = heading || 'FAQ'
      const count = items?.length || 0
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: `${count} vragen` }
    },
  },
})
