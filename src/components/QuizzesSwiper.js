"use client";

import { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { v4 as uuidv4 } from "uuid";

import useQuizzesSwiper from "@/hooks/useQuizzesSwiper";

import Image from "next/image";
import QuizCard from "./QuizCard";

const QuizzesSwiper = ({ quizzes }) => {
  const { quizzesCardPerView, shouldShowNextButton } = useQuizzesSwiper();

  const [swiper, setSwiper] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className="relative flex items-center">
      {!isBeginning && <Prev swiper={swiper} />}
      <Swiper
        spaceBetween={16}
        slidesPerGroup={1}
        className="w-full h-full"
        slidesPerView={quizzesCardPerView()}
        onSwiper={(swiper) => setSwiper(swiper)}
        onSlideChange={(swiper) => handleSlideChange(swiper)}
      >
        {quizzes.map((quiz) => (
          <SwiperSlide key={uuidv4()}>
            <QuizCard quizData={quiz} />
          </SwiperSlide>
        ))}
      </Swiper>
      {!isEnd && shouldShowNextButton(quizzes) && <Next swiper={swiper} />}
    </div>
  );
};

const Prev = ({ swiper }) => {
  return (
    <div
      onClick={() => swiper.slidePrev()}
      className="flex absolute left-2 z-10 w-8 h-8 bg-black justify-center items-center border rounded-full border-transparent hover:border-white cursor-pointer transition-colors duration-300 "
    >
      <Image
        src={"/img/icons/short-arrow.png"}
        width={16}
        height={16}
        alt={"→"}
        className="relative right-[1px] w-4 min-w-[16px] h-4 min-h-[16px] rotate-180"
      />
    </div>
  );
};

const Next = ({ swiper }) => {
  return (
    <div
      onClick={() => swiper.slideNext()}
      className="flex absolute right-2 z-10 w-8 h-8 bg-black justify-center items-center border rounded-full border-transparent hover:border-white cursor-pointer transition-colors duration-300 "
    >
      <Image
        src={"/img/icons/short-arrow.png"}
        width={16}
        height={16}
        alt={"→"}
        className="relative left-[1px] w-4 min-w-[16px] h-4 min-h-[16px]"
      />
    </div>
  );
};

export default QuizzesSwiper;
