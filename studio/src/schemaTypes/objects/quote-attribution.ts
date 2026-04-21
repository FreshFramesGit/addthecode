import { defineField, defineType } from 'sanity'

/**
 * Quote Attribution — citaat met bron-info.
 *
 * Gebruikt door: quoteClusterBlock (primaryQuote + secondaryQuotes[]),
 * caseDocument.quote, ndaExplainerBlock optional, etc.
 *
 * Voor anonimized in-flight cases laat je `name` en `company` leeg en gebruik
 * je alleen `role` (bv "Productmanager bij grote retailer").
 */
export const quoteAttribution = defineType({
  name: 'quoteAttribution',
  title: 'Quote met attributie',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Citaat',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(400),
    }),
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      description: 'Voor- en achternaam. Leeg laten voor anonieme bron (bv NDA-cases).',
    }),
    defineField({
      name: 'role',
      title: 'Functie',
      type: 'string',
      description: 'Bv "Hoofd Communicatie", "Productmanager".',
    }),
    defineField({
      name: 'company',
      title: 'Bedrijf / organisatie',
      type: 'string',
      description: 'Leeg laten voor NDA-cases. Anders bv "Bell Hammerson", "Universiteit van Nederland".',
    }),
    defineField({
      name: 'portrait',
      title: 'Portret (optioneel)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
  ],
  preview: {
    select: { quote: 'quote', name: 'name', role: 'role' },
    prepare({ quote, name, role }) {
      const attribution = [name, role].filter(Boolean).join(' · ') || 'Anoniem'
      const quoteSnippet = quote ? quote.slice(0, 60) + (quote.length > 60 ? '…' : '') : 'Geen citaat'
      return { title: `"${quoteSnippet}"`, subtitle: attribution }
    },
  },
})
