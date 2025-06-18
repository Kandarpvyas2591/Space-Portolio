"use client";

import React from "react";
import { motion } from "framer-motion";
import SkillText from "../sub/SkillText";
import { IconCloud } from "@/components/magicui/icon-cloud-optimized";
import { SkillCategories } from "../sub/SkillCategories";
import { slideInFromBottom } from "@/utils/motion";

const skillIcons = [
  "/next.png",
  "/react.png",
  "/vite.png", 
  "/tailwind.png",
  "/redux.png",
  "/reactquery.png",
  "/js.png",
  "/ts.png",
  "/html.png",
  "/css.png",
  "/express.png",
  "/mongodb.png",
  "/postger.png",
  "/mysql.png",
  "/node-js.png",
  "/mui.png",
  "/Firebase.png",
  "/supabase.png",
  "/gitwhite.png",
  "/docker.webp",
  "/aws.png",
  "/python.png",
  "/java.png",
  "/c.png",
  "/cpp.png",
];

const skillCategories = [
  "Frontend Development",
  "Backend Development",
  "UI/UX Design",
  "Cloud Services",
  "Database Management",
  "DevOps",
  "Mobile Development",
  "Programming Languages"
];

const Skills = () => {
  return (
    <section
      id="skills"
      className="flex flex-col items-center justify-center gap-3 h-full relative overflow-hidden pb-20 sm:pb-32 md:pb-44 pt-10 sm:pt-20"
    >      <SkillText />
      
      <motion.div
        variants={slideInFromBottom(0.2)}
        initial="hidden"
        animate="visible"
      >
        <SkillCategories categories={skillCategories} />
      </motion.div>      <div className="w-full max-w-6xl px-4 sm:px-6 md:px-10 mx-auto mt-4 sm:mt-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="min-h-[370px] sm:min-h-[470px] md:min-h-[570px] w-full flex items-center justify-center relative"
        >          
          <div className="w-full max-w-[350px] sm:max-w-[400px] md:max-w-[500px] aspect-square">
            <IconCloud images={skillIcons.slice(0, 20)} />
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-4 text-center w-full text-xs sm:text-sm text-gray-400"
          >
            <span className="italic">Interact with the globe ✨</span>
          </motion.div>
        </motion.div>
      </div>      <div className="w-full h-full absolute">
        <div className="w-full h-full z-[-10] opacity-30 absolute flex items-center justify-center bg-cover">          <video
            className="w-full h-auto"
            preload="metadata"
            playsInline
            loop
            muted
            autoPlay
            src="/cards-video.webm"
          />
        </div>
      </div>
    </section>
  );
};

export default Skills;
