// src/contexts/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Traducciones básicas - puedes expandir esto
const translations = {
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.projects': 'Proyectos',
    'nav.skills': 'Habilidades',
    'nav.contact': 'Contacto',
    
    // Hero Section
    'hero.greeting': 'Hola, soy',
    'hero.name': 'Juan Carlos Ochoa Guzmán',
    'hero.role.prefix': 'Soy',
    'hero.roles.frontend': 'Desarrollador Frontend',
    'hero.roles.react': 'Desarrollador React',
    'hero.roles.fullstack': 'Desarrollador Full Stack',
    'hero.roles.uiux': 'UI/UX Developer',
    'hero.description': 'Especializado en crear experiencias web modernas y funcionales, apasionado por el código limpio, el diseño intuitivo y las últimas tecnologías.',
    'hero.viewProjects': 'Ver mis proyectos',
    'hero.downloadCV': 'Descargar CV',
    
    // Projects
    'projects.title': 'Mis Proyectos',
    'projects.subtitle': 'Una colección de proyectos que demuestran mis habilidades en desarrollo web, aplicaciones móviles y soluciones técnicas innovadoras.',
    'projects.search': 'Buscar proyectos o tecnologías...',
    'projects.noResults': 'No se encontraron proyectos',
    'projects.filter.all': 'Todos',
    'projects.filter.web': 'Web',
    'projects.filter.mobile': 'Móvil',
    'projects.filter.api': 'API',
    
    // Skills
    'skills.title': 'Mis Habilidades',
    'skills.subtitle': 'Tecnologías y herramientas que domino',
    'skills.count': 'habilidades',
    'skills.level': 'Nivel promedio',
    'skills.category.all': 'Todas',
    'skills.category.frontend': 'Frontend',
    'skills.category.backend': 'Backend',
    'skills.category.tools': 'Herramientas',
    'skills.category.design': 'Diseño',
    
    // Methodologies
    'methodologies.title': 'Metodologías Ágiles',
    'methodologies.subtitle': '& Procesos de Desarrollo',
    'methodologies.description': 'Experiencia en implementación de metodologías ágiles, desde el levantamiento de requerimientos hasta la entrega continua, fomentando la colaboración y la mejora continua en los equipos de desarrollo.',
    
    // Contact
    'contact.title': 'Contacto',
    'contact.subtitle': 'Hablemos sobre tu próximo proyecto',
    'contact.info.title': 'Información de Contacto',
    'contact.form.name': 'Nombre completo',
    'contact.form.email': 'Correo electrónico',
    'contact.form.subject': 'Asunto',
    'contact.form.message': 'Mensaje',
    'contact.form.send': 'Enviar mensaje',
    'contact.form.sending': 'Enviando...',
    'contact.form.success': '¡Mensaje enviado con éxito!',
    'contact.form.error': 'Error al enviar el mensaje',
    'contact.form.required': 'Este campo es requerido',
    'contact.form.emailInvalid': 'Correo electrónico inválido',
    'contact.form.nameShort': 'El nombre debe tener al menos 2 caracteres',
    'contact.form.messageShort': 'El mensaje debe tener al menos 10 caracteres',
    
    // Common
    'common.viewProject': 'Ver Proyecto',
    'common.technologies': 'Tecnologías',
    'common.liveDemo': 'Demo en Vivo',
    'common.sourceCode': 'Código Fuente',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.greeting': 'Hello, I am',
    'hero.name': 'Juan Carlos Ochoa Guzmán',
    'hero.role.prefix': 'I am',
    'hero.roles.frontend': 'Frontend Developer',
    'hero.roles.react': 'React Developer',
    'hero.roles.fullstack': 'Full Stack Developer',
    'hero.roles.uiux': 'UI/UX Developer',
    'hero.description': 'Specialized in creating modern and functional web experiences, passionate about clean code, intuitive design and the latest technologies.',
    'hero.viewProjects': 'View my projects',
    'hero.downloadCV': 'Download CV',
    
    // Projects
    'projects.title': 'My Projects',
    'projects.subtitle': 'A collection of projects that demonstrate my skills in web development, mobile applications and innovative technical solutions.',
    'projects.search': 'Search projects or technologies...',
    'projects.noResults': 'No projects found',
    'projects.filter.all': 'All',
    'projects.filter.web': 'Web',
    'projects.filter.mobile': 'Mobile',
    'projects.filter.api': 'API',
    
    // Skills
    'skills.title': 'My Skills',
    'skills.subtitle': 'Technologies and tools I master',
    'skills.count': 'skills',
    'skills.level': 'Average level',
    'skills.category.all': 'All',
    'skills.category.frontend': 'Frontend',
    'skills.category.backend': 'Backend',
    'skills.category.tools': 'Tools',
    'skills.category.design': 'Design',
    
    // Methodologies
    'methodologies.title': 'Agile Methodologies',
    'methodologies.subtitle': '& Development Processes',
    'methodologies.description': 'Experience implementing agile methodologies, from requirements gathering to continuous delivery, fostering collaboration and continuous improvement in development teams.',
    
    // Contact
    'contact.title': 'Contact',
    'contact.subtitle': 'Let\'s talk about your next project',
    'contact.info.title': 'Contact Information',
    'contact.form.name': 'Full name',
    'contact.form.email': 'Email address',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send message',
    'contact.form.sending': 'Sending...',
    'contact.form.success': 'Message sent successfully!',
    'contact.form.error': 'Error sending message',
    'contact.form.required': 'This field is required',
    'contact.form.emailInvalid': 'Invalid email address',
    'contact.form.nameShort': 'Name must be at least 2 characters',
    'contact.form.messageShort': 'Message must be at least 10 characters',
    
    // Common
    'common.viewProject': 'View Project',
    'common.technologies': 'Technologies',
    'common.liveDemo': 'Live Demo',
    'common.sourceCode': 'Source Code',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'es' ? 'en' : 'es';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
