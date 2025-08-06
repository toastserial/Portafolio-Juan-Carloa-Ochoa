// src/components/common/LanguageToggle.tsx
import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 group"
      aria-label={`Switch to ${language === 'es' ? 'English' : 'Spanish'}`}
      title={`Cambiar a ${language === 'es' ? 'Inglés' : 'Español'}`}
    >
      <div className="relative w-5 h-5">
        {/* Icono para Español */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            language === 'es' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-0'
          }`}
        >
          <span className="text-xs font-bold text-orange-500">ES</span>
        </div>
        
        {/* Icono para Inglés */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            language === 'en' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          }`}
        >
          <span className="text-xs font-bold text-blue-500">EN</span>
        </div>

        {/* Icono de globo como fondo */}
        <Globe 
          className={`absolute inset-0 w-5 h-5 text-gray-400 dark:text-gray-500 transition-all duration-300 ${
            language === 'es' ? 'opacity-30' : 'opacity-30'
          }`}
        />
      </div>
      
      {/* Efecto de hover */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      
      {/* Indicador de idioma actual */}
      <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-blue-500 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-white dark:bg-gray-900"></div>
      </div>
    </button>
  );
};
