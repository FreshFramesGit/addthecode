import type { ClientPerspective, QueryParams } from '@sanity/client'
import { sanityClient } from 'sanity:client'

const token =
  import.meta.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_READ_TOKEN

/**
 * Parses the perspective-cookie value. Sanity's Presentation Tool may
 * write either:
 *  - a simple string ("drafts" / "published")
 *  - a JSON-encoded array (Content Releases stack: ["release-foo", "drafts"])
 *
 * Returns undefined when the value is unparseable.
 */
function parsePerspective(
  raw: string | undefined,
): ClientPerspective | undefined {
  if (!raw) return undefined
  const decoded = decodeURIComponent(raw)
  if (decoded.startsWith('[')) {
    try {
      return JSON.parse(decoded) as ClientPerspective
    } catch {
      return undefined
    }
  }
  return decoded as ClientPerspective
}

/**
 * Cookie-driven loadQuery (Sanity best-practice).
 *
 * - Geen cookie → published, geen stega, geen token, snel + cacheable
 * - Cookie aanwezig → drafts/release perspective, stega-encoded strings
 *   voor de click-to-edit overlays, source-map voor field-tracing
 *
 * Volgens https://www.sanity.io/docs/visual-editing/astro-visual-editing
 */
export async function loadQuery<QueryResponse>({
  query,
  params,
  perspectiveCookie = undefined,
}: {
  query: string
  params?: QueryParams
  perspectiveCookie?: string | undefined
}) {
  const draftMode = perspectiveCookie ? true : false

  if (draftMode && !token) {
    throw new Error(
      'The `SANITY_API_READ_TOKEN` environment variable is required during Visual Editing.',
    )
  }

  const perspective: ClientPerspective = draftMode
    ? (parsePerspective(perspectiveCookie) ?? 'drafts')
    : 'published'

  const { result, resultSourceMap } = await sanityClient.fetch<QueryResponse>(
    query,
    params ?? {},
    {
      filterResponse: false,
      perspective,
      resultSourceMap: draftMode ? 'withKeyArraySelector' : false,
      stega: draftMode,
      ...(draftMode ? { token } : {}),
    },
  )

  return {
    data: result,
    sourceMap: resultSourceMap,
    perspective,
  }
}
