"use client";

import { createContext, useContext, useState, useEffect } from "react";

import { useParams, useRouter } from "next/navigation";

import { db } from "@/components/firebase";
import { doc, getDoc } from "firebase/firestore";

const QuizzesContext = createContext();

const QuizzesProvider = ({ children }) => {
  const { push } = useRouter();

  const [quiz, setQuiz] = useState(null);
  const [author, setAuthor] = useState(null);

  const [taker, setTaker] = useState("");

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [results, setResults] = useState([]);

  const getAuthor = async (id) => {
    try {
      const userRef = doc(db, "users", id);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const { displayName, profilePicture } = userSnapshot.data();
        setAuthor({ id, displayName, profilePicture });
      } else {
        throw new Error("User doesn't exist");
      }
    } catch (error) {
      console.error("Error getting data from Firebase:", error);
    }
  };

  const getQuiz = async (id) => {
    try {
      const quizRef = doc(db, "quizzes", id);
      const quizSnapshot = await getDoc(quizRef);

      if (quizSnapshot.exists()) {
        const quizData = quizSnapshot.data();
        await getAuthor(quizData.author);
        setQuiz({ id, ...quizData });
      } else {
        throw new Error("Document doesn't exist");
      }
    } catch (error) {
      console.error("Error getting data from Firebase:", error);
    }
  };

  const getQuizResult = (results) => {
    let personalityCount = {};

    results.forEach((personality) => {
      if (personalityCount[personality] === undefined) {
        personalityCount[personality] = 1;
      } else {
        personalityCount[personality]++;
      }
    });

    let personalityMaxCount = Math.max(...Object.values(personalityCount));

    const result = Object.keys(personalityCount).filter(
      (personality) => personalityCount[personality] === personalityMaxCount
    );

    if (result.length > 1) {
      const random = Math.floor(Math.random() * result.length);
      push(`/quiz/${quiz.id}/result/${result[random]}`);
      return;
    }

    push(`/quiz/${quiz.id}/result/${result}`);
  };

  const handleNextQuestion = (question) => {
    if (selectedAnswer === null) return;

    if (Number(question) === quiz.questions.length) {
      // Resultado
      const newResults = [
        ...results,
        ...quiz.questions[Number(question) - 1].answers[selectedAnswer]
          .personalities,
      ];
      setResults(newResults);
      setSelectedAnswer(null);
      getQuizResult(newResults);
    } else {
      const newResults = [
        ...results,
        ...quiz.questions[Number(question) - 1].answers[selectedAnswer]
          .personalities,
      ];
      setResults(newResults);
      setSelectedAnswer(null);
      push(`/quiz/${quiz.id}/${Number(question) + 1}`);
    }
  };

  const data = {
    quiz,
    setQuiz,
    author,
    setAuthor,
    taker,
    setTaker,
    selectedAnswer,
    setSelectedAnswer,
    results,
    setResults,
    getQuiz,
    getQuizResult,
    handleNextQuestion,
  };

  return (
    <QuizzesContext.Provider value={data}>{children}</QuizzesContext.Provider>
  );
};

const useQuizzesContext = () => {
  return useContext(QuizzesContext);
};

export { QuizzesProvider };
export default useQuizzesContext;
