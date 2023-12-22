"use client";

import { useEffect } from "react";

import useNavbarContext from "@/contexts/NavbarContext";

import QuizCard from "./QuizCard";

const QuizzesScroll = ({
  quizzes,
  getQuizzes,
  loadingQuizzes,
  setLoadingQuizzes,
}) => {
  const { isNavbarFixed } = useNavbarContext();

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement || document.body;

      if (scrollTop + clientHeight >= scrollHeight - 64 && !loadingQuizzes) {
        getQuizzes();
        setLoadingQuizzes(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loadingQuizzes]);

  return (
    <>
      {quizzes?.length === 0 ? (
        <span>There are no quizzes to show</span>
      ) : (
        <div
          className={`grid flex-col gap-4 ${
            isNavbarFixed
              ? "min-[726px]:grid-cols-2 min-[1174px]:grid-cols-3 min-[1430px]:grid-cols-4 min-[1686px]:grid-cols-5"
              : "min-[576px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          }`}
        >
          {quizzes?.map((quiz) => (
            <QuizCard key={quiz.id} quizData={quiz} />
          ))}
        </div>
      )}
    </>
  );
};

export default QuizzesScroll;
