import { useI18n } from '../components/providers/I18nWrapperNew';

export interface TranslationFunction {
  (key: string, options?: any): string | object;
}

export const useTranslation = () => {
  const context = useI18n();
  
  const t: TranslationFunction = (key: string, options?: any) => {
    try {
      return context.t(key, options);
    } catch (error) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  };

  const changeLanguageWithRoute = (lng: string) => {
    context.changeLanguage(lng);
  };

  return {
    t,
    i18n: {
      language: context.language,
      changeLanguage: changeLanguageWithRoute,
    },
    changeLanguageWithRoute
  };
};
