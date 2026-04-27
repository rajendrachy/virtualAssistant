import React from 'react'
import Card from '../components/Card';
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image4.png";
import image4 from "../assets/image5.png";
import image5 from "../assets/image6.jpeg";
import image6 from "../assets/image7.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { useState, useRef, useContext } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaArrowLeft, FaCheck } from "react-icons/fa";

function Customize() {
  const { serverUrl, userData, setUserData, backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage } = useContext(userDataContext)
  const navigate = useNavigate()
  const inputImage = useRef(null)
  const [hoveredImage, setHoveredImage] = useState(null)

  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const images = [
    { src: image1, name: "CYBER" },
    { src: image2, name: "NOVA" },
    { src: image3, name: "ECHO" },
    { src: image4, name: "ATLAS" },
    { src: image5, name: "PRISM" },
    { src: image6, name: "QUANTUM" },
  ]

  return (
    <div className="min-h-screen w-full bg-[#000] flex justify-center items-center p-4 sm:p-8 relative overflow-hidden">

      <div className="absolute inset-0 bg-gradient-radial from-[#0a1a0a] via-[#000] to-[#000]"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,255,0,0.05) 0%, transparent 50%)` }}></div>
      </div>

      <FaArrowLeft className="absolute top-5 left-5 text-[#0f0]/50 w-6 h-6 cursor-pointer hover:text-[#0f0] transition-colors z-10" onClick={() => navigate('/signin')} />

      <div className="relative z-10 w-full max-w-3xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 border-2 border-[#0f0] rounded-sm flex items-center justify-center mb-4">
            <FaRobot className="w-8 h-8 text-[#0f0]" />
          </div>
          <h1 className="text-[#0f0] text-xl sm:text-2xl font-mono font-bold tracking-wider text-center">
            CONFIGURE ASSISTANT
          </h1>
          <p className="text-[#0f0]/50 font-mono text-xs mt-2 tracking-widest">[ SELECT_AVATAR_PROTOCOL ]</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 justify-center">
          {images.map((img, index) => (
            <Card key={index} image={img.src} name={img.name} />
          ))}

          <div
            className={`relative aspect-square rounded-sm overflow-hidden border-2 cursor-pointer transition-all duration-300
              ${selectedImage === "custom" || frontendImage
                ? 'border-[#0f0] shadow-[0_0_20px_rgba(0,255,0,0.5)]'
                : 'border-[#0f0]/30 hover:border-[#0f0]/70 hover:shadow-[0_0_15px_rgba(0,255,0,0.3)]'
              }`}
            onClick={() => {
              inputImage.current.click();
              setSelectedImage("custom");
            }}
          >
            {frontendImage ? (
              <img src={frontendImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0a]">
                <RiImageAddLine className="w-8 h-8 text-[#0f0]/50" />
                <span className="text-[#0f0]/50 font-mono text-xs mt-2">UPLOAD</span>
              </div>
            )}
          </div>
        </div>

        <input
          type="file"
          accept='image/*'
          ref={inputImage}
          hidden
          onChange={handleImage}
        />

        {selectedImage && (
          <div className="flex justify-center mt-8">
            <button
              className="px-8 py-3 bg-[#0f0]/10 border border-[#0f0]/50 hover:bg-[#0f0]/20 hover:border-[#0f0] text-[#0f0] font-mono font-bold tracking-wider rounded-sm transition-all"
              onClick={() => navigate("/customize2")}
            >
              {'>'} PROCEED
            </button>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#0f0]/30 font-mono text-xs">
        STEP 1 OF 2 // AVATAR_SELECTION
      </div>
    </div>
  )
}

export default Customize