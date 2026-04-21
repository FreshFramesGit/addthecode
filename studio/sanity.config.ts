import './src/studio-theme.css'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import {
  CogIcon,
  MenuIcon,
  EnvelopeIcon,
  HomeIcon,
  DocumentIcon,
  DocumentsIcon,
  DatabaseIcon,
  CloseCircleIcon,
  CheckmarkCircleIcon,
  WarningOutlineIcon,
  UsersIcon,
  UserIcon,
  CircleIcon,
  ColorWheelIcon,
  CodeBlockIcon,
  RobotIcon,
  BookIcon,
  StarIcon,
  ArchiveIcon,
  CommentIcon,
  ComponentIcon,
  LockIcon,
} from '@sanity/icons'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './src/schemaTypes'
import {coloredIcon} from './src/lib/colored-icon'
import {locations} from './src/lib/resolve'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'PLACEHOLDER'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

/** Accent color voor CMS-pages (collections) */
const CMS_COLOR = '#c4afff'

/** Accent color voor Inbox (read-only inboxes) */
const INBOX_COLOR = '#9bc4af'

/**
 * Singleton types — fixed document IDs, hidden from generic lists.
 * Bevat template-singletons + alle Add the Code pagina-singletons.
 */
const singletonTypes = new Set([
  // Template
  'siteSettings',
  'navigation',
  'homePage',
  'notFoundPage',
  'thankYouPage',
  'componentDefaults',
  // Add the Code pagina's
  'workIndexPage',
  'teamPage',
  'approachPage',
  'serviceDesignPage',
  'serviceBuildPage',
  'serviceAutomatePage',
  'academyIndexPage',
  'contactPage',
  // Add the Code utility pages
  'errorPage',
  'offlinePage',
])

/** Types hidden from the auto-generated list (singletons + collections die eigen views hebben) */
const hiddenFromGenericList = new Set([
  ...singletonTypes,
  'formSubmission',
  'page',
  'case',
  'essay',
  'teamMember',
  'recognition',
  'inquiry',
  'newsletterSubscription',
])

