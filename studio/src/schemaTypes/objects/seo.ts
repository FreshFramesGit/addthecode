import { defineField, defineType } from 'sanity'

/**
 * Reusable SEO object with Open Graph and JSON-LD support.
 * OG and JSON-LD use a "same as" / "custom" toggle similar to Webflow.
 * Fallback logic lives in GROQ/Astro, not in the schema.
 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    // ─── Basic SEO ───
    defineField({
      name: 'title',
      title: 'SEO title',
      type: 'string',
      description: 'Overrides the page title in search results (max 60 characters). Empty = falls back to page title.',
      validation: (r) => r.max(60),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'Short description for search results (max 160 characters).',
      validation: (r) => r.max(160),
    }),

    // ─── Open Graph ───
    defineField({
      name: 'ogImage',
      title: 'Social (OG) image',
      type: 'image',
      description: 'Recommended size: 1200x630px. Empty = falls back to siteSettings.defaultOgImage.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ogTitleMode',
      title: 'Open Graph title',
      type: 'string',
      options: {
        list: [
          { title: 'Same as SEO title', value: 'same' },
          { title: 'Custom', value: 'custom' },
        ],
        layout: 'radio',
      },
      initialValue: 'same',
    }),
    defineField({
      name: 'ogTitle',
      title: 'Custom OG title',
      type: 'string',
      hidden: ({ parent }) => parent?.ogTitleMode !== 'custom',
    }),
    defineField({
      name: 'ogDescriptionMode',
      title: 'Open Graph description',
      type: 'string',
      options: {
        list: [
          { title: 'Same as meta description', value: 'same' },
          { title: 'Custom', value: 'custom' },
        ],
        layout: 'radio',
      },
      initialValue: 'same',
    }),
    defineField({
      name: 'ogDescription',
      title: 'Custom OG description',
      type: 'text',
      rows: 2,
      hidden: ({ parent }) => parent?.ogDescriptionMode !== 'custom',
    }),

    // ─── Canonical ───
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'Overrides the automatically generated canonical URL.',
      validation: (r) => r.uri({ allowRelative: false, scheme: ['https'] }),
    }),

    // ─── Indexing ───
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      description: 'Add noindex to this page.',
      initialValue: false,
    }),

    // ─── Structured Data ───
    defineField({
      name: 'structuredData',
      title: 'Structured Data (JSON-LD)',
      type: 'object',
      description: 'JSON-LD settings for Google rich results.',
      fields: [
        defineField({
          name: 'mode',
          title: 'Mode',
          type: 'string',
          options: {
            list: [
              { title: 'Automatic (recommended)', value: 'auto' },
              { title: 'Disabled', value: 'disabled' },
              { title: 'Manual', value: 'custom' },
            ],
            layout: 'radio',
          },
          initialValue: 'auto',
        }),
        defineField({
          name: 'customJsonLd',
          title: 'Custom JSON-LD',
          type: 'text',
          rows: 10,
          description: 'Only for "Manual" mode. Paste your JSON-LD code here.',
          hidden: ({ parent }) => parent?.mode !== 'custom',
        }),
      ],
      options: { collapsible: true, collapsed: true },
    }),
  ],
})
