"use client";

import React, { createContext, useState, useContext } from "react";

// Definimos el tipo del contexto
type LanguageContextType = {
  locale: "es" | "en"; // Unión de literales, no el string "es | en"
  setLocale: React.Dispatch<React.SetStateAction<"es" | "en">>;
};

// Creamos el contexto con un valor por defecto adecuado
const LanguageContext = createContext<LanguageContextType>({
  locale: "es",
  setLocale: () => {}
});

// Proveedor del contexto
export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<"es" | "en">("es");

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useLanguage = () => useContext(LanguageContext);
