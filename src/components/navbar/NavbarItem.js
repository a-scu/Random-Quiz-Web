import Link from "next/link";
import Image from "next/image";

import useNavbarContext from "@/contexts/NavbarContext";

const NavbarItem = ({ children, href, icon, alt }) => {
  const { isNavbarFixed } = useNavbarContext();

  return (
    <li>
      <Link
        href={href}
        className={`flex w-full h-10 px-2 hover:bg-neutral-800 items-center gap-2 border rounded-md border-transparent hover:border-neutral-700 cursor-pointer group-hover:transition-[background,border] group-hover:duration-300 ${
          isNavbarFixed
            ? "justify-between"
            : "justify-center group-hover:justify-between"
        }`}
      >
        <Image
          src={icon}
          width={20}
          height={20}
          alt={alt || ""}
          className="aspect-square"
        />
        <span
          className={`text-[15px] ${
            !isNavbarFixed && "hidden group-hover:block"
          }`}
        >
          {children}
        </span>
      </Link>
    </li>
  );
};

export default NavbarItem;
