import type Lenis from 'lenis'

let activeLenis: Lenis | null = null

export function setActiveLenis(instance: Lenis | null) {
  activeLenis = instance
}

export function smoothScrollTo(target: number | string | HTMLElement) {
  if (activeLenis) {
    activeLenis.scrollTo(target, {
      lerp: 0.095,
      offset: typeof target === 'number' ? 0 : -64,
    })
    return
  }

  if (typeof target === 'number') {
    window.scrollTo({ behavior: 'smooth', top: target })
    return
  }

  const element = typeof target === 'string'
    ? document.querySelector<HTMLElement>(target)
    : target
  element?.scrollIntoView({ behavior: 'smooth' })
}
