import {defineLocations, type DocumentLocationResolvers} from 'sanity/presentation'

/** Helper: singleton → fixed URL */
function singletonLocation(title: string, href: string) {
  return defineLocations({
    message: `Used on ${title}`,
    locations: [{title, href}],
    tone: 'positive',
  })
}

/** Helper: slug-based document → dynamic URL */
function slugLocation(routePrefix: string) {
  return defineLocations({
    select: {title: 'title', slug: 'slug.current'},
    resolve: (doc) => ({
      locations: doc?.slug
        ? [{title: doc.title || 'Untitled', href: `${routePrefix}/${doc.slug}`}]
        : [],
    }),
  })
}

/** Helper: global document without its own page */
function globalLocation() {
  return defineLocations({
    message: 'This document is used on all pages',
    tone: 'caution',
  })
}

/**
 * Visual Editing — Presentation tool location-resolvers.
 *
 * Bevat alle Add the Code pagina-singletons, utility-pages en collections.
 * Toegevoegd 2026-04-21 (Phase 3 close-out): preview-routing voor de
 * volledige site, niet alleen template-defaults.
 */
export const locations: DocumentLocationResolvers = {
    // ─── Template singletons ─────────────────────────────
    homePage: singletonLocation('Home', '/'),
    notFoundPage: singletonLocation('404', '/404'),
    thankYouPage: singletonLocation('Thank you', '/thank-you'),

    // ─── Add the Code pagina-singletons ──────────────────
    workIndexPage: singletonLocation('Work (index)', '/work'),
    teamPage: singletonLocation('Team', '/team'),
    approachPage: singletonLocation('Approach', '/approach'),
    serviceDesignPage: singletonLocation('Service · Design', '/services/design'),
    serviceBuildPage: singletonLocation('Service · Build', '/services/build'),
    serviceAutomatePage: singletonLocation('Service · Automate', '/services/automate'),
    academyIndexPage: singletonLocation('Academy (index)', '/academy'),
    contactPage: singletonLocation('Contact', '/contact'),

    // ─── Add the Code utility singletons ─────────────────
    errorPage: singletonLocation('500 (server error)', '/500'),
    offlinePage: singletonLocation('Offline', '/offline'),

    // ─── Global documents ────────────────────────────────
    siteSettings: globalLocation(),
    navigation: globalLocation(),
    componentDefaults: globalLocation(),

    // ─── Slug-based collections ──────────────────────────
    page: slugLocation(''),
    case: slugLocation('/work'),
    essay: slugLocation('/academy'),
}
