import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { InteractiveBackground } from '../ui/InteractiveBackground'
import { CommandPalette } from '../ui/CommandPalette'
import { SmoothScroll } from '../ui/SmoothScroll'
import type { Locale } from '../../types/content'

interface MainLayoutProps {
  children: ReactNode
  locale: Locale
}

export function MainLayout({ children, locale }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SmoothScroll />
      <InteractiveBackground />
      <CommandPalette locale={locale} />
      <a className="skip-link" href="#main-content">
        {locale === 'es' ? 'Saltar al contenido' : 'Skip to content'}
      </a>
      <Header locale={locale} />
      <main id="main-content">{children}</main>
      <Footer locale={locale} />
    </div>
  )
}
