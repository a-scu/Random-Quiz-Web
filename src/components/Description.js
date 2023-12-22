const Description = ({ children, shadow }) => {
  return (
    <p className={`text-xs text-stone-300 ${shadow && "text-shadow"}`}>
      {children}
    </p>
  );
};

export default Description;
