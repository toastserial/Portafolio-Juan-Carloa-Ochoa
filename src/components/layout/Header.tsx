import { Navigation } from '../navigation/Navigation'
import { playClick } from '../../lib/soundEffects'
import type { Locale } from '../../types/content'

interface HeaderProps {
  locale: Locale
  pathname: string
  onNavigate: (href: string) => void
}

export function Header({ locale, pathname, onNavigate }: HeaderProps) {
  const home = `/${locale}`
  return (
    <header className="portfolio-header">
      <div className="portfolio-header-inner">
        <a aria-label={locale === 'es' ? 'Juan Ochoa, inicio' : 'Juan Ochoa, home'} className="brand-lockup focus-ring" href={home} onClick={(event) => { event.preventDefault(); playClick(); onNavigate(home) }}>
          <img alt="" height="34" src="/icons/brand-mark.png" width="34" />
        </a>
        <Navigation locale={locale} onNavigate={onNavigate} pathname={pathname} />
      </div>
    </header>
  )
}
