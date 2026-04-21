import { defineArrayMember, defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons'

/**
 * Hero Home — variant C uit `docs/07a §1`.
 *
 * Drie-delige merk-belofte met typografische hiërarchie — geen video,
 * geen overlay, geen hero-image. Pure typografie + Thinking Ring motif.
 *
 * Voorbeeld-content (seed):
 *   preClaim: "◌ Fresh Frames · sinds 2017 · Breda"
 *   headlineParts: ["Custom design.", "Custom code.", "AI-versnelde bouw."]
 *   subClaim: "We bouwen merk-eigen websites en web-apps die weer van jou zijn."
 */
export const heroHomeBlock = defineType({
  name: 'heroHomeBlock',
  title: 'Hero — Home (variant C)',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      description: 'Uitschakelen verbergt de sectie zonder te verwijderen.',
      initialValue: true,
    }),
    defineField({
      name: 'preClaim',
      title: 'Pre-claim (mono-label boven hero)',
      type: 'string',
      description: 'Kort mono-label — bv "◌ Fresh Frames · sinds 2017 · Breda".',
    }),
    defineField({
      name: 'headlineParts',
      title: 'Headline (3 regels)',
      type: 'array',
      description:
        'Exact 3 regels — de drie-delige merk-belofte. Voorbeeld: ["Custom design.", "Custom code.", "AI-versnelde bouw."].',
      validation: (r) => r.length(3).error('Hero-home vereist precies 3 regels.'),
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'subClaim',
      title: 'Sub-claim (onder headline)',
      type: 'text',
      rows: 2,
      description: 'Één of twee zinnen onder de headline — zet de belofte in context.',
    }),
    defineField({
      name: 'ctas',
      title: 'CTAs (max 2)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'heroCta',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'link', title: 'Link', type: 'cmsLink', validation: (r) => r.required() }),
            defineField({
              name: 'variant',
              title: 'Variant',
              type: 'string',
              options: {
                list: [
                  { title: 'Primary', value: 'primary' },
                  { title: 'Secondary', value: 'secondary' },
                  { title: 'Tertiary (link)', value: 'tertiary' },
                ],
                layout: 'radio',
              },
              initialValue: 'primary',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'variant' },
          },
        }),
      ],
      validation: (r) => r.max(2),
    }),
    defineField({
      name: 'showThinkingRing',
      title: 'Toon Thinking Ring',
      type: 'boolean',
      initialValue: true,
      description: 'Sitebreed signature-motif. Standaard aan op home-hero.',
    }),
    defineField({
      name: 'tone',
      title: 'Tonale zone',
      type: 'string',
      options: {
        list: [
          { title: 'Paper (licht)', value: 'paper' },
          { title: 'Ink (donker)', value: 'ink' },
          { title: 'Claude (oranje)', value: 'claude' },
        ],
        layout: 'radio',
      },
      initialValue: 'paper',
    }),
    defineField({
      name: 'anchorId',
      title: 'Anchor ID (hash-link)',
      type: 'string',
      description: 'Optioneel — kebab-case voor #hash linking.',
      validation: (r) => r.regex(/^[a-z0-9-]*$/, { name: 'kebab-case' }),
    }),
  ],
  preview: {
    select: { enabled: 'enabled', parts: 'headlineParts' },
    prepare({ enabled, parts }) {
      const title = parts?.join(' ') || 'Hero — Home'
      return {
        title: enabled === false ? `🚫 ${title}` : title,
        subtitle: enabled === false ? 'Verborgen' : 'Hero — Home (variant C)',
      }
    },
  },
})
