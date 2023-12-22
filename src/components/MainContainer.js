"use client";

import { useState, useEffect } from "react";

import useNavbarContext from "../contexts/NavbarContext";

import Navbar from "./navbar/Navbar";
import Footer from "./Footer";

const MainContainer = ({ children }) => {
  const { isNavbarFixed, NAVBAR_SIDES, navbarSide } = useNavbarContext();

  const [loading, setLoading] = useState(true);
  const [margin, setMargin] = useState(null);

  useEffect(() => {
    if (isNavbarFixed) {
      navbarSide === NAVBAR_SIDES.right
        ? setMargin("sm:mr-[206px]")
        : setMargin("sm:ml-[206px]");
    } else {
      navbarSide === NAVBAR_SIDES.right
        ? setMargin("sm:mr-[56px]")
        : setMargin("sm:ml-[56px]");
    }

    setLoading(false);
  }, [isNavbarFixed, navbarSide]);

  return (
    <div className={loading ? "hidden" : ""}>
      <Navbar />
      <div className={margin}>
        <div className={`min-h-screen mx-auto`}>{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default MainContainer;
