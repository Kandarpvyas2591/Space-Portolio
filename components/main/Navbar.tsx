"use client";

import { Socials } from "@/constants";
import Image from "next/image";
import React, { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] backdrop-blur-md z-50 px-4 sm:px-10">
      <div className="w-full h-full flex flex-row items-center justify-between m-auto px-[10px]">
        <a
          href="#about-me"
          className="h-auto w-auto flex flex-row items-center"
        >
          <Image
            src="/NavLogo.png"
            alt="logo"
            width={70}
            height={70}
            className="cursor-pointer hover:animate-slowspin"
          />

          <span className="font-bold ml-[10px] hidden md:block text-gray-300">
            WebChain Dev
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex w-[500px] h-full flex-row items-center justify-between md:mr-20">
          <div className="flex items-center justify-between w-full h-auto border border-[#7042f861] bg-[#0300145e] mr-[15px] px-[20px] py-[10px] rounded-full text-gray-200">
            <a href="#about-me" className="cursor-pointer">
              About me
            </a>
            <a href="#skills" className="cursor-pointer">
              Skills
            </a>
            <a href="#projects" className="cursor-pointer">
              Projects
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden text-white flex flex-col justify-center items-center">
          <div className={`w-6 h-0.5 bg-white mb-1.5 ${isMenuOpen ? "transform rotate-45 translate-y-2" : ""}`}></div>
          <div className={`w-6 h-0.5 bg-white mb-1.5 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}></div>
          <div className={`w-6 h-0.5 bg-white ${isMenuOpen ? "transform -rotate-45 -translate-y-2" : ""}`}></div>
        </button>        <div className="hidden md:flex flex-row gap-5">
          {Socials.map((social) => (
            <Image
              src={social.src}
              alt={social.name}
              key={social.name}
              width={24}
              height={24}
            />
          ))}
        </div>
        
        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-[65px] bg-[#030014] bg-opacity-95 z-50 flex flex-col md:hidden">
            <div className="flex flex-col items-center justify-center h-full gap-10">
              <a href="#about-me" className="text-gray-200 text-2xl" onClick={toggleMenu}>
                About me
              </a>
              <a href="#skills" className="text-gray-200 text-2xl" onClick={toggleMenu}>
                Skills
              </a>
              <a href="#projects" className="text-gray-200 text-2xl" onClick={toggleMenu}>
                Projects
              </a>
              <div className="flex flex-row gap-8 mt-8">
                {Socials.map((social) => (
                  <Image
                    src={social.src}
                    alt={social.name}
                    key={social.name}
                    width={30}
                    height={30}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
