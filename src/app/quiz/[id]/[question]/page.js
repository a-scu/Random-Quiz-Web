"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import useNavbarContext from "@/contexts/NavbarContext";
import useQuizzesContext from "@/contexts/QuizzesContext";

import Image from "next/image";
import Link from "next/link";

const QuizQuestion = () => {
  const { id, question } = useParams();

  const { isNavbarFixed } = useNavbarContext();

  const { quiz, selectedAnswer, setSelectedAnswer, handleNextQuestion } =
    useQuizzesContext();

  if (!quiz)
    return (
      <div className="relative flex h-screen flex-col">
        {/* Header */}
        <h1 className="logo absolute top-4 left-4 text-2xl font-bold line-clamp-1 text-shadow">
          Random Quiz
        </h1>

        <div className="flex w-full h-full px-4 py-16 justify-center items-center">
          <Link
            href={`/quiz/${id}`}
            className="flex w-full max-w-3xs h-10 px-2 bg-emerald-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-emerald-700 cursor-pointer transition-[border] duration-300"
          >
            <span className="text-sm">Go to quiz</span>
          </Link>
        </div>
      </div>
    );

  if (question)
    return (
      <div
        className="relative flex flex-col h-full min-h-screen mb-4 bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            quiz?.questions[question - 1]?.backgroundImage?.url
          })`,
        }}
      >
        {/* Header */}
        <h1 className="logo absolute top-4 left-4 text-2xl font-bold line-clamp-1 text-shadow">
          Random Quiz
        </h1>

        {/* Content */}
        <div className="quiz-intro-gradient flex-grow flex w-full h-full p-4 flex-col justify-center items-center gap-16">
          <div className="flex flex-col items-center gap-2">
            <span className="text-center text-shadow">
              Question {question} of {quiz?.questions?.length}
            </span>

            <h2 className="text-4xl font-semibold text-center text-shadow">
              {quiz?.questions[question - 1]?.question}
            </h2>
          </div>

          <div className="flex w-full max-w-2xl flex-col gap-2">
            {quiz?.questions[question - 1]?.answers?.map((answer) => (
              <div
                key={answer.id}
                onClick={() => setSelectedAnswer(answer.order)}
                className={`flex w-full min-h-[114px] p-2 justify-center items-center gap-4 border rounded-md border-transparent cursor-pointer transition-[background,border] duration-300 ${
                  selectedAnswer === answer.order
                    ? "bg-[#065f4680]"
                    : "bg-[#17171780] hover:border-neutral-700"
                } ${
                  isNavbarFixed ? "max-[790px]:flex-col" : "max-sm:flex-col"
                }`}
              >
                <span className="mr-auto">{answer.answer}</span>

                {answer.answerImage.url && (
                  <Image
                    src={answer.answerImage.url}
                    width={112}
                    height={112}
                    alt=""
                    className="aspect-square rounded-md object-cover"
                  />
                )}
              </div>
            ))}
          </div>

          <div
            className={`flex w-full justify-center items-center gap-2 ${
              isNavbarFixed ? "max-[790px]:flex-col" : "max-sm:flex-col"
            }`}
          >
            <Link
              href={`/quiz/${quiz.id}/${Number(question) + 1}`}
              className="flex w-full max-w-3xs h-10 px-2 bg-neutral-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-neutral-700 cursor-pointer transition-[border] duration-300"
            >
              <span className="text-sm">Previous Question</span>
            </Link>

            <button
              onClick={() => handleNextQuestion(question)}
              className="flex w-full max-w-3xs h-10 px-2 bg-emerald-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-emerald-700 cursor-pointer transition-[border] duration-300"
            >
              <span className="text-sm">Next Question</span>
            </button>
          </div>
        </div>
      </div>
    );
};
export default QuizQuestion;
