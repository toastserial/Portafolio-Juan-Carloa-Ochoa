import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MainLayout } from './components/layout/MainLayout'
import { DEFAULT_LOCALE, isLocale } from './lib/locale'
import { PortfolioPage } from './pages/PortfolioPage'
import type { Locale, PortfolioRoute, ThemeMode } from './types/content'

interface RouteState {
  locale: Locale
  route: PortfolioRoute
  pathname: string
  projectId?: string
}

type WipeStage = 'idle' | 'cover' | 'reveal'

function resolveRoute(pathname: string): RouteState {
  const segments = pathname.split('/').filter(Boolean)
  const locale = isLocale(segments[0]) ? segments[0] : DEFAULT_LOCALE
  const routeOffset = isLocale(segments[0]) ? 1 : 0
  const slug = segments[routeOffset]
  const projectId = slug === 'projects' ? segments[routeOffset + 1] : undefined
  const route: PortfolioRoute = projectId
    ? 'project'
    : slug === 'about' || slug === 'projects' || slug === 'contact' ? slug : 'home'
  const routePath = route === 'home'
    ? ''
    : route === 'project'
      ? `/projects/${projectId}`
      : `/${route}`
  return { locale, route, projectId, pathname: `/${locale}${routePath}` }
}

function setMeta(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

function RouteWipe({ stage, locale }: { stage: WipeStage; locale: Locale }) {
  if (stage === 'idle') return null
  const es = locale === 'es'
  return (
    <div aria-label={es ? 'Cambiando de página' : 'Changing page'} aria-live="polite" className={`route-wipe route-wipe--${stage}`} role="status">
      {Array.from({ length: 25 }, (_, index) => (
        <span aria-hidden="true" className="route-wipe-slice" key={index} style={{ animationDelay: `${(stage === 'cover' ? index : 24 - index) * 0.012}s` }} />
      ))}
      <div aria-hidden="true" className="route-wipe-mark"><span className="brand-mark brand-mark--wipe" /><span>JUAN OCHOA</span></div>
    </div>
  )
}

function InitialLoader({ locale }: { locale: Locale }) {
  const es = locale === 'es'
  return (
    <motion.div animate={{ opacity: 1 }} className="initial-loader" exit={{ opacity: 0, transition: { duration: 0.45 } }} initial={{ opacity: 1 }} role="status">
      <motion.span aria-hidden="true" animate={{ opacity: [0.45, 1, 0.45], scale: [0.96, 1, 0.96] }} className="brand-mark brand-mark--loader" transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity }} />
      <p>{es ? 'CARGANDO EXPERIENCIA' : 'LOADING EXPERIENCE'}</p>
      <div className="initial-loader-track"><span /></div>
    </motion.div>
  )
}

export function App() {
  const [route, setRoute] = useState<RouteState>(() => resolveRoute(window.location.pathname))
  const [isBooting, setIsBooting] = useState(true)
  const [wipeStage, setWipeStage] = useState<WipeStage>('idle')
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      return window.localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark'
    } catch {
      return 'dark'
    }
  })
  const reduceMotion = useReducedMotion()
  const timerRef = useRef<number | undefined>(undefined)
  const routeLockRef = useRef(false)
  const initialPathRef = useRef(route.pathname)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try { window.localStorage.setItem('portfolio-theme', theme) } catch { /* storage can be unavailable in private contexts */ }
  }, [theme])

  useEffect(() => {
    if (window.location.pathname !== initialPathRef.current) {
      window.history.replaceState({}, '', `${initialPathRef.current}${window.location.search}${window.location.hash}`)
    }
    const compactExperience = window.matchMedia('(max-width: 47.99rem)').matches
    const bootTimer = window.setTimeout(() => setIsBooting(false), reduceMotion ? 120 : compactExperience ? 720 : 1450)
    return () => window.clearTimeout(bootTimer)
  }, [reduceMotion])

  useEffect(() => {
    const es = route.locale === 'es'
    document.documentElement.lang = route.locale
    const title = `Juan Carlos Ochoa — ${es ? 'Desarrollador de Software' : 'Software Developer'} | Beyond the Interface`
    const description = es
      ? 'Portafolio de Juan Carlos Ochoa: desarrollo de software, interfaces web, sistemas internos y soluciones basadas en datos.'
      : 'Juan Carlos Ochoa’s portfolio: software development, web interfaces, internal systems, and data-informed solutions.'
    const siteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '') || window.location.origin
    document.title = title
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical) }
    canonical.href = `${siteUrl}${route.pathname}`
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:url"]', `${siteUrl}${route.pathname}`)
    setMeta('meta[property="og:locale"]', es ? 'es_HN' : 'en_US')
  }, [route])

  const transitionTo = useCallback((href: string, pushHistory = true) => {
    const target = resolveRoute(new URL(href, window.location.origin).pathname)
    if (target.pathname === route.pathname || routeLockRef.current) return
    if (timerRef.current) window.clearTimeout(timerRef.current)

    const commitRoute = () => {
      if (pushHistory) window.history.pushState({}, '', target.pathname)
      setRoute(target)
      window.scrollTo(0, 0)
      setWipeStage('reveal')
      timerRef.current = window.setTimeout(() => {
        routeLockRef.current = false
        setWipeStage('idle')
      }, 790)
    }

    if (reduceMotion) { commitRoute(); return }
    routeLockRef.current = true
    setWipeStage('cover')
    timerRef.current = window.setTimeout(commitRoute, 790)
  }, [reduceMotion, route.pathname])

  useEffect(() => {
    const onPopState = () => transitionTo(window.location.pathname, false)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [transitionTo])

  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current) }, [])

  return (
    <>
      <motion.div animate={{ opacity: isBooting ? 0 : 1 }} className="app-content" initial={{ opacity: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
        <MainLayout locale={route.locale} onNavigate={transitionTo} pathname={route.pathname} theme={theme} onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}>
          <AnimatePresence initial={false} mode="wait">
            <motion.div animate={{ opacity: 1, y: 0 }} className="route-page" initial={reduceMotion ? false : { opacity: 0, y: 18 }} key={route.pathname} transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <PortfolioPage locale={route.locale} onNavigate={transitionTo} projectId={route.projectId} route={route.route} />
            </motion.div>
          </AnimatePresence>
        </MainLayout>
      </motion.div>
      <AnimatePresence>{isBooting && <InitialLoader key="initial-loader" locale={route.locale} />}</AnimatePresence>
      <RouteWipe locale={route.locale} stage={wipeStage} />
    </>
  )
}
