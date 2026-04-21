// Schema Registry — Add the Code

// Blocks — Portable Text
import { blockContent } from './blocks/block-content'

// Blocks — Page Builder (template legacy, kept for backwards-compat)
import { heroBlock } from './blocks/hero-block'
import { textBlock } from './blocks/text-block'
import { imageBlock } from './blocks/image-block'
import { ctaBlock } from './blocks/cta-block'
import { contactBlock } from './blocks/contact-block'

// Blocks — Hero's (Add the Code)
import { heroHomeBlock } from './blocks/hero-home-block'
import { heroStandardBlock } from './blocks/hero-standard-block'
import { heroCaseBlock } from './blocks/hero-case-block'
import { heroEssayBlock } from './blocks/hero-essay-block'

// Blocks — Sections (Add the Code)
import { pitchOpeningBlock } from './blocks/pitch-opening-block'
import { serviceTriptychBlock } from './blocks/service-triptych-block'
import { quoteClusterBlock } from './blocks/quote-cluster-block'
import { ctaRefreinBlock } from './blocks/cta-refrein-block'
import { heritageStripBlock } from './blocks/heritage-strip-block'
import { projectGridBlock } from './blocks/project-grid-block'
import { essayGridBlock } from './blocks/essay-grid-block'
import { teamGridBlock } from './blocks/team-grid-block'
import { timelineBlock } from './blocks/timeline-block'
import { principlesBlock } from './blocks/principles-block'

// Blocks — Case-detail
import { decisionBlock } from './blocks/decision-block'
import { phaseBlock } from './blocks/phase-block'
import { metaBlock } from './blocks/meta-block'
import { artifactGalleryBlock } from './blocks/artifact-gallery-block'
import { metricsStripBlock } from './blocks/metrics-strip-block'
import { nextCaseBlock } from './blocks/next-case-block'
import { ndaExplainerBlock } from './blocks/nda-explainer-block'

// Blocks — Forms & utility
import { contactFormBlock } from './blocks/contact-form-block'
import { newsletterFormBlock } from './blocks/newsletter-form-block'
import { faqBlock } from './blocks/faq-block'
import { directChannelsBlock } from './blocks/direct-channels-block'
import { expectationStepsBlock } from './blocks/expectation-steps-block'
import { calloutBlock } from './blocks/callout-block'
import { tagStripBlock } from './blocks/tag-strip-block'
import { preClaimBlock } from './blocks/pre-claim-block'

// Objects (shared)
import { seo } from './objects/seo'
import { pageBuilder } from './objects/page-builder'
import { cmsLink } from './objects/cms-link'
import { period } from './objects/period'
import { metric } from './objects/metric'
import { quoteAttribution } from './objects/quote-attribution'

// Singletons (template — bestaand)
import { siteSettings } from './singletons/site-settings'
import { navigation } from './singletons/navigation'
import { homePage } from './singletons/home-page'
import { notFoundPage } from './singletons/not-found-page'
import { thankYouPage } from './singletons/thank-you-page'
import { componentDefaults } from './singletons/component-defaults'

// Singletons (Add the Code — utility pages)
import { errorPage } from './singletons/error-page'
import { offlinePage } from './singletons/offline-page'

// Singletons (Add the Code — pagina's)
import { workIndexPage } from './singletons/work-index-page'
import { teamPage } from './singletons/team-page'
import { approachPage } from './singletons/approach-page'
import { serviceDesignPage } from './singletons/service-design-page'
import { serviceBuildPage } from './singletons/service-build-page'
import { serviceAutomatePage } from './singletons/service-automate-page'
import { academyIndexPage } from './singletons/academy-index-page'
import { contactPage } from './singletons/contact-page'

// Documents (template — bestaand)
import { page } from './documents/page'
import { formSubmission } from './documents/form-submission'

// Documents (Add the Code — collections)
import { caseDocument } from './documents/case'
import { essayDocument } from './documents/essay'
import { teamMember } from './documents/team-member'
import { recognition } from './documents/recognition'
import { inquiry } from './documents/inquiry'
import { newsletterSubscription } from './documents/newsletter-subscription'

export const schemaTypes = [
  // ─── Portable Text ───
  blockContent,

  // ─── Blocks (legacy template) ───
  heroBlock,
  textBlock,
  imageBlock,
  ctaBlock,
  contactBlock,

  // ─── Blocks (Add the Code Hero's) ───
  heroHomeBlock,
  heroStandardBlock,
  heroCaseBlock,
  heroEssayBlock,

  // ─── Blocks (Add the Code Sections) ───
  pitchOpeningBlock,
  serviceTriptychBlock,
  quoteClusterBlock,
  ctaRefreinBlock,
  heritageStripBlock,
  projectGridBlock,
  essayGridBlock,
  teamGridBlock,
  timelineBlock,
  principlesBlock,

  // ─── Blocks (Case-detail) ───
  decisionBlock,
  phaseBlock,
  metaBlock,
  artifactGalleryBlock,
  metricsStripBlock,
  nextCaseBlock,
  ndaExplainerBlock,

  // ─── Blocks (Forms + utility) ───
  contactFormBlock,
  newsletterFormBlock,
  faqBlock,
  directChannelsBlock,
  expectationStepsBlock,
  calloutBlock,
  tagStripBlock,
  preClaimBlock,

  // ─── Objects ───
  seo,
  pageBuilder,
  cmsLink,
  period,
  metric,
  quoteAttribution,

  // ─── Singletons (template) ───
  siteSettings,
  navigation,
  homePage,
  notFoundPage,
  thankYouPage,
  componentDefaults,

  // ─── Singletons (Add the Code utility pages) ───
  errorPage,
  offlinePage,

  // ─── Singletons (Add the Code pagina's) ───
  workIndexPage,
  teamPage,
  approachPage,
  serviceDesignPage,
  serviceBuildPage,
  serviceAutomatePage,
  academyIndexPage,
  contactPage,

  // ─── Documents (template) ───
  page,
  formSubmission,

  // ─── Documents (Add the Code collections) ───
  caseDocument,
  essayDocument,
  teamMember,
  recognition,
  inquiry,
  newsletterSubscription,
]
