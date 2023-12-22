"use client";

import { useParams } from "next/navigation";

import useUserContext from "@/contexts/UserContext";

const Settings = () => {
  const { loadingUserData, userData, logInWithGoogle, logOut } =
    useUserContext();

  const { tab } = useParams();

  if (!loadingUserData)
    return (
      <div className="flex min-h-screen p-4 flex-col gap-4">
        <h1 className="logo min-w-fit text-2xl font-bold">Random Quiz</h1>
        <h2 className="w-fit text-xl font-medium">Settings</h2>

        <div className="flex w-full h-full flex-grow flex-col gap-4">
          <div className="flex justify-center gap-4">
            <button
              className={`flex w-full max-w-3xs max-[384px]:w-full h-10 px-2 justify-center items-center gap-2 border rounded-md border-transparent cursor-pointer transition-[border] duration-300 ${
                tab === "general"
                  ? "bg-emerald-800"
                  : "bg-neutral-800 hover:border-neutral-700"
              }`}
            >
              <span className="text-sm">General</span>
            </button>

            <button
              className={`flex w-full max-w-3xs max-[384px]:w-full h-10 px-2 justify-center items-center gap-2 border rounded-md border-transparent cursor-pointer transition-[border] duration-300 ${
                tab === "profile"
                  ? "bg-emerald-800"
                  : "bg-neutral-800 hover:border-neutral-700"
              }`}
            >
              <span className="text-sm">Profile</span>
            </button>
          </div>

          <div className="flex w-full h-full flex-grow flex-col justify-center items-center gap-2">
            {!userData && (
              <button
                onClick={logInWithGoogle}
                className="flex w-full max-w-3xs h-10 px-2 bg-emerald-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-emerald-700 cursor-pointer transition-[border] duration-300"
              >
                <span className="text-sm">Log in with Google</span>
              </button>
            )}

            <button
              onClick={logOut}
              className="flex w-full max-w-3xs h-10 px-2 bg-red-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-emerald-700 cursor-pointer transition-[border] duration-300"
            >
              <span className="text-sm">Log out</span>
            </button>
          </div>
        </div>
      </div>
    );
};

export default Settings;
