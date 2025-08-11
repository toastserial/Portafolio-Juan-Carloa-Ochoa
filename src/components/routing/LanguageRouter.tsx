import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import i18n from '../../i18n.ts';

// Component to handle language-based routing
export const LanguageRouter: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Extract language from current path
    const pathLang = currentPath.split('/')[1];
    const validLangs = ['es', 'en'];

    // If path has valid language, update i18n
    if (validLangs.includes(pathLang) && pathLang !== i18n.language) {
      i18n.changeLanguage(pathLang);
    }
  }, [location.pathname]);

  return null;
};

// Hook to get current language from URL
export const useLanguageFromPath = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const langFromPath = pathSegments[1];
  
  return ['es', 'en'].includes(langFromPath) ? langFromPath : 'es';
};

// Hook to navigate with language prefix
export const useLanguageNavigate = () => {
  const navigate = useNavigate();

  const navigateWithLang = (path: string, options?: any) => {
    const currentLang = i18n.language;
    const fullPath = path.startsWith('/') ? `/${currentLang}${path}` : `/${currentLang}/${path}`;
    navigate(fullPath, options);
  };

  return navigateWithLang;
};
