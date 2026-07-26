import { AboutSection } from '../components/sections/AboutSection'
import { CapabilitiesSection } from '../components/sections/CapabilitiesSection'
import { ContactSection } from '../components/sections/ContactSection'
import { ExperienceSection } from '../components/sections/ExperienceSection'
import { HeroSection } from '../components/sections/HeroSection'
import { WorkSection } from '../components/sections/WorkSection'
import { WorkExperienceSection } from '../components/sections/WorkExperienceSection'
import type { Locale } from '../types/content'

interface PortfolioPageProps {
  locale: Locale
}

export function PortfolioPage({ locale }: PortfolioPageProps) {
  return (
    <>
      <HeroSection locale={locale} />
      <WorkSection locale={locale} />
      <CapabilitiesSection locale={locale} />
      <WorkExperienceSection locale={locale} />
      <ExperienceSection locale={locale} />
      <AboutSection locale={locale} />
      <ContactSection locale={locale} />
    </>
  )
}
