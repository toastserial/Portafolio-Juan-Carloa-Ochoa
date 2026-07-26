import { useEffect, useState } from 'react'
import { MainLayout } from './components/layout/MainLayout'
import { DEFAULT_LOCALE, isLocale } from './lib/locale'
import { PortfolioPage } from './pages/PortfolioPage'
import type { Locale } from './types/content'

function localeFromPath(): Locale {
  const pathLocale = window.location.pathname.split('/')[1]
  return isLocale(pathLocale) ? pathLocale : DEFAULT_LOCALE
}

function setMeta(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

function setCanonical(href: string) {
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.append(canonical)
  }
  canonical.href = href
}

export function App() {
  const [locale, setLocale] = useState(localeFromPath)

  useEffect(() => {
    const pathLocale = window.location.pathname.split('/')[1]

    if (!isLocale(pathLocale)) {
      window.history.replaceState({}, '', `/${DEFAULT_LOCALE}${window.location.hash}`)
    }

    document.documentElement.lang = locale
    const es = locale === 'es'
    const title = `Juan Carlos Ochoa — ${es ? 'Desarrollador de Software' : 'Software Developer'}`
    const description = es
      ? 'Portafolio de Juan Carlos Ochoa: desarrollo de software, interfaces web, sistemas internos, automatización y soluciones basadas en datos.'
      : 'Juan Carlos Ochoa’s portfolio: software development, web interfaces, internal systems, automation, and data-informed solutions.'
    const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '')
    const siteUrl = configuredSiteUrl || window.location.origin
    const canonicalUrl = `${siteUrl}/${locale}`
    const socialImage = `${siteUrl}/images/background_funko/background-base.png`

    document.title = title
    setCanonical(canonicalUrl)
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:locale"]', es ? 'es_HN' : 'en_US')
    setMeta('meta[property="og:url"]', canonicalUrl)
    setMeta('meta[property="og:image"]', socialImage)
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', description)
    setMeta('meta[name="twitter:image"]', socialImage)

    const handlePopState = () => setLocale(localeFromPath())
    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [locale])

  useEffect(() => {
    const sectionId = window.location.hash.slice(1)
    if (!sectionId) return

    if (sectionId === 'top') {
      window.scrollTo({ top: 0 })
      return
    }

    let secondFrame = 0
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView()
      })
    })

    return () => {
      window.cancelAnimationFrame(firstFrame)
      window.cancelAnimationFrame(secondFrame)
    }
  }, [locale])

  return (
    <MainLayout locale={locale}>
      <PortfolioPage locale={locale} />
    </MainLayout>
  )
}
