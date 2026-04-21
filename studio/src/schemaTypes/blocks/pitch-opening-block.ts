import { defineField, defineType } from 'sanity'
import { TextIcon } from '@sanity/icons'

/**
 * Pitch Opening — 1-2 alinea's positionering-tekst.
 *
 * Spec: docs/07a §2 (home), docs/07a §7 (approach-teaser),
 *       docs/07e/f/g §2 (services intro).
 *
 * Optionele CTA aan einde — gebruikt voor "approach-teaser"-pattern op home
 * (link naar /approach), services-cross-links, etc.
 */
export const pitchOpeningBlock = defineType({
  name: 'pitchOpeningBlock',
  title: 'Pitch Opening (alinea)',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim (mono-label)', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading (optioneel)', type: 'string' }),
    defineField({
      name: 'body',
      title: 'Body (Portable Text)',
      type: 'blockContent',
      description: '1-2 alinea\'s. Ondersteunt inline emphasis (Claude-orange highlight, mono inline).',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label (optioneel)',
      type: 'string',
      description:
        'Vul in om een tertiary-link onder de body te tonen. Bv "Lees onze werkwijze →".',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA link (optioneel)',
      type: 'cmsLink',
      hidden: ({ parent }: { parent?: { ctaLabel?: string } }) => !parent?.ctaLabel,
    }),
    defineField({
      name: 'maxWidth',
      title: 'Max breedte',
      type: 'string',
      options: { list: ['small', 'main', 'full'], layout: 'radio' },
      initialValue: 'main',
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
    select: { enabled: 'enabled', preClaim: 'preClaim', heading: 'heading' },
    prepare({ enabled, preClaim, heading }) {
      const title = heading || preClaim || 'Pitch Opening'
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: 'Pitch Opening (alinea)' }
    },
  },
})
