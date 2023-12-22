"use client";

import { useState, useEffect } from "react";

import { db } from "@/components/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";

import useNavbarContext from "@/contexts/NavbarContext";

import Image from "next/image";
import QuizzesScroll from "@/components/QuizzesScroll";

export default function Home() {
  const { isNavbarFixed } = useNavbarContext();

  const [categorie, setCategorie] = useState("trending");

  const [loadingTopQuizzes, setLoadingTopQuizzes] = useState(true);
  const [topQuizzes, setTopQuizzes] = useState([]);
  const [topQuizzesLastDoc, setTopQuizzesLastDoc] = useState(null);

  const [loadingTrendingQuizzes, setLoadingTrendingQuizzes] = useState(true);
  const [trendingQuizzes, setTrendingQuizzes] = useState([]);
  const [trendingQuizzesLastDoc, setTrendingQuizzesLastDoc] = useState(null);

  useEffect(() => {
    getTopQuizzes(true);
    getTrendingQuizzes(true);
  }, []);

  const getTopQuizzes = async (fromBeginning) => {
    // Creo la ref de los quizzes
    const quizzesRef = collection(db, "quizzes");

    // Creo la query
    let q;

    if (!fromBeginning) {
      q = query(
        quizzesRef,
        orderBy("takers", "desc"),
        startAfter(topQuizzesLastDoc),
        limit(24)
      );
    } else {
      q = query(quizzesRef, orderBy("takers", "desc"), limit(24));
    }

    // Obtengo los docs
    const snapshot = await getDocs(q);
    const newQuizzes = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Si hay para agregar
    if (newQuizzes.length > 0) {
      const finalQuizzes = [...trendingQuizzes];

      newQuizzes.forEach((item1) => {
        const exists = finalQuizzes.find((item2) => item2.id === item1.id);
        if (!exists) {
          finalQuizzes.push(item1);
        }
      });

      // Actualizo el estado
      setTopQuizzesLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setTopQuizzes(finalQuizzes);
    }

    // Cierro el modal
    setLoadingTopQuizzes(false);
  };

  const getTrendingQuizzes = async (fromBeginning) => {
    // Creo la ref de los quizzes
    const quizzesRef = collection(db, "quizzes");

    // Creo el limite para obtener los quizzes que se hayan creado en los ultimos 7 dias
    const limitDate = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;

    // Creo la query
    let q;

    if (!fromBeginning) {
      q = query(
        quizzesRef,
        where("uploadTime", ">", limitDate),
        orderBy("uploadTime", "desc"),
        startAfter(trendingQuizzesLastDoc),
        limit(24)
      );
    } else {
      q = query(
        quizzesRef,
        where("uploadTime", ">", limitDate),
        orderBy("uploadTime", "desc"),
        limit(24)
      );
    }

    // Obtengo los docs
    const snapshot = await getDocs(q);
    const newQuizzes = snapshot.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      };
    });

    // Si hay para agregar
    if (newQuizzes.length > 0) {
      const finalQuizzes = [...trendingQuizzes];

      newQuizzes.forEach((item1) => {
        const exists = finalQuizzes.find((item2) => item2.id === item1.id);
        if (!exists) {
          finalQuizzes.push(item1);
        }
      });

      // Actualizo el estado
      setTrendingQuizzesLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setTrendingQuizzes(finalQuizzes);
    }

    // Cierro el modal
    setLoadingTrendingQuizzes(false);
  };

  return (
    <div className="flex flex-col">
      {/* Fixed Header */}
      <div
        className={`flex sticky top-0 z-10 p-4 bg-neutral-900 items-center gap-4 ${
          isNavbarFixed ? "max-[918px]:flex-col" : "max-md:flex-col"
        }`}
      >
        {/* Search */}
        <div className="group flex max-[384px]:w-full max-[384px]:flex-col min-[384px]:items-center gap-4">
          <h1 className="logo min-w-fit text-2xl font-bold">Random Quiz</h1>

          {/* <div className="flex relative items-center">
            <input
              required
              maxLength={128}
              placeholder="Search"
              title="Search any keywords"
              // value={quizData.title}
              // onChange={(e) => {} }
              className="w-full h-10 pl-2 pr-10 bg-neutral-800 border border-transparent hover:border-neutral-700 focus:border-neutral-700 rounded-md outline-none text-sm font-extralight placeholder:text-neutral-400 transition-[border] duration-300"
            />

            <button
              type="button"
              // onClick={saveDisplayName}
              className="flex absolute right-0 w-10 h-10 justify-center items-center cursor-pointer"
            >
              <Image
                src={"/img/icons/search.png"}
                width={16}
                height={16}
                alt="✓"
                className="w-4 min-w-[16px] h-4 min-h-[16px]"
              />
            </button>
          </div> */}
        </div>

        <div className="flex max-[384px]:w-full max-[384px]:flex-col gap-2">
          <button
            onClick={() => setCategorie("trending")}
            className={`flex w-fit max-[384px]:w-full h-10 px-2 justify-center items-center gap-2 border rounded-md border-transparent cursor-pointer transition-[border] duration-300 ${
              categorie === "trending"
                ? "bg-emerald-800"
                : "bg-neutral-800 hover:border-neutral-700"
            }`}
          >
            <span className="text-sm">Trending This Week</span>
          </button>

          <button
            onClick={() => setCategorie("top")}
            className={`flex w-fit max-[384px]:w-full h-10 px-2 justify-center items-center gap-2 border rounded-md border-transparent cursor-pointer transition-[border] duration-300 ${
              categorie === "top"
                ? "bg-emerald-800"
                : "bg-neutral-800 hover:border-neutral-700"
            }`}
          >
            <span className="text-sm">Top Quizzes</span>
          </button>
        </div>
      </div>

      {/* Quizzes */}
      <div className="flex px-4 pb-4 flex-col gap-4">
        <h2 className="w-fit text-xl font-medium">
          {categorie === "trending"
            ? "Trending This Week"
            : categorie === "top" && "Top Quizzes"}
        </h2>
        <QuizzesScroll
          quizzes={
            categorie === "top"
              ? topQuizzes
              : categorie === "trending" && trendingQuizzes
          }
          getQuizzes={
            categorie === "top"
              ? getTopQuizzes
              : categorie === "trending" && getTrendingQuizzes
          }
          loadingQuizzes={
            categorie === "top"
              ? loadingTopQuizzes
              : categorie === "trending" && loadingTrendingQuizzes
          }
          setLoadingQuizzes={
            categorie === "top"
              ? setLoadingTopQuizzes
              : categorie === "trending" && setLoadingTrendingQuizzes
          }
        />
      </div>
    </div>
  );
}

// Arreglar navbar (eventualmente)
