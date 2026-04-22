import type { APIRoute } from 'astro'
import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { perspectiveCookieName } from '@sanity/preview-url-secret/constants'
import { sanityClient } from 'sanity:client'

/**
 * Draft-mode enable endpoint.
 *
 * Sanity's Presentation Tool roept dit aan met een one-time secret in de
 * URL. We valideren via `validatePreviewUrl` (verwacht een Viewer-token in
 * `SANITY_API_READ_TOKEN`), en zetten daarna de `perspectiveCookie` zodat
 * `loadQuery` drafts + stega ophaalt.
 *
 * Volgens https://www.sanity.io/docs/visual-editing/astro-visual-editing
 */
export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const token =
    import.meta.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_READ_TOKEN

  if (!token) {
    return new Response(
      'Server misconfigured: missing SANITY_API_READ_TOKEN',
      { status: 500 },
    )
  }

  const clientWithToken = sanityClient.withConfig({ token })
  const {
    isValid,
    redirectTo = '/',
    studioPreviewPerspective,
  } = await validatePreviewUrl(clientWithToken, request.url)

  if (!isValid) {
    return new Response('Invalid secret', { status: 401 })
  }

  cookies.set(perspectiveCookieName, studioPreviewPerspective ?? 'drafts', {
    httpOnly: false, // toegankelijk voor de SanityVisualEditing client component
    sameSite: 'none', // cross-origin (Studio iframe → frontend)
    secure: true, // verplicht bij sameSite=none
    path: '/',
  })

  return redirect(redirectTo, 307)
}
