import { Download } from 'lucide-react'
import { Reveal } from '../ui/Reveal'
import { ScrollLyricsText } from '../effects/ScrollLyricsText'
import { SmudgeReveal } from '../effects/SmudgeReveal'
import type { Locale } from '../../types/content'

export function EducationSection({ locale }: { locale: Locale }) {
  const es = locale === 'es'

  return (
    <section className="section-shell education-section" id="education">
      <div className="education-grid">
        <Reveal className="education-degree">
          <p className="technical-label">{es ? 'FORMACIÓN' : 'EDUCATION'}</p>
          <SmudgeReveal
            className="about-heading-smudge education-smudge"
            label={es ? 'Pasa el cursor para revelar otra idea' : 'Move the pointer to reveal another idea'}
            revealed={<h2>{es ? 'Aprender nunca termina.' : 'Learning never stops.'}</h2>}
          >
            <h2><ScrollLyricsText text={es ? 'Ingeniería en Ciencias de la Computación.' : 'Computer Science Engineering.'} /></h2>
          </SmudgeReveal>
          <p>{es ? 'Universidad Católica de Honduras' : 'Catholic University of Honduras'}</p>
        </Reveal>

        <Reveal className="education-details" delay={0.1}>
          <div>
            <span>{es ? 'DISTINCIÓN' : 'HONORS'}</span>
            <strong>Magna Cum Laude · {es ? '2.º lugar' : '2nd place'}</strong>
          </div>
          <div>
            <span>{es ? 'IDIOMAS' : 'LANGUAGES'}</span>
            <strong>{es ? 'Español · Inglés avanzado' : 'Spanish · Advanced English'}</strong>
          </div>
          <a className="button-secondary education-cv" download href="/cv-juan-ochoa.pdf">
            {es ? 'Descargar CV' : 'Download CV'} <Download aria-hidden="true" size={17} />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
