import { defineType, defineArrayMember } from 'sanity'

/**
 * Page Builder array — drag-and-drop sections.
 *
 * Toegestane blocks voor alle pagina-singletons + case.content + essay heeft eigen body.
 *
 * Niet inbegrepen:
 * - heroCaseBlock + heroEssayBlock — geen pageBuilder-blocks; worden automatisch
 *   geprepended door Astro template uit case/essay-document velden.
 * - heroBlock (legacy template-default) — alleen voor backwards-compat behouden
 *   in registry, niet hier.
 *
 * Add the Code v1 — geen per-singleton whitelist (zie discovery/schema-decisions §12.1).
 */
export const pageBuilder = defineType({
  name: 'pageBuilder',
  title: 'Page sections',
  type: 'array',
  of: [
    // ─── Hero's ───
    defineArrayMember({ type: 'heroHomeBlock' }),
    defineArrayMember({ type: 'heroStandardBlock' }),

    // ─── Sections (algemeen) ───
    defineArrayMember({ type: 'pitchOpeningBlock' }),
    defineArrayMember({ type: 'serviceTriptychBlock' }),
    defineArrayMember({ type: 'quoteClusterBlock' }),
    defineArrayMember({ type: 'heritageStripBlock' }),
    defineArrayMember({ type: 'projectGridBlock' }),
    defineArrayMember({ type: 'essayGridBlock' }),
    defineArrayMember({ type: 'teamGridBlock' }),
    defineArrayMember({ type: 'timelineBlock' }),
    defineArrayMember({ type: 'principlesBlock' }),

    // ─── Case-detail blocks ───
    defineArrayMember({ type: 'decisionBlock' }),
    defineArrayMember({ type: 'phaseBlock' }),
    defineArrayMember({ type: 'metaBlock' }),
    defineArrayMember({ type: 'artifactGalleryBlock' }),
    defineArrayMember({ type: 'metricsStripBlock' }),
    defineArrayMember({ type: 'nextCaseBlock' }),
    defineArrayMember({ type: 'ndaExplainerBlock' }),

    // ─── Forms + utility ───
    defineArrayMember({ type: 'contactFormBlock' }),
    defineArrayMember({ type: 'newsletterFormBlock' }),
    defineArrayMember({ type: 'faqBlock' }),
    defineArrayMember({ type: 'directChannelsBlock' }),
    defineArrayMember({ type: 'expectationStepsBlock' }),
    defineArrayMember({ type: 'calloutBlock' }),
    defineArrayMember({ type: 'tagStripBlock' }),
    defineArrayMember({ type: 'preClaimBlock' }),

    // ─── CTA-refrein (sitebreed) ───
    defineArrayMember({ type: 'ctaRefreinBlock' }),

    // ─── Legacy template blocks (backwards-compat) ───
    defineArrayMember({ type: 'heroBlock' }),
    defineArrayMember({ type: 'textBlock' }),
    defineArrayMember({ type: 'imageBlock' }),
    defineArrayMember({ type: 'ctaBlock' }),
    defineArrayMember({ type: 'contactBlock' }),
  ],
})
