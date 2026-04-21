import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'

/**
 * Team Grid — leest team-members uit de collection.
 *
 * Spec: docs/07c §4.
 */
export const teamGridBlock = defineType({
  name: 'teamGridBlock',
  title: 'Team Grid',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'preClaim', title: 'Pre-claim', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'coreOnly',
      title: 'Alleen core team',
      type: 'boolean',
      initialValue: true,
      description: 'Filter op `team_member.isCore`. Standaard alleen core (Alex + 2-3 leden).',
    }),
    defineField({
      name: 'showQuotes',
      title: 'Toon quote per team-member',
      type: 'boolean',
      initialValue: true,
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
    select: { enabled: 'enabled', heading: 'heading', core: 'coreOnly' },
    prepare({ enabled, heading, core }) {
      const title = heading || 'Team Grid'
      return {
        title: enabled === false ? `🚫 ${title}` : title,
        subtitle: core ? 'Core team only' : 'Volledig team',
      }
    },
  },
})
