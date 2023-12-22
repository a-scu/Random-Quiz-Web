"use client";

import { createContext, useContext, useState, useEffect } from "react";

const NavbarContext = createContext();

const NavbarProvider = ({ children }) => {
  const NAVBAR_SIDES = {
    left: "left",
    right: "right",
  };

  const [isNavbarFixed, setIsNavbarFixed] = useState(false);
  const [navbarSide, setNavbarSide] = useState(NAVBAR_SIDES.right);
  const [isNavbarRight, setIsNavbarRight] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const storedNavbarState = JSON.parse(localStorage.getItem("navbarState"));

    if (storedNavbarState) {
      setIsNavbarFixed(storedNavbarState.isNavbarFixed);
      setNavbarSide(storedNavbarState.navbarSide);
      if (storedNavbarState.navbarSide === NAVBAR_SIDES.right) {
        setIsNavbarRight(true);
      } else {
        setIsNavbarRight(false);
      }
    } else {
      localStorage.setItem(
        "navbarState",
        JSON.stringify({
          isNavbarFixed: false,
          navbarSide: NAVBAR_SIDES.right,
        })
      );
    }
  }, []);

  const handleNavbarFixed = () => {
    switch (isNavbarFixed) {
      case true:
        setIsNavbarFixed(false);
        localStorage.setItem(
          "navbarState",
          JSON.stringify({
            isNavbarFixed: false,
            navbarSide,
          })
        );
        break;
      case false:
        setIsNavbarFixed(true);
        localStorage.setItem(
          "navbarState",
          JSON.stringify({
            isNavbarFixed: true,
            navbarSide,
          })
        );
        break;
    }
  };

  const handleNavbarSide = () => {
    switch (navbarSide) {
      case NAVBAR_SIDES.left:
        setNavbarSide(NAVBAR_SIDES.right);
        localStorage.setItem(
          "navbarState",
          JSON.stringify({
            isNavbarFixed,
            navbarSide: NAVBAR_SIDES.right,
          })
        );
        break;
      case NAVBAR_SIDES.right:
        setNavbarSide(NAVBAR_SIDES.left);
        localStorage.setItem(
          "navbarState",
          JSON.stringify({
            isNavbarFixed,
            navbarSide: NAVBAR_SIDES.left,
          })
        );
        break;
    }

    setIsNavbarRight(!isNavbarRight);
  };

  const handleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const data = {
    isNavbarFixed,
    handleNavbarFixed,
    isNavbarRight,
    NAVBAR_SIDES,
    navbarSide,
    handleNavbarSide,
    isUserMenuOpen,
    handleUserMenu,
  };

  return (
    <NavbarContext.Provider value={data}>{children}</NavbarContext.Provider>
  );
};

const useNavbarContext = () => {
  return useContext(NavbarContext);
};

export { NavbarProvider };
export default useNavbarContext;
