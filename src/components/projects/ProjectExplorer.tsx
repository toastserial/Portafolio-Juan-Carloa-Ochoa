import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import type Lenis from 'lenis'
import type { Locale, Project } from '../../types/content'
import type { MotionValue } from 'framer-motion'
import { playClick } from '../../lib/soundEffects'
import { getCurrentScrollPosition, setScrollBoundaryHandler, smoothScrollTo } from '../../lib/smoothScroll'
import { projectFootage } from '../../data/projectMedia'

interface ProjectExplorerProps {
  locale: Locale
  onNavigate: (href: string) => void
  projects: Project[]
}

interface ProjectSlide {
  organization: Record<Locale, string>
  project: Project
}

const projectSlideOrder = [
  { organization: { es: 'Universidad Cat\u00f3lica de Honduras', en: 'Catholic University of Honduras' }, projectIds: ['autolote', 'commerce-concept'] },
  { organization: { es: 'Aeropuerto Internacional Palmerola', en: 'Palmerola International Airport' }, projectIds: ['cendo', 'skycontrol'] },
  { organization: { es: 'Life Couriers', en: 'Life Couriers' }, projectIds: ['multilingual-invoice-automation', 'radiopharma', 'power-bi-operational-dashboards'] },
] satisfies Array<{ organization: Record<Locale, string>; projectIds: string[] }>

function ProjectArtwork({ isPlaying, onPlaying, project, showPoster }: { isPlaying: boolean; onPlaying?: () => void; project: Project; showPoster?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const footage = projectFootage[project.id]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!isPlaying) {
      video.pause()
      video.removeAttribute('src')
      video.load()
      return
    }

    void video.play().catch(() => undefined)
  }, [footage, isPlaying])

  if (!footage) {
    return <img alt="" className="project-scene-video-fallback" src={project.image} />
  }

  return (
    <div className="project-scene-video-frame">
      {showPoster && project.image && <img alt="" aria-hidden="true" className="project-scene-video-poster" decoding="async" fetchPriority="high" loading="eager" src={project.image} />}
      <video
        aria-hidden="true"
        className="project-scene-video"
        disablePictureInPicture
        loop
        muted
        playsInline
        poster={showPoster ? project.image : undefined}
        onPlaying={onPlaying}
        preload="none"
        ref={videoRef}
        src={isPlaying ? footage : undefined}
        tabIndex={-1}
      />
    </div>
  )
}

function ProjectMediaLayer({ isBase, isNext, isPlaying, progress, project, reduceMotion, showPoster }: {
  isBase: boolean
  isNext: boolean
  isPlaying: boolean
  reduceMotion: boolean
  progress: MotionValue<number>
  project: Project
  showPoster: boolean
}) {
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    if (!isPlaying) setVideoReady(false)
  }, [isPlaying])

  const clip = useTransform(progress, (value) => {
    const edge = (1 - value) * 100
    const wave = Math.sin(Math.PI * value) * 3.5
    return `polygon(0% ${edge}%, 18% ${edge + wave}%, 42% ${edge - wave}%, 67% ${edge + wave * 0.7}%, 100% ${edge}%, 100% 100%, 0% 100%)`
  })

  return (
    <motion.div
      aria-hidden="true"
      className={`project-scene-media-layer${isBase ? ' is-base' : ''}${isNext ? ' is-next' : ''}`}
      style={{
        clipPath: isNext ? (videoReady || reduceMotion ? clip : 'inset(100% 0 0 0)') : 'none',
        visibility: isBase || isNext ? 'visible' : 'hidden',
        zIndex: isNext ? 2 : 0,
      }}
    >
      <ProjectArtwork isPlaying={isPlaying} onPlaying={isPlaying ? () => setVideoReady(true) : undefined} project={project} showPoster={showPoster} />
    </motion.div>
  )
}

