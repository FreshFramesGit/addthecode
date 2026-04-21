import { defineField, defineType } from 'sanity'
import { DocumentsIcon } from '@sanity/icons'

/**
 * Work Index — de /work pagina (drielaag overview: launch / in-flight / heritage).
 *
 * De drielaag-structuur wordt gerenderd via `projectGridBlock` instances met per-laag
 * `layerFilter` enum. Case-documents bepalen de items; dit singleton bepaalt alleen
 * de hero, tussenteksten en sectie-volgorde.
 *
 * Spec: docs/07b-work.md
 */
export const workIndexPage = defineType({
  name: 'workIndexPage',
  title: 'Work (index)',
  type: 'document',
  icon: DocumentsIcon,
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
        'Voeg secties toe en sleep ze in de gewenste volgorde. Standaard: hero-standard → projectGrid (launch) → projectGrid (in-flight) → projectGrid (heritage) → cta-refrein.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Work (index)' }
    },
  },
})
