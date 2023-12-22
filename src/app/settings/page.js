"use client";

import { useParams } from "next/navigation";

import useUserContext from "@/contexts/UserContext";
import useNavbarContext from "@/contexts/NavbarContext";

import Image from "next/image";

const Settings = () => {
  const {
    loadingUserData,
    userData,
    authWithGoogle,
    logout,
    profilePictureFileHandler,
    deleteProfilePicture,
    bannerFileHandler,
    deleteBanner,
    handleDeleteAccount,
  } = useUserContext();

  const { isNavbarFixed } = useNavbarContext();

  const { tab } = useParams();

  return (
    <div className="flex min-h-screen p-4 flex-col gap-4">
      <h1 className="logo min-w-fit text-2xl font-bold">Random Quiz</h1>
      <h2 className="w-fit text-xl font-semibold">Settings</h2>

      <div className="flex w-full h-full flex-grow flex-col gap-4">
        <div className="relative flex w-full gap-4">
          <div className="w-full h-52 bg-neutral-800 rounded-md overflow-hidden">
            {/* Banner Image */}
            {userData?.banner && (
              <Image
                priority
                src={userData.banner}
                width={1500}
                height={200}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Settings | Profile Picture | Display Name | Quizzes */}

          <div
            className={`relative flex w-full flex-col justify-center items-center gap-4 rounded-md ${
              isNavbarFixed
                ? "max-[918px]:absolute min-[918px]:max-w-[256px] min-[1686]:max-w-[512px max-[918px]:h-full min-[918px]:bg-neutral-800"
                : "max-md:absolute md:max-w-[256px] 2xl:max-w-[512px] max-md:h-full md:bg-neutral-800"
            }`}
          >
            {/* Profile Picture */}
            {loadingUserData && !userData ? (
              <div className="flex w-24 h-24 bg-neutral-800 justify-center items-center rounded-full">
                <Image
                  src={"/img/icons/loading.png"}
                  width={32}
                  height={32}
                  alt="Loading"
                  className="aspect-square rotate-infinite"
                />
              </div>
            ) : userData?.profilePicture ? (
              <Image
                src={userData.profilePicture}
                width={96}
                height={96}
                alt=""
                className="aspect-square rounded-full object-cover"
              />
            ) : (
              <Image
                src={"/img/icons/user.png"}
                width={96}
                height={96}
                alt=""
                className="aspect-square rounded-full object-cover"
              />
            )}

            <div className="flex flex-col items-center gap-2">
              {/* Display Name */}
              <span className="text-lg font-semibold">
                {userData?.displayName || "..."}
              </span>
            </div>
          </div>
        </div>

        {userData ? (
          <>
            <div className="flex flex-col gap-2">
              <h3 className="w-fit text-lg font-medium">Profile Picture</h3>

              <div className="flex gap-2">
                <div className="relative w-full max-w-3xs">
                  <label
                    htmlFor={"profile-picture"}
                    className="flex w-full h-10 px-2 bg-neutral-800 justify-center items-center border rounded-md border-transparent hover:border-neutral-700 text-sm cursor-pointer transition-[border] duration-300"
                  >
                    <span className="line-clamp-1">
                      {userData?.profilePicture ? "Change" : "Select"} Image
                    </span>
                  </label>
                  <input
                    type="file"
                    id={"profile-picture"}
                    name={"profile-picture"}
                    onChange={profilePictureFileHandler}
                    accept=".jpg, .jpeg, .png, .webp"
                    className="absolute bottom-0 w-fit h-8 opacity-0 pointer-events-none"
                  />
                </div>

                <button
                  onClick={deleteProfilePicture}
                  className="flex w-full max-w-3xs h-10 px-2 bg-emerald-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-emerald-700 cursor-pointer transition-[border] duration-300"
                >
                  <span className="text-sm">Delete Image</span>
                </button>
              </div>
            </div>
            {/* Profile Picture */}

            <div className="flex flex-col gap-2">
              {/* Banner */}
              <h3 className="w-fit text-lg font-medium">Banner</h3>

              <div className="flex gap-2">
                <div className="relative w-full max-w-3xs">
                  <label
                    htmlFor={"banner"}
                    className="flex w-full h-10 px-2 bg-neutral-800 justify-center items-center border rounded-md border-transparent hover:border-neutral-700 text-sm cursor-pointer transition-[border] duration-300"
                  >
                    <span className="line-clamp-1">
                      {userData?.profilePicture ? "Change" : "Select"} Image
                    </span>
                  </label>
                  <input
                    type="file"
                    id={"banner"}
                    name={"banner"}
                    onChange={bannerFileHandler}
                    accept=".jpg, .jpeg, .png, .webp"
                    className="absolute bottom-0 w-fit h-8 opacity-0 pointer-events-none"
                  />
                </div>

                <button
                  onClick={deleteBanner}
                  className="flex w-full max-w-3xs h-10 px-2 bg-emerald-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-emerald-700 cursor-pointer transition-[border] duration-300"
                >
                  <span className="text-sm">Delete Image</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}

        <hr className="border-neutral-800 h-[1px]" />

        <div className="flex gap-2">
          {/* Log in | Log out */}
          {!userData ? (
            <button
              onClick={authWithGoogle}
              className="flex w-full max-w-3xs h-10 px-2 bg-emerald-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-emerald-700 cursor-pointer transition-[border] duration-300"
            >
              <span className="text-sm">Log in with Google</span>
            </button>
          ) : (
            <button
              onClick={logout}
              className="flex w-full max-w-3xs h-10 px-2 bg-red-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-red-700 cursor-pointer transition-[border] duration-300"
            >
              <span className="text-sm">Log out</span>
            </button>
          )}

          {userData && (
            <button
              onClick={handleDeleteAccount}
              className="flex w-full max-w-3xs h-10 px-2 bg-red-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-red-700 cursor-pointer transition-[border] duration-300"
            >
              <span className="text-sm">Delete Account</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
