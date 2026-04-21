import { defineArrayMember, defineField, defineType } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

/**
 * Contact Form — formulier dat naar `inquiry` document schrijft + Resend mail.
 *
 * Spec: docs/07j §2 + docs/09-microcopy §2.1.
 * Bot-bescherming: Turnstile + honeypot via API endpoint.
 */
export const contactFormBlock = defineType({
  name: 'contactFormBlock',
  title: 'Contact Form',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'intro',
      title: 'Intro (Portable Text)',
      type: 'blockContent',
      description: 'Korte intro boven het formulier.',
    }),
    defineField({
      name: 'topicOptions',
      title: 'Topic-opties (select)',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Bv ["Project / opdracht", "Werkwijze vraag", "Anders"]. Default als leeg.',
      initialValue: ['Project / opdracht', 'Werkwijze vraag', 'Anders'],
    }),
    defineField({
      name: 'requireCompany',
      title: 'Bedrijfsveld verplicht',
      type: 'boolean',
      initialValue: false,
      description: 'Aan: bedrijf-veld is required. Uit: optioneel.',
    }),
    defineField({
      name: 'submitLabel',
      title: 'Submit button label',
      type: 'string',
      initialValue: 'Verstuur bericht',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success message',
      type: 'text',
      rows: 3,
      initialValue: 'Bericht ontvangen. Alex stuurt binnen één werkdag een eerste reactie terug naar je e-mail.',
    }),
    defineField({
      name: 'errorMessage',
      title: 'Error message',
      type: 'text',
      rows: 3,
      initialValue:
        'Er is iets misgegaan bij verzenden. Stuur een bericht direct naar hello@addthecode.nl, dan komt het zeker binnen.',
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
    select: { enabled: 'enabled', heading: 'heading' },
    prepare({ enabled, heading }) {
      const title = heading || 'Contact Form'
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: 'Contact Form' }
    },
  },
})
