"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { db } from "@/components/firebase";
import { doc, getDoc } from "firebase/firestore";

import useNavbarContext from "@/contexts/NavbarContext";

import Image from "next/image";
import useModalsContext from "@/contexts/ModalsContext";

const QuizResult = () => {
  const { id, result } = useParams();

  const { isNavbarFixed } = useNavbarContext();
  const { setLoadingModal } = useModalsContext();

  const [quiz, setQuiz] = useState(null);
  const [author, setAuthor] = useState(null);

  const [copied, setCopied] = useState(false);

  const router = useRouter();

  const currentURL =
    typeof window !== "undefined" ? window.location.href : router.asPath;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentURL);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (error) {
      console.error("Error copying link: ", error);
    }
  };

  useEffect(() => {
    const getAuthor = async (id) => {
      try {
        const userRef = doc(db, "users", id);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const { displayName, profilePicture } = userSnapshot.data();
          setAuthor({ id, displayName, profilePicture });
        } else {
          throw new Error("User doesn't exist");
        }
      } catch (error) {
        console.error("Error getting data from Firebase:", error);
      }
    };

    const getDocFromFirebase = async (id) => {
      try {
        const quizRef = doc(db, "quizzes", id);
        const quizSnapshot = await getDoc(quizRef);

        if (quizSnapshot.exists()) {
          const quizData = quizSnapshot.data();
          await getAuthor(quizData.author);
          setQuiz({ id, ...quizData });
        } else {
          throw new Error("Document doesn't exist");
        }
      } catch (error) {
        console.error("Error getting data from Firebase:", error);
      }

      setLoadingModal(false);
    };

    setLoadingModal(true);
    getDocFromFirebase(id);
  }, []);

  const takeAgain = () => {
    router.push(`/quiz/${quiz.id}`);
  };

  if (quiz)
    return (
      <div
        className="relative flex flex-col h-full min-h-screen mb-4 bg-cover bg-center"
        style={{
          backgroundImage: `url(${quiz.cardImage.url})`,
        }}
      >
        {/* Header */}
        <h1 className="logo absolute top-4 left-4 text-2xl font-bold line-clamp-1 text-shadow">
          Random Quiz
        </h1>

        {/* Content */}
        <div className="quiz-intro-gradient flex h-full px-4 py-16 flex-grow flex-col justify-center items-center gap-4">
          <div className="flex flex-col justify-evenly items-center gap-4">
            {quiz.personalities.map(
              (personality) =>
                personality.id === result && (
                  <div
                    key={personality.id}
                    className="flex max-w-2xl flex-col items-center gap-4"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-shadow">Your Result:</span>

                      <h2 className="text-4xl font-semibold text-center text-shadow">
                        {personality.name}
                      </h2>
                    </div>
                    <Image
                      src={personality.resultImage.url}
                      width={320}
                      height={320}
                      alt=""
                      className="aspect-square w-full max-w-xs bg-neutral-800 rounded-md object-cover"
                    />

                    <p className="my-4 text-lg font-medium text-center text-shadow">
                      {personality.description}
                    </p>
                  </div>
                )
            )}
          </div>

          <div className="flex w-full justify-center items-center gap-2 max-[448px]:flex-col">
            {/* Take Again */}
            <button
              type="button"
              onClick={takeAgain}
              className="flex w-full max-w-3xs h-10 px-2 bg-emerald-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-emerald-700 cursor-pointer transition-[border] duration-300"
            >
              <span className="text-sm">Take Again</span>
            </button>

            {/* Take Again */}
            <button
              type="button"
              onClick={copyLink}
              className="flex w-full max-w-3xs h-10 px-2 bg-emerald-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-emerald-700 cursor-pointer transition-[border] duration-300"
            >
              <span className="text-sm">Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    );
};

export default QuizResult;
