import { lazy, Suspense, useRef } from 'react'
import { Reveal } from '../ui/Reveal'
import { SmudgeReveal } from '../effects/SmudgeReveal'
import { ScrollLyricsText } from '../effects/ScrollLyricsText'
import type { Locale } from '../../types/content'

const MarcusAureliusModel = lazy(() => import('../about/MarcusAureliusModel'))

export function PhilosophySection({ locale }: { locale: Locale }) {
  const es = locale === 'es'
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section className="section-shell philosophy-section" id="philosophy" ref={sectionRef}>
      <Reveal className="philosophy-heading">
        <p className="technical-label">{es ? 'MI FILOSOFÍA' : 'MY PHILOSOPHY'}</p>
      </Reveal>

      <SmudgeReveal
        className="philosophy-composition"
        label={es ? 'Mueve el cursor para revelar otra pregunta' : 'Move the pointer to reveal another question'}
        revealed={
          <div className="philosophy-grid philosophy-grid-ink">
            <div aria-hidden="true" className="philosophy-model-frame">
              <Suspense fallback={
                <div className="philosophy-model-chunk-fallback">
                  <span className="philosophy-model-loader-orbit" />
                </div>
              }>
                <MarcusAureliusModel containerRef={sectionRef} showGoggles />
              </Suspense>
            </div>
            <div className="philosophy-quote">
              <h2>{es ? '“¿QUÉ ESTAMOS DANDO POR HECHO?”' : '“WHAT ARE WE TAKING FOR GRANTED?”'}</h2>
            </div>
          </div>
        }
      >
        <div className="philosophy-grid">
          <div
            aria-label={es ? 'Modelo 3D de Marco Aurelio' : '3D model of Marcus Aurelius'}
            className="philosophy-model-frame"
            role="img"
          >
            <Suspense fallback={
              <div aria-hidden="true" className="philosophy-model-chunk-fallback">
                <span className="philosophy-model-loader-orbit" />
              </div>
            }>
              <MarcusAureliusModel containerRef={sectionRef} showGoggles={false} />
            </Suspense>
          </div>
          <div className="philosophy-quote">
            <h2>
              <ScrollLyricsText text={es ? '“UNA BUENA PREGUNTA CAMBIA LA SOLUCIÓN.”' : '“A BETTER QUESTION CHANGES THE SOLUTION.”'} />
            </h2>
          </div>
        </div>
      </SmudgeReveal>
    </section>
  )
}
