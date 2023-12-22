import Image from "next/image";

import useNavbarContext from "@/contexts/NavbarContext";
import useUserContext from "@/contexts/UserContext";

const UserMenuProfile = () => {
  const { isNavbarFixed, isUserMenuOpen, handleUserMenu } = useNavbarContext();
  const { loadingUserData, userData } = useUserContext();

  if (loadingUserData)
    return (
      <li>
        <div className="flex w-full h-10 px-2 justify-center items-center">
          <Image
            src={userData?.photoURL ?? "/img/icons/loading.png"}
            width={64}
            height={64}
            alt="Loading"
            className="rotate-infinite w-6 min-w-[24px] rounded-full"
          />
        </div>
      </li>
    );

  return (
    <li onClick={handleUserMenu}>
      <div className="flex w-full h-10 px-2 hover:bg-stone-800 justify-between items-center gap-2 rounded-lg cursor-pointer group-hover:transition-colors group-hover:duration-300 ">
        <Image
          src={userData?.profilePicture ?? "/img/icons/userIcon.png"}
          width={24}
          height={24}
          alt="Profile Picture"
          className="aspect-square w-6 min-w-[24px] h-6 min-h-[24px] rounded-full"
        />
        <span
          className={`text-sm text-right line-clamp-1 ${
            !isNavbarFixed && "hidden group-hover:block"
          }`}
        >
          {userData?.displayName ?? "Not Logged"}
        </span>
        <Image
          src={"/img/icons/shortArrow.png"}
          width={64}
          height={64}
          alt="Open Profile Menu"
          className={`w-3 min-w-[12px] transition-transform duration-300 ${
            isNavbarFixed ? "flex" : "hidden group-hover:flex"
          } ${isUserMenuOpen ? "rotate-90" : "-rotate-90"}`}
        />
      </div>
    </li>
  );
};

export default UserMenuProfile;
