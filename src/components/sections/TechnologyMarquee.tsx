import { BarChart3, Workflow } from 'lucide-react'
import { FaFileExcel } from 'react-icons/fa'
import {
  SiBitbucket,
  SiFigma,
  SiGit,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from 'react-icons/si'
import type { CSSProperties, ComponentType } from 'react'
import type { Locale } from '../../types/content'
import LogoMarquee, { type Logo } from '../ui/logo-marquee'

type LogoIcon = ComponentType<{
  'aria-hidden'?: boolean
  size?: number | string
  style?: CSSProperties
}>

const logos: Logo[] = [
  { alt: 'React', color: 'var(--color-accent)', icon: SiReact as LogoIcon },
  { alt: 'TypeScript', color: 'var(--color-accent)', icon: SiTypescript as LogoIcon },
  { alt: 'Next.js', color: 'var(--color-accent)', icon: SiNextdotjs as LogoIcon },
  { alt: 'Vite', color: 'var(--color-accent)', icon: SiVite as LogoIcon },
  { alt: 'Tailwind CSS', color: 'var(--color-accent)', icon: SiTailwindcss as LogoIcon },
  { alt: 'Node.js', color: 'var(--color-accent)', icon: SiNodedotjs as LogoIcon },
  { alt: 'PHP', color: 'var(--color-accent)', icon: SiPhp as LogoIcon },
  { alt: 'SQL', color: 'var(--color-accent)', icon: SiPostgresql as LogoIcon },
  { alt: 'Power BI', color: 'var(--color-accent)', icon: BarChart3 as LogoIcon },
  { alt: 'Excel', color: 'var(--color-accent)', icon: FaFileExcel as LogoIcon },
  { alt: 'Python', color: 'var(--color-accent)', icon: SiPython as LogoIcon },
  { alt: 'Git', color: 'var(--color-accent)', icon: SiGit as LogoIcon },
  { alt: 'Bitbucket', color: 'var(--color-accent)', icon: SiBitbucket as LogoIcon },
  { alt: 'Figma', color: 'var(--color-accent)', icon: SiFigma as LogoIcon },
  { alt: 'Power Query', color: 'var(--color-accent)', icon: Workflow as LogoIcon },
]

export function TechnologyMarquee({ locale }: { locale: Locale }) {
  return (
    <section className="technology-marquee-section" id="stack">
      <LogoMarquee
        ariaLabel={locale === 'es' ? 'Tecnologías que uso' : 'Technologies I use'}
        logos={logos}
      />
    </section>
  )
}