export function ProjectExplorer({ locale, onNavigate, projects }: ProjectExplorerProps) {
  const es = locale === 'es'
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const [cursorVisible, setCursorVisible] = useState(false)
  const [nextVideoPlaying, setNextVideoPlaying] = useState(false)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const cursorX = useSpring(pointerX, { damping: 32, mass: 0.04, stiffness: 1400 })
  const cursorY = useSpring(pointerY, { damping: 32, mass: 0.04, stiffness: 1400 })
  const slides = useMemo<ProjectSlide[]>(() => {
    const byId = new Map(projects.map((project) => [project.id, project]))
    return projectSlideOrder.flatMap((group) => group.projectIds.flatMap((id) => {
      const project = byId.get(id)
      return project ? [{ organization: group.organization, project }] : []
    }))
  }, [projects])

  const [transitionIndex, setTransitionIndex] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const revealProgress = useMotionValue(0)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const scrollPosition = useTransform(scrollYProgress, [0, 1], [0, Math.max(0, slides.length - 1)])
  const currentSlide = slides[activeIndex]
  const activeProject = currentSlide?.project

  useEffect(() => {
    const handleGlobalPointerMove = (event: globalThis.PointerEvent) => {
      const scene = sceneRef.current
      if (!scene || event.pointerType !== 'mouse') {
        setCursorVisible(false)
        return
      }

      const bounds = scene.getBoundingClientRect()
      const insideScene = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom
      const target = event.target
      if (!insideScene || (target instanceof Element && target.closest('.portfolio-header, .project-scene-navigation'))) {
        setCursorVisible(false)
        return
      }

      pointerX.set(Math.max(48, Math.min(event.clientX - bounds.left, bounds.width - 48)))
      pointerY.set(Math.max(48, Math.min(event.clientY - bounds.top, bounds.height - 48)))
      setCursorVisible(true)
    }
    const hideCursor = () => setCursorVisible(false)
    const handlePointerOut = (event: globalThis.PointerEvent) => {
      if (!event.relatedTarget) hideCursor()
    }

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true })
    window.addEventListener('blur', hideCursor)
    document.addEventListener('pointerout', handlePointerOut)
    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove)
      window.removeEventListener('blur', hideCursor)
      document.removeEventListener('pointerout', handlePointerOut)
    }
  }, [pointerX, pointerY])

  useMotionValueEvent(scrollPosition, 'change', (position) => {
    const bounded = Math.max(0, Math.min(position, slides.length - 1))
    const segment = Math.min(Math.floor(bounded), Math.max(slides.length - 2, 0))
    const localProgress = slides.length < 2 || bounded >= slides.length - 1 ? 1 : bounded - segment
    revealProgress.set(reduceMotion ? (localProgress >= 0.5 ? 1 : 0) : localProgress)
    const shouldPlayNext = !reduceMotion && localProgress > 0.18
    setNextVideoPlaying(shouldPlayNext)
    setTransitionIndex(segment)
    setActiveIndex(localProgress >= 0.5 ? Math.min(segment + 1, slides.length - 1) : segment)
  })

  useEffect(() => {
    const baseIndex = Math.min(transitionIndex, Math.max(slides.length - 2, 0))
    const value = Math.max(0, Math.min(scrollPosition.get(), slides.length - 1))
    const progress = slides.length < 2 || value >= slides.length - 1 ? 1 : value - baseIndex
    revealProgress.set(reduceMotion ? (progress >= 0.5 ? 1 : 0) : progress)
    const shouldPlayNext = !reduceMotion && progress > 0.18
    setNextVideoPlaying(shouldPlayNext)
    setActiveIndex(progress >= 0.5 ? Math.min(baseIndex + 1, slides.length - 1) : baseIndex)
  }, [reduceMotion, revealProgress, scrollPosition, slides.length, transitionIndex])

  const scrollToProject = useCallback((index: number, withSound = true, immediate = false) => {
    const section = sectionRef.current
    if (!section || slides.length < 2) return
    const sectionTop = section.getBoundingClientRect().top + getCurrentScrollPosition()
    const scrollableDistance = Math.max(0, section.offsetHeight - window.innerHeight)
    const wrappedIndex = (index + slides.length) % slides.length
    const top = sectionTop + (wrappedIndex / (slides.length - 1)) * scrollableDistance
    if (withSound) playClick()
    smoothScrollTo(top, reduceMotion || immediate)
  }, [reduceMotion, slides.length])

  useEffect(() => {
    const handleScrollBoundary = (deltaY: number, lenis: Lenis | null) => {
      if (deltaY <= 0) return false
      const section = sectionRef.current
      if (!section || slides.length < 2) return false

      const currentScroll = lenis?.animatedScroll ?? window.scrollY
      const targetScroll = lenis?.targetScroll ?? currentScroll
      const sectionTop = section.getBoundingClientRect().top + currentScroll
      const trackEnd = sectionTop + section.offsetHeight - window.innerHeight
      const projectedScroll = targetScroll + deltaY
      if (Math.max(currentScroll, targetScroll, projectedScroll) < trackEnd - 1) return false

      scrollToProject(0, false, true)
      return true
    }

    setScrollBoundaryHandler(handleScrollBoundary)
    return () => setScrollBoundaryHandler(null)
  }, [scrollToProject, slides.length])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('a,button')) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      const wrapped = activeIndex === slides.length - 1
      scrollToProject(wrapped ? 0 : activeIndex + 1, true, wrapped)
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      const wrapped = activeIndex === 0
      scrollToProject(wrapped ? slides.length - 1 : activeIndex - 1, true, wrapped)
    }
  }

  const openCaseStudy = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (!activeProject) return
    playClick()
    onNavigate('/' + locale + '/projects/' + activeProject.id)
  }

  if (!activeProject || !currentSlide) return null

  return (
    <div
      aria-label={es ? 'Proyectos de Juan Carlos Ochoa' : 'Juan Carlos Ochoa projects'}
      className="project-scroll-track"
      ref={sectionRef}
      style={{ height: `${Math.max(slides.length, 1) * 100}svh` }}
    >
      <div className="project-scene" onKeyDown={handleKeyDown} ref={sceneRef} role="region" tabIndex={0}>
        {slides.map((slide, index) => {
          const isBase = index === transitionIndex
          const isNext = index === transitionIndex + 1
          const isPlaying = reduceMotion !== true && (isBase || (isNext && nextVideoPlaying))
          const showPoster = (isBase || isNext) && (slide.project.id === slides[0]?.project.id || reduceMotion === true)
          return (
            <ProjectMediaLayer
              isBase={isBase}
              isNext={isNext}
              isPlaying={isPlaying}
              key={slide.project.id}
              progress={revealProgress}
              project={slide.project}
              reduceMotion={Boolean(reduceMotion)}
              showPoster={showPoster}
            />
          )
        })}
        <div aria-hidden="true" className="project-scene-shade" />

        <motion.a
          aria-label={(es ? 'Ver caso de estudio: ' : 'View case study: ') + activeProject.title[locale]}
          animate={{ opacity: cursorVisible ? 1 : 0, scale: cursorVisible ? 1 : 0.68 }}
          className="project-scene-view"
          data-visible={cursorVisible ? 'true' : 'false'}
          href={`/${locale}/projects/${activeProject.id}`}
          initial={false}
          onBlur={() => setCursorVisible(false)}
          onClick={openCaseStudy}
          onFocus={(event) => {
            if (event.currentTarget.matches(':focus-visible')) {
              const bounds = sceneRef.current?.getBoundingClientRect()
              if (bounds) {
                pointerX.set(bounds.width / 2)
                pointerY.set(bounds.height / 2)
              }
            }
            setCursorVisible(true)
          }}
          style={{ x: reduceMotion ? pointerX : cursorX, y: reduceMotion ? pointerY : cursorY }}
          transformTemplate={(_, generatedTransform) => `translate(-50%, -50%) ${generatedTransform}`}
          transition={reduceMotion ? { duration: 0 } : { opacity: { duration: 0.16, ease: 'easeOut' }, scale: { type: 'spring', stiffness: 520, damping: 26, mass: 0.48 } }}
          whileHover={reduceMotion ? undefined : { scale: 1.06 }}
          whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        >
          <span>{es ? 'VER' : 'VIEW'}</span>
          <ArrowUpRight aria-hidden="true" size={16} />
        </motion.a>

        <p className="project-scene-organization">{currentSlide.organization[locale]}</p>
        <div className="project-scene-copy" key={activeProject.id}>
          <AnimatePresence initial={false} mode="wait">
            <motion.div animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }} exit={reduceMotion ? undefined : { opacity: 0, y: -14 }} initial={reduceMotion ? false : { opacity: 0, y: 18, clipPath: 'inset(0 0 100% 0)' }} key={activeProject.id} transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}>
              <h2>{activeProject.title[locale]}</h2>
              <p className="project-scene-description">{activeProject.solution[locale]}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div aria-live="polite" className="project-scene-counter">
          <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
          <span>/ {String(slides.length).padStart(2, '0')}</span>
        </div>
        <p className="project-scene-scroll-hint">{es ? '( DESLIZA PARA EXPLORAR )' : '( SCROLL TO EXPLORE )'}</p>
        <div className="project-scene-navigation">
          <button aria-label={es ? 'Proyecto anterior' : 'Previous project'} onClick={() => {
            const wrapped = activeIndex === 0
            scrollToProject(wrapped ? slides.length - 1 : activeIndex - 1, true, wrapped)
          }} type="button">
            <ArrowLeft aria-hidden="true" size={19} />
          </button>
          <button aria-label={es ? 'Siguiente proyecto' : 'Next project'} onClick={() => {
            const wrapped = activeIndex === slides.length - 1
            scrollToProject(wrapped ? 0 : activeIndex + 1, true, wrapped)
          }} type="button">
            <ArrowRight aria-hidden="true" size={19} />
          </button>
        </div>
      </div>
    </div>
  )
}
