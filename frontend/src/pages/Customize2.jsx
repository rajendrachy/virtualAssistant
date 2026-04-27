import React, { useContext, useState } from 'react'
import axios from 'axios';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaArrowLeft, FaMicrochip } from "react-icons/fa";

function Customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData, frontendImage } = useContext(userDataContext)
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    if (!assistantName.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("assistantName", assistantName)

      if (backendImage) {
        formData.append("assistantImage", backendImage)
      } else if (frontendImage) {
        formData.append("imageUrl", frontendImage)
      } else {
        formData.append("imageUrl", selectedImage)
      }

      const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })
      setLoading(false);
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error.response?.data || error.message);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#000] flex justify-center items-center p-4 relative overflow-hidden">

      <div className="absolute inset-0 bg-gradient-radial from-[#0a0a1a] via-[#000] to-[#000]"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,255,0,0.03) 0%, transparent 50%)` }}></div>
      </div>

      <FaArrowLeft className="absolute top-5 left-5 text-[#0f0]/50 w-6 h-6 cursor-pointer hover:text-[#0f0] transition-colors z-10" onClick={() => navigate('/customize')} />

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">

        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 border-2 border-[#0f0] rounded-sm flex items-center justify-center mb-4">
              <FaRobot className="w-10 h-10 text-[#0f0]" />
            </div>
          </div>
          <h1 className="text-[#0f0] text-xl sm:text-2xl font-mono font-bold tracking-wider text-center">
            NAME YOUR ASSISTANT
          </h1>
          <p className="text-[#0f0]/50 font-mono text-xs mt-2 tracking-widest">[ ASSIGN_IDENTITY_PROTOCOL ]</p>
        </div>

        <div className="w-full space-y-6">
          <div>
            <label className="text-[#0f0]/70 font-mono text-xs uppercase tracking-wider ml-1 mb-2 block">Assistant Identifier</label>
            <input
              type="text"
              placeholder='e.g. HELIX, NOVA, ATLAS, CYBER'
              className='w-full h-14 bg-[#0a0a0a] border border-[#0f0]/30 text-[#0f0] font-mono placeholder-[#0f0]/30 px-4 rounded-sm text-lg focus:outline-none focus:border-[#0f0] transition-all'
              required
              onChange={(e) => setAssistantName(e.target.value.toUpperCase())}
              value={assistantName}
              maxLength={15}
            />
          </div>

          <div className="bg-[#0a0a0a] border border-[#0f0]/20 rounded-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaMicrochip className="w-4 h-4 text-[#0f0]/50" />
              <span className="text-[#0f0]/50 font-mono text-xs">SYSTEM_NOTES:</span>
            </div>
            <ul className="text-[#0f0]/40 font-mono text-xs space-y-1">
              <li>{'>'} Name must be unique (2-15 characters)</li>
              <li>{'>'} Use letters, numbers only</li>
              <li>{'>'} This will be your voice assistant identity</li>
            </ul>
          </div>
        </div>

        {assistantName && assistantName.length >= 2 && (
          <div className="flex justify-center mt-6">
            <button
              className="w-full h-12 bg-[#0f0]/10 border border-[#0f0]/50 hover:bg-[#0f0]/20 hover:border-[#0f0] text-[#0f0] font-mono font-bold tracking-wider rounded-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={loading}
              onClick={handleUpdateAssistant}
            >
              {loading ? (
                <span className="animate-pulse">{' >'} INITIALIZING...</span>
              ) : (
                <span>{'>'} FINALIZE_ASSISTANT</span>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#0f0]/30 font-mono text-xs">
        STEP 2 OF 2 // IDENTITY_CONFIGURATION
      </div>
    </div>
  )
}

export default Customize2