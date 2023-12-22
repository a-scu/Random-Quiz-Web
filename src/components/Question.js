import useNavbarContext from "@/contexts/NavbarContext";
import useModalsContext from "@/contexts/ModalsContext";
import useQuizMakerContext from "@/contexts/QuizMakerContext";

import Image from "next/image";
import Answer from "./Answer";

const Question = ({ question }) => {
  const { isNavbarFixed } = useNavbarContext();
  const { setHandleImageModal } = useModalsContext();
  const {
    quizData,
    questionBackgroundImageFileHandler,
    onChangeQuestion,
    handleDeleteQuestion,
    handleDeleteQuestionBackground,
    addAnswer,
    moveUp,
    moveDown,
  } = useQuizMakerContext();

  return (
    <div className="flex w-full max-w-2xl h-fit p-2 mx-auto flex-col gap-2 border rounded-lg border-neutral-800">
      <div className="flex justify-between items-center gap-2">
        {/* Question Title */}
        <span className="w-fit">Question {question.order + 1}</span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleDeleteQuestion(question)}
            className="flex h-8 w-8 bg-red-800 justify-center items-center border rounded-full border-transparent hover:border-neutral-700 cursor-pointer transition-[border] duration-300"
          >
            <Image
              src={"/img/icons/bin.png"}
              width={16}
              height={16}
              alt={"🗑"}
              className="w-4 min-w-[16px] h-4 min-h-[16px]"
            />
          </button>

          {/* Move Up */}
          {question.order > 0 && (
            <button
              type="button"
              onClick={() => moveUp(question)}
              className="flex h-8 w-8 bg-neutral-800 justify-center items-center border rounded-full border-transparent hover:border-neutral-700 cursor-pointer transition-[border] duration-300 -rotate-90"
            >
              <Image
                src={"/img/icons/long-arrow.png"}
                width={16}
                height={16}
                alt={"⬆"}
                className="w-4 min-w-[16px] h-4 min-h-[16px]"
              />
            </button>
          )}

          {/* Move Down */}
          {quizData.questions.length > 1 &&
            question.order !== quizData.questions.length - 1 && (
              <button
                type="button"
                onClick={() => moveDown(question)}
                className="flex h-8 w-8 bg-neutral-800 justify-center items-center border rounded-full border-transparent hover:border-neutral-700 cursor-pointer transition-[border] duration-300 rotate-90"
              >
                <Image
                  src={"/img/icons/long-arrow.png"}
                  width={16}
                  height={16}
                  alt={"⬇"}
                  className="w-4 min-w-[16px] h-4 min-h-[16px]"
                />
              </button>
            )}
        </div>
      </div>

      <textarea
        required
        maxLength={256}
        placeholder="..."
        value={quizData.questions[question.order]?.question}
        onChange={(e) => {
          onChangeQuestion(e, question);
        }}
        className="w-auto h-[102px] px-2 py-2.5 bg-neutral-800 border border-transparent hover:border-neutral-700 focus:border-neutral-700 rounded-md outline-none text-sm font-extralight placeholder:text-neutral-400 transition-[border] duration-300 resize-none"
      />

      <div className="flex gap-2">
        {question.question.length === 0 && (
          <p className="text-xs text-red-400">This field is required</p>
        )}
        <p className="ml-auto text-xs text-neutral-400 tracking-wider">
          {question.question.length}/256
        </p>
      </div>

      <div
        className={`flex gap-2 ${
          isNavbarFixed ? "max-[790px]:flex-col" : "max-sm:flex-col"
        }`}
      >
        {/* Question Background */}
        <div
          onClick={() => {
            document.body.style.overflow = "hidden";
            setHandleImageModal({
              isOpen: true,
              title: "Question Background",
              image:
                question?.backgroundImage?.previewUrl ||
                question?.backgroundImage?.url,
              changeImage: (e) => {
                questionBackgroundImageFileHandler(e, question);
                setHandleImageModal({ isOpen: false });
                document.body.style.overflow = "";
              },
              deleteImage: () => handleDeleteQuestionBackground(question),
            });
          }}
          className="flex w-full p-2 bg-neutral-800 justify-between gap-4 border rounded-md border-transparent hover:border-neutral-700 cursor-pointer transition-[border] duration-300"
        >
          <div className="flex flex-col gap-2">
            <span className="text-sm">
              Question <br /> Background
            </span>
            <p className="text-xs text-neutral-400">Optional</p>
          </div>

          {question.backgroundImage.previewUrl ||
          question.backgroundImage.url ? (
            <Image
              src={
                question.backgroundImage.previewUrl ||
                question.backgroundImage.url
              }
              width={96}
              height={96}
              alt=""
              className="aspect-square w-24 min-w-[96px] h-24 min-h-[96px] bg-neutral-900 rounded-md object-cover"
            />
          ) : (
            <div className="flex aspect-square w-24 min-w-[96px] h-24 min-h-[96px] bg-neutral-900 justify-center items-center rounded-md">
              <Image
                src={"/img/icons/plus.png"}
                width={16}
                height={16}
                alt="+"
                className="w-4 min-w-[16px] h-4 min-h-[16px]"
              />
            </div>
          )}
        </div>

        {/* Add Answer */}
        <button
          onClick={() => addAnswer(question)}
          className="flex w-full h-auto min-h-[116px] p-2 hover:bg-neutral-800 justify-center items-center gap-4 border rounded-md border-neutral-800 hover:border-neutral-700 text-sm cursor-pointer transition-[background,border] duration-300"
        >
          <span className="text-center">Add Answer</span>
          <Image
            src={"/img/icons/plus.png"}
            width={14}
            height={14}
            alt="+"
            className="w-3.5 min-w-[14px] h-3.5 min-h-[14px]"
          />
        </button>
      </div>

      {/* Answers */}
      {question.answers.length !== 0 && (
        <div className="flex p-2 flex-col gap-2 border rounded-md border-neutral-800">
          <span>Answers</span>
          <div className="flex flex-col gap-2">
            {quizData.questions[question.order]?.answers.map((answer) => (
              <Answer
                key={`question-${question.order + 1}-answer-${
                  answer.order + 1
                }`}
                question={question}
                answer={answer}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
