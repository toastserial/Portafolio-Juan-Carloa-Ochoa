import type { Project } from '../types/content'

export const projects: Project[] = [
  {
    id: 'multilingual-invoice-automation',
    title: {
      es: 'Automatización de invoices multilingües',
      en: 'Multilingual invoice automation',
    },
    category: {
      es: 'Caso profesional',
      en: 'Professional case',
    },
    status: 'professional',
    problem: {
      es: 'Invoices recibidos en distintos idiomas y formatos requerían una preparación consistente antes de ser utilizados.',
      en: 'Invoices received in different languages and formats required consistent preparation before use.',
    },
    solution: {
      es: 'Un flujo estructurado de ingestión, transformación, normalización, validación y salida para análisis.',
      en: 'A structured flow for ingestion, transformation, normalization, validation, and analytical output.',
    },
    participation: {
      es: 'Definición de transformaciones, reglas de validación y apoyo de automatización con Python.',
      en: 'Transformation design, validation rules, and Python-assisted automation.',
    },
    outcome: {
      es: 'Un proceso repetible para preparar información heterogénea antes del análisis.',
      en: 'A repeatable process for preparing heterogeneous information before analysis.',
    },
    learning: {
      es: 'La validación debe diseñarse junto con la transformación, no agregarse al final.',
      en: 'Validation should be designed alongside transformation, not added at the end.',
    },
    period: { es: 'Sep 2025 — Jul 2026', en: 'Sep 2025 — Jul 2026' },
    image: '/preview/Planning power Transform data.jpg',
    images: ['/preview/Planning power Transform data.jpg'],
    stack: ['Power Query', 'Excel', 'Python', 'Data validation'],
    featured: true,
    nextSteps: {
      es: 'Continuar reduciendo pasos manuales y fortalecer las validaciones.',
      en: 'Continue reducing manual steps and strengthen validation.',
    },
  },
  {
    id: 'power-bi-operational-dashboards',
    title: {
      es: 'Dashboards operativos',
      en: 'Operational dashboards',
    },
    category: {
      es: 'Business intelligence',
      en: 'Business intelligence',
    },
    status: 'professional',
    problem: {
      es: 'La información operativa necesitaba una estructura común para poder consultarse y compararse.',
      en: 'Operational information needed a common structure to be queried and compared.',
    },
    solution: {
      es: 'Preparación de datos, modelos analíticos y dashboards en Power BI conectados a flujos de actualización.',
      en: 'Data preparation, analytical models, and Power BI dashboards connected to refresh flows.',
    },
    participation: {
      es: 'Transformación de datos, organización del modelo y construcción de visualizaciones.',
      en: 'Data transformation, model organization, and visualization building.',
    },
    outcome: {
      es: 'Información operativa organizada en una experiencia de consulta consistente.',
      en: 'Operational information organized into a consistent reporting experience.',
    },
    learning: {
      es: 'Un dashboard útil comienza con un modelo de datos claro.',
      en: 'A useful dashboard begins with a clear data model.',
    },
    period: { es: '2025 — 2026', en: '2025 — 2026' },
    image: '/preview/Power Bi reports.png',
    images: ['/preview/Power Bi reports.png'],
    stack: ['Power BI', 'Power Query', 'Excel', 'Data pipelines'],
    featured: false,
  },
  {
    id: 'portfolio',
    title: { es: 'Portafolio personal', en: 'Personal portfolio' },
    category: { es: 'Producto personal', en: 'Personal product' },
    status: 'in-development',
    problem: {
      es: 'Presentar mi perfil técnico sin depender de una plantilla genérica.',
      en: 'Present my technical profile without relying on a generic template.',
    },
    solution: {
      es: 'Una experiencia bilingüe, accesible y editorial construida con React y una escena 3D progresiva.',
      en: 'A bilingual, accessible editorial experience built with React and a progressive 3D scene.',
    },
    participation: {
      es: 'Dirección visual, arquitectura frontend e implementación.',
      en: 'Visual direction, frontend architecture, and implementation.',
    },
    period: { es: '2025 — Actualidad', en: '2025 — Present' },
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Three.js'],
    featured: false,
    nextSteps: {
      es: 'Validar contenido, optimizar el modelo y publicar.',
      en: 'Validate content, optimize the model, and publish.',
    },
  },
  {
    id: 'cendo',
    title: { es: 'CENDO', en: 'CENDO' },
    category: {
      es: 'Pasantía · Palmerola',
      en: 'Internship · Palmerola',
    },
    status: 'professional',
    problem: {
      es: 'Modernizar la interfaz de un sistema interno de gestión documental.',
      en: 'Modernize the interface of an internal document-management system.',
    },
    solution: {
      es: 'Migración de Bootstrap a Tailwind CSS, componentes reutilizables y una interfaz responsive sobre Next.js.',
      en: 'Migrated Bootstrap styles to Tailwind CSS, built reusable components, and delivered a responsive Next.js interface.',
    },
    participation: {
      es: 'Desarrollo frontend, migración visual, refactorización y colaboración mediante Bitbucket.',
      en: 'Frontend development, visual migration, refactoring, and Bitbucket-based collaboration.',
    },
    period: { es: 'Feb — Mar 2025', en: 'Feb — Mar 2025' },
    image: '/preview/cendo-login.png',
    images: [
      '/preview/cendo-login.png',
      '/preview/Bitbucket-CendoFrontEnd.png',
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Bitbucket'],
    featured: false,
  },
  {
    id: 'skycontrol',
    title: { es: 'SkyControl', en: 'SkyControl' },
    category: {
      es: 'Pasantía · Palmerola',
      en: 'Internship · Palmerola',
    },
    status: 'professional',
    problem: {
      es: 'Construir una experiencia web clara para supervisar operaciones aeroportuarias.',
      en: 'Build a clear web experience for monitoring airport operations.',
    },
    solution: {
      es: 'Interfaz dinámica y adaptativa con React, Vite y Tailwind CSS, optimizada mediante carga eficiente de componentes.',
      en: 'A dynamic, adaptive interface using React, Vite, and Tailwind CSS with efficient component loading.',
    },
    participation: {
      es: 'Desarrollo frontend, diseño responsive, optimización y flujo colaborativo con Git.',
      en: 'Frontend development, responsive design, optimization, and collaborative Git workflow.',
    },
    period: { es: 'Mar — Abr 2025', en: 'Mar — Apr 2025' },
        image: '/preview/SkyControl.png',
    images: [
      '/preview/SkyControl.png',
      '/preview/Bitbucket-SkyControlFrontEnd.png',
    ],
    stack: ['React', 'Vite', 'JavaScript', 'Tailwind CSS', 'Bitbucket'],
    featured: false,
  },
  {
    id: 'autolote',
    title: { es: 'Gestión de Autolote', en: 'Dealership management' },
    category: { es: 'Proyecto académico', en: 'Academic project' },
    status: 'practice',
    problem: {
      es: 'Centralizar la consulta pública de vehículos y la administración interna del inventario.',
      en: 'Centralize public vehicle browsing and internal inventory management.',
    },
    solution: {
      es: 'API y aplicación web con catálogo para clientes y dashboard administrativo para empleados.',
      en: 'An API and web application with a customer catalog and an employee administration dashboard.',
    },
    participation: {
      es: 'Diseño de la solución, desarrollo de la API y construcción de la interfaz.',
      en: 'Solution design, API development, and interface implementation.',
    },
    period: { es: 'Oct — Dic 2024', en: 'Oct — Dec 2024' },
    image: '/preview/project-autolote.png',
    images: ['/preview/project-autolote.png'],
    stack: ['React', 'JavaScript', 'REST API', 'GitHub'],
    featured: false,
  },
  {
    id: 'commerce-concept',
    title: { es: 'E-commerce de tecnología', en: 'Technology e-commerce' },
    category: { es: 'Proyecto académico', en: 'Academic project' },
    status: 'practice',
    problem: {
      es: 'Implementar una experiencia de compra completa para un catálogo tecnológico.',
      en: 'Implement a complete purchasing experience for a technology catalog.',
    },
    solution: {
      es: 'Carrito con altas, cambios y eliminación de productos, además de pagos simulados con PayPal Sandbox.',
      en: 'A cart with add, update, and remove actions plus simulated payments through PayPal Sandbox.',
    },
    participation: {
      es: 'Desarrollo del flujo de compra y la integración del entorno de pagos.',
      en: 'Developed the purchase flow and payment sandbox integration.',
    },
    period: { es: 'Abr 2024', en: 'Apr 2024' },
    stack: ['PHP', 'PayPal Sandbox', 'GitHub'],
    featured: false,
  },
  {
    id: 'radiopharma',
    title: { es: 'Radiopharma', en: 'Radiopharma' },
    category: {
      es: 'Desarrollo interno · Life Couriers',
      en: 'Internal development · Life Couriers',
    },
    status: 'in-development',
    problem: {
      es: 'Centralizar documentación, consultas a una API gubernamental y procesos internos de información en un solo sistema.',
      en: 'Centralize documentation, government API queries, and internal information workflows in a single system.',
    },
    solution: {
      es: 'Aplicación interna con una interfaz documental, integración de servicios y administración segura de datos.',
      en: 'An internal application with a documentation interface, service integration, and secure data management.',
    },
    participation: {
      es: 'Desarrollo full stack, integración de API y diseño del flujo interno de base de datos.',
      en: 'Full-stack development, API integration, and internal database workflow design.',
    },
    outcome: {
      es: 'Una base central para documentación, consultas externas y gestión interna.',
      en: 'A central foundation for documentation, external queries, and internal management.',
    },
    learning: {
      es: 'Diseñar límites claros entre documentación, integraciones y datos internos.',
      en: 'Designing clear boundaries between documentation, integrations, and internal data.',
    },
    period: { es: '2026 — En desarrollo', en: '2026 — In development' },
    image: '/preview/RadioPharma.png',
    images: ['/preview/RadioPharma.png'],
    stack: ['Next.js', 'Supabase', 'Express', 'Tailwind CSS'],
    featured: false,
    nextSteps: {
      es: 'Continuar validando permisos, trazabilidad y flujos operativos con usuarios internos.',
      en: 'Continue validating permissions, traceability, and operational flows with internal users.',
    },
  },
]
