import { useState } from "react";

import useNavbarContext from "@/contexts/NavbarContext";
import useUserContext from "@/contexts/UserContext";

import UserMenuItem from "./UserMenuItem";
import UserMenuProfile from "./UserMenuProfile";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import SmallButton from "@/components/SmallButton";

const NavUserMenu = () => {
  const { isNavbarFixed, isUserMenuOpen } = useNavbarContext();
  const { userData, logout } = useUserContext();
  const { authWithGoogle } = useUserContext();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const openModal = () => setIsLoginModalOpen(true);
  const closeModal = () => setIsLoginModalOpen(false);

  const handleLoginWithGoogle = async () => {
    await authWithGoogle();
    closeModal();
  };

  const handleSignUpWithGoogle = async () => {
    await authWithGoogle();
    closeModal();
  };

  return (
    <>
      {/* Modal */}

      <Modal isModalOpen={isLoginModalOpen} closeModal={closeModal}>
        <div
          className="w-96 p-4 bg-black rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close modal */}
          <div className="flex mb-4 justify-end">
            <SmallButton
              icon={"/img/icons/whiteClose.png"}
              alt={"X"}
              onClick={closeModal}
            />
          </div>

          {/* Modal content */}

          <div className="flex flex-col gap-2">
            {/* Sign up */}
            <Button
              icon={"/img/icons/google.png"}
              alt={"Google"}
              onClick={handleLoginWithGoogle}
            >
              Sign up with
            </Button>
            {/* Login */}
            <Button
              icon={"/img/icons/google.png"}
              alt={"Google"}
              onClick={handleSignUpWithGoogle}
            >
              Login with
            </Button>
          </div>
        </div>
      </Modal>

      {/* User menu */}

      <div
        className={`transition-all duration-300 overflow-hidden ${
          isUserMenuOpen && isNavbarFixed
            ? "h-[136px]"
            : isUserMenuOpen
            ? "group-hover:h-[136px]"
            : "h-10"
        }`}
      >
        <ul className="flex flex-col gap-2 overflow-hidden">
          {/* User profile item */}
          <UserMenuProfile />
          {/* Menu items */}
          {!userData ? (
            <>
              {/* Register */}
              <UserMenuItem action={openModal}>{"Register"}</UserMenuItem>
              {/* Login */}
              <UserMenuItem action={openModal}>{"Login"}</UserMenuItem>
            </>
          ) : (
            <>
              {/* Profile */}
              <UserMenuItem route={`/profile/${userData.uid}`}>
                {"Profile"}
              </UserMenuItem>
              {/* Logout */}
              <UserMenuItem action={logout}>{"Logout"}</UserMenuItem>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default NavUserMenu;
