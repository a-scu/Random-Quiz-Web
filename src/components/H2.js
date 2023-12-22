const H2 = ({ children, shadow }) => {
  return (
    <h2 className={`text-lg font-semibold ${shadow && "text-shadow"}`}>
      {children}
    </h2>
  );
};

export default H2;
