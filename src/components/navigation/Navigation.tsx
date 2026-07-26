import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { MouseEvent } from 'react'
import { navigation } from '../../data/navigation'
import type { Locale } from '../../types/content'

interface NavigationProps {
  locale: Locale
}

export function Navigation({ locale }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()
  const alternateLocale: Locale = locale === 'es' ? 'en' : 'es'

  const closeMenu = () => setIsOpen(false)
  const changeLanguage = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const nextUrl = `/${alternateLocale}${window.location.hash}`
    window.history.pushState({}, '', nextUrl)
    window.dispatchEvent(new PopStateEvent('popstate'))
    closeMenu()
  }

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  useEffect(() => {
    let animationFrame = 0

    const updateActiveSection = () => {
      animationFrame = 0
      const readingLine = Math.min(160, window.innerHeight * 0.28)
      let currentSection: string | null = null

      for (const item of navigation) {
        const section = document.getElementById(item.id)
        if (!section) continue

        const bounds = section.getBoundingClientRect()
        if (bounds.top <= readingLine && bounds.bottom > readingLine) {
          currentSection = item.id
          break
        }
      }

      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 4
      ) {
        currentSection = 'contact'
      }

      setActiveSection((current) =>
        current === currentSection ? current : currentSection,
      )
    }

    const scheduleUpdate = () => {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(updateActiveSection)
    }

    updateActiveSection()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  return (
    <nav aria-label={locale === 'es' ? 'Navegación principal' : 'Main navigation'}>
      <button
        aria-controls="primary-navigation"
        aria-expanded={isOpen}
        className="nav-toggle focus-ring rounded-full border border-line px-4 py-2 text-sm md:hidden"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="sr-only">
          {isOpen
            ? locale === 'es' ? 'Cerrar menú' : 'Close menu'
            : locale === 'es' ? 'Abrir menú' : 'Open menu'}
        </span>
        <span aria-hidden="true" className={`hamburger ${isOpen ? 'is-open' : ''}`}>
          <span />
          <span />
          <span />
        </span>
      </button>

      <AnimatePresence initial={false}>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={`${isOpen ? 'flex' : 'hidden'} nav-panel absolute inset-x-0 top-16 flex-col gap-1 border-b border-line bg-surface p-4 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          id="primary-navigation"
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {navigation.map((item, index) => {
            const isActive = activeSection === item.id

            return (
              <motion.a
                animate={{ opacity: 1, x: 0 }}
                aria-current={isActive ? 'location' : undefined}
                className={`nav-link focus-ring rounded-md px-3 py-2 text-sm text-muted ${isActive ? 'is-active' : ''}`}
                href={`/${locale}${item.href}`}
                initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  closeMenu()
                }}
                transition={{ delay: isOpen ? index * 0.035 : 0 }}
              >
                <span className="nav-link-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{item.label[locale]}</span>
              </motion.a>
            )
          })}
          <a
            aria-label={
              locale === 'es' ? 'Cambiar idioma a inglés' : 'Change language to Spanish'
            }
            className="language-link focus-ring mt-2 rounded-full border border-line px-3 py-2 text-xs text-accent md:mt-0 md:ml-2"
            href={`/${alternateLocale}${window.location.hash}`}
            onClick={changeLanguage}
          >
            <span className="language-label">
              {locale === 'es' ? 'Idioma' : 'Language'}
            </span>
            <strong>{alternateLocale.toUpperCase()}</strong>
          </a>
        </motion.div>
      </AnimatePresence>
    </nav>
  )
}
