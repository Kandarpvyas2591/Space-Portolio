"use client"
import React from 'react'
import {motion} from 'framer-motion'
import { slideInFromLeft, slideInFromRight, slideInFromTop } from '@/utils/motion'
import { SparklesIcon } from '@heroicons/react/24/solid'

const SkillText = () => {
  return (
    <div className='w-full h-auto flex flex-col items-center justify-center px-4'>      <motion.div
        variants={slideInFromTop}
        className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9] flex items-center"
      >
        <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
        <h1 className="Welcome-text text-[13px]">
          Full Stack Development
        </h1>
      </motion.div>
      <motion.div
        variants={slideInFromLeft(0.5)}
        className='text-[20px] sm:text-[24px] md:text-[30px] text-white font-medium mt-[10px] text-center mb-[15px]'
      >
        My Technology Stack
      </motion.div>
      <motion.div
        variants={slideInFromRight(0.5)}
        className='cursive text-[16px] sm:text-[18px] md:text-[20px] text-gray-200 mb-6 sm:mb-10 mt-[10px] text-center'
      >
        Building with modern and cutting-edge technologies
      </motion.div>
    </div>
  )
}

export default SkillText