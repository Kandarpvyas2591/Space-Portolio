import Image from "next/image";
import React from "react";

interface Props {
  src: string;
  title: string;
  description: string;
}

const ProjectCard = ({ src, title, description }: Props) => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg border border-[#2A0E61] h-full flex flex-col">
      <div className="h-[200px] sm:h-[220px] md:h-[240px] overflow-hidden">
        <Image
          src={src}
          alt={title}
          width={1000}
          height={1000}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative p-4 flex-1 flex flex-col">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">{title}</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-300">{description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
