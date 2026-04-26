import React, { useState } from 'react'
import { useContext } from 'react';
import { userDataContext } from '../context/userContext';
import { FaCheck } from "react-icons/fa";

function Card({ image, name }) {
  const { selectedImage, setSelectedImage, setBackendImage, setFrontendImage } = useContext(userDataContext);
  const [isHovered, setIsHovered] = useState(false);

  const isSelected = selectedImage === image;

  return (
    <div 
      className={`relative aspect-square rounded-sm overflow-hidden border-2 cursor-pointer transition-all duration-300 group
        ${isSelected 
          ? 'border-[#0f0] shadow-[0_0_20px_rgba(0,255,0,0.5)]' 
          : 'border-[#0f0]/30 hover:border-[#0f0]/70 hover:shadow-[0_0_15px_rgba(0,255,0,0.3)]'
        }`}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null);
        setFrontendImage(null);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={image} alt="" className="w-full h-full object-cover" />
      
      {isSelected && (
        <div className="absolute inset-0 bg-[#0f0]/20 flex items-center justify-center backdrop-blur-sm">
          <FaCheck className="w-8 h-8 text-[#0f0]" />
        </div>
      )}
      
      <div className={`absolute bottom-0 left-0 right-0 bg-[#0a0a0a]/90 py-1 text-center transition-opacity duration-200
        ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-[#0f0] font-mono text-xs">{name}</span>
      </div>
    </div>
  )
}

export default Card