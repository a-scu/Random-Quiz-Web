import useQuizMakerContext from "@/contexts/QuizMakerContext";
import useModalsContext from "@/contexts/ModalsContext";

import Image from "next/image";

const PersonalityCard = ({ personality }) => {
  const { name, description, resultImage } = personality;

  const { setPersonalityModal } = useModalsContext();
  const { setPersonalityToModify } = useQuizMakerContext();

  return (
    <div
      onClick={() => {
        setPersonalityToModify(personality);
        setPersonalityModal(true);
        document.body.style.overflow = "hidden";
      }}
      className="flex w-full p-2 bg-neutral-800 gap-2 border rounded-md border-transparent hover:border-neutral-700 cursor-pointer transition-[border] duration-300"
    >
      {/* Name - Description */}
      <div className="flex w-full flex-col gap-2">
        <span className="line-clamp-1">{name}</span>
        <p className="text-sm font-extralight line-clamp-3">{description}</p>
      </div>

      {/* Result Image */}
      {(resultImage.previewUrl || resultImage.url) && (
        <Image
          src={resultImage.previewUrl || resultImage.url}
          width={96}
          height={96}
          alt=""
          className="aspect-square w-24 min-w-[96px] h-24 min-h-[96px] rounded-md object-cover"
        />
      )}
    </div>
  );
};

export default PersonalityCard;
