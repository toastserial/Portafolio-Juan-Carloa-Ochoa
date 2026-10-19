import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { ArrowDownRight, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { experience } from '../../data/experience'
import type { Locale } from '../../types/content'
import { Reveal } from '../ui/Reveal'
import { ScrollLyricsText } from '../effects/ScrollLyricsText'
import { SmudgeReveal } from '../effects/SmudgeReveal'

interface WorkExperienceSectionProps {
  locale: Locale
}

function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-HN' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

function ExperienceArtifact({ id }: { id: string }) {
  if (id === 'data-analyst-life-couriers') {
    return (
      <svg aria-hidden="true" className="experience-artifact experience-artifact-data" viewBox="0 0 320 190">
        <path d="M28 151H292M28 104H292M28 57H292" />
        <rect className="artifact-bar" x="55" y="111" width="32" height="40" rx="3" />
        <rect className="artifact-bar" x="112" y="83" width="32" height="68" rx="3" />
        <rect className="artifact-bar" x="169" y="63" width="32" height="88" rx="3" />
        <rect className="artifact-bar" x="226" y="39" width="32" height="112" rx="3" />
        <path className="artifact-trend" d="m48 99 65-23 57-13 67-29" />
        <circle className="artifact-point" cx="237" cy="34" r="5" />
      </svg>
    )
  }
  if (id === 'software-developer-life-couriers') {
    return (
      <svg aria-hidden="true" className="experience-artifact experience-artifact-systems" viewBox="0 0 320 190">
        <path d="M89 95h55m33 0h55" />
        <rect className="artifact-system-node" x="28" y="63" width="61" height="64" rx="6" />
        <rect className="artifact-system-node artifact-system-node-main" x="144" y="49" width="68" height="92" rx="6" />
        <rect className="artifact-system-node" x="231" y="63" width="61" height="64" rx="6" />
        <path className="artifact-system-glyph" d="m48 89 9 8-9 8m24-16-9 16" />
        <path className="artifact-system-glyph" d="M163 73h30m-30 16h30m-30 16h22m-22 16h27" />
        <circle className="artifact-system-dot" cx="261" cy="83" r="5" />
        <path className="artifact-system-glyph" d="M249 101h24m-24 12h18" />
      </svg>
    )
  }
  return (
    <svg aria-hidden="true" className="experience-artifact experience-artifact-interface" viewBox="0 0 320 190">
      <rect className="artifact-browser" x="24" y="24" width="272" height="142" rx="6" />
      <path className="artifact-browser-line" d="M24 53h272" />
      <circle cx="43" cy="39" r="3" /><circle cx="55" cy="39" r="3" /><circle cx="67" cy="39" r="3" />
      <rect className="artifact-interface-panel" x="43" y="72" width="68" height="74" rx="3" />
      <rect className="artifact-interface-line" x="130" y="73" width="143" height="9" rx="4" />
      <rect className="artifact-interface-line artifact-interface-line-short" x="130" y="93" width="96" height="6" rx="3" />
      <rect className="artifact-interface-card" x="130" y="112" width="64" height="34" rx="3" />
      <rect className="artifact-interface-card artifact-interface-card-two" x="209" y="112" width="64" height="34" rx="3" />
      <circle className="artifact-interface-cursor" cx="250" cy="110" r="7" />
    </svg>
  )
}

export function WorkExperienceSection({
  locale,
}: WorkExperienceSectionProps) {
  const es = locale === 'es'
  const reduceMotion = useReducedMotion()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const markerRefs = useRef(new Map<string, HTMLDivElement>())
  const lastScrollAt = useRef(0)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 72%', 'end 48%'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 24,
    mass: 0.32,
  })

  useEffect(() => {
    const markers = markerRefs.current
    if (!markers.size) return

    const handleScroll = () => { lastScrollAt.current = performance.now() }
    const sectionObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setExpandedId(null)
    })
    if (sectionRef.current) sectionObserver.observe(sectionRef.current)
    let observer: IntersectionObserver | null = null
    const observeMarkers = () => {
      observer?.disconnect()
      const centerMargin = Math.round(window.innerHeight * 0.43)
      observer = new IntersectionObserver((entries) => {
        if (lastScrollAt.current && performance.now() - lastScrollAt.current > 180) return
        const reached = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) =>
            Math.abs(first.boundingClientRect.top + first.boundingClientRect.height / 2 - window.innerHeight / 2) -
            Math.abs(second.boundingClientRect.top + second.boundingClientRect.height / 2 - window.innerHeight / 2),
          )[0]
        const nextId = reached?.target.getAttribute('data-experience-id')
        if (nextId) setExpandedId(nextId)
      }, { rootMargin: `-${centerMargin}px 0px -${centerMargin}px 0px`, threshold: 0 })
      markers.forEach((marker) => observer?.observe(marker))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', observeMarkers)
    observeMarkers()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', observeMarkers)
      observer?.disconnect()
      sectionObserver.disconnect()
    }
  }, [])

  return (
    <section className="section-shell work-experience-section" id="experience" ref={sectionRef}>
      <Reveal className="section-heading work-experience-heading">
        <p className="technical-label">
            {es ? 'Experiencia' : 'Experience'}
        </p>
        <SmudgeReveal
          className="about-heading-smudge"
          label={es ? 'Pasa el cursor para revelar otra idea' : 'Move the pointer to reveal another idea'}
          revealed={<h2>{es ? 'Del bug al café. Y de vuelta al bug.' : 'From bugs to coffee. Then back to bugs.'}</h2>}
        >
          <h2><ScrollLyricsText text={es
            ? 'Del dato al producto.'
            : 'From data to product.'} /></h2>
        </SmudgeReveal>
      </Reveal>

      <div className="experience-timeline" ref={timelineRef}>
        <motion.div
          aria-hidden="true"
          className="experience-progress"
          style={{ scaleY: reduceMotion ? 1 : smoothProgress }}
        />

        {experience.map((item, index) => (
          <Reveal
            className={`experience-entry${!item.endDate ? ' is-current' : ''}`}
            delay={index * 0.09}
            key={item.id}
          >
            <div
              aria-hidden="true"
              className="experience-marker"
              data-experience-id={item.id}
              ref={(node) => {
                if (node) markerRefs.current.set(item.id, node)
                else markerRefs.current.delete(item.id)
              }}
            />
            <div className="experience-meta">
              <p className="technical-label">{item.company}</p>
              <p>
                <time dateTime={item.startDate}>
                  {formatDate(item.startDate, locale)}
                </time>
                <ArrowDownRight aria-hidden="true" size={14} />
                {item.endDate ? (
                  <time dateTime={item.endDate}>
                    {formatDate(item.endDate, locale)}
                  </time>
                ) : (
                  <span>{es ? 'Actualidad' : 'Present'}</span>
                )}
              </p>
            </div>
            <div className="experience-content">
              <h3>
                <button
                  aria-controls={`experience-details-${item.id}`}
                  aria-expanded={expandedId === item.id}
                  className="experience-role-toggle"
                  onClick={() => setExpandedId((current) => current === item.id ? null : item.id)}
                  type="button"
                >
                  <span>{item.role[locale]}</span>
                  <ChevronDown aria-hidden="true" size={23} strokeWidth={1.5} />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {expandedId === item.id && (
                  <motion.div
                    animate={reduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1, y: 0 }}
                    className="experience-details"
                    exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0, y: -8 }}
                    id={`experience-details-${item.id}`}
                    initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0, y: 8 }}
                    key={item.id}
                    style={{ overflow: 'hidden' }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="experience-detail-grid">
                      <ExperienceArtifact id={item.id} />
                      <div>
                        <ul>
                          {item.responsibilities.map((responsibility) => (
                            <li key={responsibility.es}>{responsibility[locale]}</li>
                          ))}
                        </ul>
                        <div className="experience-tools">
                          {item.technologies.map((technology) => (
                            <span key={technology}>{technology}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
