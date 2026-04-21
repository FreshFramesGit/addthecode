import { defineArrayMember, defineField, defineType } from 'sanity'
import { ComponentIcon } from '@sanity/icons'

/**
 * Component Defaults — sitebreed gedeelde defaults voor herbruikbare blocks.
 *
 * Patroon: blocks (ctaRefreinBlock, newsletterFormBlock, expectationStepsBlock) lezen
 * eerst uit hun eigen lokale velden, vallen daarna terug op deze defaults.
 *
 * Toevoeging 2026-04-21 (Add the Code Phase 1):
 * - ctaRefreins[] — sitebreed CTA-refrein-varianten (`docs/09-microcopy §11`)
 * - newsletter — newsletter form copy (`docs/09-microcopy §2.2`)
 * - expectationSteps — `/contact` §3 drie-staps verwachting (`docs/07j §3`)
 */
export const componentDefaults = defineType({
  name: 'componentDefaults',
  title: 'Component Defaults',
  type: 'document',
  icon: ComponentIcon,
  groups: [
    { name: 'cta', title: 'CTA (legacy)', default: true },
    { name: 'ctaRefrein', title: 'CTA-refrein (sitebreed)' },
    { name: 'newsletter', title: 'Newsletter form' },
    { name: 'expectationSteps', title: 'Expectation steps (/contact)' },
  ],
  fields: [
    // ─── CTA (legacy template-default — laten staan voor backwards-compat) ───
    defineField({
      name: 'cta',
      title: 'Call to Action (legacy)',
      type: 'object',
      group: 'cta',
      description:
        'Generieke CTA-block die op detail-pagina\'s kan verschijnen. Voor de Add the Code site primair gebruikt door cases en essays. CTA-refrein staat in eigen tab.',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: '' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
        defineField({ name: 'contactName', title: 'Contact person', type: 'string' }),
        defineField({ name: 'contactPhone', title: 'Phone', type: 'string' }),
        defineField({ name: 'contactEmail', title: 'Email', type: 'string' }),
        defineField({ name: 'buttonLabel', title: 'Button text', type: 'string', initialValue: '' }),
        defineField({ name: 'buttonLink', title: 'Button link', type: 'cmsLink' }),
        defineField({
          name: 'photo',
          title: 'Photo',
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
      ],
    }),

    // ─── CTA-refrein (sitebreed, varianten per pagina) ───
    defineField({
      name: 'ctaRefreins',
      title: 'CTA-refrein varianten',
      type: 'array',
      group: 'ctaRefrein',
      description:
        'De refrein-statements die `ctaRefreinBlock` per pagina kan tonen. Per pagina selecteer je in het block welke `key` te gebruiken (zie docs/09-microcopy §11 voor toewijzings-tabel).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'ctaRefreinVariant',
          fields: [
            defineField({
              name: 'key',
              title: 'Key',
              type: 'string',
              description:
                'Unieke identifier — wordt door blocks gerefereerd. Voorbeelden: `primary`, `work-index`, `case-detail`, `team`, `services-design`, `services-automate`, `academy-index`, `essay-detail`.',
              validation: (r) => r.required().regex(/^[a-z0-9-]+$/, { name: 'kebab-case' }),
            }),
            defineField({
              name: 'statement',
              title: 'Statement (refrein-vraag)',
              type: 'string',
              description:
                'De vraag of statement bovenaan het CTA-blok. Bv "Klaar om weer met eigen code te bouwen?".',
              validation: (r) => r.required().max(120),
            }),
            defineField({
              name: 'helperLine',
              title: 'Helper line (subtitle)',
              type: 'string',
              description: 'Optionele subregel onder het statement.',
            }),
            defineField({
              name: 'buttonLabel',
              title: 'Button label',
              type: 'string',
              description: 'Bv. "Plan een gesprek →". Standaard fallback "Plan een gesprek".',
              initialValue: 'Plan een gesprek',
            }),
            defineField({
              name: 'buttonLink',
              title: 'Button link',
              type: 'cmsLink',
              description: 'Doorgaans een interne link naar /contact.',
            }),
          ],
          preview: {
            select: { title: 'key', subtitle: 'statement' },
            prepare: ({ title, subtitle }) => ({
              title: title ? `${title}` : 'Geen key',
              subtitle: subtitle || 'Geen statement',
            }),
          },
        }),
      ],
      validation: (r) =>
        r.custom((items) => {
          if (!items) return true
          const keys = items.map((item: any) => item?.key).filter(Boolean)
          const duplicates = keys.filter((k, i) => keys.indexOf(k) !== i)
          return duplicates.length === 0 ? true : `Dubbele keys: ${duplicates.join(', ')}`
        }),
    }),

    // ─── Newsletter form defaults ───
    defineField({
      name: 'newsletter',
      title: 'Newsletter form copy',
      type: 'object',
      group: 'newsletter',
      description:
        'Default copy voor `newsletterFormBlock` (footer + academy bottom). Per-instance kan overschreven worden in het block zelf.',
      fields: [
        defineField({
          name: 'intro',
          title: 'Intro (boven veld)',
          type: 'string',
          initialValue: 'Eens per maand een essay over custom-code en AI-versnelde bouw.',
        }),
        defineField({
          name: 'placeholder',
          title: 'Email placeholder',
          type: 'string',
          initialValue: 'jij@bedrijf.nl',
        }),
        defineField({
          name: 'buttonLabel',
          title: 'Button label',
          type: 'string',
          initialValue: 'Aanmelden',
        }),
        defineField({
          name: 'buttonLabelSubmitting',
          title: 'Button label (submitting)',
          type: 'string',
          initialValue: 'Aanmelden…',
        }),
        defineField({
          name: 'helperLine',
          title: 'Helper line (onder veld)',
          type: 'string',
          initialValue: 'Ongeveer één per maand. Afmelden vanuit elke mail.',
        }),
        defineField({
          name: 'consentLabel',
          title: 'Consent label',
          type: 'text',
          rows: 2,
          description:
            'Optioneel. Voor double opt-in / GDPR. Leeg laten = geen consent-checkbox tonen.',
        }),
        defineField({
          name: 'successMessage',
          title: 'Success message',
          type: 'string',
          initialValue:
            '◌ Ingeschreven. De volgende essay verschijnt binnen ±30 dagen in je inbox.',
        }),
        defineField({
          name: 'errorMessage',
          title: 'Error message',
          type: 'string',
          initialValue:
            'Er ging iets mis. Probeer het over even opnieuw, of stuur je adres naar hello@addthecode.nl.',
        }),
      ],
    }),

    // ─── Expectation steps (/contact §3) ───
    defineField({
      name: 'expectationSteps',
      title: 'Expectation steps (/contact §3)',
      type: 'object',
      group: 'expectationSteps',
      description:
        'De drie-staps "wat er na contact gebeurt" sectie op /contact. Elders niet gebruikt — hier centraal beheerd zodat copy eenvoudig aanpasbaar is.',
      fields: [
        defineField({
          name: 'heading',
          title: 'Section heading',
          type: 'string',
          initialValue: '◌  Wat er gebeurt nadat je verstuurt',
        }),
        defineField({
          name: 'steps',
          title: 'Steps (3)',
          type: 'array',
          validation: (r) => r.length(3).error('Precies 3 steps verwacht.'),
          of: [
            defineArrayMember({
              type: 'object',
              name: 'expectationStep',
              fields: [
                defineField({
                  name: 'stepNumber',
                  title: 'Step number',
                  type: 'string',
                  description: 'Bv "01", "02", "03".',
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                  description: 'Korte titel — bv "Binnen één werkdag: een eerste reactie".',
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 3,
                  description: 'Body-tekst van de stap.',
                  validation: (r) => r.required(),
                }),
              ],
              preview: {
                select: { title: 'label', subtitle: 'stepNumber' },
                prepare: ({ title, subtitle }) => ({
                  title: title || 'Geen label',
                  subtitle: subtitle ? `Stap ${subtitle}` : 'Geen nummer',
                }),
              },
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Component Defaults' }),
  },
})
