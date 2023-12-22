"use client";

import { useEffect } from "react";

import useNavbarContext from "@/contexts/NavbarContext";
import useModalsContext from "@/contexts/ModalsContext";
import useQuizMakerContext from "@/contexts/QuizMakerContext";

import PreviewCard from "@/components/PreviewCard";
import useUserContext from "@/contexts/UserContext";

const NewQuiz = () => {
  const { isNavbarFixed } = useNavbarContext();
  const { setLoadingModal } = useModalsContext();
  const {
    initialQuizData,
    quizData,
    setQuizData,
    createQuiz,
    cardImageFileHandler,
  } = useQuizMakerContext();
  const { loadingUserData, userData } = useUserContext();

  useEffect(() => {
    setQuizData(initialQuizData);
    setLoadingModal(false);
  }, []);

  if (!loadingUserData && !userData) return <div>Go home</div>;

  if (!loadingUserData && userData)
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex sticky top-0 z-10 p-4 bg-neutral-900 items-center gap-4">
          <h1 className="logo min-w-fit text-2xl font-bold">Random Quiz</h1>
          <span>{">"}</span>
          <h2 className="w-fit text-xl font-semibold">New Quiz</h2>
          <span>{">"}</span>
          <button
            onClick={createQuiz}
            className="flex w-fit h-8 px-2 bg-emerald-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-neutral-700 cursor-pointer transition-[border] duration-300"
          >
            <span className="text-sm">Create Quiz</span>
          </button>
        </div>

        <div
          className={`flex w-full h-full p-4 pt-0 m-auto gap-4 justify-evenly items-center ${
            isNavbarFixed ? "max-[1174px]:flex-col" : "max-lg:flex-col"
          }`}
        >
          {/* Col 1 */}
          <div className="flex w-full max-w-xl flex-col gap-4">
            {/* Quiz Title */}
            <div className="flex flex-col gap-2 p-4 border rounded-md border-neutral-800">
              <h3 className="w-fit text-lg font-medium">Quiz Title</h3>
              <input
                required
                maxLength={128}
                placeholder="..."
                value={quizData.title}
                onChange={(e) =>
                  setQuizData({
                    ...quizData,
                    title: e.target.value,
                  })
                }
                className="w-full h-10 px-2 bg-neutral-800 border border-transparent hover:border-neutral-700 focus:border-neutral-700 rounded-md outline-none text-sm font-extralight placeholder:text-neutral-400 transition-[border] duration-300"
              />
              <div className="flex gap-2">
                {quizData.title.length === 0 && (
                  <p className="text-xs text-red-400">This field is required</p>
                )}
                <span className="ml-auto text-xs text-neutral-400 tracking-wider">
                  {quizData.title.length}/128
                </span>
              </div>
            </div>

            {/* Quiz Intro */}
            <div className="flex flex-col gap-2 p-4 border rounded-md border-neutral-800">
              <h3 className="w-fit text-lg font-medium">Quiz Intro</h3>
              <textarea
                required
                maxLength={512}
                placeholder="..."
                value={quizData.intro}
                onChange={(e) =>
                  setQuizData({
                    ...quizData,
                    intro: e.target.value,
                  })
                }
                className="hidden-scroll w-full h-[102px] px-2 py-2.5 bg-neutral-800 border border-transparent hover:border-neutral-700 focus:border-neutral-700 rounded-md outline-none text-sm font-extralight placeholder:text-neutral-400 transition-[border] duration-300 resize-none"
              />

              <div className="flex gap-2">
                <p className="text-xs text-neutral-400">Optional</p>
                <span className="ml-auto text-xs text-neutral-400 tracking-wider">
                  {quizData.intro.length}/256
                </span>
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div
            className={`flex w-full flex-col gap-4 p-4 border rounded-md border-neutral-800 ${
              isNavbarFixed
                ? "max-w-xl min-[1174px]:max-w-sm"
                : "max-w-xl lg:max-w-sm"
            }`}
          >
            {/* Card Image */}
            <div className="flex flex-col gap-2">
              <h3 className="w-fit text-lg font-medium">Card Image</h3>
              <p className="text-xs text-neutral-400">
                We recommend you using a 3:2 aspect ratio image.
              </p>

              <div className="relative">
                <label
                  htmlFor={"card-image"}
                  className="flex w-fit h-8 px-2 bg-neutral-800 justify-center items-center border rounded-md border-transparent hover:border-neutral-700 text-sm cursor-pointer transition-[border] duration-300"
                >
                  <span className="line-clamp-1">
                    {quizData.cardImage.previewUrl
                      ? "Change Image"
                      : "Select Image"}
                  </span>
                </label>
                <input
                  type="file"
                  id={"card-image"}
                  name={"card-image"}
                  onChange={cardImageFileHandler}
                  accept=".jpg, .jpeg, .png, .webp"
                  className="absolute bottom-0 w-fit h-8 opacity-0 pointer-events-none"
                />
              </div>

              {!quizData.cardImage.url && !quizData.cardImage.file && (
                <p className="text-xs text-red-400">This field is required</p>
              )}
            </div>

            {/* Preview Card */}
            <PreviewCard />
          </div>
        </div>
      </div>
    );
};

export default NewQuiz;
