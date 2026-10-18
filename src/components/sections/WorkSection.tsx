import { projects } from '../../data/projects'
import type { Locale } from '../../types/content'
import { ProjectExplorer } from '../projects/ProjectExplorer'

export function WorkSection({ locale, onNavigate }: { locale: Locale; onNavigate: (href: string) => void }) {
  const es = locale === 'es'
  return (
    <section aria-label={es ? 'Proyectos' : 'Projects'} className="section-shell work-project-section" id="work">
      <ProjectExplorer locale={locale} onNavigate={onNavigate} projects={projects} />
    </section>
  )
}
