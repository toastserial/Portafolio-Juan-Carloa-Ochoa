import type { NavigationItem } from '../types/content'

export const navigation: NavigationItem[] = [
  { id: 'home', label: { es: 'Inicio', en: 'Home' }, href: '' },
  { id: 'about', label: { es: 'Perfil', en: 'About' }, href: '/about' },
  { id: 'projects', label: { es: 'Proyectos', en: 'Projects' }, href: '/projects' },
  { id: 'contact', label: { es: 'Contacto', en: 'Contact' }, href: '/contact' },
]
