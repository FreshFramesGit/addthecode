import { defineField, defineType } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

export const formSubmission = defineType({
  name: 'formSubmission',
  title: 'Form submission',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Contact form', value: 'contact' },
          { title: 'Newsletter', value: 'newsletter' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({ name: 'name', title: 'Name', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', readOnly: true }),
    defineField({ name: 'organization', title: 'Organization', type: 'string', readOnly: true }),
    defineField({ name: 'role', title: 'Role', type: 'string', readOnly: true }),
    defineField({ name: 'intent', title: 'Intent', type: 'string', readOnly: true }),
    defineField({ name: 'project', title: 'Project / message', type: 'text', rows: 4, readOnly: true }),
    defineField({ name: 'budgetBucket', title: 'Budget bucket', type: 'string', readOnly: true }),
    defineField({ name: 'timing', title: 'Timing', type: 'string', readOnly: true }),
    defineField({
      name: 'utm',
      title: 'UTM / attribution',
      type: 'object',
      readOnly: true,
      fields: [
        defineField({ name: 'source', title: 'utm_source', type: 'string' }),
        defineField({ name: 'medium', title: 'utm_medium', type: 'string' }),
        defineField({ name: 'campaign', title: 'utm_campaign', type: 'string' }),
        defineField({ name: 'term', title: 'utm_term', type: 'string' }),
        defineField({ name: 'content', title: 'utm_content', type: 'string' }),
        defineField({ name: 'landingPage', title: 'Landing page', type: 'string' }),
        defineField({ name: 'referrer', title: 'Referrer', type: 'string' }),
        defineField({ name: 'gclid', title: 'gclid', type: 'string' }),
        defineField({ name: 'fbclid', title: 'fbclid', type: 'string' }),
      ],
    }),
    defineField({ name: 'submittedAt', title: 'Submitted at', type: 'datetime', readOnly: true }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['new', 'in progress', 'completed', 'spam'], layout: 'radio' },
      initialValue: 'new',
    }),
    defineField({ name: 'notes', title: 'Internal notes', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'name', source: 'source', date: 'submittedAt', status: 'status' },
    prepare({ title, source, date, status }) {
      const statusIcon = status === 'new' ? '🔵' : status === 'in progress' ? '🟡' : status === 'spam' ? '🚫' : '✅'
      return {
        title: `${statusIcon} ${title || 'Unknown'}`,
        subtitle: `${source || 'unknown'} — ${date ? new Date(date).toISOString().split('T')[0] : ''}`,
      }
    },
  },
  orderings: [
    { title: 'Newest first', name: 'submittedAtDesc', by: [{ field: 'submittedAt', direction: 'desc' }] },
  ],
})
