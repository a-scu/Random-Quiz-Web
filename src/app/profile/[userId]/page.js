"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import useModalsContext from "@/contexts/ModalsContext";
import useUserContext from "@/contexts/UserContext";

import { db } from "@/components/firebase";
import { doc, getDoc } from "firebase/firestore";

import Link from "next/link";
import Banner from "@/components/Banner";
import QuizzesSwiper from "@/components/QuizzesSwiper";

const Profile = () => {
  const { userId } = useParams();

  const { setLoadingModal } = useModalsContext();
  const { loadingUserData, userData } = useUserContext();

  const [profileUserData, setProfileUserData] = useState(null);
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [favoriteQuizzes, setFavoriteQuizzes] = useState([]);

  useEffect(() => {
    // Abro el modal de carga
    setLoadingModal(true);
  }, []);

  useEffect(() => {
    // Se ejecuta solo cuando se hayan terminado de cargar los datos del usuario (haya un usuario logeado o no) o cuando se modifique la user data
    if (!loadingUserData) getProfileUserData();
  }, [loadingUserData, userData]);

  // Evalua si el perfil actual es el perfil del usuario logueado
  const isUsersOwnProfile = userData && userData.uid === userId;

  const getFavoriteQuizzes = async () => {
    // Si no hay un usuario logueado
    if (!userData) {
      console.log("No hay un usuario logueado");
      return;
    }

    // Si el usuario no tiene favoritos
    if (userData.favoriteQuizzes.length === 0) {
      console.log("No hay favoritos");
      return;
    }

    // Si ya se cargaron todos los favoritos
    if (favoriteQuizzes.length === userData.favoriteQuizzes.length) {
      console.log("Ya se cargaron todos los favoritos");
      return;
    }

    const newFavoriteQuizzes = await Promise.all(
      userData.favoriteQuizzes.map(async (quizId) => {
        // Creo una ref del doc
        const quizRef = doc(db, "quizzes", quizId);
        // Lo obtengo
        const quizSnapshot = await getDoc(quizRef);

        // Si existe lo retorno
        if (quizSnapshot.exists()) {
          return { id: quizSnapshot.id, ...quizSnapshot.data() };
        }
      })
    );

    // Actualizo el estado
    setFavoriteQuizzes(newFavoriteQuizzes);
    console.log("Se cargan los favoritos del swiper");
  };

  const getProfileUserData = async () => {
    // Si el userId es igual al id del usuario logeado
    if (isUsersOwnProfile) {
      // Obtengo los quizzes que creo el usuario
      getCreatedQuizzes(userData);
      // Obtengo los quizzes favoritos del usuario
      getFavoriteQuizzes();
      // Cierro el modal de carga
      setLoadingModal(false);
      return;
    }

    // Creo una ref del usuario
    const userRef = doc(db, "users", userId);
    // Obtengo sus datos
    const profileUserData = (await getDoc(userRef)).data();

    // Actualizo el estado
    setProfileUserData(profileUserData);
    // Obtengo sus quizzes creados
    getCreatedQuizzes(profileUserData);
    // Cierro el modal de carga
    setLoadingModal(false);
  };

  const getCreatedQuizzes = async (user) => {
    // Si el usuario no creo ningun quiz
    if (user.createdQuizzes.length === 0) {
      console.log("El usuario no creo ningun quiz");
      return;
    }

    // Obtengo la info de cada quiz
    const newUserQuizzes = await Promise.all(
      user.createdQuizzes.map(async (quizId) => {
        // Creo una ref del doc
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
    setCreatedQuizzes(newUserQuizzes);
  };

  return (
    <div className="flex min-h-screen p-4 flex-col gap-4">
      <h1 className="logo min-w-fit text-2xl font-bold">Random Quiz</h1>

      {/* Banner */}
      <Banner
        user={isUsersOwnProfile ? userData : profileUserData}
        isUsersOwnProfile={isUsersOwnProfile}
      />

      {/* Created Quizzes */}
      {createdQuizzes.length !== 0 && (
        <div className="flex flex-col gap-4">
          <Link href={`/user/${userId}/quizzes`} className="w-fit">
            <h2 className="w-fit text-xl font-semibold border-b border-transparent hover:border-white transition-[border] duration-300">
              {isUsersOwnProfile ? "Your" : "Created"} Quizzes
            </h2>
          </Link>
          <QuizzesSwiper quizzes={createdQuizzes} />
        </div>
      )}

      {/* Favorite Quizzes */}
      {favoriteQuizzes.length !== 0 && isUsersOwnProfile && (
        <div className="flex flex-col gap-4">
          <Link href={"/favorites"} className="w-fit">
            <h2 className="text-xl font-semibold border-b border-transparent hover:border-white transition-[border] duration-300">
              Favorite Quizzes
            </h2>
          </Link>
          <QuizzesSwiper quizzes={favoriteQuizzes} />
        </div>
      )}
    </div>
  );
};

export default Profile;
