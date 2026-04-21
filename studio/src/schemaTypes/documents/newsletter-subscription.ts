import { defineField, defineType } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

/**
 * Newsletter Subscription — Brevo-sync archief.
 *
 * Submissions worden via API endpoint geschreven (newsletter-subscribe.ts)
 * + parallel naar Brevo gesynced. Sanity is read-only inbox voor archive +
 * recovery bij Brevo-failure.
 */
export const newsletterSubscription = defineType({
  name: 'newsletterSubscription',
  title: 'Newsletter subscription',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'email',
      readOnly: true,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Ingeschreven op',
      type: 'datetime',
      readOnly: true,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Footer (sitebreed)', value: 'footer' },
          { title: 'Academy bottom', value: 'academy' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description:
        'Aan = actief geabonneerd. Uit = uitgeschreven (handmatig of via Brevo unsubscribe webhook).',
    }),
    defineField({
      name: 'brevoSyncStatus',
      title: 'Brevo sync status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending (nog niet gesynced)', value: 'pending' },
          { title: 'Synced', value: 'synced' },
          { title: 'Failed (manueel actie nodig)', value: 'failed' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'brevoSubscriberId',
      title: 'Brevo subscriber ID',
      type: 'string',
      readOnly: true,
      description: 'Brevo-side ID na succesvolle sync — voor cross-reference + manuele admin in Brevo.',
    }),
    defineField({
      name: 'lastSyncAttemptAt',
      title: 'Laatste sync poging',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'syncErrorMessage',
      title: 'Sync error message',
      type: 'text',
      rows: 3,
      readOnly: true,
      hidden: ({ document }) => document?.brevoSyncStatus !== 'failed',
    }),
  ],
  preview: {
    select: { email: 'email', active: 'active', sync: 'brevoSyncStatus', subscribedAt: 'subscribedAt' },
    prepare({ email, active, sync, subscribedAt }) {
      const activeBadge = active ? '●' : '○'
      const syncBadge = sync === 'synced' ? '✓' : sync === 'failed' ? '⚠' : '⏳'
      const dateStr = subscribedAt ? new Date(subscribedAt).toLocaleDateString('nl-NL') : '?'
      return {
        title: `${activeBadge} ${email}`,
        subtitle: `Brevo: ${syncBadge} ${sync || 'pending'} · ${dateStr}`,
      }
    },
  },
  orderings: [
    {
      title: 'Recently subscribed (newest first)',
      name: 'subscribedDesc',
      by: [{ field: 'subscribedAt', direction: 'desc' }],
    },
    {
      title: 'Sync status (failed first)',
      name: 'syncFailedFirst',
      by: [
        { field: 'brevoSyncStatus', direction: 'asc' },
        { field: 'subscribedAt', direction: 'desc' },
      ],
    },
  ],
})
