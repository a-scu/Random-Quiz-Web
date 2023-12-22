import useNavbarContext from "@/contexts/NavbarContext";
import useQuizMakerContext from "@/contexts/QuizMakerContext";

import H2 from "./H2";
import Description from "./Description";
import Button from "./Button";
import InputText from "./InputText";
import TextArea from "./TextArea";
import PreviewCard from "./PreviewCard";
import Message from "./Message";

const CreateQuizSection = () => {
  const { isNavbarFixed } = useNavbarContext();
  const { quizData, setQuizData, createQuiz } = useQuizMakerContext();

  return (
    <div
      className={`grid w-full gap-4 ${
        isNavbarFixed
          ? "min-[1174px]:grid-cols-[1fr,416px]"
          : "lg:grid-cols-[1fr,416px]"
      }`}
    >
      {/* Col 1 */}
      <div className="flex h-fit flex-col gap-4">
        {/* Quiz Title */}
        <div className="flex p-4 bg-black flex-col gap-2 rounded-lg">
          <H2>Quiz Title</H2>
          <InputText
            value={quizData.title}
            maxLength={128}
            onChange={(e) =>
              setQuizData({
                ...quizData,
                title: e.target.value,
              })
            }
          />
          <div className="flex gap-2">
            {quizData.title.length === 0 && (
              <Message warning>This field is required</Message>
            )}

            <p className="ml-auto text-xs text-stone-300 tracking-wider">
              {quizData.title.length}/256
            </p>
          </div>
        </div>

        {/* Quiz Intro */}
        <div className="flex p-4 bg-black flex-col gap-2 rounded-lg">
          <H2>Quiz Intro</H2>
          <TextArea
            value={quizData.intro}
            maxLength={256}
            onChange={(e) =>
              setQuizData({
                ...quizData,
                intro: e.target.value,
              })
            }
          />
          <div className="flex gap-2">
            <Description>(Optional)</Description>
            <p className="ml-auto text-xs text-stone-300 tracking-wider">
              {quizData.intro.length}/256
            </p>
          </div>
        </div>
      </div>

      {/* Col 2 */}
      <div
        href={"/"}
        className="flex w-full h-fit p-4 bg-black flex-col gap-4 rounded-lg"
      >
        {/* Card Image */}
        <div className="flex flex-col gap-2">
          <H2>Card Image</H2>
          <Description>
            We recommend you using a 3:2 aspect ratio image.
          </Description>
          {!quizData.cardImage.url && !quizData.cardImage.file && (
            <Message warning>This field is required</Message>
          )}
        </div>

        {/* Preview Card */}
        <PreviewCard />

        {/* Create Quiz */}
        {!quizData.id && (
          <Button
            full
            icon="/img/icons/long-arrow.png"
            alt="→"
            center
            onClick={createQuiz}
          >
            Create Quiz
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateQuizSection;
