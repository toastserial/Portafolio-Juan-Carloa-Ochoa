// src/components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: 'Inicio', href: 'inicio' },
  { name: 'Proyectos', href: 'projects-section' },
  { name: 'Habilidades', href: 'skills-section' },
  { name: 'Contacto', href: 'contact-section' },
];

const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      let current = 'inicio';
      for (const item of navItems) {
        const section = document.getElementById(item.href);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom > 80) {
            current = item.href;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      {/* Fondo interactivo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradiente base */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/5 dark:to-blue-500/5" />
        
        {/* Elementos decorativos */}
        <div className="absolute w-[500px] h-[500px] -top-[250px] -left-[250px] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-[400px] h-[400px] -top-[200px] -right-[200px] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Efecto de malla */}
        <div 
          className="absolute inset-0 opacity-10 dark:opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at center, purple 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Contenido existente */}
      <nav className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold transition-transform duration-200 text-gradient hover:scale-105"
          >
            Juan ∞a
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-12 md:flex">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group
                  ${activeSection === item.href 
                    ? 'text-white bg-blue-600 dark:bg-blue-500 shadow-lg transform scale-105' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }
                `}
                style={{ background: activeSection === item.href ? undefined : 'none', border: 'none', outline: 'none', cursor: 'pointer' }}
              >
                {item.name}
                
                {/* Indicador de sección activa */}
                {activeSection === item.href && (
                  <span className="absolute w-2 h-2 transform -translate-x-1/2 bg-white rounded-full shadow-md -bottom-1 left-1/2 animate-pulse"></span>
                )}
                
                {/* Efecto hover cuando no está activo */}
                {activeSection !== item.href && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* Social Links & Theme Toggle */}
          <div className="items-center hidden space-x-4 md:flex">
            <a 
              href="https://github.com/toastserial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/juan-carlos-ochoa-guzm%C3%A1n-28a256373/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="mailto:jcochoag18@gmail.com"
              className="p-2 text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a 
              href="https://wa.me/50496821640"
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Phone className="w-5 h-5" />
            </a>
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 transition-colors duration-200 rounded-md dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-96 opacity-100' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="py-4 mt-2 space-y-2 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  scrollToSection(item.href);
                  setIsMenuOpen(false);
                }}
                className={`block w-full px-4 py-3 text-base font-medium rounded-md transition-all duration-200 text-left
                  ${activeSection === item.href 
                    ? 'text-white bg-blue-600 dark:bg-blue-500 shadow-md transform scale-105' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }
                `}
                style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
              >
                <div className="flex items-center justify-between">
                  {item.name}
                  {activeSection === item.href && (
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  )}
                </div>
              </button>
            ))}
            
            {/* Mobile Social Links */}
            <div className="flex justify-center pt-4 space-x-6 border-t border-gray-200 dark:border-gray-700">
              <a 
                href="https://github.com/toastserial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/juan-carlos-ochoa-guzm%C3%A1n-28a256373/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:jcochoag18@gmail.com"
                className="p-2 text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};