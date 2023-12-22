"use client";

import { useState, useEffect } from "react";

import useModalsContext from "@/contexts/ModalsContext";
import useUserContext from "@/contexts/UserContext";

import { db } from "@/components/firebase";
import { doc, getDoc } from "firebase/firestore";

import QuizzesScroll from "@/components/QuizzesScroll";

const FavoriteQuizzes = () => {
  const { setLoadingModal } = useModalsContext();
  const { loadingUserData, userData } = useUserContext();

  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [favoriteQuizzes, setFavoriteQuizzes] = useState([]);
  const [beginning, setBeginning] = useState(0);

  useEffect(() => {
    // Abro el modal de carga
    setLoadingModal(true);
  }, []);

  useEffect(() => {
    // Se ejecuta solo cuando se hayan terminado de cargar los datos del usuario (haya un usuario logeado o no) o cuando se modifique la user data
    if (!loadingUserData) getFavoriteQuizzes(true);
  }, [loadingUserData, userData]);

  const getFavoriteQuizzes = async (fromBeginning) => {
    // Validaciones
    if (!userData) {
      console.log("No hay un usuario logueado");
      setLoadingModal(false);
      setLoadingQuizzes(false);
      return;
    }

    if (userData.favoriteQuizzes.length === 0) {
      setLoadingModal(false);
      setLoadingQuizzes(false);
      console.log("No hay favoritos");
      return;
    }

    if (favoriteQuizzes.length === userData.favoriteQuizzes.length) {
      setLoadingModal(false);
      setLoadingQuizzes(false);
      console.log("Ya se cargaron todos los favoritos");
      return;
    }

    // Si se agrego o elimino algun favorito, se cargan todos de cero
    if (fromBeginning) {
      let end;

      // Se cargan hasta 24 quizzes
      if (userData.favoriteQuizzes.length > 0 + 24) {
        end = 0 + 24;
        setBeginning(end);
      } else {
        end = 0 + (userData.favoriteQuizzes.length - 0);
        setBeginning(end);
      }

      // Obtengo los quizzes
      const newFavoriteQuizzes = await Promise.all(
        userData.favoriteQuizzes.slice(0, end).map(async (quizId) => {
          // Creo una ref del quiz
          const quizRef = doc(db, "quizzes", quizId);
          // Lo obtengo
          const quizSnapshot = await getDoc(quizRef);

          // Si existe lo retorno
          if (quizSnapshot.exists()) {
            return { ...quizSnapshot.data(), id: quizSnapshot.id };
          }
        })
      );

      // Actualizo el estado
      setFavoriteQuizzes(newFavoriteQuizzes);

      console.log("Se cargan favoritos");
    } else {
      // Si se scrolleo

      let end;

      // Se cargan hasta 24 quizzes
      if (userData.favoriteQuizzes.length > beginning + 24) {
        end = beginning + 24;
        setBeginning(end);
      } else {
        end = beginning + (userData.favoriteQuizzes.length - beginning);
        setBeginning(end);
      }

      // Obtengo los quizzes
      const newFavoriteQuizzes = await Promise.all(
        userData.favoriteQuizzes.slice(beginning, end).map(async (quizId) => {
          // Creo una ref del quiz
          const quizRef = doc(db, "quizzes", quizId);
          // Si existe lo retorno
          const quizSnapshot = await getDoc(quizRef);

          // Si existe lo retorno
          if (quizSnapshot.exists()) {
            return { ...quizSnapshot.data(), id: quizSnapshot.id };
          }
        })
      );

      // Actualizo el estado
      setFavoriteQuizzes((prevFavoriteQuizzes) => [
        ...prevFavoriteQuizzes,
        ...newFavoriteQuizzes,
      ]);

      console.log("Se cargan favoritos desde cero");
    }

    // Actualizo el estado y cierro el modal
    setLoadingQuizzes(false);
    setLoadingModal(false);
  };

  if (!loadingUserData)
    return (
      <div className="flex p-4 flex-col gap-4">
        <h1 className="logo w-fit text-2xl font-bold">Random Quiz</h1>
        <h2 className="w-fit text-xl font-medium">Favorites</h2>
        <QuizzesScroll
          quizzes={favoriteQuizzes}
          getQuizzes={getFavoriteQuizzes}
          loadingQuizzes={loadingQuizzes}
          setLoadingQuizzes={setLoadingQuizzes}
        />
      </div>
    );
};

export default FavoriteQuizzes;
