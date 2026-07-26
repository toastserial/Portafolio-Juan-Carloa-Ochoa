import { PortfolioScenePlaceholder } from '../three/PortfolioScenePlaceholder'
import { ArrowDownRight, Clock3, Download, Mail, MapPin, Radio } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Reveal } from '../ui/Reveal'
import { AnimatedWords } from '../ui/AnimatedWords'
import { StaggeredText } from '../ui/StaggeredText'
import { TechParallaxLayers } from '../ui/TechParallaxLayers'
import type { Locale, WorkspaceMode } from '../../types/content'

interface HeroSectionProps {
  locale: Locale
}

export function HeroSection({ locale }: HeroSectionProps) {
  const isSpanish = locale === 'es'
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>('software')
  const [showAvailability, setShowAvailability] = useState(false)

  return (
    <section className="hero-shell" id="top">
      <TechParallaxLayers mode={workspaceMode} />
      <div className="page-shell hero-content grid min-h-[calc(100svh-4rem)] items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
        <div className="hero-availability">
          <button
            aria-expanded={showAvailability}
            className="availability-trigger"
            onClick={() => setShowAvailability((current) => !current)}
            type="button"
          >
            <span className="status-dot" />
            <span className="technical-label">
              {isSpanish ? 'Disponible para colaborar' : 'Available to collaborate'}
            </span>
          </button>
          <AnimatePresence>
            {showAvailability && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="availability-popover"
                exit={{ opacity: 0, y: -6 }}
                initial={{ opacity: 0, y: -6 }}
              >
                <p><MapPin aria-hidden="true" size={14} /> Honduras · UTC−6</p>
                <p><Radio aria-hidden="true" size={14} /> {isSpanish ? 'Remoto e híbrido' : 'Remote and hybrid'}</p>
                <p><Clock3 aria-hidden="true" size={14} /> {isSpanish ? 'Respuesta usual: menos de 24 h' : 'Usual reply: under 24h'}</p>
                <a href="#contact">{isSpanish ? 'Iniciar conversación' : 'Start a conversation'}</a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-6xl md:text-7xl xl:text-[5.6rem]">
          <StaggeredText>Juan Carlos</StaggeredText>
          <StaggeredText className="block text-muted">Ochoa Guzmán.</StaggeredText>
        </h1>
        <div className="hero-dynamic-line">
          <span>{isSpanish ? 'Construyo' : 'I build'}</span>
          <AnimatedWords
            words={
              isSpanish
                ? ['interfaces.', 'sistemas.', 'herramientas.', 'datos útiles.']
                : ['interfaces.', 'systems.', 'useful tools.', 'clear data.']
            }
          />
        </div>
        <p className="max-w-xl mt-4 text-base leading-7 text-muted">
          {isSpanish
            ? 'Full stack en Honduras. Diseño productos funcionales que convierten complejidad técnica en experiencias claras.'
            : 'Full-stack developer in Honduras. I design functional products that turn technical complexity into clear experiences.'}
        </p>
        <div
          aria-label={isSpanish ? 'Modo del workspace' : 'Workspace mode'}
          className="workspace-mode-switch"
        >
          {([
            ['data', isSpanish ? 'Datos' : 'Data'],
            ['automation', isSpanish ? 'Automatización' : 'Automation'],
            ['software', 'Software'],
          ] as Array<[WorkspaceMode, string]>).map(([mode, label], index) => (
            <button
              aria-pressed={workspaceMode === mode}
              key={mode}
              onClick={() => setWorkspaceMode(mode)}
              type="button"
            >
              <span>0{index + 1}</span>
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-9">
          <a className="button-primary" href="#work">
            {isSpanish ? 'Explorar trabajo' : 'Explore work'}
            <ArrowDownRight aria-hidden="true" size={17} />
          </a>
          <a className="button-secondary" href="#contact">
            <Mail aria-hidden="true" size={16} />
            {isSpanish ? 'Escribirme' : 'Email me'}
          </a>
          <a
            className="button-quiet"
            download
            href="/cv-juan-ochoa.pdf"
          >
            <Download aria-hidden="true" size={16} />
            CV
          </a>
        </div>
        </Reveal>
        <PortfolioScenePlaceholder
          label={
            isSpanish
              ? 'Figura coleccionable 3D de Juan Carlos Ochoa.'
              : '3D collectible figure of Juan Carlos Ochoa.'
          }
          locale={locale}
          mode={workspaceMode}
          onModeChange={setWorkspaceMode}
        />
      </div>
    </section>
  )
}
