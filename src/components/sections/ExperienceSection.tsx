import type { Locale } from '../../types/content'
import { TechnologyMarquee } from './TechnologyMarquee'

export function ExperienceSection({ locale }: { locale: Locale }) {
  return <TechnologyMarquee locale={locale} />
}
