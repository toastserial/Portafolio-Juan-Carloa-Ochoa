
import type { Project } from '../types/project';

export const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Moderno',
    description: 'Plataforma de comercio electrónico completa con React, TypeScript y Stripe.',
    longDescription: 'Una aplicación de comercio electrónico completa con carrito de compras, autenticación de usuarios, procesamiento de pagos con Stripe, y panel de administración.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'],
    githubUrl: 'https://github.com/tu-usuario/ecommerce-app',
    liveUrl: 'https://tu-ecommerce.vercel.app',
    featured: true,
    category: 'web',
    status: 'completed',
    year: 2024
  },
  {
    id: '2',
    title: 'Dashboard Analytics',
    description: 'Dashboard interactivo para análisis de datos con gráficos dinámicos.',
    longDescription: 'Un dashboard completo para visualización de datos con múltiples tipos de gráficos, filtros avanzados y exportación de reportes.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
    technologies: ['React', 'D3.js', 'Chart.js', 'Material-UI', 'Firebase'],
    githubUrl: 'https://github.com/tu-usuario/analytics-dashboard',
    liveUrl: 'https://tu-dashboard.netlify.app',
    featured: true,
    category: 'web',
    status: 'completed',
    year: 2024
  },
  {
    id: '3',
    title: 'App de Tareas',
    description: 'Aplicación móvil para gestión de tareas con React Native.',
    longDescription: 'Una aplicación móvil completa para gestión de tareas con sincronización en la nube, notificaciones push y modo offline.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&h=300&fit=crop',
    technologies: ['React Native', 'Expo', 'Firebase', 'Redux', 'AsyncStorage'],
    githubUrl: 'https://github.com/tu-usuario/tasks-app',
    featured: false,
    category: 'mobile',
    status: 'completed',
    year: 2023
  },
  {
    id: '4',
    title: 'API RESTful',
    description: 'API robusta para aplicaciones web con autenticación JWT.',
    longDescription: 'Una API RESTful completa con autenticación JWT, documentación con Swagger, y pruebas automatizadas.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Swagger', 'Jest'],
    githubUrl: 'https://github.com/tu-usuario/rest-api',
    featured: false,
    category: 'api',
    status: 'completed',
    year: 2023
  },
  {
    id: '5',
    title: 'Portfolio Personal',
    description: 'Mi portafolio personal desarrollado con React y Framer Motion.',
    longDescription: 'Un portafolio moderno y responsivo con animaciones suaves, tema oscuro/claro y formulario de contacto funcional.',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500&h=300&fit=crop',
    technologies: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'Vite'],
    githubUrl: 'https://github.com/tu-usuario/portfolio',
    liveUrl: 'https://tu-portfolio.vercel.app',
    featured: true,
    category: 'web',
    status: 'completed',
    year: 2024
  },
  {
    id: '6',
    title: 'Sistema de Blog',
    description: 'CMS personalizado para blogs con editor rich text.',
    longDescription: 'Un sistema de gestión de contenido completo con editor WYSIWYG, categorías, etiquetas y comentarios.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68e2c4fd81?w=500&h=300&fit=crop',
    technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'NextAuth.js', 'TailwindCSS'],
    githubUrl: 'https://github.com/tu-usuario/blog-cms',
    liveUrl: 'https://tu-blog.vercel.app',
    featured: false,
    category: 'web',
    status: 'in-progress',
    year: 2024
  }
];