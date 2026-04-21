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
  DatabaseIcon,
  CloseCircleIcon,
  CheckmarkCircleIcon,
  WarningOutlineIcon,
} from '@sanity/icons'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './src/schemaTypes'
import {coloredIcon} from './src/lib/colored-icon'
import {locations} from './src/lib/resolve'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'PLACEHOLDER'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

/** Accent color for CMS pages */
const CMS_COLOR = '#c4afff'

/** Singleton types — fixed document IDs, hidden from generic lists */
const singletonTypes = new Set([
  'siteSettings',
  'navigation',
  'homePage',
  'notFoundPage',
  'thankYouPage',
  'componentDefaults',
])

/** Types hidden from the auto-generated list */
const hiddenFromGenericList = new Set([
  ...singletonTypes,
  'formSubmission',
  'page',
])

export default defineConfig({
  name: 'my-studio',
  title: 'My Studio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // ─── Settings ───
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
                      .icon(CogIcon)
                      .child(S.document().schemaType('componentDefaults').documentId('componentDefaults')),
                  ]),
              ),

            S.divider(),

            // ─── Pages (static — singletons) ───
            S.listItem()
              .title('Pages')
              .icon(DocumentIcon)
              .child(
                S.list()
                  .title('Pages')
                  .items([
                    S.listItem()
                      .title('Home')
                      .icon(HomeIcon)
                      .child(S.document().schemaType('homePage').documentId('homePage')),

                    S.divider(),

                    S.listItem()
                      .title('Free pages')
                      .icon(DocumentIcon)
                      .child(
                        S.documentList()
                          .title('Free pages')
                          .filter('_type == "page"')
                          .defaultOrdering([{field: 'title', direction: 'asc'}]),
                      ),
                  ]),
              ),

            // ─── Utility pages ───
            S.listItem()
              .title('Utility pages')
              .icon(WarningOutlineIcon)
              .child(
                S.list()
                  .title('Utility pages')
                  .items([
                    S.listItem()
                      .title('404')
                      .icon(CloseCircleIcon)
                      .child(S.document().schemaType('notFoundPage').documentId('notFoundPage')),
                    S.listItem()
                      .title('Thank you')
                      .icon(CheckmarkCircleIcon)
                      .child(S.document().schemaType('thankYouPage').documentId('thankYouPage')),
                  ]),
              ),

            // ─── CMS pages (dynamic — #c4afff accent) ───
            S.listItem()
              .title('CMS pages')
              .icon(coloredIcon(DatabaseIcon, CMS_COLOR))
              .child(
                S.list()
                  .title('CMS pages')
                  .items([
                    // Add project-specific CMS types here
                  ]),
              ),

            S.divider(),

            // ─── Inbox ───
            S.listItem()
              .title('Inbox')
              .icon(EnvelopeIcon)
              .child(
                S.documentList()
                  .title('Inbox')
                  .filter('_type == "formSubmission"')
                  .defaultOrdering([{field: 'submittedAt', direction: 'desc'}])
                  .menuItems([
                    S.orderingMenuItem({name: 'submittedAtDesc', title: 'Newest first', by: [{field: 'submittedAt', direction: 'desc'}]}),
                    S.orderingMenuItem({name: 'statusAsc', title: 'Status', by: [{field: 'status', direction: 'asc'}]}),
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
