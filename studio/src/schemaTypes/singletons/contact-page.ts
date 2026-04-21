import { defineField, defineType } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

/**
 * Contact Page — /contact.
 *
 * Content: hero-standard → contact-form → expectation-steps → direct-channels → faq.
 *
 * Geen cta-refrein onderaan — het formulier zelf is de CTA (zie docs/09-microcopy §11).
 *
 * Spec: docs/07j-contact.md
 */
export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact',
  type: 'document',
  icon: EnvelopeIcon,
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
        'Voeg secties toe en sleep ze in de gewenste volgorde. Contact-form sleutels in Sanity-inquiry archief + Resend mail.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Contact' }
    },
  },
})
