// Schema Registry

// Blocks — Portable Text
import { blockContent } from './blocks/block-content'

// Blocks — Page Builder
import { heroBlock } from './blocks/hero-block'
import { textBlock } from './blocks/text-block'
import { imageBlock } from './blocks/image-block'
import { ctaBlock } from './blocks/cta-block'
import { contactBlock } from './blocks/contact-block'

// Objects
import { seo } from './objects/seo'
import { pageBuilder } from './objects/page-builder'
import { cmsLink } from './objects/cms-link'

// Singletons
import { siteSettings } from './singletons/site-settings'
import { navigation } from './singletons/navigation'
import { homePage } from './singletons/home-page'
import { notFoundPage } from './singletons/not-found-page'
import { thankYouPage } from './singletons/thank-you-page'
import { componentDefaults } from './singletons/component-defaults'

// Documents
import { page } from './documents/page'
import { formSubmission } from './documents/form-submission'

export const schemaTypes = [
  // Blocks — Portable Text
  blockContent,

  // Blocks — Page Builder
  heroBlock,
  textBlock,
  imageBlock,
  ctaBlock,
  contactBlock,

  // Objects
  seo,
  pageBuilder,
  cmsLink,

  // Singletons
  siteSettings,
  navigation,
  homePage,
  notFoundPage,
  thankYouPage,
  componentDefaults,

  // Documents
  page,
  formSubmission,
]
