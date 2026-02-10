import React from 'react'
import Card from '../components/Card';
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { useState } from 'react';
import { useRef } from 'react';
import { useContext } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from "react-icons/md";


function Customize() {
   
  const {serverUrl, userData, setUserData, backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage} = useContext(userDataContext)


   const navigate = useNavigate()

    const inputImage = useRef()


    const handleImage = (e) => {
      const file = e.target.files[0]
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))

    }



  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black]
     to-[#030353] flex justify-center items-center flex-col p-[20px]  '>
       

    <MdOutlineKeyboardBackspace className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={() => navigate('/')}/>



  <h1 className='text-white mb-[40px] text-[30px] text-center'>Select your <span className='text-blue-200'>Assistant Image</span></h1>

       <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px] '>
       <Card image={image1}/>
      <Card image={image2}/>
       <Card image={image3}/>
       <Card image={image4}/>
       <Card image={image5}/>
       <Card image={image6}/>
       <Card image={image7}/>


    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden  hover:shadow-blue-950 cursor-pointer hover:border-white hover:border-4 flex items-center justify-center ${selectedImage === "input" ? "border-white border-4 shadow-2xl shadow-blue-950" : null}`} onClick={() => {
      inputImage.current.click()
      setSelectedImage("input")
      }}>



  {!frontendImage &&  <RiImageAddLine className='text-white w-[25px] h-[25px] '/>}
     

{frontendImage && <img src={frontendImage} className='h-full object-cover' /> }


    </div>

    
<input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
  
       </div>
    

    {selectedImage  && 
       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer bg-white rounded-full text-[19px] ' onClick={() => navigate("/customize2")}>Next</button>
    }

    </div>
  )
}



export default Customize






