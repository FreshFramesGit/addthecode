import { defineField, defineType } from 'sanity'
import { LockIcon } from '@sanity/icons'

/**
 * NDA Explainer — vervangt §6/§7 op in-flight cases.
 *
 * Spec: docs/07b §3 + docs/07h. Gebruikt op case-pagina's met `layer: 'in-flight'`.
 * Legt uit waarom details niet gedeeld kunnen worden, met optionele release-datum.
 */
export const ndaExplainerBlock = defineType({
  name: 'ndaExplainerBlock',
  title: 'NDA Explainer (in-flight)',
  type: 'object',
  icon: LockIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim', type: 'string', initialValue: '◌ Onder NDA' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Wat we nu nog niet kunnen delen',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body (Portable Text)',
      type: 'blockContent',
      description:
        'Uitleg over de NDA-context en wat de lezer wel mag verwachten zodra het project live is.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'expectedReleaseDate',
      title: 'Verwachte release-datum (optioneel)',
      type: 'string',
      description: 'Bv "Q3 2026" of "zomer 2026". Vrije tekst.',
    }),
    defineField({
      name: 'contactCta',
      title: 'Contact-CTA (optioneel)',
      type: 'object',
      description: 'Voor lezers die nu al details willen bespreken.',
      fields: [
        defineField({ name: 'label', title: 'CTA label', type: 'string' }),
        defineField({ name: 'link', title: 'CTA link', type: 'cmsLink' }),
      ],
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
    select: { enabled: 'enabled', heading: 'heading', release: 'expectedReleaseDate' },
    prepare({ enabled, heading, release }) {
      const title = heading || 'NDA Explainer'
      return {
        title: enabled === false ? `🚫 ${title}` : title,
        subtitle: release ? `Release: ${release}` : 'In-flight (NDA)',
      }
    },
  },
})
