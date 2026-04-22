import { useEffect, useMemo, useRef } from 'react'
import {
  VisualEditing,
  type HistoryAdapter,
  type HistoryUpdate,
} from '@sanity/visual-editing/react'
import { perspectiveCookieName } from '@sanity/preview-url-secret/constants'
import type { ClientPerspective } from '@sanity/client'

/**
 * Custom Visual Editing component voor Astro (zonder client-router).
 *
 * Doet drie dingen die `<VisualEditing />` van @sanity/astro niet doet:
 *  1. **History adapter** — synct browser-URL met Studio (Astro heeft geen
 *     SPA-router; we monkey-patchen pushState/replaceState + luisteren naar
 *     popstate/hashchange).
 *  2. **Perspective cookie sync** — schrijft de cookie wanneer editor in
 *     Studio van perspective wisselt (drafts ↔ released ↔ Content Releases),
 *     herlaadt daarna de pagina zodat de server met nieuwe perspective fetcht.
 *  3. **Refresh** — bij content-mutatie in Studio doen we full page-reload
 *     zodat alle SSR-data opnieuw uit Sanity komt.
 *
 * Volgens https://www.sanity.io/docs/visual-editing/astro-visual-editing
 */

function serializePerspective(perspective: ClientPerspective): string {
  return typeof perspective === 'string'
    ? perspective
    : JSON.stringify(perspective)
}

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

function setPerspectiveCookie(perspective: ClientPerspective): boolean {
  const next = serializePerspective(perspective)
  const current = getCookie(perspectiveCookieName)
  if (current === next) return false
  document.cookie = `${perspectiveCookieName}=${encodeURIComponent(
    next,
  )}; path=/; SameSite=None; Secure`
  return true
}

function currentUrl() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

function applyHistoryUpdate(
  update: Pick<HistoryUpdate, 'type' | 'url'>,
  currentHref: string,
) {
  switch (update.type) {
    case 'push':
      if (currentHref !== update.url) window.location.assign(update.url)
      return
    case 'replace':
      if (currentHref !== update.url) window.location.replace(update.url)
      return
    case 'pop':
      window.history.back()
      return
  }
}

export default function SanityVisualEditing() {
  type Navigate = Parameters<HistoryAdapter['subscribe']>[0]
  const navigateRef = useRef<Navigate | undefined>(undefined)
  const lastUrlRef = useRef('')

  useEffect(() => {
    const sync = () => {
      const url = currentUrl()
      if (url !== lastUrlRef.current) {
        lastUrlRef.current = url
        navigateRef.current?.({ type: 'push', title: document.title, url })
      }
    }

    sync()
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)

    const origPush = window.history.pushState
    const origReplace = window.history.replaceState
    window.history.pushState = function (...args) {
      origPush.apply(window.history, args)
      sync()
    }
    window.history.replaceState = function (...args) {
      origReplace.apply(window.history, args)
      sync()
    }

    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
      window.history.pushState = origPush
      window.history.replaceState = origReplace
    }
  }, [])

  const history = useMemo<HistoryAdapter>(
    () => ({
      subscribe: (navigate) => {
        navigateRef.current = navigate
        const url = currentUrl()
        lastUrlRef.current = url
        navigate({ type: 'push', title: document.title, url })
        return () => {
          if (navigateRef.current === navigate) {
            navigateRef.current = undefined
          }
        }
      },
      update: (update) => {
        applyHistoryUpdate(update, window.location.href)
      },
    }),
    [],
  )

  return (
    <VisualEditing
      history={history}
      portal={true}
      onPerspectiveChange={(perspective) => {
        if (setPerspectiveCookie(perspective)) {
          window.location.reload()
        }
      }}
      refresh={() => {
        return new Promise((resolve) => {
          window.location.reload()
          resolve()
        })
      }}
    />
  )
}
