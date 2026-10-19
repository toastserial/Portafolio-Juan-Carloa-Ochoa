import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { navigation } from '../../data/navigation'
import { playClick, playHover } from '../../lib/soundEffects'
import type { Locale } from '../../types/content'

interface NavigationProps {
  locale: Locale
  pathname: string
  onNavigate: (href: string) => void
}

export function Navigation({ locale, pathname, onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const alternateLocale: Locale = locale === 'es' ? 'en' : 'es'
  const currentPage = pathname.replace(/^\/(es|en)/, '')

  useEffect(() => {
    if (!isOpen) return
    const previousBodyOverflow = document.body.style.overflow
    const previousDocumentOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousDocumentOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault()
    playClick()
    setIsOpen(false)
    onNavigate(href)
  }

  return (
    <nav aria-label={locale === 'es' ? 'Navegación principal' : 'Main navigation'} className="site-navigation">
      <div className="nav-desktop">
        {navigation.map((item) => {
          const href = `/${locale}${item.href}`
          const active = pathname === href || (item.id === 'projects' && pathname.startsWith(`${href}/`)) || (item.id === 'home' && pathname === `/${locale}/`)
          return (
            <a aria-current={active ? 'page' : undefined} className={`nav-link${active ? ' is-active' : ''}`} href={href} key={item.id} onClick={(event) => handleClick(event, href)}>
              <span className="nav-roll"><span>{item.label[locale]}</span><span aria-hidden="true">{item.label[locale]}</span></span>
            </a>
          )
        })}
        <a aria-label={locale === 'es' ? 'Cambiar idioma' : 'Change language'} className="nav-language" href={`/${alternateLocale}${currentPage}`} onClick={(event) => handleClick(event, `/${alternateLocale}${currentPage}`)}>
          {alternateLocale.toUpperCase()}
        </a>
      </div>

      <button aria-controls="mobile-navigation" aria-expanded={isOpen} aria-label={isOpen ? (locale === 'es' ? 'Cerrar menú' : 'Close menu') : (locale === 'es' ? 'Abrir menú' : 'Open menu')} className="nav-toggle" onClick={() => { playClick(); setIsOpen((open) => !open) }} onMouseEnter={playHover} type="button">
        {isOpen ? <X aria-hidden="true" size={25} strokeWidth={1.8} /> : <Menu aria-hidden="true" size={25} strokeWidth={1.8} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div animate={{ clipPath: 'inset(0% 0% 0% 0%)' }} className="nav-mobile-panel" exit={reduceMotion ? undefined : { clipPath: 'inset(0% 0% 100% 0%)' }} id="mobile-navigation" initial={reduceMotion ? false : { clipPath: 'inset(0% 0% 100% 0%)' }} transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.76, 0, 0.24, 1] }}>
            {navigation.map((item, index) => {
              const href = `/${locale}${item.href}`
              const active = pathname === href || (item.id === 'projects' && pathname.startsWith(`${href}/`)) || (item.id === 'home' && pathname === `/${locale}/`)
              return (
                <motion.a aria-current={active ? 'page' : undefined} animate={{ opacity: 1, x: 0 }} className={`nav-mobile-link${active ? ' is-active' : ''}`} href={href} initial={reduceMotion ? false : { opacity: 0, x: 36 }} key={item.id} onClick={(event) => handleClick(event, href)} transition={{ delay: reduceMotion ? 0 : 0.08 + index * 0.07 }}>
                  <span className="nav-roll"><span>{item.label[locale]}</span><span aria-hidden="true">{item.label[locale]}</span></span>
                </motion.a>
              )
            })}
            <a className="nav-mobile-language" href={`/${alternateLocale}${currentPage}`} onClick={(event) => handleClick(event, `/${alternateLocale}${currentPage}`)}>{alternateLocale.toUpperCase()}</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
