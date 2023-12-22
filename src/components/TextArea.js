const TextArea = ({
  id,
  value,
  placeholder,
  small,
  maxLength,
  required,
  onChange,
}) => {
  return (
    <textarea
      id={id}
      name={id}
      placeholder={placeholder || "..."}
      value={value}
      maxLength={maxLength}
      required={required}
      onChange={onChange}
      className={`alternativeScroll overflow-y-hidden w-full px-2 py-1.5 bg-stone-700 hover:bg-stone-600 focus:bg-stone-600 border-b-2 rounded-lg outline-none text-sm placeholder:text-stone-300 resize-y transition-colors duration-300 ${
        small ? "h-12 min-h-[48px] max-h-24" : "h-24 min-h-[96px] max-h-48"
      }`}
    />
  );
};

export default TextArea;
