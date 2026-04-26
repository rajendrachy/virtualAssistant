import React, { useState, useEffect, useRef } from 'react'
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { userDataContext } from '../context/userContext';
import axios from 'axios';
import { FaRobot, FaNetworkWired, FaMicrochip, FaBrain } from "react-icons/fa";



function SignIn() {

  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState('');
  const matrixRef = useRef(null);

  const { serverUrl, userData, setUserData} = useContext(userDataContext);

  const navigate = useNavigate("");

  const introText = "AI SYSTEM // VIRTUAL ASSISTANT v2.0";
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= introText.length) {
        setTypedText(introText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = matrixRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        const opacity = Math.random() * 0.5 + 0.5;
        ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail, remember: true }));
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (formData.remember) localStorage.setItem('savedEmail', formData.email);
      else localStorage.removeItem('savedEmail');

      let result = await axios.post(`${serverUrl}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      }, {withCredentials: true})
      
      setUserData(result.data);
      setLoading(false);
      navigate("/")
 
    } catch (error) {
      setUserData(null);
      setLoading(false);
      if (error.response?.data?.message) setErrors({ general: error.response.data.message });
      else setErrors({ general: "Authentication failed" });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#000] relative overflow-hidden">
      
      <canvas ref={matrixRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 pointer-events-none" />
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 text-[#0f0]/60 font-mono text-xs">
          <p className="animate-pulse">{typedText}</p>
        </div>
        
        <div className="absolute top-10 right-10 flex items-center gap-4 text-[#0f0]/60 font-mono text-xs">
          <div className="flex items-center gap-2">
            <FaBrain className="w-3 h-3" />
            <span>NEURAL_PROCESSOR: <span className="text-[#0f0]">ONLINE</span></span>
          </div>
          <div className="flex items-center gap-2">
            <FaMicrochip className="w-3 h-3" />
            <span>AI_CORE: <span className="text-[#0f0]">ACTIVE</span></span>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 text-[#0f0]/40 font-mono text-xs">
          <p>SYSTEM_TIME: {new Date().toISOString()}</p>
          <p>MEMORY: 128GB // ALLOCATED</p>
        </div>

        <div className="absolute bottom-10 right-10 text-[#0f0]/40 font-mono text-xs text-right">
          <p>STATUS: WAITING FOR INPUT</p>
          <p>SECURE_CONNECTION: ESTABLISHED</p>
        </div>
      </div>


      <div className="relative z-10 w-[90%] max-w-[420px]">
        <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-[#0f0]/30 rounded-sm p-8 shadow-[0_0_30px_rgba(0,255,0,0.1)]">
          
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-[#0f0] rounded-sm flex items-center justify-center mb-4">
                <FaRobot className="w-8 h-8 text-[#0f0]" />
              </div>
              <div className="absolute inset-0 border border-[#0f0]/50 animate-pulse" />
            </div>
            <h1 className="text-[#0f0] text-xl font-mono font-bold tracking-wider">
              AUTHENTICATE
            </h1>
            <p className="text-[#0f0]/50 font-mono text-xs mt-2 tracking-widest">[ SECURITY CLEARANCE REQUIRED ]</p>
          </div>

          <form className="space-y-4" onSubmit={handleSignIn}>
            
            <div>
              <label className="text-[#0f0]/70 font-mono text-xs uppercase tracking-wider ml-1 mb-1 block">Identifier</label>
              <input 
                type="email" 
                placeholder='user@domain.com' 
                className="w-full h-12 bg-[#0a0a0a] border border-[#0f0]/30 text-[#0f0] font-mono placeholder-[#0f0]/30 px-4 rounded-sm text-sm focus:outline-none focus:border-[#0f0] transition-all"
                onFocus={() => setIsFocused('email')}
                onBlur={() => setIsFocused(null)}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                value={formData.email}
              />
              {errors.email && <p className="text-red-500 font-mono text-xs mt-1 ml-1">! {errors.email}</p>}
            </div>

            <div>
              <label className="text-[#0f0]/70 font-mono text-xs uppercase tracking-wider ml-1 mb-1 block">Passcode</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="********" 
                  className="w-full h-12 bg-[#0a0a0a] border border-[#0f0]/30 text-[#0f0] font-mono placeholder-[#0f0]/30 px-4 pr-10 rounded-sm text-sm focus:outline-none focus:border-[#0f0] transition-all"
                  onFocus={() => setIsFocused('password')}
                  onBlur={() => setIsFocused(null)}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  value={formData.password}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IoEyeOff className="w-4 h-4 text-[#0f0]/50" />
                  ) : (
                    <IoEye className="w-4 h-4 text-[#0f0]/50" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 font-mono text-xs mt-1 ml-1">! {errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.remember}
                  onChange={(e) => setFormData(prev => ({ ...prev, remember: e.target.checked }))}
                  className="w-4 h-4 rounded-sm border-[#0f0]/30 bg-[#0a0a0a] accent-[#0f0]"
                />
                <span className="text-[#0f0]/50 font-mono text-xs">REMEMBER_SESSION</span>
              </label>
            </div>

            {errors.general && (
              <p className="text-red-500 font-mono text-xs bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-sm">
                ! ERROR: {errors.general}
              </p>
            )}

            <button 
              className="w-full h-12 bg-[#0f0]/10 border border-[#0f0]/50 hover:bg-[#0f0]/20 hover:border-[#0f0] text-[#0f0] font-mono font-bold tracking-wider rounded-sm transition-all disabled:opacity-50"
              disabled={loading}
            >
{loading ? (
                <span className="animate-pulse">&gt; EXECUTING...</span>
              ) : (
                <span>&gt; INITIATE_SESSION</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#0f0]/50 font-mono text-xs">
              <span 
                className="cursor-pointer hover:text-[#0f0] transition-colors" 
                onClick={() => navigate("/signup")}
              >
                [ NEW_AGENT_REGISTRATION ]
              </span>
            </p>
          </div>
        </div>

        <p className="text-center text-[#0f0]/30 font-mono text-xs mt-6 tracking-widest">
          // SYSTEM v2.0 // SECURE_TERMINAL //
        </p>
      </div>
    </div>
  )
}

export default SignIn