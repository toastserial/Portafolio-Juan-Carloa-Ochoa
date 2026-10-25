import { useReducedMotion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { HeroVideoBackground } from '../ui/HeroVideoBackground'
import { SmudgeReveal } from '../effects/SmudgeReveal'
import { ScrollLyricsText } from '../effects/ScrollLyricsText'
import { Reveal } from '../ui/Reveal'
import { playClick, playHover } from '../../lib/soundEffects'
import type { Locale } from '../../types/content'

export function AboutSection({ locale }: { locale: Locale }) {
  const es = locale === 'es'
  const reduceMotion = useReducedMotion()
  const portraitRef = useRef<HTMLElement>(null)
  const curveRef = useRef<SVGPathElement>(null)
  const clipId = `about-portrait-clip-${useId().replaceAll(':', '')}`

  useEffect(() => {
    const section = portraitRef.current
    const path = curveRef.current
    if (!section || !path) return
    let frame = 0

    const drawCurve = () => {
      frame = 0
      const bounds = section.getBoundingClientRect()
      const progress = reduceMotion ? 1 : Math.min(1, Math.max(0, -bounds.top / (bounds.height * 0.5)))
      path.setAttribute(
        'd',
        `M 0,0 L 1,0 L 1,${0.85 + 0.15 * progress} Q 0.7,${0.95 + 0.05 * progress} 0.4,${0.95 + 0.05 * progress} Q 0.15,${0.9 + 0.1 * progress} 0,${0.8 + 0.2 * progress} Z`,
      )
    }
    const scheduleDraw = () => { if (!frame) frame = window.requestAnimationFrame(drawCurve) }

    drawCurve()
    window.addEventListener('scroll', scheduleDraw, { passive: true })
    window.addEventListener('resize', scheduleDraw)
    return () => {
      window.removeEventListener('scroll', scheduleDraw)
      window.removeEventListener('resize', scheduleDraw)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [reduceMotion])

  return (
    <>
      <svg aria-hidden="true" className="about-clip-definitions" height="0" width="0">
        <defs>
          <clipPath clipPathUnits="objectBoundingBox" id={clipId}>
            <path d="M 0,0 L 1,0 L 1,0.85 Q 0.7,0.95 0.4,0.95 Q 0.15,0.9 0,0.8 Z" ref={curveRef} />
          </clipPath>
        </defs>
      </svg>
      <section
        aria-label={es ? 'Retrato de Juan Carlos Ochoa' : 'Portrait of Juan Carlos Ochoa'}
        className="about-portrait-stage"
        id="about-portrait"
        ref={portraitRef}
        style={{ clipPath: `url(#${clipId})` }}
      >
        <HeroVideoBackground />
        <a className="about-mobile-cue" href="#about" onClick={playClick} onMouseEnter={playHover}>
          <span>{es ? 'DESLIZA PARA CONOCERME' : 'SCROLL TO MEET ME'}</span>
          <ArrowDown aria-hidden="true" size={15} />
        </a>
      </section>

      <section className="section-shell about-page" id="about">
        <div className="about-page-grid">
          <Reveal className="about-role-column">
            <p className="technical-label">{es ? 'PERFIL' : 'ABOUT'}</p>
            <SmudgeReveal
              className="about-role-smudge"
              label={es ? 'Pasa el cursor para descubrir mi enfoque' : 'Move the pointer to discover my approach'}
              revealed={<div className="about-role-type about-role-type-ink">{es ? <><span>ROMPO.</span><span>ARREGLO.</span><span>ERA <em>REFACTOR.</em></span></> : <><span>BREAK.</span><span>FIX.</span><span>CALL IT <em>REFACTOR.</em></span></>}</div>}
            >
              <h1 className="about-role-type">
                {es ? <><span>INGENIERO</span><span>EN CIENCIAS</span><span>DE LA <em>COMPUTACIÓN</em></span></> : <><span>COMPUTER</span><span>SCIENCE</span><span><em>ENGINEER</em></span></>}
              </h1>
            </SmudgeReveal>
          </Reveal>

          <Reveal className="about-copy about-page-copy" delay={0.1}>
            <p className="technical-label">{es ? 'CÓMO PIENSO EL TRABAJO' : 'HOW I APPROACH THE WORK'}</p>
            <h2>
              <ScrollLyricsText text={es ? 'Interfaces claras. Lógica que funciona.' : 'Clear interfaces. Reliable systems.'} />
            </h2>
            <p>
              {es
                ? 'Mi trabajo cruza frontend, backend y datos: conecto esas piezas para crear productos fáciles de usar y mantener.'
                : 'My work spans frontend, backend, and data. I connect those pieces into products that are easy to use and maintain.'}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
