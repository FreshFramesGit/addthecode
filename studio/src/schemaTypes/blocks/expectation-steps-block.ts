import { defineField, defineType } from 'sanity'
import { RocketIcon } from '@sanity/icons'

/**
 * Expectation Steps — drie-staps verwachting na contact.
 *
 * Spec: docs/07j §3. Default copy uit `componentDefaults.expectationSteps`.
 */
export const expectationStepsBlock = defineType({
  name: 'expectationStepsBlock',
  title: 'Expectation Steps (3-staps)',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({
      name: 'overrideHeading',
      title: 'Heading override (optioneel)',
      type: 'string',
      description: 'Vervangt default uit Component Defaults. Leeg = default gebruiken.',
    }),
    defineField({
      name: 'overrideSteps',
      title: 'Steps override (optioneel)',
      type: 'array',
      validation: (r) => r.length(3).warning('Precies 3 steps verwacht — anders default uit Component Defaults gebruiken.'),
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'stepNumber', title: 'Step number', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: (r) => r.required() }),
          ],
        },
      ],
      description: 'Vul alleen in als je af wilt wijken van Component Defaults.',
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
    select: { enabled: 'enabled', override: 'overrideHeading' },
    prepare({ enabled, override }) {
      const title = override || 'Expectation Steps (default)'
      return { title: enabled === false ? `🚫 ${title}` : title, subtitle: 'Expectation Steps' }
    },
  },
})
