import React from "react";
import {
  RxDiscordLogo,
  RxGithubLogo,
  RxInstagramLogo,
  RxTwitterLogo,
  RxLinkedinLogo,
} from "react-icons/rx";

import { FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full h-full bg-transparent text-gray-200 shadow-lg p-[15px]">
        <div className="w-full flex flex-col items-center justify-center m-auto">
            <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-start justify-items-center py-6">
                <div className="w-full max-w-[200px] h-auto flex flex-col items-center sm:items-center justify-start">
                    <div className="font-bold text-[16px]">Community</div>
                    <p className="flex flex-row items-center my-[10px] sm:my-[15px] cursor-pointer">
                        <FaYoutube />
                        <span className="text-[14px] sm:text-[15px] ml-[6px]">Youtube</span>    
                    </p>
                    <p className="flex flex-row items-center my-[10px] sm:my-[15px] cursor-pointer">
                        <RxGithubLogo />
                        <span className="text-[14px] sm:text-[15px] ml-[6px]">Github</span>    
                    </p>
                    <p className="flex flex-row items-center my-[10px] sm:my-[15px] cursor-pointer">
                        <RxDiscordLogo />
                        <span className="text-[14px] sm:text-[15px] ml-[6px]">Discord</span>    
                    </p>
                </div>
                <div className="w-full max-w-[200px] h-auto flex flex-col items-center sm:items-center justify-start">
                    <div className="font-bold text-[16px]">Social Media</div>
                    <p className="flex flex-row items-center my-[10px] sm:my-[15px] cursor-pointer">
                        <FaYoutube />
                        <span className="text-[14px] sm:text-[15px] ml-[6px]">Instagram</span>    
                    </p>
                    <p className="flex flex-row items-center my-[10px] sm:my-[15px] cursor-pointer">
                        <RxGithubLogo />
                        <span className="text-[14px] sm:text-[15px] ml-[6px]">Twitter</span>    
                    </p>
                    <p className="flex flex-row items-center my-[10px] sm:my-[15px] cursor-pointer">
                        <RxDiscordLogo />
                        <span className="text-[14px] sm:text-[15px] ml-[6px]">Linkedin</span>    
                    </p>
                </div>
                <div className="w-full max-w-[200px] h-auto flex flex-col items-center sm:items-center justify-start">
                    <div className="font-bold text-[16px]">About</div>
                   <p className="flex flex-row items-center my-[10px] sm:my-[15px] cursor-pointer">
                     
                        <span className="text-[14px] sm:text-[15px] ml-[6px]">Become Sponsor</span>    
                    </p>
                    <p className="flex flex-row items-center my-[10px] sm:my-[15px] cursor-pointer">
                      
                        <span className="text-[14px] sm:text-[15px] ml-[6px]">Learning about me</span>    
                    </p>
                    <p className="flex flex-row items-center my-[10px] sm:my-[15px] cursor-pointer">
                  
                        <span className="text-[14px] sm:text-[15px] ml-[6px]">mifwebchain@gmail.com</span>    
                    </p>
                </div>
            </div>

            <div className="mb-[20px] text-[13px] sm:text-[15px] text-center px-4">
                &copy; WebChain Dev 2023 Inc. All rights reserved
            </div>
        </div>
    </div>
  )
}

export default Footer