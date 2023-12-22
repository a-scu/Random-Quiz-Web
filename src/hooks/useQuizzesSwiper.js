import useNavbarContext from "@/contexts/NavbarContext";
import useScreenSize from "./useScreenSize";

const useQuizzesSwiper = () => {
  const { isNavbarFixed } = useNavbarContext();
  const { width } = useScreenSize();

  const quizzesCardPerView = () => {
    if (isNavbarFixed) {
      if (width >= 1686) {
        return 5;
      } else if (width >= 1430) {
        return 4;
      } else if (width >= 1174) {
        return 3;
      } else if (width >= 918) {
        return 2;
      } else if (width >= 598) {
        return 1.5;
      } else {
        return 1;
      }
    } else {
      if (width >= 1536) {
        return 5;
      } else if (width >= 1280) {
        return 4;
      } else if (width >= 1024) {
        return 3;
      } else if (width >= 768) {
        return 2;
      } else if (width >= 448) {
        return 1.5;
      } else {
        return 1;
      }
    }
  };

  const shouldShowNextButton = (quizzes) => {
    if (isNavbarFixed) {
      if (width >= 1686) {
        return quizzes.length > 5;
      } else if (width >= 1430) {
        return quizzes.length > 4;
      } else if (width >= 1174) {
        return quizzes.length > 3;
      } else if (width >= 918) {
        return quizzes.length > 2;
      } else if (width >= 598) {
        return quizzes.length > 1.5;
      } else {
        return quizzes.length > 1;
      }
    } else {
      if (width >= 1536) {
        return quizzes.length > 5;
      } else if (width >= 1280) {
        return quizzes.length > 4;
      } else if (width >= 1024) {
        return quizzes.length > 3;
      } else if (width >= 768) {
        return quizzes.length > 2;
      } else if (width >= 448) {
        return quizzes.length > 1.5;
      } else {
        return quizzes.length > 1;
      }
    }
  };

  return { quizzesCardPerView, shouldShowNextButton };
};

export default useQuizzesSwiper;
