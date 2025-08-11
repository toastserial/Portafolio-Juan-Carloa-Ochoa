// src/components/sections/Hero.tsx
import React, { useEffect, useState } from 'react';
import { ChevronDown, Download, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export const Hero: React.FC = () => {
  const { t } = useTranslation();
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Get roles from translation
  const roles = t('hero.roles', { returnObjects: true }) as string[];

  useEffect(() => {
    const currentText = roles[currentRole];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 500 : 2000;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentText.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentRole((prev) => (prev + 1) % roles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentRole]);

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects-section');
    projectsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-bg" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-blue-400/10 blur-3xl animate-pulse" />
        <div className="absolute delay-1000 rounded-full -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 blur-3xl animate-pulse" />
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 blur-3xl animate-spin-slow" />
      </div>

      <div className="relative z-10 max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
        {/* Profile Image */}
        <div className="mt-20 animate-fade-in">
          <div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full shadow-2xl ring-4 ring-white/20 dark:ring-gray-800/20">
                        <img 
                          // Ruta absoluta para funcionar correctamente en /es, /en, etc.
                          src="/me.png" 
                          alt="Juan Carlos Ochoa Guzmán" 
                          className="object-cover duration-500 w-fullansition-transform h- hover:scale-110"
                        />
          </div>
        </div>

        {/* Main Content */}
        <div className="animate-slide-up">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
            {t('hero.greeting')}{' '}
            <span className="text-gradient">{t('hero.name')}</span>
          </h1>
          
          <div className="flex items-center justify-center h-12 mb-8 text-2xl font-light text-gray-700 sm:text-3xl lg:text-4xl dark:text-gray-300">
            <span className="mr-2">{t('hero.rolePrefix')}</span>
            <span className="min-w-0 font-medium text-gradient">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
          </div>

          <p className="max-w-3xl mx-auto mb-12 text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-gray-400">
            {t('hero.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 mb-16 sm:flex-row">
            <button 
              onClick={scrollToProjects}
              className="flex items-center px-8 py-4 space-x-2 font-medium text-white transition-all duration-300 rounded-full group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-xl"
            >
              <span>{t('hero.viewProjects')}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            
            <a 
              href="/cvj8a.pdf" 
              download
              className="flex items-center px-8 py-4 space-x-2 font-medium text-gray-700 transition-all duration-300 border-2 border-gray-300 rounded-full group dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105"
            >
              <Download className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" />
              <span>{t('hero.downloadCV')}</span>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button 
          onClick={scrollToProjects}
          className="absolute mt-2 text-gray-400 transition-colors duration-300 transform -translate-x-1/2 left-1/2 hover:text-blue-500 animate-bounce"
          aria-label="Scroll to next section"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};