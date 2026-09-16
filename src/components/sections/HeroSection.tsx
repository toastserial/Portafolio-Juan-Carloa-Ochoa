import { ArrowDownRight, Clock3, Download, Mail, MapPin, Radio } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Reveal } from '../ui/Reveal'
import { AnimatedWords } from '../ui/AnimatedWords'
import { HeroVideoBackground } from '../ui/HeroVideoBackground'
import { StaggeredText } from '../ui/StaggeredText'
import type { Locale } from '../../types/content'

interface HeroSectionProps {
  locale: Locale
}

export function HeroSection({ locale }: HeroSectionProps) {
  const isSpanish = locale === 'es'
  const [showAvailability, setShowAvailability] = useState(false)

  return (
    <section className="hero-shell" id="top">
      <HeroVideoBackground />

      <div className="page-shell hero-content">
        <Reveal>
          <div className="hero-copy">
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

            <p className="hero-eyebrow">
              {isSpanish ? 'Datos · Automatización · Software' : 'Data · Automation · Software'}
            </p>

            <h1>
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

            <p className="hero-summary">
              {isSpanish
                ? 'Full stack en Honduras. Diseño productos funcionales que convierten complejidad técnica en experiencias claras.'
                : 'Full-stack developer in Honduras. I design functional products that turn technical complexity into clear experiences.'}
            </p>

            <div className="hero-actions">
              <a className="button-primary" href="#work">
                {isSpanish ? 'Explorar trabajo' : 'Explore work'}
                <ArrowDownRight aria-hidden="true" size={17} />
              </a>
              <a className="button-secondary" href="#contact">
                <Mail aria-hidden="true" size={16} />
                {isSpanish ? 'Escribirme' : 'Email me'}
              </a>
              <a className="button-quiet" download href="/cv-juan-ochoa.pdf">
                <Download aria-hidden="true" size={16} />
                CV
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      <div aria-hidden="true" className="hero-video-cue">
        <span>↔</span>
        {isSpanish ? 'Mueve el cursor' : 'Move your cursor'}
      </div>
    </section>
  )
}
