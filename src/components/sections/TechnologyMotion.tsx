import { ChartNoAxesCombined, Database, FileSpreadsheet, GitMerge, Workflow } from 'lucide-react'
import {
  SiBitbucket, SiFigma, SiGit, SiNextdotjs, SiNodedotjs, SiPhp,
  SiPostgresql, SiPython, SiReact, SiTailwindcss, SiTypescript, SiVite,
} from 'react-icons/si'
import type { ReactNode } from 'react'
import type { TechnologyCategory } from '../../types/content'

const marks: Record<string, ReactNode> = {
  react: <SiReact />,
  typescript: <SiTypescript />,
  nextjs: <SiNextdotjs />,
  vite: <SiVite />,
  tailwind: <SiTailwindcss />,
  node: <SiNodedotjs />,
  php: <SiPhp />,
  sql: <SiPostgresql />,
  'power-query': <Workflow />,
  'power-bi': <ChartNoAxesCombined />,
  excel: <FileSpreadsheet />,
  'python-data': <SiPython />,
  'data-pipelines': <Database />,
  git: <SiGit />,
  bitbucket: <SiBitbucket />,
  figma: <SiFigma />,
}

export function TechnologyMotion({ id, category }: { id: string; category: TechnologyCategory }) {
  return (
    <div aria-hidden="true" className={`stack-tool-motion stack-tool-motion-${category}`}>
      <span className="stack-tool-mark">{marks[id] ?? <GitMerge />}</span>
      <span className="stack-tool-track">
        <span />
        <span />
        <span />
      </span>
    </div>
  )
}
