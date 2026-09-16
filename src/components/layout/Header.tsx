import { ArrowUpRight } from 'lucide-react'
import type { MouseEvent } from 'react'
import { Navigation } from '../navigation/Navigation'
import { smoothScrollTo } from '../../lib/smoothScroll'
import type { Locale } from '../../types/content'

interface HeaderProps {
  locale: Locale
}

export function Header({ locale }: HeaderProps) {
  const returnToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    window.history.pushState({}, '', `/${locale}#top`)
    smoothScrollTo(0)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="page-shell flex min-h-16 items-center justify-between gap-6">
        <a
          className="brand-lockup focus-ring"
          href={`/${locale}#top`}
          onClick={returnToTop}
        >
          <img alt="" height="28" src="/icons/brand-mark.png" width="28" />
          <span>JUAN OCHOA</span>
        </a>
        <Navigation locale={locale} />
        <a className="header-contact focus-ring" href="#contact">
          {locale === 'es' ? 'Hablemos' : 'Let’s talk'}
          <ArrowUpRight aria-hidden="true" size={15} />
        </a>
      </div>
    </header>
  )
}
