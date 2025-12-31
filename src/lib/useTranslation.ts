import { useStore } from './store';
import { translations } from './translations';

export function useTranslation() {
  const language = useStore((state) => state.language);
  const t = translations[language];
  
  return { t, language };
}

