import { useIsPresentationTool } from '@sanity/visual-editing/react'

/**
 * Floating button die draft-mode uit zet, alleen zichtbaar wanneer
 * de bezoeker de site direct bekijkt (niet binnen de Studio iframe).
 *
 * Inside de Presentation Tool stuurt Studio zelf draft-mode aan, dus
 * dan is de button overbodig.
 *
 * Volgens https://www.sanity.io/docs/visual-editing/astro-visual-editing
 */
export default function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool()

  // null = nog aan het detecteren, true = inside Presentation Tool
  if (isPresentationTool !== false) return null

  return (
    <a
      href="/api/draft-mode/disable"
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 50,
        padding: '0.5rem 1rem',
        borderRadius: '9999px',
        backgroundColor: '#141413', // var(--atc-ink) — kan niet via CSS-var omdat Suisse niet in deze island geladen is
        color: '#faf9f5', // var(--atc-paper)
        fontFamily:
          "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace",
        fontSize: '0.75rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        boxShadow: '0 4px 16px rgba(20, 20, 19, 0.2)',
      }}
    >
      ◌ Verlaat draft mode
    </a>
  )
}
