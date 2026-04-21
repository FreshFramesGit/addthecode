import { defineField, defineType } from 'sanity'
import { CodeBlockIcon } from '@sanity/icons'

/**
 * Service · Build — /services/build.
 *
 * Op deze pagina wordt de stack expliciet genoemd (Astro / Sanity / Vercel /
 * Supabase / Resend|Postmark). Zie CLAUDE.md §2.
 *
 * Spec: docs/07f-services-build.md
 */
export const serviceBuildPage = defineType({
  name: 'serviceBuildPage',
  title: 'Service · Build',
  type: 'document',
  icon: CodeBlockIcon,
  groups: [
    { name: 'pageSettings', title: 'Page settings', default: true },
    { name: 'content', title: 'Sections' },
  ],
  fields: [
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'pageSettings' }),
    defineField({
      name: 'content',
      title: 'Page sections',
      type: 'pageBuilder',
      group: 'content',
      description:
        'Voeg secties toe en sleep ze in de gewenste volgorde. Voorgestelde flow per docs/07f: hero-standard → pitch-opening → tile-grid (oplevering) → stack-strip (tag-strip met stack) → cases-strip → faq → cta-refrein.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Service · Build' }
    },
  },
})
