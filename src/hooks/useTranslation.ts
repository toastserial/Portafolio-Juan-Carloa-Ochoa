import { useTranslation as useOriginalTranslation } from 'react-i18next';
import { useMemo } from 'react';

// Type definitions for better TypeScript support
interface TranslationFunction {
  (key: string): string;
  (key: string, options: { returnObjects: true }): any;
  (key: string, defaultValue: string): string;
  (key: string, options?: any): string | any;
}

// Custom hook to ensure compatibility with React 19 and URL routing
export const useTranslation = () => {
  try {
    const result = useOriginalTranslation();
    
    // Override changeLanguage to update URL
    const originalChangeLanguage = result.i18n.changeLanguage;
    
    const changeLanguageWithRoute = (lng: string) => {
      const currentPath = window.location.pathname;
      const pathSegments = currentPath.split('/');
      
      // Replace language in path or add it
      if (['es', 'en'].includes(pathSegments[1])) {
        pathSegments[1] = lng;
      } else {
        pathSegments.splice(1, 0, lng);
      }
      
      const newPath = pathSegments.join('/') || `/${lng}`;
      
      // Use history API to navigate
      window.history.pushState(null, '', newPath);
      
      return originalChangeLanguage(lng);
    };

    return {
      ...result,
      i18n: {
        ...result.i18n,
        changeLanguage: changeLanguageWithRoute,
      }
    };
  } catch (error) {
    console.warn('Translation hook error, falling back to defaults:', error);
    // Fallback object in case of errors
    return useMemo(() => ({
      t: ((key: string, options?: any) => {
        console.warn(`Translation missing for key: ${key}`);
        
        // Handle returnObjects option
        if (options?.returnObjects) {
          // Return default arrays based on key
          if (key === 'hero.roles') {
            return [
              'Desarrollador Frontend',
              'Desarrollador React', 
              'Desarrollador Full Stack',
              'UI/UX Developer'
            ];
          }
          return [];
        }
        
        const fallback = options?.defaultValue || (typeof options === 'string' ? options : undefined);
        return fallback || key.split('.').pop() || key;
      }) as TranslationFunction,
      i18n: {
        language: 'es',
        changeLanguage: (lng: string) => {
          console.warn(`Language change attempted: ${lng}`);
          const currentPath = window.location.pathname;
          const pathSegments = currentPath.split('/');
          
          if (['es', 'en'].includes(pathSegments[1])) {
            pathSegments[1] = lng;
          } else {
            pathSegments.splice(1, 0, lng);
          }
          
          const newPath = pathSegments.join('/') || `/${lng}`;
          window.history.pushState(null, '', newPath);
        },
      },
    }), []);
  }
};

export default useTranslation;
