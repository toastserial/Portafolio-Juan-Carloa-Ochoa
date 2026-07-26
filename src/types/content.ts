export type Locale = 'es' | 'en'
export type WorkspaceMode = 'software' | 'data' | 'automation'

export type ProjectStatus =
  | 'professional'
  | 'personal'
  | 'prototype'
  | 'in-development'
  | 'concept'
  | 'experiment'
  | 'template'
  | 'practice'

export interface LocalizedText {
  es: string
  en: string
}

export interface Project {
  id: string
  title: LocalizedText
  category: LocalizedText
  status: ProjectStatus
  problem: LocalizedText
  solution: LocalizedText
  participation: LocalizedText
  outcome?: LocalizedText
  learning?: LocalizedText
  period?: LocalizedText
  stack: string[]
  image?: string
  images?: string[]
  demoUrl?: string
  repositoryUrl?: string
  nextSteps?: LocalizedText
  featured: boolean
}

export interface Experience {
  id: string
  role: LocalizedText
  company: string
  startDate: string
  endDate?: string
  responsibilities: LocalizedText[]
  technologies: string[]
  contributions: LocalizedText[]
  learnings: LocalizedText[]
}

export type TechnologyCategory =
  | 'frontend'
  | 'backend'
  | 'data'
  | 'tools'

export interface Technology {
  id: string
  name: string
  category: TechnologyCategory
  usage: LocalizedText
}

export interface SocialLink {
  id: string
  label: string
  href: string
  kind: 'email' | 'github' | 'linkedin' | 'other'
}

export interface NavigationItem {
  id: string
  label: LocalizedText
  href: `#${string}`
}
