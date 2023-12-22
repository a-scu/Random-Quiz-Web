"use client";

import { createContext, useContext, useState, useEffect } from "react";

import useModalsContext from "./ModalsContext";
import useUserContext from "./UserContext";

import { useRouter } from "next/navigation";

import { db, storage } from "@/components/firebase";

import {
  doc,
  addDoc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";

import { v4 as uuidv4 } from "uuid";

const QuizMakerContext = createContext();

const initialQuizData = {
  id: "",
  author: "",
  title: "",
  type: "personality",
  intro: "",
  cardImage: {
    url: "",
    name: "",
    file: null,
    previewUrl: "",
  },
  takers: 0,
  timestamp: null,
  uploadTime: 0,
  questionsEmpty: true,
  personalities: [],
  questions: [],
};

const initialPersonalityToModify = {
  id: "",
  name: "",
  description: "",
  resultImage: {
    url: "",
    name: "",
    file: null,
    previewUrl: "",
  },
  errors: {
    name: "",
    description: "",
    resultImage: "",
  },
};

const QuizMakerProvider = ({ children }) => {
  const {
    setLoadingModal,
    setPersonalityModal,
    confirmModal,
    setConfirmModal,
    assignPersonalityModal,
    setAssignPersonalityModal,
    setHandleImageModal,
  } = useModalsContext();
  const { userData, setUserData } = useUserContext();

  const [quizData, setQuizData] = useState(initialQuizData);
  const [personalityToModify, setPersonalityToModify] = useState(
    initialPersonalityToModify
  );
  const [imagesToDelete, setImagesToDelete] = useState({
    personalities: [],
    questions: [],
    answers: [],
  });

  const { push } = useRouter();

  useEffect(() => {
    console.log(quizData);
  }, [quizData]);

  const cardImageFileHandler = (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      const previewUrl = URL.createObjectURL(selectedImage);

      setQuizData({
        ...quizData,
        cardImage: {
          ...quizData.cardImage,
          file: selectedImage,
          previewUrl,
        },
      });
    }
  };

  const personalityResultImagefileHandler = (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      const previewUrl = URL.createObjectURL(selectedImage);

      setPersonalityToModify({
        ...personalityToModify,
        resultImage: {
          ...personalityToModify.resultImage,
          file: selectedImage,
          previewUrl,
        },
      });
    }
  };

  const questionBackgroundImageFileHandler = (e, question) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      const previewUrl = URL.createObjectURL(selectedImage);

      const newQuestions = quizData.questions.map((questionToEvaluate) => {
        if (questionToEvaluate.order === question.order) {
          return {
            ...question,
            backgroundImage: {
              ...question.backgroundImage,
              file: selectedImage,
              previewUrl,
            },
          };
        } else {
          return questionToEvaluate;
        }
      });

      setQuizData({
        ...quizData,
        questions: newQuestions,
      });
    }
  };

  const answerFileHandler = (e, question, answer) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      const previewUrl = URL.createObjectURL(selectedImage);

      const newQuestions = quizData.questions.map((questionToEvaluate) => {
        if (questionToEvaluate.order === question.order) {
          const newAnswers = questionToEvaluate.answers.map(
            (answerToEvaluate) => {
              if (answerToEvaluate.order === answer.order) {
                return {
                  ...answer,
                  answerImage: {
                    ...answer.answerImage,
                    file: selectedImage,
                    previewUrl,
                  },
                };
              } else {
                return answerToEvaluate;
              }
            }
          );

          return {
            ...question,
            answers: newAnswers,
          };
        } else {
          return questionToEvaluate;
        }
      });

      setQuizData({
        ...quizData,
        questions: newQuestions,
      });
    }
  };

  const getQuizData = async (quizId) => {
    if (userData) {
      const quizRef = doc(db, "quizzes", quizId);

      const quizSnapshot = await getDoc(quizRef);
      const storedQuizData = quizSnapshot.data();

      console.log("storedQuizData: ", storedQuizData);

      if (storedQuizData) {
        if (storedQuizData.author !== userData.uid)
          return console.log("You can't edit this quiz because is not yours");

        setQuizData({ ...storedQuizData, id: quizSnapshot.id });
      } else {
        console.log("Error, el quiz no existe");
      }
    } else {
      console.log("Inicia sesion para editar tus quizzes");
    }
  };

  const createQuiz = async (e) => {
    setLoadingModal(true);

    // Validaciones
    if (!quizData.title || !quizData.type || !quizData.cardImage.file) return;

    // Creo una ref de la coleccion quizzes
    const quizzesRef = collection(db, "quizzes");

    // Creo un nuevo quiz (con un id random) y guardo la ref para acceder a su id
    const quizRef = await addDoc(quizzesRef, {
      title: quizData.title,
      type: quizData.type,
      intro: quizData.intro,
      takers: quizData.takers,
      timestamp: serverTimestamp(),
      uploadTime: new Date().getTime(),
      personalities: quizData.personalities,
      questions: quizData.questions,
      author: userData.uid,
    });

    // Creo una ref de la imagen a subir
    const imageToUploadRef = ref(
      storage,
      `quizzes/${quizRef.id}/card-image-${quizRef.id}`
    );

    // La subo
    await uploadBytes(imageToUploadRef, quizData.cardImage.file);

    // Obtengo su url
    const imageUrl = await getDownloadURL(imageToUploadRef);

    // Actualizo el quiz en firestore con la url de cardImage
    await setDoc(
      quizRef,
      {
        cardImage: { url: imageUrl, name: `card-image-${quizRef.id}` },
      },
      { merge: true }
    );

    // Actualizo el quiz con la url de cardImage y el id
    setQuizData({
      ...quizData,
      id: quizRef.id,
      cardImage: { url: imageUrl, name: `card-image-${quizRef.id}` },
    });

    // Creo una ref del usuario
    const userRef = doc(db, "users", userData.uid);

    // Agrego el quiz a la lista de quizzes que creo el usuario
    await setDoc(
      userRef,
      {
        createdQuizzes: [...userData.createdQuizzes, quizRef.id],
      },
      { merge: true }
    );

    // Redijiro a la pagina para editar el quiz
    push(`/quizMaker/${quizRef.id}`);
  };

  const handleDeleteQuiz = (id, title) => {
    document.body.style.overflow = "hidden";
    setConfirmModal({
      isOpen: true,
      message: "¿Delete quiz?",
      resetOverflow: true,
      onConfirm: () => {
        deleteQuiz(id);
        setConfirmModal({ ...confirmModal, isOpen: false });
        document.body.style.overflow = "";
      },
    });
  };

  const deleteDirectory = async (directoryRef) => {
    const dir = await listAll(directoryRef);
    await Promise.all(dir.items.map((itemRef) => deleteObject(itemRef)));
    await Promise.all(
      dir.prefixes.map((folderRef) => deleteDirectory(folderRef))
    );
  };

  const deleteQuiz = async (id) => {
    // Creo una ref del quiz en firestore
    const quizFirestoreRef = doc(db, "quizzes", id);

    // Borro toda la data del quiz en firestore
    deleteDoc(quizFirestoreRef);

    // Creo una ref del quiz en storage
    const quizStorageRef = ref(storage, `quizzes/${id}`);

    // Borro toda la data del quiz en storage
    await deleteDirectory(quizStorageRef);

    // Creo una ref del usuario en firestore
    const userRef = doc(db, "users", userData.uid);

    const filteredCreatedQuizzes = [];

    // Filtro el quiz a borrar
    userData.createdQuizzes.forEach((quizId) => {
      if (quizId !== id) filteredCreatedQuizzes.push(quizId);
    });

    // Actualizo la lista de quizzes que creo el usuario en firebase
    await setDoc(
      userRef,
      {
        createdQuizzes: filteredCreatedQuizzes,
      },
      { merge: true }
    );

    // Cambio el estado actual del quiz y el usuario
    setQuizData(initialQuizData);
    setUserData({ ...userData, createdQuizzes: filteredCreatedQuizzes });

    // Redirijo al perfil
    push("/myProfile");
  };

  const updateCardImage = async () => {
    // Si se cambio la imagen
    if (quizData.cardImage.file) {
      console.log("Cambiando cardImage");

      // Creo una ref de la imagen a subir
      const imageToUploadRef = ref(
        storage,
        `quizzes/${quizData.id}/${quizData.cardImage.name}`
      );

      // La subo
      await uploadBytes(imageToUploadRef, quizData.cardImage.file);

      // Obtengo su url
      const imageUrl = await getDownloadURL(imageToUploadRef);

      return { url: imageUrl, name: quizData.cardImage.name };

      // Si no se cambio
    } else {
      return { url: quizData.cardImage.url, name: quizData.cardImage.name };
    }
  };

  const updatePersonalities = async () => {
    // Si se elimino alguna personalidad, entonces se elimina su resultImage del storage
    if (imagesToDelete.personalities.length !== 0) {
      await Promise.all(
        imagesToDelete.personalities.map(async (imageName) => {
          // Creo una ref de la imagen a borrar
          const imageToDeleteRef = ref(
            storage,
            `quizzes/${quizData.id}/personalities/${imageName}`
          );

          // La borro
          deleteObject(imageToDeleteRef);
        })
      );
      setImagesToDelete({ ...imagesToDelete, personalities: [] });
    }

    // Se sube, se actualiza o se mantiene la resultImage de cada personalidad
    const newPersonalities = await Promise.all(
      quizData.personalities.map(async (personality) => {
        // Si se cambio la imagen
        if (personality.resultImage.file) {
          // Creo una ref de imagen la a subir
          const imageToUploadRef = ref(
            storage,
            `quizzes/${quizData.id}/personalities/personality-${personality.id}`
          );

          // Lo subo
          await uploadBytes(imageToUploadRef, personality.resultImage.file);

          // Obtengo su url
          const imageUrl = await getDownloadURL(imageToUploadRef);

          return {
            id: personality.id,
            name: personality.name,
            description: personality.description,
            resultImage: {
              url: imageUrl,
              name: `personality-${personality.id}`,
            },
          };

          // Si no se cambio la imagen
        } else {
          return {
            id: personality.id,
            name: personality.name,
            description: personality.description,
            resultImage: {
              url: personality.resultImage.url,
              name: personality.resultImage.name,
            },
          };
        }
      })
    );

    return newPersonalities;
  };

  const updateAnswers = async (question) => {
    const newAnswers = await Promise.all(
      question.answers.map(async (answer) => {
        if (answer.answerImage.file) {
          // Creo una ref de imagen la a subir
          const imageToUploadRef = ref(
            storage,
            `quizzes/${quizData.id}/answers/answer-${answer.id}`
          );

          // La subo
          await uploadBytes(imageToUploadRef, answer.answerImage.file);

          // Obtengo su url
          const imageUrl = await getDownloadURL(imageToUploadRef);

          return {
            ...answer,
            answerImage: { url: imageUrl, name: `answer-${answer.id}` },
          };
        } else {
          return answer;
        }
      })
    );

    return newAnswers;
  };

  const updateQuestions = async () => {
    // Si se elimino alguna pregunta, entonces se elimina su backgroundImage del storage
    if (imagesToDelete.questions.length !== 0) {
      await Promise.all(
        imagesToDelete.questions.map(async (imageName) => {
          // Creo una ref de la imagen a borrar
          const imageToDeleteRef = ref(
            storage,
            `quizzes/${quizData.id}/questions/${imageName}`
          );

          // La borro
          deleteObject(imageToDeleteRef);
        })
      );

      setImagesToDelete({ ...imagesToDelete, questions: [] });
    }

    // Se sube, se actualiza o se mantiene la backgroundImage de cada pregunta
    const newQuestions = await Promise.all(
      quizData.questions.map(async (question) => {
        // Si se cambio la imagen
        if (question.backgroundImage.file) {
          // Creo una ref de imagen la a subir
          const imageToUploadRef = ref(
            storage,
            `quizzes/${quizData.id}/questions/question-${question.id}`
          );

          // La subo
          await uploadBytes(imageToUploadRef, question.backgroundImage.file);

          // Obtengo su url
          const imageUrl = await getDownloadURL(imageToUploadRef);

          const answers = await updateAnswers(question);

          return {
            id: question.id,
            order: question.order,
            question: question.question,
            backgroundImage: {
              url: imageUrl,
              name: `question-${question.id}`,
            },
            answers: answers,
          };
        } else {
          const answers = await updateAnswers(question);

          return {
            id: question.id,
            order: question.order,
            question: question.question,
            backgroundImage: {
              url: question.backgroundImage.url,
              name: question.backgroundImage.name,
            },
            answers,
          };
        }
      })
    );

    // Si se elimino alguna respuesta, entonces se elimina su answerImage del storage
    if (imagesToDelete.answers.length !== 0) {
      await Promise.all(
        imagesToDelete.answers.map(async (imageName) => {
          // Creo una ref de la imagen a borrar
          const imageToDeleteRef = ref(
            storage,
            `quizzes/${quizData.id}/answers/${imageName}`
          );

          // La borro
          deleteObject(imageToDeleteRef);
        })
      );

      setImagesToDelete({ ...imagesToDelete, answers: [] });
    }

    return newQuestions;
  };

  const savePersonality = async () => {
    // Validaciones
    if (
      !personalityToModify.name ||
      !personalityToModify.description ||
      (!personalityToModify.resultImage.url &&
        !personalityToModify.resultImage.file)
    )
      return;

    // Abro el modal de carga
    setLoadingModal(true);

    // Si la personalidad no existe (se esta creando)
    if (!personalityToModify.id) {
      // Creo un id unico para la nueva personalidad
      const personalityId = uuidv4();

      // Actualizo el estado
      setQuizData({
        ...quizData,
        personalities: [
          { ...personalityToModify, id: personalityId },
          ...quizData.personalities,
        ],
      });

      // Si la personalidad ya existe (se esta editando):
    } else {
      // Filtro la personalidad que se esta modificando
      const filteredPersonalities = quizData.personalities.filter(
        (personality) => personality.id !== personalityToModify.id
      );

      // Actualizo el estado
      setQuizData({
        ...quizData,
        personalities: [personalityToModify, ...filteredPersonalities],
      });
    }

    // Cierro el modal de carga y el modal de personalidad
    setLoadingModal(false);
    setPersonalityModal(false);
    document.body.style.overflow = "";
  };

  const handleDeletePersonality = (personality) => {
    document.body.style.overflow = "hidden";
    setConfirmModal({
      isOpen: true,
      message: "¿Delete personality?",
      onConfirm: () => {
        deletePersonality(personality);
        document.body.style.overflow = "";
      },
    });
  };

  const updateAnswersPersonalities = (personalityToDelete) => {
    const newQuestions = [];

    quizData.questions.forEach((question) => {
      const newAnswers = [];

      question.answers.forEach((answer) => {
        const newPersonalities = answer.personalities.filter(
          (personality) => personality !== personalityToDelete
        );

        newAnswers.push({ ...answer, personalities: newPersonalities });
      });

      newQuestions.push({ ...question, answers: newAnswers });
    });

    return newQuestions;
  };

  const deletePersonality = async (personalityToDelete) => {
    setLoadingModal(true);

    // Filtro la personalidad a borrar
    const newPersonalities = quizData.personalities.filter(
      (personality) => personality.id !== personalityToDelete.id
    );

    // Elimino la personalidad de las respuestas
    const newQuestions = updateAnswersPersonalities(personalityToDelete.id);

    // Actualizo el estado
    setQuizData({
      ...quizData,
      personalities: newPersonalities,
      questions: newQuestions,
    });

    // Items to delete from storage
    setImagesToDelete({
      ...imagesToDelete,
      personalities: [
        ...imagesToDelete.personalities,
        personalityToDelete.resultImage.name,
      ],
    });

    // Cierro el modal de carga y reseteo la personalidad a modificar
    setPersonalityToModify(initialPersonalityToModify);
    setPersonalityModal(false);
    setConfirmModal({ ...confirmModal, isOpen: false });
    setLoadingModal(false);
    document.body.style.overflow = "";
  };

  const onChangeQuestion = (e, question) => {
    const newQuestions = quizData.questions.map((questionToEvaluate) => {
      if (questionToEvaluate.order === question.order) {
        return { ...question, question: e.target.value };
      } else {
        return questionToEvaluate;
      }
    });

    setQuizData({ ...quizData, questions: newQuestions });
  };

  const onChangeAnswer = (e, question, answer) => {
    const newQuestions = quizData.questions.map((questionToEvaluate) => {
      if (questionToEvaluate.order === question.order) {
        const newAnswers = questionToEvaluate.answers.map(
          (answerToEvaluate) => {
            if (answerToEvaluate.order === answer.order) {
              return { ...answer, answer: e.target.value };
            } else {
              return answerToEvaluate;
            }
          }
        );

        return { ...questionToEvaluate, answers: newAnswers };
      } else {
        return questionToEvaluate;
      }
    });

    setQuizData({ ...quizData, questions: newQuestions });
  };

  const addQuestion = () => {
    // Si hay menos de 20 preguntas
    if (quizData.questions.length < 20) {
      setQuizData({
        ...quizData,
        questions: [
          ...quizData.questions,
          {
            id: uuidv4(),
            order: quizData.questions.length,
            question: "",
            backgroundImage: {
              url: "",
              name: "",
              file: null,
              previewUrl: "",
            },
            answers: [],
          },
        ],
      });

      // Si hay 20 preguntas
    } else {
      console.log("El maximo son 20 preguntas");
    }
  };

  const addAnswer = (question) => {
    // Si hay menos de 10 respuestas
    if (quizData.questions[question.order].answers.length < 10) {
      const newQuestions = [];

      quizData.questions.forEach((questionToEvaluate) => {
        if (questionToEvaluate.order === question.order) {
          newQuestions.push({
            ...questionToEvaluate,
            answers: [
              ...questionToEvaluate.answers,
              {
                id: uuidv4(),
                order: questionToEvaluate.answers.length,
                answer: "",
                personalities: [],
                answerImage: {
                  url: "",
                  name: "",
                  file: null,
                  previewUrl: "",
                },
              },
            ],
          });
        } else {
          newQuestions.push(questionToEvaluate);
        }
      });

      setQuizData({ ...quizData, questions: newQuestions });

      // Si hay 10 respuestas
    } else {
      console.log("El maximo son 10 respuestas");
    }
  };

  const handleDeleteQuestion = (question) => {
    document.body.style.overflow = "hidden";
    setConfirmModal({
      isOpen: true,
      message: "¿Delete question?",
      resetOverflow: true,
      onConfirm: () => {
        deleteQuestion(question);
        setConfirmModal({ ...confirmModal, isOpen: false });
        document.body.style.overflow = "";
      },
    });
  };

  const deleteQuestion = (question) => {
    const newQuestions = [];

    quizData.questions.forEach((questionToEvaluate) => {
      if (questionToEvaluate.order < question.order) {
        newQuestions.push(questionToEvaluate);
      }

      if (questionToEvaluate.order > question.order) {
        newQuestions.push({
          ...questionToEvaluate,
          order: questionToEvaluate.order - 1,
        });
      }
    });

    // If the question has a background image, is added to array of images to delete from storage when user saveChanges
    if (question.backgroundImage.url)
      setImagesToDelete({
        ...imagesToDelete,
        questions: [...imagesToDelete.questions, question.backgroundImage.name],
      });

    // Update State
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleDeleteAnswer = (question, answer) => {
    if (
      !answer.answer &&
      !answer.personalities.length &&
      !answer.answerImage.previewUrl &&
      !answer.answerImage.url
    )
      return deleteAnswer(question, answer);

    document.body.style.overflow = "hidden";
    setConfirmModal({
      isOpen: true,
      message: "¿Delete answer?",
      resetOverflow: true,
      onConfirm: () => {
        deleteAnswer(question, answer);
        setConfirmModal({ ...confirmModal, isOpen: false });
        document.body.style.overflow = "";
      },
    });
  };

  const deleteAnswer = (question, answer) => {
    const newQuestions = [];

    quizData.questions.forEach((questionToEvaluate) => {
      if (questionToEvaluate.order === question.order) {
        const newAnswers = [];

        questionToEvaluate.answers.forEach((answerToEvaluate) => {
          if (answerToEvaluate.order < answer.order) {
            newAnswers.push(answerToEvaluate);
          }

          if (answerToEvaluate.order > answer.order) {
            newAnswers.push({
              ...answerToEvaluate,
              order: answerToEvaluate.order - 1,
            });
          }
        });

        newQuestions.push({ ...questionToEvaluate, answers: newAnswers });
      } else {
        newQuestions.push(questionToEvaluate);
      }
    });

    // Items to delete from storage
    if (answer.answerImage.url)
      setImagesToDelete({
        ...imagesToDelete,
        answers: [...imagesToDelete.answers, answer.answerImage.name],
      });

    setQuizData({ ...quizData, questions: newQuestions });
  };

  const moveUp = (question) => {
    const newQuestions = [];
    let prevQuestion;

    quizData.questions.forEach((questionToEvaluate) => {
      if (questionToEvaluate.order === question.order - 1) {
        prevQuestion = {
          ...questionToEvaluate,
          order: questionToEvaluate.order + 1,
        };
      } else if (questionToEvaluate.order === question.order) {
        newQuestions.push({ ...question, order: question.order - 1 });
        newQuestions.push(prevQuestion);
      } else {
        newQuestions.push(questionToEvaluate);
      }
    });

    setQuizData({ ...quizData, questions: newQuestions });
  };

  const moveDown = (question) => {
    const newQuestions = [];
    let prevQuestion;

    quizData.questions.forEach((questionToEvaluate) => {
      if (questionToEvaluate.order === question.order + 1) {
        newQuestions.push({
          ...questionToEvaluate,
          order: questionToEvaluate.order - 1,
        });
        newQuestions.push(prevQuestion);
      } else if (questionToEvaluate.order === question.order) {
        prevQuestion = {
          ...questionToEvaluate,
          order: questionToEvaluate.order + 1,
        };
      } else {
        newQuestions.push(questionToEvaluate);
      }
    });

    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleAssignPersonality = (question, answer) => {
    let unassignedPersonalities = [];

    if (answer.personalities.length !== 0) {
      unassignedPersonalities = quizData.personalities.filter(
        (personality) => !answer.personalities.includes(personality.id)
      );
    } else {
      unassignedPersonalities = quizData.personalities;
    }

    setAssignPersonalityModal({
      isOpen: true,
      unassignedPersonalities,
      question,
      answer,
    });
  };

  const assignPersonality = (personality, question, answer) => {
    const newQuestions = [];

    quizData.questions.forEach((questionToEvaluate) => {
      if (questionToEvaluate.order === question.order) {
        const newAnswers = [];

        questionToEvaluate.answers.forEach((answerToEvaluate) => {
          if (answerToEvaluate.order === answer.order) {
            newAnswers.push({
              ...answer,
              personalities: [...answer.personalities, personality.id],
            });
          } else {
            newAnswers.push(answerToEvaluate);
          }
        });

        newQuestions.push({ ...questionToEvaluate, answers: newAnswers });
      } else {
        newQuestions.push(questionToEvaluate);
      }
    });

    setQuizData({ ...quizData, questions: newQuestions });
    setAssignPersonalityModal({ ...assignPersonalityModal, isOpen: false });
    document.body.style.overflow = "";
  };

  const deleteAnswerPersonality = (personality, question, answer) => {
    const newQuestions = [];

    quizData.questions.forEach((questionToEvaluate) => {
      // Si estoy en la pregunta a modificar
      if (questionToEvaluate.order === question.order) {
        const newAnswers = [];

        questionToEvaluate.answers.forEach((answerToEvaluate) => {
          // Si estoy en la respuesta a modificar
          if (answerToEvaluate.order === answer.order) {
            const newPersonalities = answer.personalities.filter(
              (personalityToEvaluate) =>
                personalityToEvaluate !== personality.id
            );

            newAnswers.push({
              ...answer,
              personalities: newPersonalities,
            });

            // Si estoy en la respuesta a modificar
          } else {
            newAnswers.push(answerToEvaluate);
          }
        });

        newQuestions.push({ ...questionToEvaluate, answers: newAnswers });

        // Si no estoy en la pregunta a modificar
      } else {
        newQuestions.push(questionToEvaluate);
      }
    });

    setQuizData({ ...quizData, questions: newQuestions });
    setAssignPersonalityModal({ ...assignPersonalityModal, isOpen: false });
  };

  const saveChanges = async () => {
    setLoadingModal(true);

    const cardImage = await updateCardImage();
    const personalities = await updatePersonalities();
    const questions = await updateQuestions();

    const quizRef = doc(db, "quizzes", quizData.id);

    await setDoc(
      quizRef,
      {
        title: quizData.title,
        intro: quizData.intro,
        type: quizData.type,
        cardImage,
        personalities,
        questions,
      },
      { merge: true }
    );

    setQuizData({
      ...quizData,
      cardImage,
      personalities,
      questions,
    });

    setLoadingModal(false);
  };

  const handleDeleteAnswerImage = (question, answer) => {
    document.body.style.overflow = "hidden";
    setConfirmModal({
      isOpen: true,
      message: "¿Delete image?",
      onConfirm: () => deleteAnswerImage(question, answer),
    });
  };

  const handleDeleteQuestionBackground = (question) => {
    document.body.style.overflow = "hidden";
    setConfirmModal({
      isOpen: true,
      message: "¿Delete image?",
      onConfirm: () => deleteQuestionBackground(question),
    });
  };

  const deleteAnswerImage = (question, answer) => {
    const newQuestions = quizData.questions.map((questionToEvaluate) => {
      if (questionToEvaluate.order === question.order) {
        const newAnswers = questionToEvaluate.answers.map(
          (answerToEvaluate) => {
            if (answerToEvaluate.order === answer.order) {
              if (answerToEvaluate.answerImage.url)
                setImagesToDelete({
                  ...imagesToDelete,
                  answers: [
                    ...imagesToDelete.answers,
                    answerToEvaluate.answerImage.name,
                  ],
                });

              return {
                ...answerToEvaluate,
                answerImage: { url: "", name: "", file: "", previewUrl: "" },
              };
            } else {
              return answerToEvaluate;
            }
          }
        );

        return { ...questionToEvaluate, answers: newAnswers };
      } else {
        return questionToEvaluate;
      }
    });

    setQuizData({ ...quizData, questions: newQuestions });
    setConfirmModal({ ...confirmModal, isOpen: false });
    setHandleImageModal({ isOpen: false });
    document.body.style.overflow = "";
  };

  const deleteQuestionBackground = (question) => {
    setConfirmModal({ isOpen: false });

    const newQuestions = quizData.questions.map((questionToEvaluate) => {
      if (questionToEvaluate.order === question.order) {
        if (questionToEvaluate.backgroundImage.url)
          setImagesToDelete({
            ...imagesToDelete,
            questions: [
              ...imagesToDelete.questions,
              questionToEvaluate.backgroundImage.name,
            ],
          });

        return {
          ...questionToEvaluate,
          backgroundImage: { url: "", name: "", file: "", previewUrl: "" },
        };
      } else {
        return questionToEvaluate;
      }
    });

    setQuizData({ ...quizData, questions: newQuestions });
    setHandleImageModal({ isOpen: false });
    document.body.style.overflow = "";
  };

  const data = {
    initialQuizData,
    initialPersonalityToModify,
    quizData,
    setQuizData,
    personalityToModify,
    setPersonalityToModify,
    cardImageFileHandler,
    personalityResultImagefileHandler,
    questionBackgroundImageFileHandler,
    answerFileHandler,
    getQuizData,
    createQuiz,
    handleDeleteQuiz,
    saveChanges,
    savePersonality,
    handleDeletePersonality,
    deletePersonality,
    onChangeQuestion,
    onChangeAnswer,
    addQuestion,
    addAnswer,
    handleDeleteQuestion,
    deleteQuestion,
    handleDeleteAnswer,
    deleteAnswer,
    handleAssignPersonality,
    assignPersonality,
    deleteAnswerPersonality,
    moveUp,
    moveDown,
    deleteAnswerImage,
    deleteQuestionBackground,
    handleDeleteAnswerImage,
    handleDeleteQuestionBackground,
  };

  return (
    <QuizMakerContext.Provider value={data}>
      {children}
    </QuizMakerContext.Provider>
  );
};

const useQuizMakerContext = () => {
  return useContext(QuizMakerContext);
};

export { QuizMakerProvider };
export default useQuizMakerContext;
