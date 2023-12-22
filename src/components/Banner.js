import useNavbarContext from "@/contexts/NavbarContext";

import Image from "next/image";
import Link from "next/link";

const Banner = ({ user, isUsersOwnProfile }) => {
  const { isNavbarFixed } = useNavbarContext();

  const quizzesText = () => {
    if (!user?.createdQuizzes || user.createdQuizzes.length === 0) {
      return "0 Quizzes";
    } else if (user.createdQuizzes.length === 1) {
      return "1 Quiz";
    } else {
      return `${user.createdQuizzes.length} Quizzes`;
    }
  };

  return (
    <div className="relative flex w-full gap-4">
      <div className="w-full h-52 bg-neutral-800 rounded-md overflow-hidden">
        {/* Banner Image */}
        {user?.banner && (
          <Image
            priority
            src={user.banner}
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
        {/* Settings */}
        {isUsersOwnProfile && (
          <Link
            href={"/settings/profile"}
            className="absolute top-4 right-4 rounded-full cursor-pointer"
          >
            <Image
              src={"/img/icons/settings.png"}
              width={20}
              height={20}
              alt={"X"}
              className="aspect-square"
            />
          </Link>
        )}

        {/* Profile Picture */}
        {!user ? (
          <div className="flex w-24 h-24 bg-neutral-800 justify-center items-center rounded-full">
            <Image
              src={"/img/icons/loading.png"}
              width={32}
              height={32}
              alt="Loading"
              className="aspect-square rotate-infinite"
            />
          </div>
        ) : user?.profilePicture ? (
          <Image
            src={user.profilePicture}
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
            {user?.displayName || "..."}
          </span>
          {/* User Quizzes */}
          <span className="text-xs">{quizzesText()}</span>
        </div>
      </div>
    </div>
  );
};
export default Banner;
