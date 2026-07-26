import { Code2, Database, DraftingCompass } from 'lucide-react'
import { Reveal } from '../ui/Reveal'
import type { Locale } from '../../types/content'

export function CapabilitiesSection({ locale }: { locale: Locale }) {
  const es = locale === 'es'
  const capabilities = [
    {
      icon: Code2,
      number: '01',
      title: es ? 'Interfaces de producto' : 'Product interfaces',
      body: es
        ? 'Sistemas responsive, componentes reutilizables y flujos que priorizan claridad.'
        : 'Responsive systems, reusable components, and flows that prioritize clarity.',
    },
    {
      icon: Database,
      number: '02',
      title: es ? 'Aplicaciones conectadas' : 'Connected applications',
      body: es
        ? 'Experiencias frontend integradas con servicios, autenticación y datos.'
        : 'Frontend experiences integrated with services, authentication, and data.',
    },
    {
      icon: DraftingCompass,
      number: '03',
      title: es ? 'Diseño con intención' : 'Intentional design',
      body: es
        ? 'Jerarquía, estados y movimiento usados para explicar, no para distraer.'
        : 'Hierarchy, states, and motion used to explain rather than distract.',
    },
  ]

  return (
    <section className="section-shell" id="capabilities">
      <Reveal className="section-heading">
        <p className="technical-label">{es ? '02 / Capacidades' : '02 / Capabilities'}</p>
        <h2>{es ? 'Del problema a una interfaz útil.' : 'From problem to useful interface.'}</h2>
      </Reveal>
      <div className="capability-grid">
        {capabilities.map(({ body, icon: Icon, number, title }, index) => (
          <Reveal className="capability-item" delay={index * 0.08} key={number}>
            <div className="capability-top">
              <Icon aria-hidden="true" size={22} />
              <span>{number}</span>
            </div>
            <h3>{title}</h3>
            <p>{body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
