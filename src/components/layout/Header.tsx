// src/components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
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
      <nav className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold transition-transform duration-200 text-gradient hover:scale-105"
          >
            Juan ∞a
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200
                  hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300 bg-transparent
                  ${activeSection === item.href ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}
                `}
                style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}
              >
                {item.name}
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
                className={`block px-4 py-2 text-base font-medium rounded-md transition-colors duration-200 text-gray-700 dark:text-gray-300 bg-transparent`}
                style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}
              >
                {item.name}
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