import Image from "next/image";

import useQuizMakerContext from "@/contexts/QuizMakerContext";
import calculateUploadDate from "@/helpers/calculateUploadDate";

const PreviewCard = () => {
  const { quizData } = useQuizMakerContext();

  const { title, cardImage, takers, uploadTime } = quizData;

  const formatedUploadDate = uploadTime
    ? calculateUploadDate(uploadTime)
    : "Now";

  return (
    <div className="flex w-full max-w-sm mx-auto flex-col overflow-hidden">
      <div className="w-full aspect-[3/2] bg-neutral-800 rounded-md overflow-hidden">
        {/* Card Image */}
        {cardImage.previewUrl || cardImage.url ? (
          <Image
            src={cardImage.previewUrl || cardImage.url}
            width={400}
            height={266}
            alt=""
            priority
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex w-full h-full justify-center items-center">
            <span>3:2</span>
          </div>
        )}
      </div>

      <div className="flex w-full pt-2 flex-col gap-1">
        {/* Title */}
        <h3 className="font-semibold line-clamp-2">{title || "..."}</h3>

        {/* Takers - Upload Date */}
        <div className="flex gap-1 text-xs font-extralight line-clamp-1">
          <span>{takers} Takers</span>
          <b className="font-black">·</b>
          <span>{formatedUploadDate}</span>
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;
