import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  LockKeyhole,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Locale, Project } from '../../types/content'
import { ProjectTechBadge } from './ProjectTechBadge'

interface ProjectModalProps {
  locale: Locale
  onClose: () => void
  project: Project | null
}

export function ProjectModal({
  locale,
  onClose,
  project,
}: ProjectModalProps) {
  const es = locale === 'es'
  const dialogRef = useRef<HTMLElement>(null)
  const [activeImage, setActiveImage] = useState(0)
  const processSteps =
    project?.id === 'multilingual-invoice-automation'
      ? (es
          ? ['Recibir formatos', 'Transformar', 'Validar reglas', 'Entregar datos']
          : ['Receive formats', 'Transform', 'Validate rules', 'Deliver data'])
      : project?.id === 'radiopharma'
        ? (es
            ? ['Documentar flujo', 'Consultar API', 'Persistir datos', 'Operar internamente']
            : ['Document flow', 'Query API', 'Persist data', 'Operate internally'])
        : (es
            ? ['Entender', 'Diseñar', 'Construir', 'Validar']
            : ['Understand', 'Design', 'Build', 'Validate'])

  useEffect(() => setActiveImage(0), [project?.id])

  useEffect(() => {
    if (!project) return

    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement as HTMLElement | null
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose, project])

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          animate={{ opacity: 1 }}
          aria-label={es ? 'Detalle del proyecto' : 'Project details'}
          aria-modal="true"
          className="project-modal-backdrop"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
        >
          <motion.article
            aria-labelledby="project-modal-title"
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="project-modal"
            exit={{ opacity: 0, scale: 0.98, y: 18 }}
            initial={{ opacity: 0, scale: 0.98, y: 18 }}
            onClick={(event) => event.stopPropagation()}
            ref={dialogRef}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="project-modal-header">
              <div>
                <p className="technical-label">{project.category[locale]}</p>
                <h3 id="project-modal-title">{project.title[locale]}</h3>
              </div>
              <button
                aria-label={es ? 'Cerrar detalle' : 'Close details'}
                autoFocus
                className="project-modal-close"
                onClick={onClose}
                type="button"
              >
                <X aria-hidden="true" />
              </button>
            </header>

            {project.images?.length ? (
              <div className="project-modal-gallery">
                <img
                  alt={`${project.title[locale]} · ${activeImage + 1}`}
                  key={project.images[activeImage]}
                  src={project.images[activeImage]}
                />
                {project.images.length > 1 && (
                  <div className="project-gallery-controls">
                    <button
                      aria-label={es ? 'Imagen anterior' : 'Previous image'}
                      onClick={() =>
                        setActiveImage((current) =>
                          current === 0
                            ? project.images!.length - 1
                            : current - 1,
                        )
                      }
                      type="button"
                    >
                      <ArrowLeft aria-hidden="true" size={16} />
                    </button>
                    <span>
                      {activeImage + 1} / {project.images.length}
                    </span>
                    <button
                      aria-label={es ? 'Imagen siguiente' : 'Next image'}
                      onClick={() =>
                        setActiveImage(
                          (current) =>
                            (current + 1) % project.images!.length,
                        )
                      }
                      type="button"
                    >
                      <ArrowRight aria-hidden="true" size={16} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="project-modal-placeholder" aria-hidden="true">
                <span>{project.title[locale]}</span>
              </div>
            )}

            <div className="project-modal-content">
              {project.period && (
                <p className="project-modal-period">
                  <CalendarDays aria-hidden="true" size={15} />
                  {project.period[locale]}
                </p>
              )}
              <div className="project-modal-details">
                <div>
                  <span>{es ? 'El reto' : 'The challenge'}</span>
                  <p>{project.problem[locale]}</p>
                </div>
                <div>
                  <span>{es ? 'La solución' : 'The solution'}</span>
                  <p>{project.solution[locale]}</p>
                </div>
                <div>
                  <span>{es ? 'Mi contribución' : 'My contribution'}</span>
                  <p>{project.participation[locale]}</p>
                </div>
                {project.outcome && (
                  <div>
                    <span>{es ? 'Resultado' : 'Outcome'}</span>
                    <p>{project.outcome[locale]}</p>
                  </div>
                )}
                {project.learning && (
                  <div>
                    <span>{es ? 'Aprendizaje' : 'Learning'}</span>
                    <p>{project.learning[locale]}</p>
                  </div>
                )}
              </div>
              <div className="case-study-flow">
                <div className="case-study-flow-heading">
                  <span>{es ? 'Proceso guiado' : 'Guided process'}</span>
                  <strong>{es ? 'Del problema al resultado' : 'From problem to outcome'}</strong>
                </div>
                <ol>
                  {processSteps.map((step, index) => (
                    <li key={step}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{step}</strong>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="project-modal-stack">
                {project.stack.map((item) => (
                  <ProjectTechBadge key={item} name={item} />
                ))}
              </div>
              {project.nextSteps && (
                <div className="project-next-step">
                  <span>{es ? 'Siguiente iteración' : 'Next iteration'}</span>
                  <p>{project.nextSteps[locale]}</p>
                </div>
              )}
              {project.status === 'professional' ||
              project.id === 'radiopharma' ? (
                <p className="project-confidential-note">
                  <LockKeyhole aria-hidden="true" size={13} />
                  {es
                    ? 'Información presentada sin datos operativos confidenciales.'
                    : 'Presented without confidential operational information.'}
                </p>
              ) : null}
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
