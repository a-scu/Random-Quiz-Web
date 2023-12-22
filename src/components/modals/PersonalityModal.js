"use client";

import useModalsContext from "@/contexts/ModalsContext";
import useNavbarContext from "@/contexts/NavbarContext";
import useQuizMakerContext from "@/contexts/QuizMakerContext";

import Image from "next/image";

const PersonalityModal = () => {
  const { isNavbarFixed } = useNavbarContext();
  const { personalityModal, setPersonalityModal } = useModalsContext();
  const {
    personalityToModify,
    setPersonalityToModify,
    handleDeletePersonality,
    personalityResultImagefileHandler,
    savePersonality,
  } = useQuizMakerContext();

  return (
    <div
      onClick={() => {
        setPersonalityModal(false);
        document.body.style.overflow = "";
      }}
      className={`fixed top-0 left-0 z-30 w-full h-screen p-4 bg-[#0f0f0f80] justify-center items-center ${
        personalityModal ? "flex" : "hidden"
      }`}
    >
      <div
        className="hidden-scroll w-full max-w-xl max-h-[95vh] bg-neutral-900 border rounded-md border-neutral-800 overflow-x-hidden overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title | Buttons */}
        <div className="sticky top-0 flex w-full p-4 bg-neutral-900 justify-between gap-2">
          <span className="w-fit my-auto text-lg font-medium">
            Personality Editor
          </span>

          <button
            type="button"
            onClick={() => {
              setPersonalityModal(false);
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

        <div className="flex w-full p-4 pt-0 mx-auto flex-col gap-4">
          {/* Personality name */}
          <div className="flex flex-col gap-2">
            <span>Personality Name</span>
            <input
              required
              maxLength={64}
              placeholder="..."
              value={personalityToModify.name}
              onChange={(e) =>
                setPersonalityToModify({
                  ...personalityToModify,
                  name: e.target.value,
                })
              }
              className="w-full h-10 pl-2 pr-8 bg-neutral-800 border border-transparent hover:border-neutral-700 focus:border-neutral-700 rounded-md outline-none text-sm font-extralight placeholder:text-neutral-400 transition-[border] duration-300"
            />
            {!personalityToModify.name && (
              <p className="text-xs text-red-400">This field is required</p>
            )}
          </div>

          {/* Personality description */}
          <div className="flex flex-col gap-2">
            <span>Description</span>
            <textarea
              required
              maxLength={256}
              placeholder="..."
              value={personalityToModify?.description}
              onChange={(e) =>
                setPersonalityToModify({
                  ...personalityToModify,
                  description: e.target.value,
                })
              }
              className="hidden-scroll w-full h-[102px] px-2 py-2.5 bg-neutral-800 border border-transparent hover:border-neutral-700 focus:border-neutral-700 rounded-md outline-none text-sm font-extralight placeholder:text-neutral-400 transition-[border] duration-300 resize-none"
            />
            {!personalityToModify.description && (
              <p className="text-xs text-red-400">This field is required</p>
            )}
          </div>

          {/* Personality image */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span>Result Image</span>
              <div className="relative">
                <label
                  htmlFor={"result-image"}
                  className="flex w-fit h-10 px-2 bg-neutral-800 justify-center items-center border rounded-md border-transparent hover:border-neutral-700 text-sm cursor-pointer transition-[border] duration-300"
                >
                  <span className="line-clamp-1">
                    {personalityToModify.resultImage.previewUrl ||
                    personalityToModify.resultImage.url
                      ? "Change Image"
                      : "Select Image"}
                  </span>
                </label>
                <input
                  type="file"
                  id={"result-image"}
                  name={"result-image"}
                  onChange={personalityResultImagefileHandler}
                  accept=".jpg, .jpeg, .png, .webp"
                  className="absolute bottom-0 w-fit h-8 opacity-0 pointer-events-none"
                />
              </div>
              <p className="text-xs text-neutral-400">
                We recommend you using a 1:1 aspect ratio image.
              </p>
              {!personalityToModify.resultImage.url &&
                !personalityToModify.resultImage.file && (
                  <p className="text-xs text-red-400">This field is required</p>
                )}
            </div>

            {personalityToModify.resultImage.previewUrl ||
            personalityToModify.resultImage.url ? (
              <Image
                src={
                  personalityToModify.resultImage.previewUrl ||
                  personalityToModify.resultImage.url
                }
                width={192}
                height={192}
                alt=""
                className="aspect-square mx-auto rounded-md object-cover"
              />
            ) : (
              <div className="flex aspect-square w-full max-w-[192px] mx-auto justify-center items-center border rounded-md border-neutral-800 overflow-hidden">
                <span className="text-sm">1:1</span>
              </div>
            )}
          </div>

          <div
            className={`flex w-full mx-auto gap-2 ${
              isNavbarFixed
                ? "max-[790px]:flex-col max-[790px]:max-w-xs"
                : "max-sm:flex-col max-sm:max-w-xs"
            }`}
          >
            {personalityToModify.id && (
              <button
                onClick={() => {
                  handleDeletePersonality(personalityToModify);
                }}
                className="flex w-full h-10 px-2 bg-neutral-800 justify-center items-center gap-2  border rounded-md border-transparent hover:border-neutral-700 cursor-pointer transition-[border] duration-300"
              >
                <span className="text-sm">Delete Personality</span>
              </button>
            )}

            <button
              onClick={savePersonality}
              className="flex w-full max-w-xs h-10 px-2 mx-auto bg-neutral-800 justify-center items-center gap-2  border rounded-md border-transparent hover:border-neutral-700 cursor-pointer transition-[border] duration-300"
            >
              <span className="text-sm">
                {!personalityToModify.id
                  ? "Create Personality"
                  : "Save Changes"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityModal;
