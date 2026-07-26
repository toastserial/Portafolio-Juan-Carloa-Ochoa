import { LockKeyhole, MousePointer2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { projects } from '../../data/projects'
import type { Locale, Project } from '../../types/content'
import { ProjectModal } from '../ui/ProjectModal'
import { ProjectTechBadge } from '../ui/ProjectTechBadge'
import { Reveal } from '../ui/Reveal'

export function WorkSection({ locale }: { locale: Locale }) {
  const es = locale === 'es'
  const featured = projects.find((project) => project.featured)
  const projectOrder = [
    'radiopharma',
    'power-bi-operational-dashboards',
    'cendo',
    'skycontrol',
    'autolote',
    'commerce-concept',
    'portfolio',
  ]
  const secondary = projects
    .filter((project) => !project.featured)
    .sort(
      (a, b) =>
        projectOrder.indexOf(a.id) - projectOrder.indexOf(b.id),
    )
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null)
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })
  const closeModal = useCallback(() => setSelectedProject(null), [])

  const movePreview = (event: React.PointerEvent, project: Project) => {
    if (event.pointerType === 'touch') return
    setHoveredProject(project)
    setPreviewPosition({ x: event.clientX, y: event.clientY })
  }

  const openWithKeyboard = (
    event: React.KeyboardEvent,
    project: Project,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setSelectedProject(project)
    }
  }

  return (
    <section className="section-shell" id="work">
      <Reveal className="section-heading">
        <p className="technical-label">{es ? '01 / Trabajo' : '01 / Work'}</p>
        <h2>{es ? 'Ideas convertidas en sistemas.' : 'Ideas turned into systems.'}</h2>
        <p>
          {es
            ? 'Proyectos profesionales, de pasantía y académicos presentados desde mi contribución real.'
            : 'Professional, internship, and academic projects presented through my actual contribution.'}
        </p>
      </Reveal>

      {featured && (
        <Reveal
          className="featured-project project-interactive"
          delay={0.08}
          onClick={() => setSelectedProject(featured)}
          onKeyDown={(event) => openWithKeyboard(event, featured)}
          onPointerLeave={() => setHoveredProject(null)}
          onPointerMove={(event) => movePreview(event, featured)}
          role="button"
          tabIndex={0}
        >
          <div className="featured-visual">
            <div className="browser-bar">
              <span />
              <span />
              <span />
              <p>invoice-pipeline / validated</p>
            </div>
            <div className="data-pipeline-visual">
              <div className="pipeline-heading">
                <span>DATA FLOW / 01</span>
                <strong>Invoices → trusted data</strong>
              </div>
              <div className="pipeline-track">
                {[
                  es ? 'Ingesta' : 'Ingest',
                  es ? 'Transformar' : 'Transform',
                  es ? 'Normalizar' : 'Normalize',
                  es ? 'Validar' : 'Validate',
                  es ? 'Salida' : 'Output',
                ].map((step, index) => (
                  <div className="pipeline-step" key={step}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{step}</strong>
                  </div>
                ))}
                <div className="pipeline-signal" />
              </div>
              <div className="pipeline-footer">
                <span>Power Query</span>
                <span>Excel</span>
                <span>Python</span>
              </div>
            </div>
          </div>
          <div className="featured-copy">
            <span className="project-index">{featured.category[locale]}</span>
            <h3>{featured.title[locale]}</h3>
            <p>{featured.solution[locale]}</p>
            <div className="project-stack">
              {featured.stack.map((item) => (
                <ProjectTechBadge key={item} name={item} />
              ))}
            </div>
            <p className="internal-case-note">
              <LockKeyhole aria-hidden="true" size={15} />
              {es
                ? 'Caso descrito sin datos operativos sensibles.'
                : 'Case described without sensitive operational data.'}
            </p>
          </div>
        </Reveal>
      )}

      <div className="project-list">
        {secondary.map((project, index) => (
          <Reveal
            aria-label={`${es ? 'Abrir proyecto' : 'Open project'}: ${project.title[locale]}`}
            className="project-row project-interactive"
            delay={index * 0.04}
            key={project.id}
            onClick={() => setSelectedProject(project)}
            onKeyDown={(event) => openWithKeyboard(event, project)}
            onPointerLeave={() => setHoveredProject(null)}
            onPointerMove={(event) => movePreview(event, project)}
            role="button"
            tabIndex={0}
          >
            <span className="project-index">
              {String(index + 2).padStart(2, '0')}
            </span>
            <div className="project-row-summary">
              <p className="technical-label">{project.category[locale]}</p>
              <h3>{project.title[locale]}</h3>
              <p>{project.solution[locale]}</p>
              <span className="project-preview-hint">
                <MousePointer2 aria-hidden="true" size={14} />
                {es ? 'Ver preview · clic para detalles' : 'Preview · click for details'}
              </span>
            </div>
            <div className="project-stack">
              {project.stack.map((item) => (
                <ProjectTechBadge key={item} name={item} />
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      {hoveredProject?.image && (
        <div
          aria-hidden="true"
          className="cursor-project-preview"
          style={{
            left: previewPosition.x,
            top: previewPosition.y,
          }}
        >
          <img alt="" src={hoveredProject.image} />
          <div>
            <span>{hoveredProject.category[locale]}</span>
            <strong>{hoveredProject.title[locale]}</strong>
          </div>
        </div>
      )}

      <ProjectModal
        locale={locale}
        onClose={closeModal}
        project={selectedProject}
      />
    </section>
  )
}
