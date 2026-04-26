import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import { FaMicrophone, FaMicrophoneSlash, FaRobot, FaPaperPlane, FaTerminal } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { IoSettings } from "react-icons/io5";

function Home() {
  const {userData, serverUrl, setUserData, getGeminiResponse} = useContext(userDataContext);
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [inputText, setInputText] = useState("");
  const [ham, setHam] = useState(false);
  const [particles, setParticles] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [AIProcessing, setAIProcessing] = useState(false);

  const inputRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecogizingRef = useRef(false);
  const synth = window.speechSynthesis;

  useEffect(() => {
    const newParticles = [...Array(25)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (userData?.history) {
      setCommandHistory([...userData.history].reverse().slice(0, 10));
    }
  }, [userData]);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {withCredentials: true});
      setUserData(null);
      navigate("/signin");
    } catch(error) {
      setUserData(null);
    }
  };

  const speak = (text) => {
    setIsSpeaking(true);
    const utterence = new SpeechSynthesisUtterance(text);
    utterence.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === 'hi-IN');
    if (hindiVoice) utterence.voice = hindiVoice;

    isSpeakingRef.current = true;
    utterence.onend = () => {
      setAiText("");
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      setTimeout(() => startRecoginition(), 8000);
    };
    synth.cancel();
    synth.speak(utterence);
  };

  const handleCommand = (data, originalCommand) => {
    const cmdLower = originalCommand.toLowerCase();
    const assistantName = userData?.assistantName || 'Assistant';
    const creatorName = userData?.name || '';
    
    setCommandHistory(prev => [originalCommand, ...prev.slice(0, 9)]);

    const siteMap = {
      youtube: 'https://www.youtube.com',
      google: 'https://www.google.com',
      gmail: 'https://mail.google.com/',
      instagram: 'https://www.instagram.com/',
      facebook: 'https://www.facebook.com/',
      linkedin: 'https://www.linkedin.com/',
      twitter: 'https://twitter.com/',
      whatsapp: 'https://web.whatsapp.com/',
      spotify: 'https://open.spotify.com/',
      netflix: 'https://www.netflix.com/',
      amazon: 'https://www.amazon.com/',
      chatgpt: 'https://chat.openai.com/',
      github: 'https://github.com/',
    };

    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good night', 'greetings', 'salam', 'namaste'];
    const isGreeting = greetings.some(g => cmdLower === g || cmdLower.startsWith(g + ' ') || cmdLower.includes(' ' + g));
    
    if (isGreeting) {
      const greets = [
        `Hello ${creatorName}! I'm ${assistantName}. How can I assist you today?`,
        `Hey there! ${assistantName} at your service. What would you like me to do?`,
        `Greetings! I'm online and ready. What can I help you with?`
      ];
      const answer = greets[Math.floor(Math.random() * greets.length)];
      setAiText(`> GREETING\n> STATUS: ${assistantName} online\n> READY: Awaiting command`);
      speak(answer);
      return;
    }

    if (cmdLower.includes('what time') || cmdLower.includes('current time')) {
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setAiText(`> SYSTEM TIME\n> VALUE: ${time}\n> STATUS: Retrieved`);
      speak(`The current time is ${time}`);
      return;
    }

    if (cmdLower.includes('what day') || cmdLower.includes('date today') || cmdLower.includes('today date') || cmdLower.includes('which day') || cmdLower.includes('day today')) {
      const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const fullDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' });
      setAiText(`> SYSTEM DATE\n> DAY: ${day}\n> DATE: ${fullDate}\n> STATUS: Retrieved`);
      speak(`Today is ${day}, ${fullDate}`);
      return;
    }

    if (cmdLower.includes('who are you') || cmdLower.includes('what is your name')) {
      const answer = `I'm ${assistantName}, your personal AI assistant. I can help you with tasks, answer questions, open apps, and more.`;
      setAiText(`> IDENTITY\n> NAME: ${assistantName}\n> CREATOR: ${creatorName}\n> STATUS: Active`);
      speak(answer);
      return;
    }

    if (cmdLower.includes('who created you') || cmdLower.includes('who made you') || cmdLower.includes('who is your creator')) {
      const answer = `I was created by ${creatorName} using advanced AI technology.`;
      setAiText(`> CREATOR\n> NAME: ${creatorName}\n> TECH: AI/ML`);
      speak(answer);
      return;
    }

    if (cmdLower.includes('how are you') || cmdLower.includes('how do you do')) {
      const answer = "I'm functioning optimally! Ready to assist you with any request.";
      setAiText(`> STATUS\n> SYSTEM: Online\n> READY: Yes`);
      speak(answer);
      return;
    }

    if (cmdLower.includes('help') || cmdLower.includes('what can you do') || cmdLower.includes('commands')) {
      const answer = `I can: open apps (YouTube, Instagram, Facebook, etc), search the web, play music, tell time/date, answer questions, get weather, and more. Just ask!`;
      setAiText(`> CAPABILITIES\n> Apps: YouTube, Instagram, Facebook, Google, WhatsApp, Spotify\n> Functions: Search, Play, Open, Answer\n> STATUS: All operational`);
      speak(answer);
      return;
    }

    if (cmdLower.includes('weather') || cmdLower.includes('temperature')) {
      setAiText(`> WEATHER CHECK\n> ACTION: Fetching weather data...\n> SOURCE: Weather Service`);
      window.open('https://www.google.com/search?q=weather', '_blank');
      speak("Opening weather information for you");
      return;
    }

    if (cmdLower.includes(' and search ')) {
      const query = cmdLower.split(/ and search /i)[1].trim();
      if (query) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        setAiText(`> SEARCH\n> QUERY: ${query}\n> ACTION: Web Search`);
        speak(`Searching ${query}`);
        return;
      }
    }

    if (cmdLower.includes(' and play ')) {
      const query = cmdLower.split(/ and play /i)[1].trim();
      if (query) {
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
        setAiText(`> PLAY\n> QUERY: ${query}\n> ACTION: YouTube`);
        speak(`Playing ${query}`);
        return;
      }
    }

    if (cmdLower.startsWith('search ') && cmdLower.includes(' on youtube')) {
      const query = cmdLower.replace(/^search /i, '').replace(/ on youtube/i, '').trim();
      if (query) {
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
        setAiText(`> YOUTUBE SEARCH\n> QUERY: ${query}\n> STATUS: Opening...`);
        speak(`Searching ${query} on YouTube`);
        return;
      }
    }

    if (cmdLower.startsWith('search ')) {
      const query = cmdLower.replace(/^search /i, '');
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      setAiText(`> SEARCH\n> QUERY: ${query}\n> ACTION: Web Search`);
      speak(`Searching for ${query}`);
      return;
    }

    if (cmdLower.startsWith('play ') || cmdLower.includes(' play ')) {
      const query = cmdLower.replace(/.*play /i, '').trim();
      if (query) {
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
        setAiText(`> PLAY\n> QUERY: ${query}\n> ACTION: YouTube`);
        speak(`Playing ${query} on YouTube`);
        return;
      }
    }

    const openKeywords = ['open', 'go to', 'launch', 'start', 'show me'];
    const isOpenRequest = openKeywords.some(kw => cmdLower.startsWith(kw + ' ')); 

    for (const [key, value] of Object.entries(siteMap)) {
      if (cmdLower.includes(key) && (isOpenRequest || cmdLower.includes(' ' + key))) {
        window.open(value, "_blank");
        setAiText(`> LAUNCH\n> APP: ${key.toUpperCase()}\n> STATUS: Opening...`);
        speak(`Opening ${key}`);
        return;
      }
    }

    if (cmdLower.startsWith('find ') || cmdLower.startsWith('lookup ')) {
      const query = cmdLower.replace(/^(find |lookup )/i, '');
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      setAiText(`> FIND\n> QUERY: ${query}\n> ACTION: Search`);
      speak(`Searching for ${query}`);
      return;
    }

    if (data && data.response && data.response.length > 3) {
      const answer = data.response;
      setAiText(answer);
      speak(answer);
    } else {
      setAiText(`> SEARCH\n> QUERY: ${originalCommand}\n> ACTION: Web Search`);
      window.open(`https://www.google.com/search?q=${encodeURIComponent(originalCommand)}`, '_blank');
      speak(`Searching for ${originalCommand}`);
    }
  };

  const processInput = async (command) => {
    if (!command.trim()) return;
    
    const cmd = command.trim();
    setUserText(cmd);
    setInputText("");
    setAIProcessing(true);
    
    const data = await getGeminiResponse(cmd);
    
    if (data) {
      setAiText(data.response || "");
      handleCommand(data, cmd);
    }
    
    setAIProcessing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !AIProcessing) {
      processInput(inputText);
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMount = true;

    const startTimeout = setTimeout(() => {
      if (isMount && !isSpeakingRef.current && !isRecogizingRef.current) {
        try { recognition.start(); } catch(e) { if(e.name !== "InvalidStateError") console.error(e); }
      }
    }, 1000);

    recognition.onstart = () => { isRecogizingRef.current = true; setListening(true); };
    recognition.onend = () => { isRecogizingRef.current = false; setListening(false); if(isMount && !isSpeakingRef.current) setTimeout(() => { try { recognition.start(); } catch(e) {}}, 1000); };
    recognition.onerror = (event) => { isRecogizingRef.current = false; setListening(false); if(event.error !== "aborted" && isMount) setTimeout(() => { try { recognition.start(); } catch(e) {}}, 1000); };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length-1][0].transcript.trim();
      if (transcript.toLowerCase().includes(userData?.assistantName?.toLowerCase())) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        const cleanCommand = transcript.replace(new RegExp(userData.assistantName, 'gi'), '').trim();
        const data = await getGeminiResponse(cleanCommand);
        if (data) { handleCommand(data, cleanCommand); setAiText(data.response); }
      }
    };

    const greeting = new SpeechSynthesisUtterance(`Hello ${userData?.name}, what can I help you with?`);
    greeting.lang = 'hi-IN';
    window.speechSynthesis.speak(greeting);

    return () => { isMount = false; clearTimeout(startTimeout); recognition.stop(); };
  }, [userData?.assistantName]);

  return (
    <div className="w-full h-[100vh] bg-[#000] flex justify-center items-center overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-radial from-[#0a1a0a] via-[#000] to-[#000]"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,255,0,0.03) 0%, transparent 50%)` }}></div>
      </div>
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-full bg-[#0f0]/30" style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, animation: `pulse ${p.duration}s ease-in-out ${p.delay}s infinite` }} />
      ))}

      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="text-[#0f0]/60 font-mono text-xs">
          <p>TERMINAL: <span className="text-[#0f0]">ACTIVE</span></p>
          <p>ASSISTANT: {userData?.assistantName}</p>
        </div>
        <CgMenuRight className="lg:hidden text-[#0f0]/70 w-6 h-6 cursor-pointer" onClick={() => setHam(true)}/>
      </div>

      <div className={`fixed lg:hidden top-0 right-0 w-[280px] h-full bg-[#0a0a0a] z-30 p-4 transition-transform duration-300 ${ham?"translate-x-0":"translate-x-full"}`}>
        <RxCross1 className="text-[#0f0]/70 absolute top-4 right-4 w-5 h-5 cursor-pointer" onClick={() => setHam(false)}/>
        <div className="mt-12 space-y-2">
          <button className="w-full h-10 bg-[#0f0]/10 border border-[#0f0]/30 hover:bg-[#0f0]/20 text-[#0f0] font-mono text-sm flex items-center gap-2 px-3 rounded-sm" onClick={() => navigate("/customize")}>
            <IoSettings className="w-4 h-4" /> CONFIG
          </button>
          <button className="w-full h-10 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-mono text-sm flex items-center gap-2 px-3 rounded-sm" onClick={handleLogOut}>
            <IoMdLogOut className="w-4 h-4" /> TERMINATE
          </button>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-3 absolute top-4 right-4 z-10">
        <button className="flex items-center gap-2 h-9 px-3 bg-[#0f0]/10 border border-[#0f0]/30 hover:bg-[#0f0]/20 text-[#0f0] font-mono text-sm rounded-sm" onClick={() => navigate("/customize")}>
          <IoSettings className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2 h-9 px-3 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-mono text-sm rounded-sm" onClick={handleLogOut}>
          <IoMdLogOut className="w-4 h-4" />
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5 w-[90%] max-w-2xl">
        <div className="relative">
          <div className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-2 ${listening ? 'border-[#0f0] shadow-[0_0_30px_rgba(0,255,0,0.5)]' : 'border-[#0f0]/30'} transition-all duration-500`}>
            <img src={userData?.assistantImage} alt="" className="w-full h-full object-cover" />
          </div>
          {listening && (<div className="absolute inset-0 flex items-center justify-center"><div className="absolute w-20 h-20 border-2 border-[#0f0] rounded-full animate-ping opacity-50"></div></div>)}
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-[#0f0] text-xl font-mono font-bold flex items-center gap-2"><FaRobot className="text-[#0f0]" />{userData?.assistantName}</h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-[#0f0]/10 border border-[#0f0]/30 rounded-sm">
            {listening ? (<><FaMicrophone className="w-3 h-3 text-[#0f0] animate-pulse" /><span className="text-[#0f0] font-mono text-xs">RECEIVING...</span></>) : 
             isSpeaking ? (<><span className="w-2 h-2 bg-[#0f0] rounded-full animate-pulse"></span><span className="text-[#0f0] font-mono text-xs">TRANSMITTING...</span></>) :
             (<><FaMicrophoneSlash className="w-3 h-3 text-[#0f0]/50" /><span className="text-[#0f0]/50 font-mono text-xs">AWAITING INPUT</span></>)}
          </div>
        </div>

        {(userText || aiText) && (
          <div className="w-full space-y-2">
            {userText && (<div className="bg-[#0a0a0a] border border-[#0f0]/30 rounded-sm p-3"><p className="text-[#0f0]/50 font-mono text-xs mb-1">INPUT:</p><p className="text-[#0f0] font-mono">{userText}</p></div>)}
            {aiText && (<div className="bg-[#0f0]/10 border border-[#0f0]/30 rounded-sm p-3 whitespace-pre-wrap"><p className="text-[#0f0] font-mono text-xs mb-1">OUTPUT:</p><p className="text-[#0f0] font-mono whitespace-pre-wrap">{aiText}</p></div>)}
          </div>
        )}

        <div className="w-full relative">
          <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#0f0]/30 rounded-sm overflow-hidden">
            <FaTerminal className="ml-3 text-[#0f0]/50 w-4 h-4" />
            <input ref={inputRef} type="text" placeholder="Enter command or speak..." className="flex-1 h-11 bg-transparent text-[#0f0] font-mono placeholder-[#0f0]/30 px-2 text-sm focus:outline-none" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyPress} disabled={AIProcessing} />
            <button className="h-11 px-4 bg-[#0f0]/20 hover:bg-[#0f0]/30 text-[#0f0] transition-all disabled:opacity-50" onClick={() => processInput(inputText)} disabled={AIProcessing || !inputText.trim()}>
              {AIProcessing ? (<span className="animate-pulse">...</span>) : (<FaPaperPlane className="w-4 h-4" />)}
            </button>
          </div>
          <p className="text-[#0f0]/30 font-mono text-xs mt-1 ml-1">Press Enter to execute • Say "{userData?.assistantName}" to activate</p>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#0f0]/30 font-mono text-xs">v2.0 // {userData?.name?.toUpperCase()} // {new Date().toISOString().split('T')[0]}</div>
    </div>
  );
}

export default Home;