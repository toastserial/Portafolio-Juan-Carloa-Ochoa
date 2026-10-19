import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent, PointerEvent } from 'react'
import { projects } from '../data/projects'
import { playClick } from '../lib/soundEffects'
import type { Locale, Project } from '../types/content'
import { ProjectGallery3D } from '../components/projects/ProjectGallery3D'
import { projectFootage } from '../data/projectMedia'

const organizations: Record<string, Record<Locale, string>> = {
  autolote: { es: 'Universidad Católica de Honduras', en: 'Catholic University of Honduras' },
  'commerce-concept': { es: 'Universidad Católica de Honduras', en: 'Catholic University of Honduras' },
  cendo: { es: 'Aeropuerto Internacional Palmerola', en: 'Palmerola International Airport' },
  skycontrol: { es: 'Aeropuerto Internacional Palmerola', en: 'Palmerola International Airport' },
  'multilingual-invoice-automation': { es: 'Life Couriers', en: 'Life Couriers' },
  radiopharma: { es: 'Life Couriers', en: 'Life Couriers' },
  'power-bi-operational-dashboards': { es: 'Life Couriers', en: 'Life Couriers' },
}
const projectNavigationIds = ['autolote', 'commerce-concept', 'cendo', 'skycontrol', 'multilingual-invoice-automation', 'radiopharma', 'power-bi-operational-dashboards', 'portfolio']
const projectNavigationOrder = projectNavigationIds
  .map((id) => projects.find((item) => item.id === id))
  .filter((item): item is Project => item !== undefined)
  .concat(projects.filter((item) => !projectNavigationIds.includes(item.id)))

function ProjectHero({ locale, project }: { locale: Locale; project: Project }) {
  const image = project.images?.[0] ?? project.image
  if (image && /\.(mp4|webm)$/i.test(image)) {
    return <video aria-hidden="true" autoPlay className="project-detail-hero-media" loop muted playsInline preload="metadata" src={image} />
  }
  if (image) {
    return (
      <div className={`project-detail-hero-image${project.id === 'radiopharma' ? ' is-sensitive' : ''}`}>
        <img alt={`${project.title[locale]} ${locale === 'es' ? 'captura de pantalla' : 'screenshot'}`} className="project-detail-hero-media" src={image} />
      </div>
    )
  }

  return (
    <div aria-label={locale === 'es' ? 'Vista conceptual de tienda tecnológica' : 'Technology store concept'} className="project-detail-concept" role="img">
      <span>PRODUCT / CART / CHECKOUT</span>
      <div className="project-detail-concept-card"><i /><i /><i /><strong>PHP + PayPal Sandbox</strong></div>
      <small>{locale === 'es' ? 'Flujo de compra simulado' : 'Simulated purchase flow'}</small>
    </div>
  )
}

function ProjectNavigationCard({ direction, locale, onNavigate, project, reduceMotion }: {
  direction: 'previous' | 'next'
  locale: Locale
  onNavigate: (href: string) => (event: MouseEvent<HTMLAnchorElement>) => void
  project: Project
  reduceMotion: boolean
}) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const image = project.images?.[0] ?? project.image
  const stillImage = image && !/\.(mp4|webm)$/i.test(image) ? image : undefined
  const footage = projectFootage[project.id]
  const showVideo = Boolean(footage && !reduceMotion && isNearViewport && !videoFailed)
  const href = `/${locale}/projects/${project.id}`
  const isPrevious = direction === 'previous'

  useEffect(() => {
    const card = cardRef.current
    if (!card || !footage || reduceMotion) return
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
      if (entry.isIntersecting) setIsNearViewport(true)
    }, { rootMargin: '180px 0px' })
    observer.observe(card)
    return () => observer.disconnect()
  }, [footage, reduceMotion])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isVisible) void video.play().catch(() => undefined)
    else video.pause()
  }, [isNearViewport, isVisible])

  return (
    <a className="project-detail-project-card" href={href} onClick={onNavigate(href)} ref={cardRef}>
      {stillImage
        ? <img alt="" className={`project-detail-project-card-media project-detail-project-card-fallback${isPlaying ? ' is-playing' : ''}`} loading="lazy" src={stillImage} />
        : <div aria-hidden="true" className="project-detail-project-card-placeholder" />}
      {showVideo && (
        <video
          aria-hidden="true"
          autoPlay
          className={`project-detail-project-card-media project-detail-project-card-video${isPlaying ? ' is-playing' : ''}`}
          loop
          muted
          playsInline
          preload={isVisible ? 'auto' : 'metadata'}
          ref={videoRef}
          src={footage}
          onPlaying={() => setIsPlaying(true)}
          onError={() => {
            setIsPlaying(false)
            setVideoFailed(true)
          }}
        />
      )}
      <span className="project-detail-project-card-shade" />
      <span className="project-detail-project-card-copy">
        <span>{isPrevious ? (locale === 'es' ? 'PROYECTO ANTERIOR' : 'PREVIOUS PROJECT') : (locale === 'es' ? 'SIGUIENTE PROYECTO' : 'NEXT PROJECT')}</span>
        <strong>{project.title[locale]}</strong>
        <span className="project-detail-project-card-arrow" aria-hidden="true">{isPrevious ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}</span>
      </span>
    </a>
  )
}

