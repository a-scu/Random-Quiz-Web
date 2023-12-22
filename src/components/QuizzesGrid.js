import useNavbarContext from "@/contexts/NavbarContext";

import QuizCard from "./QuizCard";
import H2 from "./H2";

const QuizzesGrid = ({ title, quizzes }) => {
  const { isNavbarFixed } = useNavbarContext();

  return (
    <>
      {quizzes.length !== 0 && (
        <div className="flex p-4 bg-black flex-col gap-4 rounded-lg">
          {title && <H2>{title}</H2>}

          <div
            className={`grid flex-col gap-4 ${
              isNavbarFixed
                ? "min-[918px]:grid-cols-2 min-[1174px]:grid-cols-3 min-[1430px]:grid-cols-4"
                : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quizData={quiz} profile />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default QuizzesGrid;
