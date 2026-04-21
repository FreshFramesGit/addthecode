import { defineArrayMember, defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons'

/**
 * Direct Channels — alternatieve contactkanalen voor wie liever niet via formulier werkt.
 *
 * Spec: docs/07j §4. E-mail / telefoon / studio-adres / WhatsApp.
 */
export const directChannelsBlock = defineType({
  name: 'directChannelsBlock',
  title: 'Direct Channels',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'Liever direct?' }),
    defineField({
      name: 'channels',
      title: 'Kanalen',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'channel',
          fields: [
            defineField({
              name: 'kind',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'E-mail', value: 'email' },
                  { title: 'Telefoon', value: 'phone' },
                  { title: 'WhatsApp', value: 'whatsapp' },
                  { title: 'Studio adres', value: 'address' },
                  { title: 'Other', value: 'other' },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({ name: 'label', title: 'Label (bv "Algemeen", "Direct Alex")', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'value',
              title: 'Waarde',
              type: 'string',
              description: 'Email-adres, telefoonnummer, of adres-string. Wordt klikbaar gemaakt als email/phone/whatsapp.',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'helperLine',
              title: 'Helper (optioneel)',
              type: 'string',
              description: 'Bv "werkdagen 9:00-17:30" of "Op afspraak".',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value', kind: 'kind' },
            prepare: ({ title, subtitle, kind }) => ({ title: `${kind} · ${title}`, subtitle }),
          },
        }),
      ],
    }),
    defineField({
      name: 'layoutVariant',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: '2×2 grid', value: 'grid-2x2' },
          { title: 'Inline (alle naast elkaar)', value: 'inline' },
          { title: 'Stack (verticaal)', value: 'stack' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid-2x2',
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
    select: { enabled: 'enabled', heading: 'heading', channels: 'channels' },
    prepare({ enabled, heading, channels }) {
      const title = heading || 'Direct Channels'
      const count = channels?.length || 0
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: `${count} kanalen` }
    },
  },
})
