import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from 'react'
import { data } from 'react-router-dom';


export const UserDataContext = createContext(null);



function UserContext({children}) {
  const serverUrl = "https://virtualassistant-moah.onrender.com"


  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
 const [selectedImage, setSelectedImage] = useState(null)



  const handleCurrentUser = async () => {
    try{
   const result = await axios.get(`${serverUrl}/api/user/current`, {withCredentials: true})
setUserData(result.data);
console.log(result.data);


    } catch(error) {
      console.log(error);

    }
  }


const getGeminiResponse = async  (command) => {
    try {
    const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, {command}, {withCredentials: true})

    return result.data;



    } catch(error) {
    console.log(error);

    }
}


  useEffect(() => {
 handleCurrentUser()
  }, [])


  
  const value = {
   serverUrl, userData, setUserData, backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage, getGeminiResponse
  }

  

  return (
    <div>
      <UserDataContext.Provider value={value}>
          {children}
      </UserDataContext.Provider>
      
    </div>
  )
}

export default UserContext