export default defineConfig({
  name: 'addthecode-studio',
  title: 'Add the Code · Studio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // ═══════════════════════════════════════════════════════════
            // PAGINA'S (singletons)
            // ═══════════════════════════════════════════════════════════
            S.listItem()
              .title("Pagina's")
              .icon(DocumentIcon)
              .child(
                S.list()
                  .title("Pagina's")
                  .items([
                    S.listItem()
                      .title('Home')
                      .icon(HomeIcon)
                      .child(S.document().schemaType('homePage').documentId('homePage')),
                    S.divider(),
                    S.listItem()
                      .title('Work (index)')
                      .icon(DocumentsIcon)
                      .child(S.document().schemaType('workIndexPage').documentId('workIndexPage')),
                    S.listItem()
                      .title('Team')
                      .icon(UsersIcon)
                      .child(S.document().schemaType('teamPage').documentId('teamPage')),
                    S.listItem()
                      .title('Approach')
                      .icon(CircleIcon)
                      .child(S.document().schemaType('approachPage').documentId('approachPage')),
                    S.divider(),
                    S.listItem()
                      .title('Services')
                      .icon(CogIcon)
                      .child(
                        S.list()
                          .title('Services')
                          .items([
                            S.listItem()
                              .title('Design')
                              .icon(ColorWheelIcon)
                              .child(S.document().schemaType('serviceDesignPage').documentId('serviceDesignPage')),
                            S.listItem()
                              .title('Build')
                              .icon(CodeBlockIcon)
                              .child(S.document().schemaType('serviceBuildPage').documentId('serviceBuildPage')),
                            S.listItem()
                              .title('Automate')
                              .icon(RobotIcon)
                              .child(S.document().schemaType('serviceAutomatePage').documentId('serviceAutomatePage')),
                          ]),
                      ),
                    S.divider(),
                    S.listItem()
                      .title('Academy (index)')
                      .icon(BookIcon)
                      .child(S.document().schemaType('academyIndexPage').documentId('academyIndexPage')),
                    S.listItem()
                      .title('Contact')
                      .icon(EnvelopeIcon)
                      .child(S.document().schemaType('contactPage').documentId('contactPage')),
                    S.divider(),
                    S.listItem()
                      .title('Free pages (custom URLs)')
                      .icon(DocumentIcon)
                      .child(
                        S.documentList()
                          .title('Free pages')
                          .filter('_type == "page"')
                          .defaultOrdering([{field: 'title', direction: 'asc'}]),
                      ),
                    S.divider(),
                    S.listItem()
                      .title('Utility pages')
                      .icon(WarningOutlineIcon)
                      .child(
                        S.list()
                          .title('Utility pages')
                          .items([
                            S.listItem()
                              .title('404 (niet gevonden)')
                              .icon(CloseCircleIcon)
                              .child(S.document().schemaType('notFoundPage').documentId('notFoundPage')),
                            S.listItem()
                              .title('500 (server error)')
                              .icon(WarningOutlineIcon)
                              .child(S.document().schemaType('errorPage').documentId('errorPage')),
                            S.listItem()
                              .title('Offline')
                              .icon(WarningOutlineIcon)
                              .child(S.document().schemaType('offlinePage').documentId('offlinePage')),
                            S.listItem()
                              .title('Thank you')
                              .icon(CheckmarkCircleIcon)
                              .child(S.document().schemaType('thankYouPage').documentId('thankYouPage')),
                          ]),
                      ),
                  ]),
              ),

            S.divider(),

            // ═══════════════════════════════════════════════════════════
            // CASES (collection met layer-views)
            // ═══════════════════════════════════════════════════════════
            S.listItem()
              .title('Cases')
              .icon(coloredIcon(DocumentsIcon, CMS_COLOR))
              .child(
                S.list()
                  .title('Cases')
                  .items([
                    S.listItem()
                      .title('Alle cases')
                      .icon(DocumentsIcon)
                      .child(
                        S.documentList()
                          .title('Alle cases')
                          .filter('_type == "case"')
                          .defaultOrdering([{field: '_updatedAt', direction: 'desc'}]),
                      ),
                    S.divider(),
                    S.listItem()
                      .title('Launch')
                      .icon(StarIcon)
                      .child(
                        S.documentList()
                          .title('Launch cases')
                          .filter('_type == "case" && layer == "launch"')
                          .defaultOrdering([{field: 'period.start', direction: 'desc'}]),
                      ),
                    S.listItem()
                      .title('In-flight (NDA)')
                      .icon(LockIcon)
                      .child(
                        S.documentList()
                          .title('In-flight (NDA) cases')
                          .filter('_type == "case" && layer == "in-flight"')
                          .defaultOrdering([{field: 'period.start', direction: 'desc'}]),
                      ),
                    S.listItem()
                      .title('Heritage')
                      .icon(ArchiveIcon)
                      .child(
                        S.documentList()
                          .title('Heritage cases')
                          .filter('_type == "case" && layer == "heritage"')
                          .defaultOrdering([{field: 'period.start', direction: 'desc'}]),
                      ),
                    S.divider(),
                    S.listItem()
                      .title('Drafts (alle layers)')
                      .icon(DocumentIcon)
                      .child(
                        S.documentList()
                          .title('Drafts')
                          .filter('_type == "case" && status == "draft"')
                          .defaultOrdering([{field: '_updatedAt', direction: 'desc'}]),
                      ),
                  ]),
              ),

            // ═══════════════════════════════════════════════════════════
            // ESSAYS (collection met category-views)
            // ═══════════════════════════════════════════════════════════
            S.listItem()
              .title('Essays')
              .icon(coloredIcon(BookIcon, CMS_COLOR))
              .child(
                S.list()
                  .title('Essays')
                  .items([
                    S.listItem()
                      .title('Alle essays')
                      .icon(BookIcon)
                      .child(
                        S.documentList()
                          .title('Alle essays')
                          .filter('_type == "essay"')
                          .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
                      ),
                    S.divider(),
                    S.listItem()
                      .title('Featured (flagship)')
                      .icon(StarIcon)
                      .child(
                        S.documentList()
                          .title('Featured essays')
                          .filter('_type == "essay" && featured == true')
                          .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
                      ),
                    S.divider(),
                    S.listItem()
                      .title('Principle')
                      .child(
                        S.documentList()
                          .title('Principle essays')
                          .filter('_type == "essay" && category == "principle"')
                          .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
                      ),
                    S.listItem()
                      .title('Practice')
                      .child(
                        S.documentList()
                          .title('Practice essays')
                          .filter('_type == "essay" && category == "practice"')
                          .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
                      ),
                    S.listItem()
                      .title('Analyse')
                      .child(
                        S.documentList()
                          .title('Analyse essays')
                          .filter('_type == "essay" && category == "analyse"')
                          .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
                      ),
                  ]),
              ),

            // ═══════════════════════════════════════════════════════════
            // TEAM (collection)
            // ═══════════════════════════════════════════════════════════
            S.listItem()
              .title('Team')
              .icon(coloredIcon(UsersIcon, CMS_COLOR))
              .child(
                S.list()
                  .title('Team')
                  .items([
                    S.listItem()
                      .title('Team members')
                      .icon(UserIcon)
                      .child(
                        S.documentList()
                          .title('Team members')
                          .filter('_type == "teamMember"')
                          .defaultOrdering([{field: 'displayOrder', direction: 'asc'}]),
                      ),
                    S.listItem()
                      .title('Core team only')
                      .icon(StarIcon)
                      .child(
                        S.documentList()
                          .title('Core team')
                          .filter('_type == "teamMember" && isCore == true')
                          .defaultOrdering([{field: 'displayOrder', direction: 'asc'}]),
                      ),
                    S.divider(),
                    S.listItem()
                      .title('Recognition (awards / talks / partners / clients)')
                      .icon(StarIcon)
                      .child(
                        S.documentList()
                          .title('Recognition')
                          .filter('_type == "recognition"')
                          .defaultOrdering([{field: 'year', direction: 'desc'}]),
                      ),
                  ]),
              ),

            S.divider(),

            // ═══════════════════════════════════════════════════════════
            // INBOX (read-only)
            // ═══════════════════════════════════════════════════════════
            S.listItem()
              .title('Inbox')
              .icon(coloredIcon(EnvelopeIcon, INBOX_COLOR))
              .child(
                S.list()
                  .title('Inbox')
                  .items([
                    S.listItem()
                      .title('Inquiries (alle)')
                      .icon(EnvelopeIcon)
                      .child(
                        S.documentList()
                          .title('Alle inquiries')
                          .filter('_type == "inquiry"')
                          .defaultOrdering([{field: 'receivedAt', direction: 'desc'}]),
                      ),
                    S.listItem()
                      .title('Inquiries — nieuw')
                      .child(
                        S.documentList()
                          .title('Nieuwe inquiries')
                          .filter('_type == "inquiry" && status == "new"')
                          .defaultOrdering([{field: 'receivedAt', direction: 'desc'}]),
                      ),
                    S.listItem()
                      .title('Inquiries — in behandeling')
                      .child(
                        S.documentList()
                          .title('In behandeling')
                          .filter('_type == "inquiry" && status == "in-progress"')
                          .defaultOrdering([{field: 'receivedAt', direction: 'desc'}]),
                      ),
                    S.divider(),
                    S.listItem()
                      .title('Newsletter subscribers')
                      .child(
                        S.documentList()
                          .title('Subscribers (active)')
                          .filter('_type == "newsletterSubscription" && active == true')
                          .defaultOrdering([{field: 'subscribedAt', direction: 'desc'}]),
                      ),
                    S.listItem()
                      .title('Newsletter — Brevo failed')
                      .child(
                        S.documentList()
                          .title('Failed Brevo sync')
                          .filter('_type == "newsletterSubscription" && brevoSyncStatus == "failed"')
                          .defaultOrdering([{field: 'lastSyncAttemptAt', direction: 'desc'}]),
                      ),
                    S.divider(),
                    S.listItem()
                      .title('Form submissions (legacy template)')
                      .child(
                        S.documentList()
                          .title('Form submissions')
                          .filter('_type == "formSubmission"')
                          .defaultOrdering([{field: 'submittedAt', direction: 'desc'}]),
                      ),
                  ]),
              ),

            S.divider(),

            // ═══════════════════════════════════════════════════════════
            // SETTINGS
            // ═══════════════════════════════════════════════════════════
            S.listItem()
              .title('Settings')
              .icon(CogIcon)
              .child(
                S.list()
                  .title('Settings')
                  .items([
                    S.listItem()
                      .title('Site Settings')
                      .icon(CogIcon)
                      .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
                    S.listItem()
                      .title('Navigation')
                      .icon(MenuIcon)
                      .child(S.document().schemaType('navigation').documentId('navigation')),
                    S.listItem()
                      .title('Component Defaults')
                      .icon(ComponentIcon)
                      .child(S.document().schemaType('componentDefaults').documentId('componentDefaults')),
                  ]),
              ),
          ]),
    }),
    presentationTool({
      resolve: {locations},
      previewUrl: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:4321',
    }),
    visionTool(),
    media(),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    // Prevent create/delete for singleton types — they use fixed document IDs
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({action}) => action && !['create', 'delete', 'duplicate'].includes(action))
        : input,
    // Hide singletons from the global "new document" menu
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global'
        ? prev.filter(({templateId}) => !singletonTypes.has(templateId))
        : prev,
  },
})
