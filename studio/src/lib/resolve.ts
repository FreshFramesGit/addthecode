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

export const locations: DocumentLocationResolvers = {
    // ─── Singletons ─────────────────────────────────────
    homePage: singletonLocation('Home', '/'),
    notFoundPage: singletonLocation('404', '/404'),
    thankYouPage: singletonLocation('Thank you', '/thank-you'),

    // ─── Global documents ────────────────────────────────
    siteSettings: globalLocation(),
    navigation: globalLocation(),
    componentDefaults: globalLocation(),

    // ─── Slug-based documents ────────────────────────────
    page: slugLocation(''),
}
