"use client";

import useNavbarContext from "@/contexts/NavbarContext";

import Link from "next/link";

const Footer = () => {
  const { isNavbarFixed, navbarSide } = useNavbarContext();

  return (
    <div
      className={`flex p-4 pt-0 flex-col gap-2 ${
        isNavbarFixed
          ? navbarSide === "right"
            ? "mr-[206px]"
            : "ml-[206px]"
          : navbarSide === "right"
          ? "mr-[56px]"
          : "ml-[56px]"
      }`}
    >
      <span className="text-lg font-semibold">Random Quiz</span>

      <span>Created by Alexis Scuderi</span>

      <div className="flex gap-4">
        <Link href={"https://scuderi-alexis.web.app/"} target="_blank">
          Portfolio
        </Link>
        <Link href={"https://www.linkedin.com/feed/"} target="_blank">
          LinkedIn
        </Link>
        <Link href={"https://github.com/a-scu"} target="_blank">
          Github
        </Link>
      </div>
    </div>
  );
};

export default Footer;
