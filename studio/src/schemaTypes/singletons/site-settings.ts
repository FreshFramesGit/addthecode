import { defineArrayMember, defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'icons', title: 'Icons' },
    { name: 'localization', title: 'Localization' },
    { name: 'contact', title: 'Contact' },
    { name: 'studioAddress', title: 'Studio (Breda)' },
    { name: 'seo', title: 'SEO' },
    { name: 'social', title: 'Social' },
  ],
  fields: [
    // ─── Identity ───
    defineField({
      name: 'siteName',
      title: 'Site name',
      type: 'string',
      group: 'identity',
      validation: (r) => r.required(),
      initialValue: '',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site description',
      type: 'text',
      rows: 2,
      group: 'identity',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'identity',
      description:
        'Korte merkbelofte die in footer, structured data, of OG-fallback gebruikt kan worden. Bv "Custom design. Custom code. AI-versnelde bouw."',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'identity',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),

    // ─── Icons ───
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      group: 'icons',
      description: 'Upload a 32x32 pixel image. Supported formats: PNG, GIF, ICO, JPG.',
      options: { accept: 'image/png,image/gif,image/x-icon,image/jpeg,image/svg+xml' },
    }),
    defineField({
      name: 'webclip',
      title: 'Webclip',
      type: 'image',
      group: 'icons',
      description: 'Upload a 256x256 pixel image. Used as the app icon on mobile devices.',
      options: { accept: 'image/png,image/jpeg' },
    }),

    // ─── Localization ───
    defineField({
      name: 'languageCode',
      title: 'Language code',
      type: 'string',
      group: 'localization',
      description: 'ISO 639-1 language code (e.g. "nl", "en", "de"). Used for the html lang attribute.',
      initialValue: 'en',
      validation: (r) => r.max(5),
    }),
    defineField({
      name: 'timeZone',
      title: 'Time zone',
      type: 'string',
      group: 'localization',
      description: 'IANA time zone (e.g. "Europe/Amsterdam").',
      initialValue: '',
    }),

    // ─── Contact ───
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'contact',
      initialValue: '',
    }),
    defineField({
      name: 'email',
      title: 'Email address',
      type: 'email',
      group: 'contact',
      initialValue: '',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp URL',
      type: 'url',
      group: 'contact',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      group: 'contact',
      initialValue: '',
    }),
    // ─── Studio (Breda) — adres + bezoek-info ───
    defineField({
      name: 'studioAddress',
      title: 'Studio adres',
      type: 'object',
      group: 'studioAddress',
      description:
        'Fysieke studio-locatie van Add the Code (Breda). Wordt getoond op /contact §4 en in footer + JSON-LD structured data.',
      fields: [
        defineField({
          name: 'addressLine1',
          title: 'Adresregel 1 (straat + nr)',
          type: 'string',
          initialValue: 'Nieuwe Prinsenkade 4',
        }),
        defineField({
          name: 'postalCode',
          title: 'Postcode',
          type: 'string',
          initialValue: '4811 VC',
        }),
        defineField({
          name: 'city',
          title: 'Stad',
          type: 'string',
          initialValue: 'Breda',
        }),
        defineField({
          name: 'country',
          title: 'Land',
          type: 'string',
          initialValue: 'Nederland',
        }),
        defineField({
          name: 'openingHours',
          title: 'Openingstijden',
          type: 'string',
          description: 'Bv. "werkdagen 9:00–17:30".',
          initialValue: 'werkdagen 9:00–17:30',
        }),
        defineField({
          name: 'visitingNote',
          title: 'Bezoek-instructie',
          type: 'text',
          rows: 2,
          description: 'Korte regel onder adres — bv "Op afspraak — loop niet zomaar binnen".',
          initialValue:
            'Op afspraak — loop niet zomaar binnen, dan zitten we meestal in iets wat we niet kunnen onderbreken.',
        }),
        defineField({
          name: 'mapUrl',
          title: 'Maps URL (optioneel)',
          type: 'url',
          description: 'Google Maps of OpenStreetMap link voor "Bekijk op kaart" knop.',
        }),
      ],
    }),

    // CTA defaults are managed in Settings → Component Defaults (componentDefaults singleton)

    // ─── SEO ───
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
      group: 'seo',
      description: 'Fallback SEO values. Used when a page has no SEO of its own.',
    }),
    defineField({
      name: 'globalCanonicalUrl',
      title: 'Canonical base URL',
      type: 'url',
      group: 'seo',
      description: 'The base URL for canonical links (e.g. "https://example.com"). Without trailing slash.',
      validation: (r) => r.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'googleSiteVerificationId',
      title: 'Google Site Verification ID',
      type: 'string',
      group: 'seo',
      description: 'Google Search Console verification meta tag value.',
    }),
    defineField({
      name: 'enableSitemap',
      title: 'Generate sitemap',
      type: 'boolean',
      group: 'seo',
      initialValue: true,
      description: 'Automatically generate a sitemap.xml.',
    }),
    defineField({
      name: 'robotsDirectives',
      title: 'Robots.txt rules',
      type: 'text',
      rows: 6,
      group: 'seo',
      description: 'Extra rules for robots.txt. Astro generates the base, these rules are appended.',
    }),
    defineField({
      name: 'llmsTxt',
      title: 'llms.txt',
      type: 'text',
      rows: 15,
      group: 'seo',
      description: 'Content for /llms.txt — a file that helps AI models understand your site. Automatically served as a route at /llms.txt.',
    }),

    // ─── Social ───
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'social',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: { list: ['LinkedIn', 'Instagram', 'YouTube', 'Twitter/X', 'Facebook', 'Other'] },
            }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
            prepare({ title, subtitle }) { return { title, subtitle } },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'siteName' },
    prepare({ title }) {
      return { title: title || 'Site settings' }
    },
  },
})
