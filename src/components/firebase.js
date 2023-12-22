// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBFrw66E3IVIMoiFG8CfPX4zeGXLSHOiZ8",
  authDomain: "random-quiz-7eafa.firebaseapp.com",
  projectId: "random-quiz-7eafa",
  storageBucket: "random-quiz-7eafa.appspot.com",
  messagingSenderId: "263058231298",
  appId: "1:263058231298:web:7fdb945fbbd5028118571b",
  measurementId: "G-PJG5Q334RV",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

export { db, auth, storage };
