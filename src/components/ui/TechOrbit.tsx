import type { CSSProperties, ComponentType } from 'react'
import { BarChart3 } from 'lucide-react'
import { FaFileExcel } from 'react-icons/fa'
import {
  SiFigma,
  SiGit,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from 'react-icons/si'
import type { Locale } from '../../types/content'

type OrbitIcon = ComponentType<{
  color?: string
  size?: number | string
}>

interface OrbitTechnology {
  abbreviation?: string
  color: string
  icon?: OrbitIcon
  label: string
}

const dataTechnologies: OrbitTechnology[] = [
  { icon: BarChart3, label: 'Power BI', color: 'var(--color-accent)' },
  { icon: FaFileExcel, label: 'Excel', color: 'var(--color-accent)' },
  { abbreviation: 'PQ', label: 'Power Query', color: 'var(--color-accent)' },
  { icon: SiPython, label: 'Python', color: 'var(--color-accent)' },
  { icon: SiPostgresql, label: 'PostgreSQL', color: 'var(--color-accent)' },
]

const softwareTechnologies: OrbitTechnology[] = [
  { icon: SiReact, label: 'React', color: 'var(--color-accent)' },
  { icon: SiTypescript, label: 'TypeScript', color: 'var(--color-accent)' },
  { icon: SiTailwindcss, label: 'Tailwind CSS', color: 'var(--color-accent)' },
  { icon: SiNodedotjs, label: 'Node.js', color: 'var(--color-accent)' },
  { icon: SiVite, label: 'Vite', color: 'var(--color-accent)' },
  { icon: SiGit, label: 'Git', color: 'var(--color-accent)' },
  { icon: SiFigma, label: 'Figma', color: 'var(--color-accent)' },
]

interface TechOrbitProps {
  locale: Locale
}

export function TechOrbit({ locale }: TechOrbitProps) {
  return (
    <div
      aria-label={
        locale === 'es'
          ? 'Tecnologías de datos y desarrollo en movimiento orbital'
          : 'Data and software technologies in orbital motion'
      }
      className="tech-orbit"
      tabIndex={0}
    >
      <div className="orbit-grid" />
      <div className="orbit-path orbit-path-outer" />
      <div className="orbit-path orbit-path-inner" />

      <div className="orbit-core">
        <span>DATA</span>
        <strong>→</strong>
        <span>SOFTWARE</span>
      </div>

      <OrbitRing
        duration={34}
        radius="clamp(8.2rem, 20vw, 12.5rem)"
        technologies={softwareTechnologies}
      />
      <OrbitRing
        duration={22}
        radius="clamp(5rem, 12vw, 7.4rem)"
        reverse
        technologies={dataTechnologies}
      />

      <p className="orbit-caption">
        {locale === 'es'
          ? 'Datos que terminan en productos útiles.'
          : 'Data that becomes useful products.'}
      </p>
    </div>
  )
}

interface OrbitRingProps {
  duration: number
  radius: string
  reverse?: boolean
  technologies: OrbitTechnology[]
}

function OrbitRing({
  duration,
  radius,
  reverse = false,
  technologies,
}: OrbitRingProps) {
  return (
    <>
      {technologies.map((technology, index) => {
        const angle = (360 / technologies.length) * index
        const style = {
          '--orbit-angle': `${angle}deg`,
          '--orbit-angle-inverse': `${-angle}deg`,
          '--orbit-duration': `${duration}s`,
          '--orbit-radius': radius,
        } as CSSProperties
        const Icon = technology.icon

        return (
          <div
            className={`tech-orbit-item ${reverse ? 'is-reverse' : ''}`}
            key={technology.label}
            style={style}
          >
            <div
              className="tech-orbit-badge"
              style={{ '--technology-color': technology.color } as CSSProperties}
              title={technology.label}
            >
              {Icon ? (
                <span aria-hidden="true">
                  <Icon size={24} />
                </span>
              ) : (
                <strong>{technology.abbreviation}</strong>
              )}
              <span className="sr-only">{technology.label}</span>
            </div>
          </div>
        )
      })}
    </>
  )
}
