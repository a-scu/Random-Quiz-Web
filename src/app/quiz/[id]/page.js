"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import useQuizzesContext from "@/contexts/QuizzesContext";

import Image from "next/image";
import Link from "next/link";

const QuizIntro = () => {
  const { id } = useParams();

  const { quiz, author, taker, setTaker, getQuiz } = useQuizzesContext();

  useEffect(() => {
    getQuiz(id);
  }, []);

  const { push } = useRouter();

  const handleStartQuiz = () => {
    function checkQuiz() {
      if (
        !quiz ||
        !quiz.questions ||
        !Array.isArray(quiz.questions) ||
        quiz.questions.length === 0 ||
        quiz.personalities.length < 2
      ) {
        return true;
      }

      for (let i = 0; i < quiz.questions.length; i++) {
        const questionItem = quiz.questions[i];

        if (
          questionItem &&
          typeof questionItem === "object" &&
          "question" in questionItem &&
          "answers" in questionItem &&
          Array.isArray(questionItem.answers)
        ) {
          if (
            typeof questionItem.question === "string" &&
            questionItem.question.trim() === ""
          ) {
            return true;
          }

          for (let j = 0; j < questionItem.answers.length; j++) {
            const answer = questionItem.answers[j];
            if (typeof answer === "string" && answer.trim() === "") {
              return true;
            }
            if (answer.personalities.length === 0) return true;
          }
        } else {
          return true;
        }
      }

      return false;
    }

    if (checkQuiz())
      return alert(
        "Este quiz no esta disponible para realizarse ya que no esta terminado"
      );

    push(`/quiz/${quiz.id}/1`);
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
        <div className="quiz-intro-gradient flex h-full px-4 py-16 flex-grow flex-col items-center gap-4">
          <div className="flex h-full flex-col justify-evenly flex-grow items-center gap-8">
            {/* Title && Intro */}
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="text-4xl font-semibold text-center text-shadow">
                {quiz.title}
              </h2>
              {quiz?.intro && (
                <p className="max-w-2xl text-center text-shadow">
                  {quiz.intro}
                </p>
              )}
            </div>

            <div className="flex w-full flex-col justify-center items-center gap-4">
              {/* Start Quiz */}
              <div className="flex w-full max-w-2xs flex-col justify-center items-center gap-2">
                {/* <input
                  required
                  maxLength={32}
                  placeholder="Enter your name"
                  value={taker}
                  onChange={(e) => setTaker(e.target.value)}
                  className="w-full h-10 px-2 bg-neutral-800 border border-transparent hover:border-neutral-700 focus:border-neutral-700 rounded-md outline-none text-sm font-extralight placeholder:text-neutral-400 transition-[border] duration-300"
                /> */}

                <button
                  onClick={handleStartQuiz}
                  className="flex w-full max-w-3xs h-10 px-2 bg-emerald-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-emerald-700 cursor-pointer transition-[border] duration-300"
                >
                  <span className="text-sm">Start Quiz</span>
                </button>
              </div>
            </div>

            {/* Author */}
            <Link
              href={`/profile/${author.id}`}
              className="group flex flex-col justify-center items-center gap-2"
            >
              <span className="text-sm text-shadow">
                By {author.displayName}
              </span>
              <Image
                src={author.profilePicture}
                width={64}
                height={64}
                alt=""
                className="aspect-square object-cover border rounded-full border-transparent group-hover:neutral-emerald-800 transition-colors duration-300 "
              />
            </Link>
          </div>
        </div>
      </div>
    );
};

export default QuizIntro;
