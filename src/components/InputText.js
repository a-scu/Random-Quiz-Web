const InputText = ({
  id,
  value,
  placeholder,
  maxLength,
  required,
  onChange,
}) => {
  return (
    <input
      id={id}
      name={id}
      placeholder={placeholder || "..."}
      value={value}
      required={required}
      maxLength={maxLength}
      onChange={onChange}
      className="w-full h-8 px-2 bg-stone-700 hover:bg-stone-600 focus:bg-stone-600 border-b-2 rounded-lg outline-none text-sm placeholder:text-stone-300 transition-colors duration-300 "
    />
  );
};

export default InputText;
