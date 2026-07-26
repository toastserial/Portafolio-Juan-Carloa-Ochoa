import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Braces, Code2, Database, Workflow } from 'lucide-react'
import { useState } from 'react'
import type { Locale, WorkspaceMode } from '../../types/content'

const thoughts = [
  {
    id: 'frontend',
    mode: 'software' as const,
    icon: Code2,
    label: { es: 'Frontend', en: 'Frontend' },
    detail: {
      es: 'Interfaces claras y reutilizables.',
      en: 'Clear, reusable interfaces.',
    },
  },
  {
    id: 'data',
    mode: 'data' as const,
    icon: Database,
    label: { es: 'Datos', en: 'Data' },
    detail: {
      es: 'Información lista para decidir.',
      en: 'Information ready for decisions.',
    },
  },
  {
    id: 'apis',
    mode: 'software' as const,
    icon: Braces,
    label: { es: 'APIs', en: 'APIs' },
    detail: {
      es: 'Servicios y sistemas conectados.',
      en: 'Connected services and systems.',
    },
  },
  {
    id: 'automation',
    mode: 'automation' as const,
    icon: Workflow,
    label: { es: 'Automatización', en: 'Automation' },
    detail: {
      es: 'Menos pasos manuales.',
      en: 'Fewer manual steps.',
    },
  },
]

export function ThoughtBubbles({
  activeMode,
  locale,
  onModeChange,
}: {
  activeMode: WorkspaceMode
  locale: Locale
  onModeChange: (mode: WorkspaceMode) => void
}) {
  const [activeThought, setActiveThought] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()

  return (
    <div
      aria-label={
        locale === 'es' ? 'Ideas alrededor de Juan' : 'Ideas around Juan'
      }
      className="thought-bubbles"
    >
      {thoughts.map(({ detail, icon: Icon, id, label, mode }, index) => {
        const isActive = activeThought === id
        const isModeActive = activeMode === mode

        return (
          <motion.button
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, index % 2 === 0 ? -7 : 6, 0],
                  }
            }
            aria-expanded={isActive}
            className={`thought-bubble thought-bubble-${index + 1} ${isModeActive ? 'is-mode-active' : ''}`}
            key={id}
            onClick={() => {
              onModeChange(mode)
              setActiveThought((current) => (current === id ? null : id))
            }}
            transition={{
              duration: 4.4 + index * 0.55,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
            type="button"
          >
            <span className="thought-bubble-core">
              <Icon aria-hidden="true" size={16} />
              <strong>{label[locale]}</strong>
            </span>
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.span
                  animate={{ opacity: 1, width: 'auto' }}
                  className="thought-bubble-detail"
                  exit={{ opacity: 0, width: 0 }}
                  initial={{ opacity: 0, width: 0 }}
                >
                  {detail[locale]}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </div>
  )
}
