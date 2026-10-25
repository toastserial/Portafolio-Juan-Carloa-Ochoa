import { Navigation } from '../navigation/Navigation'
import { playClick } from '../../lib/soundEffects'
import type { Locale, ThemeMode } from '../../types/content'

interface HeaderProps {
  locale: Locale
  pathname: string
  onNavigate: (href: string) => void
  theme: ThemeMode
  onToggleTheme: () => void
}

export function Header({ locale, pathname, onNavigate, theme, onToggleTheme }: HeaderProps) {
  const home = `/${locale}`
  const isOverDarkProject = pathname.includes('/projects')
  return (
    <header className={`portfolio-header${isOverDarkProject ? ' portfolio-header--over-dark' : ''}`}>
      <div className="portfolio-header-inner">
        <a aria-label={locale === 'es' ? 'Juan Ochoa, inicio' : 'Juan Ochoa, home'} className="brand-lockup focus-ring" href={home} onClick={(event) => { event.preventDefault(); playClick(); onNavigate(home) }}>
          <span aria-hidden="true" className="brand-mark" />
        </a>
        <Navigation locale={locale} onNavigate={onNavigate} pathname={pathname} theme={theme} onToggleTheme={onToggleTheme} />
      </div>
    </header>
  )
}
