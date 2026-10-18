import type { Locale } from '../../types/content'

export function ProjectFlowArtwork({ locale }: { locale: Locale }) {
  return (
    <div className="project-flow-art" role="img" aria-label={locale === 'es' ? 'Flujo de preparaci\u00f3n y validaci\u00f3n de invoices' : 'Invoice preparation and validation workflow'}>
      <span className="project-flow-kicker">DATA WORKFLOW / INVOICES</span>
      <div className="project-flow-track">
        {(locale === 'es' ? ['Ingesta', 'Transformaci\u00f3n', 'Validaci\u00f3n', 'An\u00e1lisis'] : ['Ingest', 'Transform', 'Validate', 'Analyze']).map((step, index) => (
          <div className="project-flow-step" key={step}>
            <small>0{index + 1}</small>
            <strong>{step}</strong>
          </div>
        ))}
      </div>
      <span className="project-flow-tools">POWER QUERY <i /> EXCEL <i /> PYTHON</span>
    </div>
  )
}
