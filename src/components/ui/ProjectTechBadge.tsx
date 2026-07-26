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
  React: { color: '#61dafb', icon: SiReact },
  TypeScript: { color: '#3178c6', icon: SiTypescript },
  JavaScript: { color: '#f7df1e', icon: SiJavascript },
  'Next.js': { color: '#f5f5f5', icon: SiNextdotjs },
  Vite: { color: '#a66cff', icon: SiVite },
  'Tailwind CSS': { color: '#38bdf8', icon: SiTailwindcss },
  Supabase: { color: '#3ecf8e', icon: SiSupabase },
  Express: { color: '#b8bdc7', icon: SiExpress },
  PHP: { color: '#8993be', icon: SiPhp },
  Python: { color: '#ffd343', icon: SiPython },
  Bitbucket: { color: '#2684ff', icon: SiBitbucket },
  GitHub: { color: '#f5f5f5', icon: SiGithub },
  'PayPal Sandbox': { color: '#169bd7', icon: SiPaypal },
  'Three.js': { color: '#f5f5f5', icon: SiThreedotjs },
  'Power BI': { color: '#f2c811', short: 'PBI' },
  'Power Query': { color: '#21a366', short: 'PQ' },
  Excel: { color: '#21a366', short: 'X' },
  'Data pipelines': { color: '#ff8a3d', short: 'ETL' },
  'Data validation': { color: '#a78bfa', short: '✓' },
  'REST API': { color: '#ff6b6b', short: 'API' },
  'Data UI': { color: '#67e8f9', short: 'UI' },
}

export function ProjectTechBadge({ name }: { name: string }) {
  const technology = technologyStyles[name] ?? {
    color: '#ffb000',
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
