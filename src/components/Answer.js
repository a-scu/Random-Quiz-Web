import useNavbarContext from "@/contexts/NavbarContext";
import useModalsContext from "@/contexts/ModalsContext";
import useQuizMakerContext from "@/contexts/QuizMakerContext";

import Image from "next/image";

const Answer = ({ question, answer }) => {
  const { isNavbarFixed } = useNavbarContext();
  const { setPersonalityModal, setHandleImageModal } = useModalsContext();
  const {
    quizData,
    onChangeAnswer,
    initialPersonalityToModify,
    setPersonalityToModify,
    handleDeleteAnswer,
    answerFileHandler,
    handleAssignPersonality,
    deleteAnswerPersonality,
    handleDeleteAnswerImage,
  } = useQuizMakerContext();

  return (
    <div className="flex p-2 flex-col gap-2 border border-neutral-800 rounded-lg">
      <div className="flex w-full justify-between items-center gap-2">
        <span className="text-sm">Answer {answer.order + 1}</span>

        {/* Delete Answer */}
        <button
          type="button"
          onClick={() => handleDeleteAnswer(question, answer)}
          className="flex h-8 w-8 bg-red-800 justify-center items-center border rounded-full border-transparent hover:border-neutral-700 cursor-pointer transition-[border] duration-300"
        >
          <Image
            src={"/img/icons/bin.png"}
            width={14}
            height={14}
            alt={"🗑"}
            className="w-3.5 min-w-[14px] h-3.5 min-h-[14px]"
          />
        </button>
      </div>

      <textarea
        required
        maxLength={256}
        placeholder="..."
        value={quizData.questions[question.order].answers[answer.order].answer}
        onChange={(e) => {
          onChangeAnswer(e, question, answer);
        }}
        className="w-auto h-[102px] px-2 py-2.5 bg-neutral-800 border border-transparent hover:border-neutral-700 focus:border-neutral-700 rounded-md outline-none text-sm font-extralight placeholder:text-neutral-400 transition-[border] duration-300 resize-none"
      />

      <div className="flex gap-2">
        {answer.answer.length === 0 && (
          <p className="text-xs text-red-400">This field is required</p>
        )}

        <p className="ml-auto text-xs text-neutral-300 tracking-wider">
          {answer.answer.length}/256
        </p>
      </div>

      <div
        className={`flex gap-2 ${
          isNavbarFixed ? "max-[790px]:flex-col" : "max-sm:flex-col"
        }`}
      >
        {/* Personalities */}
        <div className="flex w-full h-auto min-h-[114px] flex-col p-2 gap-2 rounded-md border border-neutral-800 transition-[border] duration-300">
          <span className="text-sm">Personalities</span>

          <div
            className={`flex flex-wrap gap-2 ${
              quizData.personalities.length === 0 ||
              (answer.personalities.length === 0 &&
                "w-full h-full justify-center items-center")
            }`}
          >
            {quizData.personalities
              .filter((personality) =>
                answer.personalities.includes(personality.id)
              )
              .map((personality) => {
                console.log(personality);

                return (
                  <button
                    key={`personality-${personality.id}`}
                    onClick={() =>
                      deleteAnswerPersonality(personality, question, answer)
                    }
                    className="flex w-fit h-8 px-2 bg-neutral-800 justify-center items-center gap-2  border rounded-md border-transparent hover:border-neutral-700 text-sm cursor-pointer transition-[border] duration-300"
                  >
                    <span>{personality.name}</span>
                  </button>
                );
              })}

            {quizData.personalities.length === 0 ? (
              <p className="text-xs text-red-400">
                You don't have personalities to assign
              </p>
            ) : (
              answer.personalities.length < quizData.personalities.length && (
                <div className="flex h-full flex-col justify-center items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleAssignPersonality(question, answer);
                      document.body.style.overflow = "hidden";
                    }}
                    className="flex aspect-square h-8 w-8 hover:bg-neutral-800 justify-center items-center border rounded-md border-neutral-800 hover:border-neutral-700 cursor-pointer transition-[background,border] duration-300"
                  >
                    <Image
                      src={"/img/icons/plus.png"}
                      width={14}
                      height={14}
                      alt="+"
                      className="w-3.5 min-w-[14px] h-3.5 min-h-[14px]"
                    />
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* Answer Image */}
        <div
          onClick={() => {
            document.body.style.overflow = "hidden";
            setHandleImageModal({
              isOpen: true,
              title: "Answer Image",
              image:
                answer?.answerImage?.previewUrl || answer?.answerImage?.url,
              changeImage: (e) => {
                answerFileHandler(e, question, answer);
                setHandleImageModal({ isOpen: false });
                document.body.style.overflow = "";
              },
              deleteImage: () => handleDeleteAnswerImage(question, answer),
            });
          }}
          className="flex w-full max-w-xs min-h-[114px] p-2 mx-auto bg-neutral-800 justify-between gap-4 border rounded-md border-transparent hover:border-neutral-700 cursor-pointer transition-[border] duration-300"
        >
          <div className="flex flex-col gap-2">
            <span className="text-sm">
              Answer <br /> Image
            </span>
            <p className="text-xs text-neutral-400">Optional</p>
          </div>

          {answer.answerImage.previewUrl || answer.answerImage.url ? (
            <Image
              src={answer.answerImage.previewUrl || answer.answerImage.url}
              width={96}
              height={96}
              alt=""
              className="aspect-square w-24 min-w-[96px] h-24 min-h-[96px] rounded-md object-cover"
            />
          ) : (
            <div className="flex aspect-square w-24 min-w-[96px] h-24 min-h-[96px] bg-neutral-900 justify-center items-center border rounded-md border-neutral-800 cursor-pointer transition-[background] duration-300">
              <Image
                src={"/img/icons/plus.png"}
                width={14}
                height={14}
                alt="+"
                className="w-3.5 min-w-[14px] h-3.5 min-h-[14px]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Answer;
