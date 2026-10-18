import { AboutSection } from '../components/sections/AboutSection'
import { ContactSection } from '../components/sections/ContactSection'
import { CapabilitiesSection } from '../components/sections/CapabilitiesSection'
import { EducationSection } from '../components/sections/EducationSection'
import { ExperienceSection } from '../components/sections/ExperienceSection'
import { HeroSection } from '../components/sections/HeroSection'
import { PhilosophySection } from '../components/sections/PhilosophySection'
import { WorkSection } from '../components/sections/WorkSection'
import { WorkExperienceSection } from '../components/sections/WorkExperienceSection'
import { ProjectDetailPage } from './ProjectDetailPage'
import type { Locale, PortfolioRoute } from '../types/content'

interface PortfolioPageProps {
  locale: Locale
  onNavigate: (href: string) => void
  route: PortfolioRoute
  projectId?: string
}

export function PortfolioPage({ locale, onNavigate, projectId, route }: PortfolioPageProps) {
  if (route === 'about') {
    return <>
      <AboutSection locale={locale} />
      <CapabilitiesSection locale={locale} />
      <WorkExperienceSection locale={locale} />
      <ExperienceSection locale={locale} />
      <EducationSection locale={locale} />
      <PhilosophySection locale={locale} />
    </>
  }
  if (route === 'projects') return <WorkSection locale={locale} onNavigate={onNavigate} />
  if (route === 'project' && projectId) return <ProjectDetailPage locale={locale} onNavigate={onNavigate} projectId={projectId} />
  if (route === 'contact') return <ContactSection locale={locale} />
  return <HeroSection locale={locale} />
}
