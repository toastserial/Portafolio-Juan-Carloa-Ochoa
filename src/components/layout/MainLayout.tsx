import type { ReactNode } from 'react'
import { Header } from './Header'
import { InteractiveBackground } from '../ui/InteractiveBackground'
import { SmoothScroll } from '../ui/SmoothScroll'
import type { Locale } from '../../types/content'

interface MainLayoutProps {
  children: ReactNode
  locale: Locale
  pathname: string
  onNavigate: (href: string) => void
}

export function MainLayout({ children, locale, pathname, onNavigate }: MainLayoutProps) {
  const isHome = pathname === `/${locale}`
  const isProjects = pathname === `/${locale}/projects` || pathname.startsWith(`/${locale}/projects/`)
  const isContact = pathname === `/${locale}/contact`

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SmoothScroll />
      <InteractiveBackground />
      <a className="skip-link" href="#main-content">
        {locale === 'es' ? 'Saltar al contenido' : 'Skip to content'}
      </a>
      <Header locale={locale} onNavigate={onNavigate} pathname={pathname} />
      <main className={isHome ? 'main-home' : isProjects ? 'main-projects' : isContact ? 'main-contact' : undefined} id="main-content">{children}</main>
    </div>
  )
}
