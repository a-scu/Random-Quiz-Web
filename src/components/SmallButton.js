import Image from "next/image";

const SmallButton = ({ icon, alt, onClick, blue, red, rotate }) => {
  return (
    <button
      onClick={onClick}
      className={`flex h-8 w-8 justify-center items-center rounded-lg text-sm cursor-pointer transition-[background,opacity] duration-300 ${rotate}
        ${
          blue
            ? "bg-blue-800 hover:bg-blue-700"
            : red
            ? "bg-red-800 hover:bg-red-700"
            : "hover:opacity-75"
        }
      `}
    >
      <Image src={icon} width={14} height={14} alt={alt} />
    </button>
  );
};

export default SmallButton;
