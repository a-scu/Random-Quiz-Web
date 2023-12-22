import useQuizMakerContext from "@/contexts/QuizMakerContext";

import Button from "./Button";

const QuizOptions = () => {
  const { quizData, saveChanges, handleDeleteQuiz } = useQuizMakerContext();

  return (
    <div className="linear-shadow fixed bottom-0 flex mb-4 rounded-lg mx-4">
      <div className="flex p-2 bg-stone-800 gap-2 border border-stone-600 rounded-lg">
        <Button icon={"/img/icons/tick.png"} alt={"✓"} onClick={saveChanges}>
          Save Changes
        </Button>

        <Button
          red
          icon={"/img/icons/bin.png"}
          alt={"🗑"}
          onClick={() => handleDeleteQuiz(quizData.id, quizData.title)}
        >
          Delete Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizOptions;
