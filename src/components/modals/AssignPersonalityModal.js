"use client";

import useModalsContext from "@/contexts/ModalsContext";
import useQuizMakerContext from "@/contexts/QuizMakerContext";

import Image from "next/image";

const AssignPersonalityModal = () => {
  const { assignPersonalityModal, setAssignPersonalityModal } =
    useModalsContext();
  const { assignPersonality } = useQuizMakerContext();

  return (
    <div
      onClick={() => {
        setAssignPersonalityModal({ ...assignPersonalityModal, isOpen: false });
        document.body.style.overflow = "";
      }}
      className={`fixed top-0 left-0 z-30 w-full min-h-screen p-4 bg-[#0f0f0f80] justify-center items-center ${
        assignPersonalityModal.isOpen ? "flex" : "hidden"
      }`}
    >
      <div
        className="hidden-scroll w-full max-w-md max-h-[95vh] bg-neutral-900 border rounded-md border-neutral-800 overflow-x-hidden overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title | Buttons */}
        <div className="sticky top-0 flex w-full p-4 bg-neutral-900 justify-between gap-2">
          <span className="w-fit my-auto text-lg font-medium">
            Assign Personality
          </span>

          <button
            type="button"
            onClick={() => {
              setAssignPersonalityModal({
                ...assignPersonalityModal,
                isOpen: false,
              });
              document.body.style.overflow = "";
            }}
            className="flex aspect-square w-8 h-8 justify-center items-center cursor-pointer"
          >
            <Image
              src={"/img/icons/close-white.png"}
              width={14}
              height={14}
              alt={"X"}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex w-full p-4 pt-0 flex-col gap-2">
          {assignPersonalityModal.unassignedPersonalities.map((personality) => (
            <div
              key={personality.id}
              onClick={() =>
                assignPersonality(
                  personality,
                  assignPersonalityModal.question,
                  assignPersonalityModal.answer
                )
              }
              className="flex w-full p-2 bg-neutral-800 gap-2 border rounded-md border-transparent hover:border-neutral-700 cursor-pointer transition-[border] duration-300"
            >
              {/* Name - Description */}
              <div className="flex w-full flex-col gap-2">
                <span className="line-clamp-1"> {personality.name}</span>
                <p className="text-sm font-extralight line-clamp-3">
                  {personality.description}
                </p>
              </div>

              {/* Result Image */}
              <Image
                src={
                  personality.resultImage.previewUrl ||
                  personality.resultImage.url
                }
                width={96}
                height={96}
                alt=""
                className="aspect-square w-24 min-w-[96px] h-24 min-h-[96px] bg-neutral-900 rounded-md object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignPersonalityModal;
