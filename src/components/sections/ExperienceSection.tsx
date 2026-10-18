import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { technologies } from '../../data/technologies'
import { Reveal } from '../ui/Reveal'
import { TechnologyMotion } from './TechnologyMotion'
import type { Locale, TechnologyCategory } from '../../types/content'

export function ExperienceSection({ locale }: { locale: Locale }) {
  const es = locale === 'es'
  const reduceMotion = useReducedMotion()
  const groups: Array<{ id: TechnologyCategory; label: string }> = [
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'data', label: es ? 'Datos' : 'Data' },
    { id: 'tools', label: es ? 'Herramientas' : 'Tools' },
  ]
  const [activeGroup, setActiveGroup] = useState<TechnologyCategory>('frontend')
  const [activeTechnology, setActiveTechnology] = useState('react')
  const [motionKey, setMotionKey] = useState(0)
  const visibleTechnologies = technologies.filter((item) => item.category === activeGroup)
  const selectedTechnology = visibleTechnologies.find((item) => item.id === activeTechnology)?.id ?? visibleTechnologies[0].id
  const headingCopy: Record<TechnologyCategory, string> = es
    ? { frontend: 'Interfaces claras.', backend: 'Sistemas confiables.', data: 'Datos con contexto.', tools: 'Trabajo bien hecho.' }
    : { frontend: 'Clear interfaces.', backend: 'Reliable systems.', data: 'Data with context.', tools: 'Work that ships.' }

  const selectGroup = (category: TechnologyCategory) => {
    setActiveGroup(category)
    setActiveTechnology(technologies.find((item) => item.category === category)?.id ?? '')
  }

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % groups.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + groups.length) % groups.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = groups.length - 1
    else return
    event.preventDefault()
    selectGroup(groups[next].id)
    document.getElementById(`stack-tab-${groups[next].id}`)?.focus()
  }

  return (
    <section className="section-shell stack-section" id="stack">
      <Reveal className="section-heading stack-heading">
        <p className="technical-label">{es ? 'HERRAMIENTAS · ELIGE UNA CATEGORÍA' : 'TOOLKIT · CHOOSE A CATEGORY'}</p>
        <h2 aria-atomic="true" aria-live="polite" className="stack-heading-copy">
          <span className="stack-heading-lead">{es ? 'Software con' : 'Software with'}</span>
          <span className="stack-heading-window">
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                animate={{ opacity: 1, y: 0 }}
                className="stack-heading-value"
                exit={reduceMotion ? undefined : { opacity: 0, y: '-55%' }}
                initial={reduceMotion ? false : { opacity: 0, y: '55%' }}
                key={activeGroup}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                {headingCopy[activeGroup]}
              </motion.span>
            </AnimatePresence>
          </span>
          <span aria-hidden="true" className="stack-heading-track">
            {groups.map((group) => <span className={activeGroup === group.id ? 'is-active' : ''} key={group.id} />)}
          </span>
        </h2>
      </Reveal>

      <Reveal className="stack-editorial">
        <div
          aria-label={es ? 'Categorías tecnológicas' : 'Technology categories'}
          className="stack-category-rail"
          role="tablist"
        >
          {groups.map((group, index) => (
            <button
              aria-controls="stack-panel"
              aria-selected={activeGroup === group.id}
              className="stack-category"
              id={`stack-tab-${group.id}`}
              key={group.id}
              onClick={() => selectGroup(group.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              role="tab"
              tabIndex={activeGroup === group.id ? 0 : -1}
              type="button"
            >
              <span>{group.label}</span>
            </button>
          ))}
        </div>

        <div
          aria-labelledby={`stack-tab-${activeGroup}`}
          className="stack-editorial-panel"
          id="stack-panel"
          role="tabpanel"
          tabIndex={0}
        >
          <div className="stack-editorial-meta">
            <span>{groups.find((group) => group.id === activeGroup)?.label}</span>
            <span>{es ? 'SELECCIONA UNA TECNOLOGÍA' : 'SELECT A TECHNOLOGY'}</span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="stack-technology-list"
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              key={activeGroup}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              {visibleTechnologies.map((technology) => {
                const active = technology.id === selectedTechnology
                return (
                  <div className={`stack-technology${active ? ' is-active' : ''}`} key={technology.id}>
                    <button
                      aria-expanded={active}
                      className="stack-technology-button"
                      onClick={() => {
                        setActiveTechnology(technology.id)
                        setMotionKey((value) => value + 1)
                      }}
                      onFocus={() => setActiveTechnology(technology.id)}
                      type="button"
                    >
                      <span>{technology.name}</span>
                      <ArrowUpRight aria-hidden="true" size={24} strokeWidth={1.5} />
                    </button>
                    <div aria-hidden={!active} className="stack-technology-detail">
                      <p>{technology.usage[locale]}</p>
                      {active && <TechnologyMotion category={technology.category} id={technology.id} key={`${technology.id}-${motionKey}`} />}
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  )
}
