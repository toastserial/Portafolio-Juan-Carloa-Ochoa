import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { technologies } from '../../data/technologies'
import { Reveal } from '../ui/Reveal'
import { TechOrbit } from '../ui/TechOrbit'
import type { Locale, TechnologyCategory } from '../../types/content'

export function ExperienceSection({ locale }: { locale: Locale }) {
  const es = locale === 'es'
  const reduceMotion = useReducedMotion()
  const groups: Array<{
    id: TechnologyCategory
    label: string
    description: string
  }> = [
    {
      id: 'frontend',
      label: 'Frontend',
      description: es ? 'Lo que la persona ve y utiliza.' : 'What people see and use.',
    },
    {
      id: 'backend',
      label: 'Backend',
      description: es ? 'La lógica que sostiene el producto.' : 'The logic behind the product.',
    },
    {
      id: 'data',
      label: es ? 'Datos' : 'Data',
      description: es ? 'La información que conecta decisiones.' : 'Information that connects decisions.',
    },
    {
      id: 'tools',
      label: es ? 'Herramientas' : 'Tools',
      description: es ? 'El sistema que permite entregar.' : 'The system that enables delivery.',
    },
  ]
  const [activeGroup, setActiveGroup] = useState<TechnologyCategory>('frontend')
  const active = groups.find((group) => group.id === activeGroup) ?? groups[0]
  const visibleTechnologies = technologies.filter(
    (technology) => technology.category === activeGroup,
  )

  return (
    <section className="section-shell" id="stack">
      <Reveal className="section-heading">
        <p className="technical-label">{es ? '04 / Herramientas' : '04 / Toolkit'}</p>
        <h2>{es ? 'Tecnología según su función.' : 'Technology by function.'}</h2>
        <p>
          {es
            ? 'Sin porcentajes arbitrarios: cada herramienta aparece por la forma en que contribuye al trabajo.'
            : 'No arbitrary percentages: every tool is shown through the role it plays in the work.'}
        </p>
      </Reveal>
      <Reveal className="tech-orbit-card">
        <div className="tech-orbit-copy">
          <p className="technical-label">
            {es ? 'Stack conectado' : 'Connected stack'}
          </p>
          <h3>
            {es
              ? 'Dos disciplinas, un mismo flujo.'
              : 'Two disciplines, one connected flow.'}
          </h3>
          <p>
            {es
              ? 'Preparo y entiendo los datos; después construyo las interfaces y sistemas que permiten utilizarlos.'
              : 'I prepare and understand data, then build the interfaces and systems that make it useful.'}
          </p>
        </div>
        <TechOrbit locale={locale} />
      </Reveal>
      <Reveal className="stack-system">
        <div
          aria-label={es ? 'Categorías tecnológicas' : 'Technology categories'}
          className="stack-tabs"
          role="tablist"
        >
          {groups.map((group, index) => (
            <button
              aria-controls="stack-panel"
              aria-selected={activeGroup === group.id}
              className="stack-tab"
              id={`stack-tab-${group.id}`}
              key={group.id}
              onClick={() => setActiveGroup(group.id)}
              role="tab"
              type="button"
            >
              <span>0{index + 1}</span>
              {group.label}
              {activeGroup === group.id && (
                <motion.span
                  className="stack-tab-indicator"
                  layoutId="stack-active"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
            </button>
          ))}
        </div>

        <div
          aria-labelledby={`stack-tab-${activeGroup}`}
          className="stack-panel"
          id="stack-panel"
          role="tabpanel"
          tabIndex={0}
        >
          <div className="stack-panel-heading">
            <div className="stack-pulse" />
            <div>
              <p className="technical-label">{active.label}</p>
              <p>{active.description}</p>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              animate="show"
              className="stack-cards"
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              initial={reduceMotion ? false : 'hidden'}
              key={activeGroup}
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.08 },
                },
              }}
            >
              {visibleTechnologies.map((technology, index) => (
                <motion.article
                  className="stack-card"
                  key={technology.id}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <span className="stack-card-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <strong>{technology.name}</strong>
                  <p>{technology.usage[locale]}</p>
                  <div className="stack-signal">
                    <motion.span
                      animate={reduceMotion ? undefined : { x: ['-100%', '320%'] }}
                      transition={{
                        duration: 2.8,
                        ease: 'linear',
                        repeat: Infinity,
                        repeatDelay: 1.2 + index * 0.4,
                      }}
                    />
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
      <Reveal className="honesty-note">
        <span>{es ? 'Conexión' : 'Connection'}</span>
        <p>
          {es
            ? 'Este stack conecta mi experiencia preparando datos con mi trabajo actual desarrollando soluciones de software.'
            : 'This toolkit connects my data preparation experience with my current work building software solutions.'}
        </p>
      </Reveal>
    </section>
  )
}
