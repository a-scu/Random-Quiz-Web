import useNavbarContext from "@/contexts/NavbarContext";

import Image from "next/image";

const NavbarOptions = () => {
  const { isNavbarFixed, handleNavbarFixed, handleNavbarSide, navbarSide } =
    useNavbarContext();

  return (
    <div
      className={`w-full justify-center gap-2
       ${isNavbarFixed ? "flex" : "hidden group-hover:flex"}
      `}
    >
      <button
        type="button"
        onClick={handleNavbarFixed}
        className={`flex h-8 w-8 justify-center items-center border rounded-full border-transparent cursor-pointer transition-[border] duration-300 ${
          isNavbarFixed
            ? "bg-emerald-800"
            : "bg-neutral-800 hover:border-neutral-700"
        }`}
      >
        <Image
          src={isNavbarFixed ? "/img/icons/unpin.png" : "/img/icons/pin.png"}
          width={16}
          height={16}
          alt={isNavbarFixed ? "Unpin" : "Pin"}
          className="w-4 min-w-[16px] h-4 min-h-[16px]"
        />
      </button>

      <button
        type="button"
        onClick={handleNavbarSide}
        className={`flex h-8 w-8 bg-neutral-800 justify-center items-center border rounded-full border-transparent hover:border-neutral-700 cursor-pointer transition-[border] duration-300 ${
          navbarSide === "right" && "rotate-180"
        }`}
      >
        <Image
          src={"/img/icons/long-arrow.png"}
          width={16}
          height={16}
          alt={navbarSide === "right" ? "←" : "→"}
          className="w-4 min-w-[16px] h-4 min-h-[16px]"
        />
      </button>
    </div>
  );
};

export default NavbarOptions;
