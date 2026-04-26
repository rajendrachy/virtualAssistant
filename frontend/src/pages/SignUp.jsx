import React, { useState, useEffect, useRef } from 'react'
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { userDataContext } from '../context/userContext';
import axios from 'axios';
import { FaRobot, FaNetworkWired } from "react-icons/fa";

const passwordRequirements = [
  { regex: /.{8,}/, label: 'MIN_8_CHARACTERS' },
  { regex: /[A-Z]/, label: 'UPPERCASE_REQUIRED' },
  { regex: /[a-z]/, label: 'LOWERCASE_REQUIRED' },
  { regex: /[0-9]/, label: 'NUMERIC_REQUIRED' },
];

function SignUp() {

  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    agreeTerms: false 
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [typedText, setTypedText] = useState('');
  const matrixRef = useRef(null);

  const { serverUrl, setUserData} = useContext(userDataContext);

  const navigate = useNavigate("");

  const introText = "NEW_AGENT_REGISTRATION // INITIALIZING...";
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= introText.length) {
        setTypedText(introText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 60);
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
    let strength = 0;
    passwordRequirements.forEach(req => {
      if (req.regex.test(formData.password)) strength++;
    });
    setPasswordStrength(strength);
  }, [formData.password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-yellow-500';
    if (passwordStrength <= 3) return 'bg-blue-500';
    return 'bg-[#0f0]';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2) newErrors.name = 'INVALID_NAME_LENGTH';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'INVALID_EMAIL_FORMAT';
    if (!formData.password || formData.password.length < 8) newErrors.password = 'PASSCODE_TOO_SHORT';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'PASSCODE_MISMATCH';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'TERMS_ACCEPTANCE_REQUIRED';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;
    setLoading(true);

    try {
      let result = await axios.post(`${serverUrl}/api/auth/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      }, {withCredentials: true})
 
      setUserData(result.data);
      setLoading(false);
      navigate("/customize")
     
    } catch (error) {
      setUserData(null);
      setLoading(false);
      if (error.response?.data?.message) setErrors({ general: error.response.data.message });
      else setErrors({ general: "REGISTRATION_FAILED" });
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

        <div className="absolute bottom-10 left-10 text-[#0f0]/40 font-mono text-xs">
          <p>PROTOCOL: HTTPS</p>
          <p>ENCRYPTION: AES-256</p>
        </div>
      </div>


      <div className="relative z-10 w-[90%] max-w-[420px]">
        <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-[#0f0]/30 rounded-sm p-8 shadow-[0_0_30px_rgba(0,255,0,0.1)] max-h-[90vh] overflow-y-auto">
          
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-[#0f0] rounded-sm flex items-center justify-center mb-4">
                <FaRobot className="w-8 h-8 text-[#0f0]" />
              </div>
              <div className="absolute inset-0 border border-[#0f0]/50 animate-pulse" />
            </div>
            <h1 className="text-[#0f0] text-xl font-mono font-bold tracking-wider">
              NEW_AGENT
            </h1>
            <p className="text-[#0f0]/50 font-mono text-xs mt-2 tracking-widest">[ IDENTITY_CREATION_PROTOCOL ]</p>
          </div>

          <form className="space-y-3" onSubmit={handleSignUp}>
            
            <div>
              <label className="text-[#0f0]/70 font-mono text-xs uppercase tracking-wider ml-1 mb-1 block">Agent_Name</label>
              <input 
                type="text" 
                placeholder='designation' 
                className="w-full h-10 bg-[#0a0a0a] border border-[#0f0]/30 text-[#0f0] font-mono placeholder-[#0f0]/30 px-3 rounded-sm text-sm focus:outline-none focus:border-[#0f0] transition-all"
                onFocus={() => setIsFocused('name')}
                onBlur={() => setIsFocused(null)}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                value={formData.name}
              />
              {errors.name && <p className="text-red-500 font-mono text-xs mt-1 ml-1">! {errors.name}</p>}
            </div>

            <div>
              <label className="text-[#0f0]/70 font-mono text-xs uppercase tracking-wider ml-1 mb-1 block">Channel</label>
              <input 
                type="email" 
                placeholder='channel@node.net' 
                className="w-full h-10 bg-[#0a0a0a] border border-[#0f0]/30 text-[#0f0] font-mono placeholder-[#0f0]/30 px-3 rounded-sm text-sm focus:outline-none focus:border-[#0f0] transition-all"
                onFocus={() => setIsFocused('email')}
                onBlur={() => setIsFocused(null)}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                value={formData.email}
              />
              {errors.email && <p className="text-red-500 font-mono text-xs mt-1 ml-1">! {errors.email}</p>}
            </div>

            <div>
              <label className="text-[#0f0]/70 font-mono text-xs uppercase tracking-wider ml-1 mb-1 block">Access_Key</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="key_code" 
                  className="w-full h-10 bg-[#0a0a0a] border border-[#0f0]/30 text-[#0f0] font-mono placeholder-[#0f0]/30 px-3 pr-8 rounded-sm text-sm focus:outline-none focus:border-[#0f0] transition-all"
                  onFocus={() => setIsFocused('password')}
                  onBlur={() => setIsFocused(null)}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  value={formData.password}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IoEyeOff className="w-4 h-4 text-[#0f0]/50" />
                  ) : (
                    <IoEye className="w-4 h-4 text-[#0f0]/50" />
                  )}
                </button>
              </div>
              
              {formData.password && (
                <div className="mt-1">
                  <div className="flex gap-0.5">
                    {[...Array(4)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-0.5 flex-1 ${i < passwordStrength ? getStrengthColor() : 'bg-[#0f0]/20'}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {errors.password && <p className="text-red-500 font-mono text-xs mt-1 ml-1">! {errors.password}</p>}
            </div>

            <div>
              <label className="text-[#0f0]/70 font-mono text-xs uppercase tracking-wider ml-1 mb-1 block">Confirm_Key</label>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="reconfirm" 
                className="w-full h-10 bg-[#0a0a0a] border border-[#0f0]/30 text-[#0f0] font-mono placeholder-[#0f0]/30 px-3 rounded-sm text-sm focus:outline-none focus:border-[#0f0] transition-all"
                onFocus={() => setIsFocused('confirmPassword')}
                onBlur={() => setIsFocused(null)}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                value={formData.confirmPassword}
              />
              {errors.confirmPassword && <p className="text-red-500 font-mono text-xs mt-1 ml-1">! {errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input 
                type="checkbox" 
                checked={formData.agreeTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                className="mt-1 w-4 h-4 rounded-sm border-[#0f0]/30 bg-[#0a0a0a] accent-[#0f0] cursor-pointer"
              />
              <span className="text-[#0f0]/50 font-mono text-xs">
                I accept the <span className="text-[#0f0]">PROTOCOL_TERMS</span>
              </span>
            </div>
            {errors.agreeTerms && <p className="text-red-500 font-mono text-xs ml-6">! {errors.agreeTerms}</p>}

            {errors.general && (
              <p className="text-red-500 font-mono text-xs bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-sm">
                ! ERROR: {errors.general}
              </p>
            )}

            <button 
              className="w-full h-11 bg-[#0f0]/10 border border-[#0f0]/50 hover:bg-[#0f0]/20 hover:border-[#0f0] text-[#0f0] font-mono font-bold tracking-wider rounded-sm transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">&gt; INITIALIZING...</span>
              ) : (
                <span>&gt; REGISTER_AGENT</span>
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-[#0f0]/50 font-mono text-xs">
              <span 
                className="cursor-pointer hover:text-[#0f0] transition-colors" 
                onClick={() => navigate("/signin")}
              >
                [ EXISTING_AGENT_LOGIN ]
              </span>
            </p>
          </div>
        </div>

        <p className="text-center text-[#0f0]/30 font-mono text-xs mt-4 tracking-widest">
          // SECURE_REGISTRATION // ENCRYPTED_TERMINAL //
        </p>
      </div>
    </div>
  )
}

export default SignUp