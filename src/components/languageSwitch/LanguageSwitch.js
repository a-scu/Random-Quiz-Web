"use client";

import useLanguageContext from "@/contexts/LanguageContext";

import LanguageSwitchItem from "./LanguageSwitchItem";

const LanguageSwitch = () => {
  const { language, handleLanguage, LANGUAGES } = useLanguageContext();

  return (
    <ul className="flex gap-2">
      <LanguageSwitchItem
        actualLanguage={language}
        language={LANGUAGES.es}
        handleLanguage={handleLanguage}
      />
      <LanguageSwitchItem
        actualLanguage={language}
        language={LANGUAGES.en}
        handleLanguage={handleLanguage}
      />
    </ul>
  );
};

export default LanguageSwitch;
