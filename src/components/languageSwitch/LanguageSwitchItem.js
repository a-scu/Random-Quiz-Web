const LanguageSwitchItem = ({ actualLanguage, language, handleLanguage }) => {
  return (
    <li
      className={`hidden ${
        actualLanguage === language ? "flex" : "group-hover:flex"
      } w-full `}
    >
      <button
        onClick={handleLanguage}
        className={`flex h-8 px-2 ${
          actualLanguage === language ? "bg-red-800" : "hover:bg-stone-800"
        } justify-center items-center rounded-lg text-xs transition-colors duration-300`}
      >
        {language.toUpperCase()}
      </button>
    </li>
  );
};

export default LanguageSwitchItem;
