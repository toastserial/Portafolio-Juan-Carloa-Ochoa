import type { IconType } from 'react-icons'
import type { CSSProperties } from 'react'
import {
  SiBitbucket,
  SiExpress,
  SiGithub,
  SiJavascript,
  SiNextdotjs,
  SiPaypal,
  SiPhp,
  SiPython,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVite,
} from 'react-icons/si'

const technologyStyles: Record<
  string,
  { color: string; icon?: IconType; short?: string }
> = {
  React: { color: 'var(--color-accent)', icon: SiReact },
  TypeScript: { color: 'var(--color-accent)', icon: SiTypescript },
  JavaScript: { color: 'var(--color-accent)', icon: SiJavascript },
  'Next.js': { color: 'var(--color-accent)', icon: SiNextdotjs },
  Vite: { color: 'var(--color-accent)', icon: SiVite },
  'Tailwind CSS': { color: 'var(--color-accent)', icon: SiTailwindcss },
  Supabase: { color: 'var(--color-accent)', icon: SiSupabase },
  Express: { color: 'var(--color-accent)', icon: SiExpress },
  PHP: { color: 'var(--color-accent)', icon: SiPhp },
  Python: { color: 'var(--color-accent)', icon: SiPython },
  Bitbucket: { color: 'var(--color-accent)', icon: SiBitbucket },
  GitHub: { color: 'var(--color-accent)', icon: SiGithub },
  'PayPal Sandbox': { color: 'var(--color-accent)', icon: SiPaypal },
  'Three.js': { color: 'var(--color-accent)', icon: SiThreedotjs },
  'Power BI': { color: 'var(--color-accent)', short: 'PBI' },
  'Power Query': { color: 'var(--color-accent)', short: 'PQ' },
  Excel: { color: 'var(--color-accent)', short: 'X' },
  'Data pipelines': { color: 'var(--color-accent)', short: 'ETL' },
  'Data validation': { color: 'var(--color-accent)', short: '✓' },
  'REST API': { color: 'var(--color-accent)', short: 'API' },
  'Data UI': { color: 'var(--color-accent)', short: 'UI' },
}

export function ProjectTechBadge({ name }: { name: string }) {
  const technology = technologyStyles[name] ?? {
    color: 'var(--color-accent)',
    short: name.slice(0, 2).toUpperCase(),
  }
  const Icon = technology.icon

  return (
    <span
      className="project-tech-badge"
      style={{ '--tech-color': technology.color } as CSSProperties}
    >
      <span className="project-tech-icon" aria-hidden="true">
        {Icon ? <Icon /> : technology.short}
      </span>
      {name}
    </span>
  )
}
