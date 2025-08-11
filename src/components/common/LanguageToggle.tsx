import React from 'react';
import { useTranslation } from '../../hooks/useTranslationNew';
import { Languages } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative p-2 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 group"
      aria-label={`Change language to ${i18n.language === 'es' ? 'English' : 'Español'}`}
      title={`Change language to ${i18n.language === 'es' ? 'English' : 'Español'}`}
    >
      <div className="flex items-center space-x-2">
        <Languages className="w-5 h-5 text-gray-600 transition-colors duration-200 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
        <span className="text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {i18n.language === 'es' ? 'EN' : 'ES'}
        </span>
      </div>
    </button>
  );
};
