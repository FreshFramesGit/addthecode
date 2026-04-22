import type { AstroCookies } from 'astro'
import { perspectiveCookieName } from '@sanity/preview-url-secret/constants'

/**
 * Reads the perspective-cookie from the request and returns the prop
 * shape that `loadQuery` accepts.
 *
 * - Visitors zonder cookie → published content, geen stega, geen token-gebruik
 * - Editors via Presentation Tool → cookie staat ge-set, drafts + stega
 *
 * Volgens https://www.sanity.io/docs/visual-editing/astro-visual-editing
 */
export function getDraftModeProps(cookies: AstroCookies) {
  return {
    perspectiveCookie: cookies.get(perspectiveCookieName)?.value ?? undefined,
  }
}
