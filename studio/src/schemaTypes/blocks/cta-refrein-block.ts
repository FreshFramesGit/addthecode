import { defineField, defineType } from 'sanity'
import { ArrowRightIcon } from '@sanity/icons'

/**
 * CTA Refrein — sitebreed CTA-blok dat per pagina een variant trekt
 * uit `componentDefaults.ctaRefreins[]`.
 *
 * Spec: docs/09-microcopy §11.
 *
 * Lookup-rule: editor selecteert `pageKey`, frontend zoekt matching key in
 * componentDefaults.ctaRefreins. Override-velden hebben voorrang als ingevuld.
 */
export const ctaRefreinBlock = defineType({
  name: 'ctaRefreinBlock',
  title: 'CTA Refrein (sitebreed)',
  type: 'object',
  icon: ArrowRightIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({
      name: 'pageKey',
      title: 'Variant key',
      type: 'string',
      description:
        'Sleutel die match maakt op een variant in Settings → Component Defaults → CTA-refrein varianten.',
      options: {
        list: [
          { title: 'Primary (default)', value: 'primary' },
          { title: 'Work index', value: 'work-index' },
          { title: 'Case detail', value: 'case-detail' },
          { title: 'Approach', value: 'approach' },
          { title: 'Team', value: 'team' },
          { title: 'Services · Design', value: 'services-design' },
          { title: 'Services · Build', value: 'services-build' },
          { title: 'Services · Automate', value: 'services-automate' },
          { title: 'Academy index', value: 'academy-index' },
          { title: 'Essay detail', value: 'essay-detail' },
        ],
      },
      initialValue: 'primary',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'overrideStatement',
      title: 'Override statement (optioneel)',
      type: 'string',
      description: 'Vul alleen in als je af wilt wijken van de default uit Component Defaults.',
    }),
    defineField({
      name: 'overrideButtonLabel',
      title: 'Override button label (optioneel)',
      type: 'string',
    }),
    defineField({
      name: 'overrideButtonLink',
      title: 'Override button link (optioneel)',
      type: 'cmsLink',
    }),
    defineField({
      name: 'tone',
      title: 'Tonale zone',
      type: 'string',
      options: { list: ['paper', 'ink', 'claude'], layout: 'radio' },
      initialValue: 'claude',
      description: 'Default Claude-zone (oranje) — sterke CTA-impact.',
    }),
    defineField({ name: 'anchorId', title: 'Anchor ID', type: 'string', validation: (r) => r.regex(/^[a-z0-9-]*$/) }),
  ],
  preview: {
    select: { enabled: 'enabled', key: 'pageKey', override: 'overrideStatement' },
    prepare({ enabled, key, override }) {
      const title = override || `CTA-refrein · ${key}`
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: 'CTA Refrein' }
    },
  },
})
