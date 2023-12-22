import Image from "next/image";

const InputFile = ({ id, children, full, onChange }) => {
  if (children) {
    return (
      <div className="relative">
        <label
          htmlFor={id}
          className={`flex h-8 px-2 bg-blue-800 hover:bg-blue-700 justify-center items-center gap-2 rounded-lg text-sm cursor-pointer transition-colors duration-300 ${
            full ? "w-full" : "w-fit"
          }`}
        >
          <span className="line-clamp-1">{children}</span>
          <Image
            src={"/img/icons/image.png"}
            width={14}
            height={14}
            alt={"🗎"}
          />
        </label>
        <input
          type="file"
          id={id}
          name={id}
          onChange={onChange}
          accept=".jpg, .jpeg, .png, .webp"
          className="absolute bottom-0 w-fit h-8 opacity-0 pointer-events-none"
        />
      </div>
    );
  } else {
    return (
      <div className="relative">
        <label
          htmlFor={id}
          className={`flex h-8 px-2 bg-blue-800 hover:bg-blue-700 justify-center items-center rounded-lg text-sm cursor-pointer transition-colors duration-300 ${
            full ? "w-full" : "w-fit"
          }`}
        >
          <Image
            src={"/img/icons/image.png"}
            width={14}
            height={14}
            alt={"🗎"}
          />
        </label>
        <input
          type="file"
          id={id}
          name={id}
          onChange={onChange}
          accept=".jpg, .jpeg, .png, .webp"
          className="absolute bottom-0 w-fit h-8 opacity-0 pointer-events-none"
        />
      </div>
    );
  }
};

export default InputFile;
