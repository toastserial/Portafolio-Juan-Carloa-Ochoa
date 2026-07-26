import { Reveal } from '../ui/Reveal'
import type { Locale } from '../../types/content'

export function AboutSection({ locale }: { locale: Locale }) {
  const es = locale === 'es'

  return (
    <section className="section-shell about-layout" id="about">
      <Reveal className="about-portrait">
        <img
          alt={es ? 'Retrato de Juan Carlos Ochoa' : 'Portrait of Juan Carlos Ochoa'}
          height="720"
          loading="lazy"
          src="/images/avatar/juan.jpg"
          width="720"
        />
        <span>Honduras · UTC−6</span>
      </Reveal>
      <Reveal className="about-copy" delay={0.08}>
        <p className="technical-label">{es ? '05 / Perfil' : '05 / About'}</p>
        <h2>
          {es
            ? 'Código limpio. Interfaces directas. Curiosidad constante.'
            : 'Clean code. Direct interfaces. Constant curiosity.'}
        </h2>
        <p>
          {es
            ? 'Soy Juan, desarrollador enfocado en crear experiencias web modernas y funcionales. Me interesa el punto donde una buena estructura técnica y una interfaz clara se encuentran.'
            : 'I’m Juan, a developer focused on modern, functional web experiences. I care about the point where solid technical structure and a clear interface meet.'}
        </p>
        <p>
          {es
            ? 'Soy Ingeniero en Ciencias de la Computación por la Universidad Católica de Honduras. Trabajo con frontend, backend y datos, cuidando que cada decisión tenga un propósito.'
            : 'I hold a Computer Science Engineering degree from the Catholic University of Honduras. I work across frontend, backend, and data, making sure every decision has a purpose.'}
        </p>
        <div className="about-values">
          <span>{es ? 'Magna Cum Laude' : 'Magna Cum Laude'}</span>
          <span>{es ? '2.º lugar · Ciencias de la Computación' : '2nd place · Computer Science'}</span>
          <span>{es ? 'Inglés avanzado' : 'Advanced English'}</span>
        </div>
      </Reveal>
    </section>
  )
}
