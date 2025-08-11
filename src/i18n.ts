import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import es from './locales/es/translation.json';
import en from './locales/en/translation.json';

// Configuración de recursos
const resources = {
  es: { translation: es },
  en: { translation: en },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    supportedLngs: ['es', 'en'],
    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },
    detection: {
      order: ['path', 'localStorage', 'navigator', 'htmlTag', 'cookies'],
      lookupFromPathIndex: 0,
      caches: ['cookies'],
    },
    react: {
      useSuspense: false, // Para compatibilidad con React 18/19
    },
  });

export default i18n;
