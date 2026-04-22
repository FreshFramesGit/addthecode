import type { APIRoute } from 'astro'
import { perspectiveCookieName } from '@sanity/preview-url-secret/constants'

/**
 * Draft-mode disable endpoint.
 *
 * Aangeroepen door de <DisableDraftMode> floating-button. Wist de
 * perspective-cookie en redirect terug naar de homepage. Daarna ziet
 * de bezoeker weer published content.
 */
export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(perspectiveCookieName, { path: '/' })
  return redirect('/', 307)
}
