"use client";

import useModalsContext from "@/contexts/ModalsContext";

import Image from "next/image";

const HandleImageModal = () => {
  const { handleImageModal, setHandleImageModal } = useModalsContext();

  return (
    <div
      onClick={() => {
        setHandleImageModal(false);
        document.body.style.overflow = "";
      }}
      className={`fixed top-0 left-0 z-30 w-full h-screen p-4 bg-[#0f0f0f80] justify-center items-center ${
        handleImageModal.isOpen ? "flex" : "hidden"
      }`}
    >
      {/* Container */}
      <div
        className="scroll w-full max-w-xs max-h-[95%] bg-neutral-900 border rounded-md border-neutral-800 overflow-x-hidden overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title | Buttons */}
        <div className="sticky top-0 flex w-full p-4 bg-neutral-900 justify-between gap-2">
          <span className="w-fit my-auto text-lg font-medium">
            {handleImageModal.title}
          </span>

          <button
            type="button"
            onClick={() => {
              setHandleImageModal(false);
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
        <div className="flex p-4 pt-0 flex-col justify-center items-center gap-4">
          {handleImageModal.image ? (
            <Image
              src={handleImageModal.image}
              width={192}
              height={192}
              alt=""
              className="aspect-square rounded-md object-cover"
            />
          ) : (
            <div className="flex aspect-square w-full max-w-[192px] justify-center items-center border rounded-md border-neutral-800 overflow-hidden">
              <span className="text-sm">1:1</span>
            </div>
          )}

          <div className="flex w-full flex-col gap-2">
            {handleImageModal.image && (
              <button
                type="button"
                onClick={handleImageModal.deleteImage}
                className="flex w-full h-10 px-2 bg-neutral-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-neutral-700 cursor-pointer transition-[border] duration-300"
              >
                <span className="text-sm line-clamp-1">Delete Image</span>
              </button>
            )}

            <div className="relative w-full">
              <label
                htmlFor={"modal-image"}
                className="flex h-10 px-2 bg-neutral-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-neutral-700 cursor-pointer transition-[border] duration-300"
              >
                <span className="text-sm line-clamp-1">
                  {handleImageModal.image ? "Change Image" : "Select Image"}
                </span>
              </label>
              <input
                type="file"
                id={"modal-image"}
                name={"modal-image"}
                onChange={handleImageModal.changeImage}
                accept=".jpg, .jpeg, .png, .webp"
                className="absolute bottom-0 w-fit h-8 opacity-0 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandleImageModal;
