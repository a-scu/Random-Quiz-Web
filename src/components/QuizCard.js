import { useState, useEffect } from "react";

import useNavbarContext from "@/contexts/NavbarContext";
import useUserContext from "@/contexts/UserContext";

import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

import { useParams } from "next/navigation";

import Image from "next/image";
import Link from "next/link";

import calculateUploadDate from "@/helpers/calculateUploadDate";

const QuizCard = ({ quizData }) => {
  const { id, title, cardImage, takers, uploadTime, author } = quizData;

  const { userId } = useParams();

  const { isNavbarFixed } = useNavbarContext();
  const { userData, handleFavorites } = useUserContext();

  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const getQuizAuthorProfilePicture = async () => {
      const userRef = doc(db, "users", author);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setProfilePicture(userData?.profilePicture || null);
      }
    };

    getQuizAuthorProfilePicture();
  }, []);

  return (
    <div
      key={id}
      className={`group flex w-full max-w-sm flex-col cursor-pointer ${
        isNavbarFixed ? "max-[1174px] mx-auto" : "max-lg mx-auto"
      }`}
    >
      <div className="relative aspect-[3/2] w-full bg-stone-800 rounded-md overflow-hidden">
        {/* Card Image */}
        {cardImage && (
          <Image
            src={cardImage.url}
            width={400}
            height={266}
            alt=""
            className="absolute w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 "
          />
        )}

        {/* Actions */}
        <div className="quiz-card-gradient absolute w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
          <div className="absolute top-2 right-2 flex gap-2">
            {/* Author Profile */}
            {(!userData || userData.uid !== author) && userId !== author && (
              <Link
                href={`/profile/${author}`}
                className="flex w-8 h-8 justify-center items-center border rounded-full border-transparent hover:border-white overflow-hidden transition-colors duration-300 "
              >
                <Image
                  src={profilePicture || "/img/icons/user.png"}
                  width={32}
                  height={32}
                  alt="👤"
                  className="w-8 min-w-[32px] h-8 min-h-[32px] object-cover"
                />
              </Link>
            )}

            {/* Edit Quiz */}
            {userData && userData.uid === author && (
              <Link
                href={`/quizMaker/${id}`}
                className="flex w-8 h-8 bg-black justify-center items-center border rounded-full border-transparent hover:border-white transition-colors duration-300 "
              >
                <Image
                  src="/img/icons/pencil.png"
                  width={16}
                  height={16}
                  alt="🖉"
                  className="w-4 min-w-[16px] h-4 min-h-[16px]"
                />
              </Link>
            )}

            {/* Handle Favorite */}
            <button
              type="button"
              onClick={() => handleFavorites(id)}
              className="flex w-8 h-8 bg-black justify-center items-center border rounded-full border-transparent hover:border-white transition-colors duration-300 "
            >
              <Image
                src={
                  userData?.favoriteQuizzes.includes(id)
                    ? "/img/icons/yellow-star.png"
                    : "/img/icons/white-star.png"
                }
                width={16}
                height={16}
                alt="☆"
                className="w-4 min-w-[16px] h-4 min-h-[16px]"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex w-full pt-2 flex-col gap-1">
        {/* Title */}
        <Link href={`/quiz/${id}`} className="w-fit">
          <h3 className="text-base line-clamp-2">{title}</h3>
        </Link>

        {/* Takers - Upload Date */}
        <div className="flex gap-1 text-xs font-extralight">
          <span>{takers} Takers</span>
          <b className="font-black">·</b>
          <span>{calculateUploadDate(uploadTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
