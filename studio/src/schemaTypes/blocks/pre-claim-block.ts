import { defineField, defineType } from 'sanity'
import { CommentIcon } from '@sanity/icons'

/**
 * Pre-claim Block — standalone mono-label.
 *
 * Spec: docs/08 §5.1. Meestal als veld binnen andere blocks (hero, section-heading),
 * maar ook beschikbaar als losse pageBuilder-block voor kale labels.
 */
export const preClaimBlock = defineType({
  name: 'preClaimBlock',
  title: 'Pre-claim (standalone)',
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({
      name: 'text',
      title: 'Text (mono-label)',
      type: 'string',
      description: 'Bv "◌ Werkwijze · 5 fases".',
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: 'showThinkingRing',
      title: 'Toon Thinking Ring glyph',
      type: 'boolean',
      initialValue: true,
      description: 'Het ◌-glyph voor de tekst.',
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
    select: { enabled: 'enabled', text: 'text' },
    prepare({ enabled, text }) {
      const title = text || 'Pre-claim'
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: 'Pre-claim (standalone)' }
    },
  },
})
