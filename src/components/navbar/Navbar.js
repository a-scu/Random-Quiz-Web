"use client";

import useNavbarContext from "@/contexts/NavbarContext";
import useUserContext from "@/contexts/UserContext";

import NavbarItem from "./NavbarItem";
import NavbarOptions from "./NavbarOptions";
import useModalsContext from "@/contexts/ModalsContext";
import Image from "next/image";

const Navbar = () => {
  const { isNavbarFixed, isNavbarRight } = useNavbarContext();
  const { userData, authWithGoogle } = useUserContext();

  return (
    <nav
      className={`group max-sm:hidden fixed z-20 h-screen bg-neutral-900 border-neutral-800 overflow-hidden transition-[width] duration-300
        ${isNavbarRight ? "right-0 border-l" : "border-r"}
        ${isNavbarFixed ? "w-52" : "w-14 hover:w-52"}
      `}
    >
      <ul className="flex relative group-hover:w-[207px] h-full p-2 flex-col justify-between gap-2">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {/* Home */}
            <NavbarItem icon={"/img/icons/home.png"} href={"/"}>
              Home
            </NavbarItem>
            {/* Favorites */}
            {userData && (
              <NavbarItem
                icon={"/img/icons/white-star.png"}
                href={"/favorites"}
              >
                Favorites
              </NavbarItem>
            )}
            {/* Create Quiz */}
            {userData && (
              <NavbarItem icon={"/img/icons/new-quiz.png"} href={"/createQuiz"}>
                Create Quiz
              </NavbarItem>
            )}
            {/* Profile */}
            {userData ? (
              <NavbarItem
                icon={"/img/icons/profile.png"}
                href={`/profile/${userData?.uid}`}
              >
                Profile
              </NavbarItem>
            ) : (
              <li>
                <button
                  onClick={authWithGoogle}
                  className={`flex w-full h-10 px-2 hover:bg-neutral-800 items-center gap-2 border rounded-md border-transparent hover:border-neutral-700 cursor-pointer group-hover:transition-[background,border] group-hover:duration-300 ${
                    isNavbarFixed
                      ? "justify-between"
                      : "justify-center group-hover:justify-between"
                  }`}
                >
                  <Image
                    src={"/img/icons/google.png"}
                    width={20}
                    height={20}
                    alt={"Google | "}
                    className="aspect-square"
                  />
                  <span
                    className={`text-[15px] ${
                      !isNavbarFixed && "hidden group-hover:block"
                    }`}
                  >
                    Log In / Register
                  </span>
                </button>
              </li>
            )}
          </div>
          {/* Navbar Actions */}
          <NavbarOptions />
        </div>

        <div className="flex flex-col gap-2">
          {/* Settings */}
          {userData && (
            <NavbarItem icon={"/img/icons/settings.png"} href={"/settings"}>
              Settings
            </NavbarItem>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
