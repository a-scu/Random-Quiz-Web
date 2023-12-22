"use client";

import Image from "next/image";

import useModalsContext from "@/contexts/ModalsContext";

const LoadingModal = () => {
  const { loadingModal } = useModalsContext();

  return (
    <div
      className={`fixed top-0 left-0 w-full min-h-screen z-[999] bg-[#0f0f0f80] justify-center items-center ${
        loadingModal ? "flex" : "hidden"
      }`}
    >
      <Image
        src={"/img/icons/loading.png"}
        width={32}
        height={32}
        alt="Loading..."
        priority
        className="rotate-infinite"
      />
    </div>
  );
};

export default LoadingModal;
