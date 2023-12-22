"use client";

import { createContext, useContext, useState, useEffect } from "react";

import { db, auth, storage } from "@/components/firebase";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import useModalsContext from "./ModalsContext";
import useQuizMakerContext from "./QuizMakerContext";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [userData, setUserData] = useState(null);

  const deleteQuiz = async (id) => {
    // Creo una ref del quiz en firestore
    const quizFirestoreRef = doc(db, "quizzes", id);

    // Borro toda la data del quiz en firestore
    deleteDoc(quizFirestoreRef);

    // Creo una ref del quiz en storage
    const quizStorageRef = ref(storage, `quizzes/${id}`);

    // Borro toda la data del quiz en storage
    await deleteDirectory(quizStorageRef);
  };

  const { confirmModal, setConfirmModal } = useModalsContext();

  const restoreSession = async () => {
    setLoadingUserData(true);

    // Obtiene el uid del usuario guardado en ls
    const storedUid = localStorage.getItem("uid");

    // Si hay un uid guardado
    if (storedUid) {
      // Creo una ref del usuario
      const userRef = doc(db, "users", storedUid);

      // Obtengo su data
      const storedUserData = (await getDoc(userRef)).data();

      // Actualizo el estado
      setUserData(storedUserData);

      console.log("Se recordo la sesion, user data: ", storedUserData);
    }

    setLoadingUserData(false);
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const authWithGoogle = async () => {
    setLoadingUserData(true);

    const provider = new GoogleAuthProvider();

    const user = (await signInWithPopup(auth, provider)).user;

    const { uid, displayName, photoURL, email } = user;

    // Creo una ref del usuario
    const userRef = doc(db, "users", uid);

    // Compruebo si el usuario ya existe en la base de datos para saber si se esta registrando o esta logeando
    const storedUserData = (await getDoc(userRef)).data();

    // Si se esta logeando
    if (storedUserData) {
      // Actualizo el estado
      setUserData(storedUserData);

      console.log("Se inicio sesion con google, user data: ", storedUserData);

      // Si se esta registrando
    } else {
      // Actualizo firestore
      await setDoc(userRef, {
        uid,
        displayName,
        profilePicture: photoURL,
        email,
        createdQuizzes: [],
        favoriteQuizzes: [],
      });

      // Actualizo el estado
      setUserData({
        uid,
        displayName,
        profilePicture: photoURL,
        email,
        createdQuizzes: [],
        favoriteQuizzes: [],
      });
    }

    localStorage.setItem("uid", uid);
    setLoadingUserData(false);

    console.log("Se registro con google la sesion, user data: ", {
      uid,
      displayName,
      photoURL,
      email,
    });
  };

  const logout = () => {
    setUserData(null);
    localStorage.removeItem("uid");
  };

  const deleteDirectory = async (directoryRef) => {
    const dir = await listAll(directoryRef);
    await Promise.all(dir.items.map((itemRef) => deleteObject(itemRef)));
    await Promise.all(
      dir.prefixes.map((folderRef) => deleteDirectory(folderRef))
    );
  };

  const deleteAccount = async () => {
    // Creo una ref del quiz en firestore
    const userFirestoreRef = doc(db, "users", userData.uid);

    // Borro toda la data
    deleteDoc(userFirestoreRef);

    // Creo una ref del quiz en storage
    const userStorageRef = ref(storage, `users/${userData.uid}`);

    // Borro toda la data del quiz en storage
    await deleteDirectory(userStorageRef);

    if (userData?.createdQuizzes.length !== 0)
      await Promise.all(
        userData.createdQuizzes.map(async (quizId) => {
          deleteQuiz(quizId);
        })
      );

    logout();
  };

  const handleDeleteAccount = () => {
    document.body.style.overflow = "hidden";
    setConfirmModal({
      isOpen: true,
      message: "¿Delete Account?",
      resetOverflow: true,
      onConfirm: () => {
        deleteAccount();
        setConfirmModal({ ...confirmModal, isOpen: false });
        document.body.style.overflow = "";
      },
    });
  };

  const bannerFileHandler = async (e) => {
    const selectedImg = e.target.files[0];

    if (selectedImg) {
      // Creo una ref de la imagen a subir
      const imageToUploadRef = ref(
        storage,
        `users/${userData.uid}/banner-${userData.uid}`
      );

      // La subo
      await uploadBytes(imageToUploadRef, selectedImg);

      // Obtengo su url
      const imageUrl = await getDownloadURL(imageToUploadRef);

      // Creo una ref del usuario
      const userRef = doc(db, "users", userData.uid);

      // Actualizo firestore
      await setDoc(
        userRef,
        {
          banner: imageUrl,
        },
        { merge: true }
      );

      // Actualizo el estado
      setUserData({
        ...userData,
        banner: imageUrl,
      });
    }
  };

  const profilePictureFileHandler = async (e) => {
    const selectedImg = e.target.files[0];

    if (selectedImg) {
      // Creo una ref de la imagen a subir
      const imageToUploadRef = ref(
        storage,
        `users/${userData.uid}/profile-picture-${userData.uid}`
      );

      // La subo
      await uploadBytes(imageToUploadRef, selectedImg);

      // Obtengo su url
      const imageUrl = await getDownloadURL(imageToUploadRef);

      // Creo una ref del usuario
      const userRef = doc(db, "users", userData.uid);

      // Actualizo firestore
      await setDoc(
        userRef,
        {
          profilePicture: imageUrl,
        },
        { merge: true }
      );

      // Actualizo el estado
      setUserData({
        ...userData,
        profilePicture: imageUrl,
      });

      console.log("profile picture changed");
    }
  };

  const deleteProfilePicture = async () => {
    const profilePictureRef = ref(
      storage,
      `users/${userData.uid}/profile-picture-${userData.uid}`
    );

    await deleteObject(profilePictureRef);

    // Creo una ref del usuario
    const userRef = doc(db, "users", userData.uid);

    // Actualizo firestore
    await setDoc(
      userRef,
      {
        profilePicture: "",
      },
      { merge: true }
    );

    // Actualizo el estado
    setUserData({ ...userData, profilePicture: "" });
  };

  const deleteBanner = async () => {
    const bannerRef = ref(
      storage,
      `users/${userData.uid}/banner-${userData.uid}`
    );

    await deleteObject(bannerRef);

    // Creo una ref del usuario
    const userRef = doc(db, "users", userData.uid);

    // Actualizo firestore
    await setDoc(
      userRef,
      {
        banner: "",
      },
      { merge: true }
    );

    // Actualizo el estado
    setUserData({ ...userData, banner: "" });
  };

  const handleFavorites = async (quizId) => {
    // Si no hay un usuario logueado
    if (!userData) return;

    // Creo una ref del usuario
    const userRef = doc(db, "users", userData.uid);

    let favoriteQuizzes;

    // Si el quiz no esta en favoritos
    if (!userData.favoriteQuizzes.includes(quizId)) {
      favoriteQuizzes = [...userData.favoriteQuizzes, quizId];

      // Actualizo firestore
      setDoc(userRef, { favoriteQuizzes }, { merge: true });

      // Actualizo el estado
      setUserData({
        ...userData,
        favoriteQuizzes,
      });

      console.log(`Favorito agregado: ${quizId}`);

      // Si el quiz esta en favoritos
    } else {
      favoriteQuizzes = await userData.favoriteQuizzes.filter(
        (quizIdToEvaluate) => quizIdToEvaluate !== quizId
      );

      // Actualizo firestore
      setDoc(userRef, { favoriteQuizzes }, { merge: true });

      // Actualizo el estado
      setUserData({ ...userData, favoriteQuizzes });

      console.log(`Favorito eliminado: ${quizId}`);
    }
  };

  const data = {
    loadingUserData,
    userData,
    setUserData,
    authWithGoogle,
    logout,
    bannerFileHandler,
    profilePictureFileHandler,
    deleteProfilePicture,
    handleFavorites,
    deleteBanner,
    handleDeleteAccount,
  };

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

const useUserContext = () => useContext(UserContext);

export { UserProvider };
export default useUserContext;
