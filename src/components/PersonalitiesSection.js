import useNavbarContext from "@/contexts/NavbarContext";
import useModalsContext from "@/contexts/ModalsContext";
import useQuizMakerContext from "@/contexts/QuizMakerContext";

import Image from "next/image";
import PersonalityCard from "./PersonalityCard";

const PersonalitiesSection = () => {
  const { isNavbarFixed } = useNavbarContext();
  const { setPersonalityModal } = useModalsContext();
  const { initialPersonalityToModify, quizData, setPersonalityToModify } =
    useQuizMakerContext();

  return (
    <div className="flex p-4 flex-col gap-2 border rounded-md border-neutral-800">
      <h3 className="w-fit text-lg font-medium">Personalities</h3>

      {quizData.personalities.length < 2 && (
        <p className="text-xs text-red-400">
          Your quiz must have at least two personalities
        </p>
      )}

      {/* Personality Cards */}

      <div
        className={`grid gap-2 justify ${
          isNavbarFixed
            ? "lg:grid-cols-2 xl:grid-cols-3"
            : "md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {quizData.personalities.map((personality) => (
          <PersonalityCard key={personality.id} personality={personality} />
        ))}

        <button
          onClick={() => {
            setPersonalityToModify(initialPersonalityToModify);
            setPersonalityModal(true);
            document.body.style.overflow = "hidden";
          }}
          className="flex w-full h-full min-h-[114px] hover:bg-neutral-800 justify-center items-center gap-4 border rounded-md border-neutral-800 hover:border-neutral-700 cursor-pointer transition-[background,border] duration-300"
        >
          <span>Add Personality</span>
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

export default PersonalitiesSection;
