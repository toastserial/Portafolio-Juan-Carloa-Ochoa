import type Lenis from 'lenis'

type ScrollBoundaryHandler = (deltaY: number, lenis: Lenis | null) => boolean

let activeLenis: Lenis | null = null
let scrollBoundaryHandler: ScrollBoundaryHandler | null = null

export function setActiveLenis(instance: Lenis | null) {
  activeLenis = instance
}

export function setScrollBoundaryHandler(handler: ScrollBoundaryHandler | null) {
  scrollBoundaryHandler = handler
}

export function interceptScrollBoundary(deltaY: number) {
  return scrollBoundaryHandler?.(deltaY, activeLenis) ?? false
}

export function smoothScrollTo(target: number | string | HTMLElement, immediate = false) {
  if (activeLenis) {
    activeLenis.scrollTo(target, {
      lerp: 0.095,
      immediate,
      offset: typeof target === 'number' ? 0 : -64,
    })
    return
  }

  if (typeof target === 'number') {
    window.scrollTo({ behavior: immediate ? 'instant' : 'smooth', top: target })
    return
  }

  const element = typeof target === 'string'
    ? document.querySelector<HTMLElement>(target)
    : target
  element?.scrollIntoView({ behavior: 'smooth' })
}

export function getCurrentScrollPosition() {
  return activeLenis?.animatedScroll ?? window.scrollY
}