export function ProjectDetailPage({ locale, onNavigate, projectId }: { locale: Locale; onNavigate: (href: string) => void; projectId: string }) {
  const es = locale === 'es'
  const reduceMotion = Boolean(useReducedMotion())
  const project = projects.find((item) => item.id === projectId)
  const projectIndex = projectNavigationOrder.findIndex((item) => item.id === projectId)
  const projectPreviews = useMemo<Project[]>(() => {
    if (!project) return []
    const screenshots = (project.images?.length ? project.images : project.image ? [project.image] : [])
      .filter((image): image is string => Boolean(image) && !/\.(mp4|webm)$/i.test(image))
    return screenshots.map((image) => ({
      ...project,
      image,
    }))
  }, [project])
  const [selectedScreenIndex, setSelectedScreenIndex] = useState(0)
  const activeScreenIndex = Math.min(selectedScreenIndex, Math.max(projectPreviews.length - 1, 0))
  const previousProject = projectNavigationOrder[(projectIndex - 1 + projectNavigationOrder.length) % projectNavigationOrder.length]
  const nextProject = projectNavigationOrder[(projectIndex + 1) % projectNavigationOrder.length]

  useEffect(() => {
    setSelectedScreenIndex(0)
  }, [projectId])

  const navigateTo = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    playClick()
    onNavigate(href)
  }

  const handleHeroPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || reduceMotion) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width))
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height))
    const style = event.currentTarget.style
    style.setProperty('--project-tilt-x', `${((0.5 - y) * 2.4).toFixed(2)}deg`)
    style.setProperty('--project-tilt-y', `${((x - 0.5) * 3.2).toFixed(2)}deg`)
    style.setProperty('--project-shift-x', `${((0.5 - x) * 12).toFixed(1)}px`)
    style.setProperty('--project-shift-y', `${((0.5 - y) * 9).toFixed(1)}px`)
    style.setProperty('--project-copy-x', `${((x - 0.5) * -4).toFixed(1)}px`)
    style.setProperty('--project-copy-y', `${((y - 0.5) * -4).toFixed(1)}px`)
  }

  const resetHeroPointer = (event: PointerEvent<HTMLElement>) => {
    const style = event.currentTarget.style
    style.setProperty('--project-tilt-x', '0deg')
    style.setProperty('--project-tilt-y', '0deg')
    style.setProperty('--project-shift-x', '0px')
    style.setProperty('--project-shift-y', '0px')
    style.setProperty('--project-copy-x', '0px')
    style.setProperty('--project-copy-y', '0px')
  }

  if (!project) {
    return (
      <section className="project-detail-not-found">
        <p className="technical-label">404 / {es ? 'PROYECTO NO ENCONTRADO' : 'PROJECT NOT FOUND'}</p>
        <a href={`/${locale}/projects`} onClick={navigateTo('/' + locale + '/projects')}><ArrowLeft aria-hidden="true" size={16} /> {es ? 'Volver a proyectos' : 'Back to projects'}</a>
      </section>
    )
  }

  const organization = organizations[project.id]?.[locale] ?? (es ? 'Proyecto' : 'Project')
  const projectInsights = [
    project.outcome && {
      label: es ? 'RESULTADO' : 'OUTCOME',
      text: project.outcome[locale],
    },
    project.learning && {
      label: es ? 'APRENDIZAJE' : 'LESSON',
      text: project.learning[locale],
    },
    project.nextSteps && {
      label: es ? 'SIGUIENTE PASO' : 'NEXT STEP',
      text: project.nextSteps[locale],
    },
  ].filter((item): item is { label: string; text: string } => Boolean(item))

  return (
    <article className="project-detail-page">
      <section className="project-detail-hero" onPointerLeave={resetHeroPointer} onPointerMove={handleHeroPointerMove}>
        <div className="project-detail-hero-background"><ProjectHero locale={locale} project={project} /></div>
        {project.id === 'radiopharma' && reduceMotion && <div aria-hidden="true" className="project-image-safety-mask" />}
        <div aria-hidden="true" className="project-detail-hero-shade" />
        <div className="project-detail-hero-copy">
          <p className="technical-label">{es ? 'CASO DESTACADO' : 'PROJECT SHOWCASE'}</p>
          <h1>{project.title[locale]}</h1>
        </div>
      </section>

      <section className="project-detail-overview">
        <div className="project-detail-meta">
          <div className="project-detail-meta-client">
            <div><span>{es ? 'CLIENTE' : 'CLIENT'}</span><strong>{organization}</strong></div>
            {project.period && <div><span>{es ? 'PERIODO' : 'YEAR'}</span><strong>{project.period[locale]}</strong></div>}
          </div>
          <div><span>{es ? 'ROL Y ALCANCE' : 'ROLE & SCOPE'}</span><strong>{project.participation[locale]}</strong></div>
          <div className="project-detail-meta-technologies">
            <span>{es ? 'TECNOLOGÍAS' : 'TECH STACK'}</span>
            <div>{project.stack.map((technology) => <span key={technology}>{technology}</span>)}</div>
          </div>
          <div className="project-detail-meta-link">
            {project.demoUrl
              ? <a href={project.demoUrl} onClick={() => playClick()} rel="noopener noreferrer" target="_blank">{es ? 'VISITAR SITIO' : 'VISIT LIVE SITE'} <ExternalLink aria-hidden="true" size={15} /></a>
              : <><span>{es ? 'TIPO DE PROYECTO' : 'PROJECT TYPE'}</span><strong>{project.category[locale]}</strong></>}
          </div>
        </div>

        <div className="project-detail-narrative">
          <section className="project-detail-narrative-block">
            <p className="technical-label">{es ? 'PANORAMA Y VISIÓN' : 'OVERVIEW & VISION'}</p>
            <p>{project.problem[locale]}</p>
          </section>
          <section className="project-detail-narrative-block project-detail-implementation">
            <p className="technical-label">{es ? 'TECNOLOGÍA E IMPLEMENTACIÓN' : 'TECH & IMPLEMENTATION'}</p>
            <p>{project.solution[locale]}</p>
          </section>
        </div>

        {projectInsights.length > 0 && (
          <section className="project-detail-insights">
            <header className="project-detail-insights-heading">
              <p className="technical-label">{es ? 'IMPACTO Y APRENDIZAJES' : 'IMPACT & LESSONS'}</p>
              <h2>{es ? 'Lo que dejó el proyecto.' : 'What the project left behind.'}</h2>
            </header>
            <div className="project-detail-insight-grid">
              {projectInsights.map((item, index) => (
                <article className="project-detail-insight" key={item.label}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p className="technical-label">{item.label}</p>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>

      {projectPreviews.length > 0 && (
        <section aria-label={es ? 'Previsualizaciones del proyecto' : 'Project previews'} className="project-detail-gallery-section project-detail-3d-section">
          <div className="project-detail-3d-stage">
            <ProjectGallery3D
              activeIndex={activeScreenIndex}
              fallback={projectPreviews[0]?.image
                ? <img alt="" loading="lazy" src={projectPreviews[0].image} />
                : null}
              locale={locale}
              onSelectProject={setSelectedScreenIndex}
              projects={projectPreviews}
            />
          </div>
        </section>
      )}

      <nav aria-label={es ? 'Otros proyectos' : 'More projects'} className="project-detail-project-nav">
        <ProjectNavigationCard direction="previous" key={previousProject.id} locale={locale} onNavigate={navigateTo} project={previousProject} reduceMotion={reduceMotion} />
        <ProjectNavigationCard direction="next" key={nextProject.id} locale={locale} onNavigate={navigateTo} project={nextProject} reduceMotion={reduceMotion} />
      </nav>
    </article>
  )
}
