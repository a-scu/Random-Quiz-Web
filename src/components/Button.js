import Image from "next/image";

const Button = ({
  children,
  id,
  icon,
  alt,
  red,
  border,
  center,
  left,
  right,
  full,
  focus,
  onClick,
}) => {
  if (icon) {
    return (
      <button
        id={id}
        type="button"
        onClick={onClick}
        className={`flex h-8 px-2 justify-center items-center gap-2 rounded-lg text-sm transition-colors duration-300 ${
          border
            ? "border border-white"
            : red
            ? "bg-red-800 hover:bg-red-700"
            : "bg-blue-800 hover:bg-blue-700"
        } ${
          focus === undefined
            ? ""
            : focus
            ? "bg-blue-800 hover:bg-blue-700"
            : "bg-stone-800 hover:bg-stone-700"
        } ${center ? "mx-auto" : left ? "mr-auto" : right && "ml-auto"} ${
          full ? "w-full" : "w-fit"
        }`}
      >
        <span className="line-clamp-1">{children}</span>
        <Image src={icon} alt={alt} width={14} height={14} />
      </button>
    );
  } else {
    return (
      <button
        id={id}
        type="button"
        onClick={onClick}
        className={`flex px-2 items-center rounded-lg transition-colors duration-300 ${
          border
            ? "border border-white"
            : red
            ? "bg-red-800 hover:bg-red-700"
            : "bg-blue-800 hover:bg-blue-700"
        } ${
          focus === undefined
            ? ""
            : focus
            ? "bg-blue-800 hover:bg-blue-700"
            : "bg-stone-800 hover:bg-stone-700"
        } ${center ? "mx-auto" : left ? "mr-auto" : right && "ml-auto"} ${
          full ? "w-full h-8 justify-center text-sm" : "w-fit h-8 text-sm"
        }
      `}
      >
        <span className="line-clamp-1">{children}</span>
      </button>
    );
  }
};

export default Button;
