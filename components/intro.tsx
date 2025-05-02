"use client";

import { useEffect } from "react";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsArrowDown, BsLinkedin } from "react-icons/bs";
import { FaGithubSquare } from "react-icons/fa";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";
import ProfilePhoto from "@/public/Dave-on-computer.jpg";
import party from "party-js";

export default function Intro() {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();

  useEffect(() => {
    party.confetti(document.body, {
      count: 200,
    });
  }, []);

  return (
    <section
      ref={ref}
      id="home"
      className="mb-28 max-w-[50rem] text-center sm:mb-0 scroll-mt-[100rem]"
    >
      <div className="flex items-center justify-center">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "tween",
              duration: 0.2,
            }}
          >
            <Image
              src={ProfilePhoto}
              alt="Dave Beauchamp on computer"
              quality="95"
              priority={true}
              className="h-32 w-32 rounded-full object-cover border-[0.1rem] border-white shadow-xl"
            />
          </motion.div>

          <motion.span
            className="absolute bottom-0 right-0 text-4xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 125,
              delay: 0.1,
              duration: 0.7,
            }}
          >
            👋
          </motion.span>
        </div>
      </div>

      <motion.h1
        className="mb-10 mt-4 px-4 text-2xl font-medium !leading-[1.5] sm:text-4xl"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="font-bold">Hello, I'm Dave.</span> I'm a{" "}
        <span className="font-bold">full-stack developer</span> with{" "}
        <span className="font-bold">over 10 years</span> of experience. I enjoy
        building <span className="italic">sites & apps</span>. My focus is{" "}
        <span className="underline">React (Next.js)</span>.
      </motion.h1>

      <motion.div
        className="flex flex-row items-center justify-center gap-2 px-4 text-lg font-medium"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
        }}
      >
        <Link
          href="#contact"
          className="group bg-gray-900 text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-[1.07] hover:scale-[1.07] active:scale-110 hover:bg-gray-950 transition"
          onClick={() => {
            setActiveSection("Contact");
            setTimeOfLastClick(Date.now());
          }}
        >
          Contact me
        </Link>

        <a
          className="bg-white p-4 text-gray-700 hover:text-gray-950 flex items-center gap-2 rounded-full focus:scale-[1.07] hover:scale-[1.07] active:scale-110 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
          href="https://www.linkedin.com/in/david-beauchamp-91307285/"
          target="_blank"
        >
          <BsLinkedin />
        </a>

        <a
          className="bg-white p-4 text-gray-700 hover:text-gray-950 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.07] hover:scale-[1.07] active:scale-110 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
          href="https://github.com/davidbbe"
          target="_blank"
        >
          <FaGithubSquare />
        </a>
      </motion.div>
    </section>
  );
}
