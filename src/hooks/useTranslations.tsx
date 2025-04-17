import en from "@/locales/en.json";
import es from "@/locales/es.json";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = { en, es };

// Definir el tipo de las claves permitidas
type Locale = keyof typeof translations;

export const useTranslations = () => {
  const { locale } = useLanguage();

  // Asegurar que `locale` sea de tipo `Locale`
  const currentLocale = locale as Locale;

  return translations[currentLocale]; // Ahora TypeScript reconocerá la indexación
};
