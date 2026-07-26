import type { Experience } from '../types/content'

export const experience: Experience[] = [
  {
    id: 'software-developer-life-couriers',
    role: {
      es: 'Software Developer',
      en: 'Software Developer',
    },
    company: 'Life Couriers',
    startDate: '2026-07-03',
    responsibilities: [
      {
        es: 'Desarrollo de software para apoyar procesos y herramientas internas.',
        en: 'Software development supporting internal processes and tools.',
      },
      {
        es: 'Transición de necesidades operativas y de datos hacia soluciones mantenibles.',
        en: 'Translating operational and data needs into maintainable solutions.',
      },
    ],
    technologies: ['Software Development', 'Data-informed systems'],
    contributions: [
      {
        es: 'Aporto contexto previo de datos y operaciones al desarrollo de nuevas soluciones.',
        en: 'Bringing prior data and operations context into new software solutions.',
      },
    ],
    learnings: [
      {
        es: 'Conectar análisis, procesos y desarrollo dentro de un mismo producto.',
        en: 'Connecting analysis, processes, and development within the same product.',
      },
    ],
  },
  {
    id: 'data-analyst-life-couriers',
    role: {
      es: 'Analista de Datos',
      en: 'Data Analyst',
    },
    company: 'Life Couriers',
    startDate: '2025-09-16',
    endDate: '2026-07-03',
    responsibilities: [
      {
        es: 'Preparación y transformación de datos con Power Query, Excel y tablas dinámicas.',
        en: 'Data preparation and transformation with Power Query, Excel, and PivotTables.',
      },
      {
        es: 'Construcción de dashboards operativos y modelos analíticos en Power BI.',
        en: 'Building operational dashboards and analytical models in Power BI.',
      },
      {
        es: 'Participación en flujos de datos, pipelines y estructuras orientadas a reporting.',
        en: 'Contributing to data flows, pipelines, and reporting-oriented structures.',
      },
    ],
    technologies: [
      'Power Query',
      'Excel',
      'PivotTables',
      'Power BI',
      'Python',
      'Data pipelines',
    ],
    contributions: [
      {
        es: 'Estructuré una automatización para procesar invoices recibidos en distintos idiomas y formatos.',
        en: 'Structured an automation workflow for invoices received in different languages and formats.',
      },
      {
        es: 'Organicé transformaciones reutilizables para normalizar y validar información antes del análisis.',
        en: 'Organized reusable transformations to normalize and validate information before analysis.',
      },
    ],
    learnings: [
      {
        es: 'Diseñar procesos de datos claros antes de construir la visualización final.',
        en: 'Designing clear data processes before building the final visualization.',
      },
    ],
  },
  {
    id: 'frontend-intern-palmerola',
    role: {
      es: 'Desarrollador Junior · Frontend',
      en: 'Junior Frontend Developer',
    },
    company: 'Aeropuerto Internacional Palmerola',
    startDate: '2025-02-01',
    endDate: '2025-04-30',
    responsibilities: [
      {
        es: 'Desarrollo y mantenimiento de interfaces para sistemas internos con React, Next.js y Tailwind CSS.',
        en: 'Built and maintained interfaces for internal systems using React, Next.js, and Tailwind CSS.',
      },
      {
        es: 'Migración de estilos, creación de componentes reutilizables y mejora de experiencias responsive.',
        en: 'Migrated styles, created reusable components, and improved responsive experiences.',
      },
      {
        es: 'Pruebas funcionales, corrección de errores e integración con servicios junto a equipos de UI/UX y backend.',
        en: 'Performed functional testing, fixed defects, and integrated services with UI/UX and backend teams.',
      },
    ],
    technologies: [
      'Next.js',
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Bitbucket',
    ],
    contributions: [
      {
        es: 'Participé en CENDO y SkyControl, dos plataformas internas orientadas a gestión documental y operaciones aeroportuarias.',
        en: 'Contributed to CENDO and SkyControl, internal platforms for document management and airport operations.',
      },
    ],
    learnings: [
      {
        es: 'Trabajo colaborativo con Git, revisión de código y entrega de interfaces dentro de productos reales.',
        en: 'Collaborative Git workflows, code review, and shipping interfaces in real products.',
      },
    ],
  },
].sort((first, second) => first.startDate.localeCompare(second.startDate))
