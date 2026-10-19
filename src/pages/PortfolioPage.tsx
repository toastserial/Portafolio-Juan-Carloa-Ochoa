import { lazy, Suspense } from 'react'
import { HeroSection } from '../components/sections/HeroSection'
import type { Locale, PortfolioRoute } from '../types/content'

const AboutSection = lazy(() => import('../components/sections/AboutSection').then((module) => ({ default: module.AboutSection })))
const CapabilitiesSection = lazy(() => import('../components/sections/CapabilitiesSection').then((module) => ({ default: module.CapabilitiesSection })))
const ContactSection = lazy(() => import('../components/sections/ContactSection').then((module) => ({ default: module.ContactSection })))
const EducationSection = lazy(() => import('../components/sections/EducationSection').then((module) => ({ default: module.EducationSection })))
const ExperienceSection = lazy(() => import('../components/sections/ExperienceSection').then((module) => ({ default: module.ExperienceSection })))
const PhilosophySection = lazy(() => import('../components/sections/PhilosophySection').then((module) => ({ default: module.PhilosophySection })))
const WorkExperienceSection = lazy(() => import('../components/sections/WorkExperienceSection').then((module) => ({ default: module.WorkExperienceSection })))
const WorkSection = lazy(() => import('../components/sections/WorkSection').then((module) => ({ default: module.WorkSection })))
const ProjectDetailPage = lazy(() => import('./ProjectDetailPage').then((module) => ({ default: module.ProjectDetailPage })))

interface PortfolioPageProps {
  locale: Locale
  onNavigate: (href: string) => void
  route: PortfolioRoute
  projectId?: string
}

function RouteFallback({ locale }: { locale: Locale }) {
  return (
    <div aria-live="polite" className="route-lazy-fallback" role="status">
      <span aria-hidden="true" />
      <p>{locale === 'es' ? 'Preparando la experiencia' : 'Preparing the experience'}</p>
    </div>
  )
}

export function PortfolioPage({ locale, onNavigate, projectId, route }: PortfolioPageProps) {
  if (route === 'about') {
    return (
      <Suspense fallback={<RouteFallback locale={locale} />}>
        <AboutSection locale={locale} />
        <CapabilitiesSection locale={locale} />
        <WorkExperienceSection locale={locale} />
        <ExperienceSection locale={locale} />
        <EducationSection locale={locale} />
        <PhilosophySection locale={locale} />
      </Suspense>
    )
  }
  if (route === 'projects') return <Suspense fallback={<RouteFallback locale={locale} />}><WorkSection locale={locale} onNavigate={onNavigate} /></Suspense>
  if (route === 'project' && projectId) return <Suspense fallback={<RouteFallback locale={locale} />}><ProjectDetailPage locale={locale} onNavigate={onNavigate} projectId={projectId} /></Suspense>
  if (route === 'contact') return <Suspense fallback={<RouteFallback locale={locale} />}><ContactSection locale={locale} /></Suspense>
  return <HeroSection locale={locale} />
}
