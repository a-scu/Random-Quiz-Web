const H1 = ({ children, center, left, right }) => {
  return (
    <h1
      className={`text-2xl font-semibold ${
        center ? "mx-auto" : left ? "mr-auto" : right && "ml-auto"
      }`}
    >
      {children}
    </h1>
  );
};

export default H1;
