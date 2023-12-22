import Link from "next/link";

import useNavbarContext from "@/contexts/NavbarContext";

const UserMenuItem = ({ children, route, action }) => {
  const { isNavbarFixed, isUserMenuOpen } = useNavbarContext();

  if (route)
    return (
      <li
        className={
          isNavbarFixed && isUserMenuOpen ? "flex" : "hidden group-hover:flex"
        }
      >
        <Link
          href={route}
          className={`flex w-full h-10 px-2 hover:bg-stone-800 items-center gap-2 rounded-lg text-sm cursor-pointer transition-colors duration-300`}
        >
          <span>{children}</span>
        </Link>
      </li>
    );

  return (
    <li
      onClick={action}
      className={`flex w-full h-10 px-2 hover:bg-stone-800 items-center gap-2 rounded-lg text-sm cursor-pointer transition-colors duration-300 ${
        isNavbarFixed && isUserMenuOpen ? "flex" : "hidden group-hover:flex"
      }`}
    >
      <span>{children}</span>
    </li>
  );
};

export default UserMenuItem;
