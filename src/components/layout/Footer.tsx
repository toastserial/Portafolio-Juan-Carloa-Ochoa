import { ArrowUp } from 'lucide-react'
import type { Locale } from '../../types/content'

interface FooterProps {
  locale: Locale
  onNavigate: (href: string) => void
}

export function Footer({ locale, onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-line py-8">
      <div className="page-shell flex flex-col gap-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} Juan Carlos Ochoa ·{' '}
          {locale === 'es' ? 'Hecho con intención.' : 'Built with intention.'}
        </p>
        <a className="footer-top focus-ring" href={`/${locale}`} onClick={(event) => { event.preventDefault(); onNavigate(`/${locale}`) }}>
          {locale === 'es' ? 'Volver arriba' : 'Back to top'}
          <ArrowUp aria-hidden="true" size={15} />
        </a>
      </div>
    </footer>
  )
}
