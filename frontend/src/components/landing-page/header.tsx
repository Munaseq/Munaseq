"use client";

import { motion } from "framer-motion";
import Button from "../common/buttons/button";
import Image from "next/image";
import logo from "@/assets/logo/munaseq-logo.svg";
import Menu from "../new-landing-page/header/menu";
import Link from "next/link";

const contentVariants = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 },
};

export default function Header() {
  const handleLinkClick = (e: any, sectionId: string) => {
    e.preventDefault();
    document.querySelector(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="p-3 flex justify-between items-center">
      <motion.div
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3, ease: "easeOut" }}
        variants={contentVariants}
      >
        <Link href="/">
          <Image
            priority
            className="sm:w-52 w-40"
            src={logo}
            alt="Munaseq logo"
          />
        </Link>
      </motion.div>

      <motion.div
        className="hidden md:flex w-full md:w-auto mr-[3.2rem]"
        id="navbar-solid-bg"
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3, ease: "easeOut" }}
        variants={contentVariants}
      >
        <ul className="text-custom-black flex font-normal text-xl space-x-20 rtl:space-x-reverse flex-row mt-0">
          <li>
            <a
              href="#features"
              onClick={(e) => {
                handleLinkClick(e, "#features");
              }}
              className="md:hover:bg-gradient-to-l md:hover:from-custom-dark-purple md:hover:to-custom-light-purple md:hover:bg-clip-text md:hover:text-transparent"
            >
              المميزات
            </a>
          </li>
          <li>
            <a
              href="#events"
              onClick={(e) => {
                handleLinkClick(e, "#events");
              }}
              className="md:hover:bg-gradient-to-l md:hover:from-custom-dark-purple md:hover:to-custom-light-purple md:hover:bg-clip-text md:hover:text-transparent"
            >
              الفعاليات
            </a>
          </li>
          <li>
            <a
              href="#footer"
              onClick={(e) => {
                handleLinkClick(e, "#footer");
              }}
              className="md:hover:bg-gradient-to-l md:hover:from-custom-dark-purple md:hover:to-custom-light-purple md:hover:bg-clip-text md:hover:text-transparent"
            >
              حول منسق
            </a>
          </li>
        </ul>
      </motion.div>

      <motion.div
        className="hidden sm:flex gap-2"
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3, ease: "easeOut" }}
        variants={contentVariants}
      >
        <Link href="/signin">
          <Button outline>تسجيل دخول</Button>
        </Link>
        <Link href="/signup">
          <Button gradient>انشاء الحساب</Button>
        </Link>
      </motion.div>

      <div className="md:hidden">
        <Menu />
      </div>
    </header>
  );
}
