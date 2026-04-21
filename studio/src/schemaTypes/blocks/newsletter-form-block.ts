import { defineField, defineType } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

/**
 * Newsletter Form — Brevo subscription + Sanity-archief.
 *
 * Spec: docs/09-microcopy §2.2.
 * Default copy uit `componentDefaults.newsletter` — overrides hier optional.
 */
export const newsletterFormBlock = defineType({
  name: 'newsletterFormBlock',
  title: 'Newsletter Form',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim', type: 'string' }),
    defineField({
      name: 'overrideIntro',
      title: 'Intro override (optioneel)',
      type: 'string',
      description: 'Vervangt default uit Component Defaults. Leeg = default gebruiken.',
    }),
    defineField({
      name: 'overrideHelperLine',
      title: 'Helper line override (optioneel)',
      type: 'string',
    }),
    defineField({
      name: 'source',
      title: 'Source-tag',
      type: 'string',
      options: {
        list: [
          { title: 'Footer (sitebreed)', value: 'footer' },
          { title: 'Academy bottom', value: 'academy' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
      initialValue: 'footer',
      description: 'Bepaalt `newsletterSubscription.source` in archief — voor analyse waar mensen aanmeldden.',
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
    select: { enabled: 'enabled', source: 'source' },
    prepare({ enabled, source }) {
      const title = `Newsletter · ${source || 'footer'}`
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: 'Newsletter Form' }
    },
  },
})
