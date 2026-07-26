import { AnimatePresence, motion } from 'framer-motion'
import {
  BriefcaseBusiness,
  Contact,
  Download,
  Languages,
  Search,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Locale } from '../../types/content'

interface Command {
  id: string
  label: string
  keywords: string
  icon: typeof Search
  run: () => void
}

function scrollToSection(id: string) {
  window.history.pushState({}, '', `${window.location.pathname}#${id}`)
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function CommandPalette({ locale }: { locale: Locale }) {
  const es = locale === 'es'
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const close = () => {
    setIsOpen(false)
    setQuery('')
  }

  const commands = useMemo<Command[]>(() => [
    {
      id: 'work',
      label: es ? 'Ver proyectos' : 'View projects',
      keywords: 'work projects trabajo proyectos',
      icon: Sparkles,
      run: () => scrollToSection('work'),
    },
    {
      id: 'experience',
      label: es ? 'Ver experiencia' : 'View experience',
      keywords: 'experience timeline experiencia trabajo',
      icon: BriefcaseBusiness,
      run: () => scrollToSection('experience'),
    },
    {
      id: 'contact',
      label: es ? 'Contactarme' : 'Contact me',
      keywords: 'contact email mensaje contacto',
      icon: Send,
      run: () => scrollToSection('contact'),
    },
    {
      id: 'about',
      label: es ? 'Ver perfil' : 'View profile',
      keywords: 'about profile perfil',
      icon: Contact,
      run: () => scrollToSection('about'),
    },
    {
      id: 'cv',
      label: es ? 'Descargar CV' : 'Download résumé',
      keywords: 'cv resume curriculum download descargar',
      icon: Download,
      run: () => {
        const link = document.createElement('a')
        link.href = '/cv-juan-ochoa.pdf'
        link.download = ''
        link.click()
      },
    },
    {
      id: 'language',
      label: es ? 'Cambiar a inglés' : 'Switch to Spanish',
      keywords: 'language idioma english español',
      icon: Languages,
      run: () => {
        const next = es ? 'en' : 'es'
        window.history.pushState({}, '', `/${next}${window.location.hash}`)
        window.dispatchEvent(new PopStateEvent('popstate'))
      },
    },
  ], [es])

  const filtered = commands.filter((command) =>
    `${command.label} ${command.keywords}`.toLowerCase().includes(query.toLowerCase()),
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsOpen((current) => !current)
      } else if (event.key === 'Escape') {
        close()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  return createPortal(
    <>
      <button
        aria-label={es ? 'Abrir comandos' : 'Open commands'}
        className="command-launcher"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <Search aria-hidden="true" size={14} />
        <span>{es ? 'Comandos' : 'Commands'}</span>
        <kbd>Ctrl K</kbd>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            aria-label={es ? 'Paleta de comandos' : 'Command palette'}
            aria-modal="true"
            className="command-backdrop"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={close}
            role="dialog"
          >
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="command-panel"
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              initial={{ opacity: 0, scale: 0.98, y: -8 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="command-search">
                <Search aria-hidden="true" size={18} />
                <input
                  aria-label={es ? 'Buscar comando' : 'Search commands'}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && filtered[0]) {
                      filtered[0].run()
                      close()
                    }
                  }}
                  placeholder={es ? '¿A dónde quieres ir?' : 'Where do you want to go?'}
                  ref={inputRef}
                  value={query}
                />
                <button aria-label={es ? 'Cerrar' : 'Close'} onClick={close} type="button">
                  <X aria-hidden="true" size={17} />
                </button>
              </div>
              <div className="command-list">
                {filtered.map(({ icon: Icon, ...command }) => (
                  <button
                    key={command.id}
                    onClick={() => {
                      command.run()
                      close()
                    }}
                    type="button"
                  >
                    <Icon aria-hidden="true" size={17} />
                    <span>{command.label}</span>
                    <kbd>↵</kbd>
                  </button>
                ))}
                {!filtered.length && (
                  <p>{es ? 'No encontré ese comando.' : 'No command found.'}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  )
}
