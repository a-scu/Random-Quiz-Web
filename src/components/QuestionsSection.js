import useNavbarContext from "@/contexts/NavbarContext";
import useQuizMakerContext from "@/contexts/QuizMakerContext";

import Question from "./Question";
import Image from "next/image";

const QuestionsSection = () => {
  const { isNavbarFixed } = useNavbarContext();
  const { quizData, addQuestion } = useQuizMakerContext();

  return (
    <div className="flex w-full p-4 flex-col gap-4 border rounded-md border-neutral-800">
      <div className="flex flex-col gap-2">
        <h3 className="w-fit text-lg font-medium">Questions</h3>
        {quizData.questions.length === 0 && (
          <p className="text-xs text-red-400">
            Your quiz must have at least one question
          </p>
        )}
      </div>

      <div
        className={`grid gap-4 ${
          isNavbarFixed ? "min-[1174px]:grid-cols-2" : "lg:grid-cols-2"
        }`}
      >
        {quizData.questions.map((question) => (
          <Question
            key={`question-${question.order + 1}`}
            quizData={quizData}
            question={question}
          />
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="flex w-full max-w-2xl h-full min-h-[114px] mx-auto hover:bg-neutral-800 justify-center items-center gap-4 border rounded-md border-neutral-800 hover:border-neutral-700 cursor-pointer transition-[background,border] duration-300"
        >
          <span>Add Question</span>
          <Image
            src={"/img/icons/plus.png"}
            width={16}
            height={16}
            alt="+"
            className="w-4 min-w-[16px] h-4 min-h-[16px]"
          />
        </button>
      </div>
    </div>
  );
};

export default QuestionsSection;
