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
    'hero.title': 'Desarrollador Full Stack',
    'hero.subtitle': 'Especializado en metodologías ágiles y desarrollo moderno',
    'hero.description': 'Creando soluciones digitales innovadoras con las mejores prácticas de desarrollo',
    
    // Projects
    'projects.title': 'Proyectos Destacados',
    'projects.subtitle': 'Algunos de mis trabajos más recientes',
    
    // Skills
    'skills.title': 'Habilidades Técnicas',
    'skills.subtitle': 'Tecnologías y herramientas que domino',
    
    // Methodologies
    'methodologies.title': 'Metodologías Ágiles',
    'methodologies.subtitle': '& Procesos de Desarrollo',
    'methodologies.description': 'Experiencia en implementación de metodologías ágiles, desde el levantamiento de requerimientos hasta la entrega continua, fomentando la colaboración y la mejora continua en los equipos de desarrollo.',
    
    // Contact
    'contact.title': 'Contacto',
    'contact.subtitle': 'Hablemos sobre tu próximo proyecto',
    
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
    'hero.title': 'Full Stack Developer',
    'hero.subtitle': 'Specialized in agile methodologies and modern development',
    'hero.description': 'Creating innovative digital solutions with development best practices',
    
    // Projects
    'projects.title': 'Featured Projects',
    'projects.subtitle': 'Some of my most recent work',
    
    // Skills
    'skills.title': 'Technical Skills',
    'skills.subtitle': 'Technologies and tools I master',
    
    // Methodologies
    'methodologies.title': 'Agile Methodologies',
    'methodologies.subtitle': '& Development Processes',
    'methodologies.description': 'Experience implementing agile methodologies, from requirements gathering to continuous delivery, fostering collaboration and continuous improvement in development teams.',
    
    // Contact
    'contact.title': 'Contact',
    'contact.subtitle': 'Let\'s talk about your next project',
    
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
