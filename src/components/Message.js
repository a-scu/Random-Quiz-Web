import Image from "next/image";

const Message = ({ children, warning }) => {
  if (warning) {
    return (
      <div className="flex w-fit items-center gap-1">
        <Image src={"/img/icons/warning.png"} width={12} height={12} alt="⚠" />

        <p className="text-xs text-red-300">{children}</p>
      </div>
    );
  }

  return (
    <div className="flex w-fit items-center gap-2">
      <Image src={"/img/icons/info.png"} width={12} height={12} alt="ⓘ" />

      <p className="text-xs text-blue-300">{children}</p>
    </div>
  );
};

export default Message;
