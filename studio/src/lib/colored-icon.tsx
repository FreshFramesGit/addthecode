import { createElement, type ComponentType } from 'react'

/**
 * Wrap een @sanity/icons component in een container met data-attribuut.
 * CSS in studio-theme.css target [data-cms-icon] voor de kleur.
 */
export function coloredIcon(Icon: ComponentType, color: string) {
  function ColoredIcon() {
    return createElement(
      'span',
      {
        'data-cms-icon': '',
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          color,
        },
      },
      createElement(Icon),
    )
  }
  ColoredIcon.displayName = `Colored(${(Icon as any).displayName || 'Icon'})`
  return ColoredIcon
}
