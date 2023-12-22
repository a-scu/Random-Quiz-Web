"use client";

import { createContext, useContext, useState } from "react";

const ModalsContext = createContext();

const initialQuestion = {
  order: 0,
  question: "",
  backgroundImage: "",
  backgroundImageFile: null,
  backgroundImageName: "",
  backgroundImagePreview: "",
  answers: [
    {
      order: 0,
      answer: "",
      personalities: [],
      answerImage: "",
      answerImageFile: null,
      answerImageName: "",
      answerImagePreview: "",
    },
    {
      order: 1,
      answer: "",
      personalities: [],
      answerImage: "",
      answerImageFile: null,
      answerImageName: "",
      answerImagePreview: "",
    },
  ],
};

const initialAnswer = {
  order: 1,
  answer: "",
  personalities: [],
  answerImage: "",
  answerImageFile: null,
  answerImageName: "",
  answerImagePreview: "",
};

const ModalsProvider = ({ children }) => {
  const [loadingModal, setLoadingModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });
  const [personalityModal, setPersonalityModal] = useState(false);
  const [assignPersonalityModal, setAssignPersonalityModal] = useState({
    isOpen: false,
    unassignedPersonalities: [],
    question: initialQuestion,
    answer: initialAnswer,
  });
  const [handleImageModal, setHandleImageModal] = useState({
    isOpen: false,
  });

  const data = {
    loadingModal,
    setLoadingModal,
    confirmModal,
    setConfirmModal,
    personalityModal,
    setPersonalityModal,
    assignPersonalityModal,
    setAssignPersonalityModal,
    handleImageModal,
    setHandleImageModal,
  };

  return (
    <ModalsContext.Provider value={data}>{children}</ModalsContext.Provider>
  );
};

const useModalsContext = () => {
  return useContext(ModalsContext);
};

export { ModalsProvider };
export default useModalsContext;
