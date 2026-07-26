import { ArrowUp } from 'lucide-react'
import type { Locale } from '../../types/content'

interface FooterProps {
  locale: Locale
}

export function Footer({ locale }: FooterProps) {
  return (
    <footer className="border-t border-line py-8">
      <div className="page-shell flex flex-col gap-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} Juan Carlos Ochoa ·{' '}
          {locale === 'es' ? 'Hecho con intención.' : 'Built with intention.'}
        </p>
        <a className="footer-top focus-ring" href="#top">
          {locale === 'es' ? 'Volver arriba' : 'Back to top'}
          <ArrowUp aria-hidden="true" size={15} />
        </a>
      </div>
    </footer>
  )
}
