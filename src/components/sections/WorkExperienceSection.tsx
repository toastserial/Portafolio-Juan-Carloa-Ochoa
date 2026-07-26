import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion'
import { ArrowDownRight, ChevronDown } from 'lucide-react'
import { useRef, useState } from 'react'
import { experience } from '../../data/experience'
import type { Locale } from '../../types/content'
import { Reveal } from '../ui/Reveal'

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

export function WorkExperienceSection({
  locale,
}: WorkExperienceSectionProps) {
  const es = locale === 'es'
  const reduceMotion = useReducedMotion()
  const timelineRef = useRef<HTMLDivElement>(null)
  const [expandedId, setExpandedId] = useState<string | null>(experience[0]?.id ?? null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 72%', 'end 48%'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 24,
    mass: 0.32,
  })

  return (
    <section className="section-shell" id="experience">
      <Reveal className="section-heading">
        <p className="technical-label">
          {es ? '03 / Experiencia' : '03 / Experience'}
        </p>
        <h2>
          {es
            ? 'De entender los datos a construir el software.'
            : 'From understanding data to building software.'}
        </h2>
        <p>
          {es
            ? 'Una evolución dentro de Life Couriers: análisis, automatización y ahora desarrollo de soluciones.'
            : 'A progression at Life Couriers: analysis, automation, and now software development.'}
        </p>
      </Reveal>

      <div className="experience-timeline" ref={timelineRef}>
        <motion.div
          aria-hidden="true"
          className="experience-progress"
          style={{ scaleY: reduceMotion ? 1 : smoothProgress }}
        />

        {experience.map((item, index) => (
          <Reveal
            className="experience-entry"
            delay={index * 0.09}
            key={item.id}
          >
            <div className="experience-marker">
              <span>{String(index + 1).padStart(2, '0')}</span>
            </div>
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
              <h3>{item.role[locale]}</h3>
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
              <button
                aria-expanded={expandedId === item.id}
                className="experience-expand"
                onClick={() =>
                  setExpandedId((current) => current === item.id ? null : item.id)
                }
                type="button"
              >
                {es ? 'Contribución y aprendizaje' : 'Contribution and learning'}
                <ChevronDown aria-hidden="true" size={15} />
              </button>
              <AnimatePresence initial={false}>
                {expandedId === item.id && (
                  <motion.div
                    animate={{ height: 'auto', opacity: 1 }}
                    className="experience-insight"
                    exit={{ height: 0, opacity: 0 }}
                    initial={{ height: 0, opacity: 0 }}
                  >
                    <div>
                      <span>{es ? 'Contribución' : 'Contribution'}</span>
                      {item.contributions.map((entry) => (
                        <p key={entry.es}>{entry[locale]}</p>
                      ))}
                    </div>
                    <div>
                      <span>{es ? 'Aprendizaje' : 'Learning'}</span>
                      {item.learnings.map((entry) => (
                        <p key={entry.es}>{entry[locale]}</p>
                      ))}
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
