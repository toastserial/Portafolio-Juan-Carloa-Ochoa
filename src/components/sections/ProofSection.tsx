import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import { projects } from '../../data/projects'
import { playClick, playHover } from '../../lib/soundEffects'
import type { Locale, Project } from '../../types/content'
import { ScrollLyricsText } from '../effects/ScrollLyricsText'
import { Reveal } from '../ui/Reveal'

const proofProjects = [
  {
    id: 'autolote',
    organization: {
      es: 'Universidad Católica de Honduras',
      en: 'Catholic University of Honduras',
    },
  },
  {
    id: 'cendo',
    organization: {
      es: 'Aeropuerto Internacional Palmerola',
      en: 'Palmerola International Airport',
    },
  },
  {
    id: 'radiopharma',
    organization: {
      es: 'Life Couriers',
      en: 'Life Couriers',
    },
  },
] as const

interface ProofItem {
  project: Project
  organization: Record<Locale, string>
}

interface ProofSectionProps {
  locale: Locale
  onNavigate: (href: string) => void
}

export function ProofSection({ locale, onNavigate }: ProofSectionProps) {
  const es = locale === 'es'
  const reduceMotion = Boolean(useReducedMotion())
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const items = useMemo<ProofItem[]>(() => proofProjects
    .reduce<ProofItem[]>((result, { id, organization }) => {
      const project = projects.find((candidate) => candidate.id === id)
      if (project) result.push({
        project,
        organization: { es: organization.es, en: organization.en },
      })
      return result
    }, []), [])

  useEffect(() => {
    if (!isPlaying || reduceMotion || items.length < 2) return
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length)
    }, 5200)
    return () => window.clearInterval(timer)
  }, [isPlaying, items.length, reduceMotion])

  if (!items.length) return null

  const active = items[activeIndex]
  const select = (index: number) => {
    playClick()
    setActiveIndex(index)
    setIsPlaying(false)
  }
  const previous = () => select((activeIndex - 1 + items.length) % items.length)
  const next = () => select((activeIndex + 1) % items.length)
  const openProject = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    playClick()
    onNavigate(`/${locale}/projects/${active.project.id}`)
  }

  return (
    <section className="section-shell proof-section" id="proof">
      <Reveal className="proof-heading">
        <p className="technical-label">{es ? 'PRUEBA DE TRABAJO' : 'PROOF OF WORK'}</p>
        <h2>
          <ScrollLyricsText text={es ? 'Lo que el trabajo demuestra.' : 'What the work proves.'} />
        </h2>
      </Reveal>

      <div className="proof-layout">
        <div aria-label={es ? 'Seleccionar caso' : 'Select case study'} className="proof-dial" role="group">
          <button
            aria-label={isPlaying ? (es ? 'Pausar carrusel' : 'Pause carousel') : (es ? 'Reanudar carrusel' : 'Resume carousel')}
            className="proof-playback"
            onClick={() => { playClick(); setIsPlaying((current) => !current) }}
            onMouseEnter={playHover}
            type="button"
          >
            {isPlaying ? <Pause aria-hidden="true" size={16} /> : <Play aria-hidden="true" size={16} />}
          </button>

          {items.map((item, index) => {
            const previousIndex = (activeIndex - 1 + items.length) % items.length
            const position = index === activeIndex ? 'active' : index === previousIndex ? 'previous' : 'next'
            const image = item.project.images?.[0] ?? item.project.image
            return (
              <button
                aria-label={`${es ? 'Ver' : 'View'} ${item.project.title[locale]}`}
                aria-pressed={index === activeIndex}
                className={`proof-dial-node is-${position}`}
                key={item.project.id}
                onClick={() => select(index)}
                onMouseEnter={playHover}
                type="button"
              >
                {image && !/\.(mp4|webm)$/i.test(image)
                  ? <img alt="" loading="lazy" src={image} />
                  : <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>}
              </button>
            )
          })}
        </div>

        <div aria-live="polite" className="proof-story">
          <AnimatePresence mode="wait">
            <motion.article
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18 }}
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              key={active.project.id}
              transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="technical-label">{active.organization[locale]}</p>
              <h3>{active.project.title[locale]}</h3>
              <p className="proof-outcome">{active.project.outcome?.[locale] ?? active.project.solution[locale]}</p>
              {active.project.learning && (
                <p className="proof-learning"><span>{es ? 'APRENDIZAJE' : 'LESSON'}</span>{active.project.learning[locale]}</p>
              )}
              <a href={`/${locale}/projects/${active.project.id}`} onClick={openProject} onMouseEnter={playHover}>
                {es ? 'VER CASO' : 'VIEW CASE'} <ArrowUpRight aria-hidden="true" size={17} />
              </a>
            </motion.article>
          </AnimatePresence>

          <div className="proof-controls">
            <button aria-label={es ? 'Caso anterior' : 'Previous case'} onClick={previous} onMouseEnter={playHover} type="button"><ArrowLeft aria-hidden="true" size={18} /></button>
            <span>{String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
            <button aria-label={es ? 'Siguiente caso' : 'Next case'} onClick={next} onMouseEnter={playHover} type="button"><ArrowRight aria-hidden="true" size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  )
}
