import axios from "axios";

const cache = new Map();
const CACHE_TIMEOUT = 5 * 60 * 1000;

const geminiResponse = async (command, assistantName, userName) => {
  const cacheKey = command.toLowerCase().trim();
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TIMEOUT) {
    console.log("Using cached response for:", command);
    return cached.data;
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = `You are ${assistantName}, a helpful AI assistant created by ${userName}.
Give a direct, short answer to this question or do what asked:
"${command}"

Respond with JSON only:
{"type": "answer", "response": "your direct answer"}`;

    const result = await axios.post(apiUrl, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 1.0,
        maxOutputTokens: 400
      }
    }, { timeout: 15000 });

    if (!result.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return JSON.stringify({
        type: "answer",
        response: `Let me help with that: ${command}`
      });
    }

    const response = result.data.candidates[0].content.parts[0].text;
    cache.set(cacheKey, { data: response, timestamp: Date.now() });
    
    if (cache.size > 50) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return response;

  } catch(error) {
    console.log("API Error:", error.message);
    
    if (error.response?.status === 429) {
      return JSON.stringify({
        type: "answer",
        response: `I'm getting too many requests. Please wait a moment and try again.`
      });
    }
    
    return JSON.stringify({
      type: "answer",
      response: `I had an issue processing "${command}". Can you try again?`
    });
  }
};

export default geminiResponse;