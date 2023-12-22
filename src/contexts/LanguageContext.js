"use client";

import { createContext, useContext, useState, useEffect } from "react";

import { TRANSLATIONS } from "@/Translations";

const LANGUAGES = {
  es: "es",
  en: "en",
};

const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(LANGUAGES.es);

  // Si hay algun lenguaje guardado en ls, lo usa como nuevo lenguaje. Si no hay ningun lenguaje guardado en ls, guarda por defecto el español

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");

    if (storedLanguage) {
      setLanguage(storedLanguage);
    } else {
      localStorage.setItem("language", language);
    }
  }, []);

  // Toma el 'e.target.textContent' del boton presionado, lo utiliza como nuevo lenguaje y lo guarda en ls

  const handleLanguage = (e) => {
    switch (e.target.textContent) {
      case LANGUAGES.es.toUpperCase():
        setLanguage(LANGUAGES.es);
        localStorage.setItem("language", LANGUAGES.es);
        break;

      case LANGUAGES.en.toUpperCase():
        setLanguage(LANGUAGES.en);
        localStorage.setItem("language", LANGUAGES.en);
        break;
    }
  };

  const data = {
    language,
    handleLanguage,
    LANGUAGES,
    TRANSLATIONS: TRANSLATIONS[language],
  };

  return (
    <LanguageContext.Provider value={data}>{children}</LanguageContext.Provider>
  );
};

const useLanguageContext = () => {
  return useContext(LanguageContext);
};

export { LanguageProvider };
export default useLanguageContext;
