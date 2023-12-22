import Image from "next/image";

const BigButton = ({ children, icon, alt, onClick }) => {
  if (icon) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full max-w-2xs h-10 px-2 mx-auto bg-blue-800 hover:bg-blue-700 justify-center items-center gap-2 rounded-lg text-base cursor-pointer transition-colors duration-300 "
      >
        {children}
        <Image src={icon} width={16} height={16} alt={alt} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full max-w-2xs h-10 px-2 mx-auto bg-blue-800 hover:bg-blue-700 justify-center items-center rounded-lg text-base cursor-pointer transition-colors duration-300 "
    >
      {children}
    </button>
  );
};

export default BigButton;
