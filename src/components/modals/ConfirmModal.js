"use client";

import useModalsContext from "@/contexts/ModalsContext";

import Image from "next/image";

const ConfirmModal = () => {
  const { confirmModal, setConfirmModal } = useModalsContext();

  return (
    <div
      onClick={() => {
        setConfirmModal(false);
        if (confirmModal.resetOverflow) document.body.style.overflow = "";
      }}
      className={`fixed top-0 left-0 z-40 w-full min-h-screen p-4 bg-[#0f0f0f80] justify-center items-center ${
        confirmModal.isOpen ? "flex" : "hidden"
      }`}
    >
      <div
        className="scroll flex w-full max-w-sm max-h-[95%] p-4 bg-neutral-900 flex-col items-center gap-4 border rounded-lg border-neutral-800 overflow-x-hidden overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="w-fit my-auto text-lg font-medium">
          {confirmModal.message}
        </span>

        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={() => {
              setConfirmModal(false);
              if (confirmModal.resetOverflow) document.body.style.overflow = "";
            }}
            className="flex w-full h-8 px-2 bg-neutral-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-neutral-700 cursor-pointer transition-[border] duration-300"
          >
            <Image
              src={"/img/icons/close-white.png"}
              width={14}
              height={14}
              alt={"X"}
              className="w-3.5 min-w-[14px] h-3.5 min-h-[14px]"
            />
          </button>

          <button
            type="button"
            onClick={confirmModal.onConfirm}
            className="flex w-full h-8 px-2 bg-neutral-800 justify-center items-center gap-2 border rounded-md border-transparent hover:border-neutral-700 cursor-pointer transition-[border] duration-300"
          >
            <Image
              src={"/img/icons/tick.png"}
              width={14}
              height={14}
              alt={"✓"}
              className="w-3.5 min-w-[14px] h-3.5 min-h-[14px]"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
