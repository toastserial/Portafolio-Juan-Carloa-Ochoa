import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../../i18n';

interface I18nContextType {
  language: string;
  t: (key: string, options?: any) => string | object;
  changeLanguage: (lng: string) => void;
  isReady: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nWrapper');
  }
  return context;
};

interface I18nWrapperProps {
  children: React.ReactNode;
}

export const I18nWrapper: React.FC<I18nWrapperProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [language, setLanguage] = useState('es');

  const t = (key: string, options?: any) => {
    try {
      return i18n.t(key, options);
    } catch (error) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  };

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      setLanguage(lng);
      
      // Update URL without page reload
      const currentPath = window.location.pathname;
      const pathWithoutLang = currentPath.replace(/^\/(es|en)/, '') || '/';
      const newPath = `/${lng}${pathWithoutLang}`;
      window.history.pushState({}, '', newPath);
    } catch (error) {
      console.warn('Language change error:', error);
    }
  };

  useEffect(() => {
    const initI18n = async () => {
      try {
        if (!i18n.isInitialized) {
          await i18n.init();
        }
        
        // Sync language with URL
        const pathLang = window.location.pathname.split('/')[1];
        if (['es', 'en'].includes(pathLang)) {
          await i18n.changeLanguage(pathLang);
          setLanguage(pathLang);
        } else {
          setLanguage(i18n.language);
        }
        
        setIsReady(true);
      } catch (error) {
        console.warn('i18n initialization error:', error);
        setIsReady(true); // Continue anyway
      }
    };

    initI18n();
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const contextValue: I18nContextType = {
    language,
    t,
    changeLanguage,
    isReady
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};
