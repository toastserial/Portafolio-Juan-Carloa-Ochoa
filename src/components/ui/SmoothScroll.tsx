import Lenis from 'lenis'
import { useEffect } from 'react'
import 'lenis/dist/lenis.css'
import { setActiveLenis } from '../../lib/smoothScroll'

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      anchors: {
        lerp: 0.095,
        offset: -64,
      },
      autoRaf: true,
      lerp: 0.095,
      overscroll: true,
      prevent: (node) =>
        Boolean(node.closest('.nav-panel, .project-modal, .command-list')),
      respectReducedMotion: true,
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
    })

    setActiveLenis(lenis)

    return () => {
      setActiveLenis(null)
      lenis.destroy()
    }
  }, [])

  return null
}
