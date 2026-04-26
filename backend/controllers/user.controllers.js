import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/user.model.js"
import moment from "moment";


export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId

    const user = await User.findById(userId).select("-password");

    if(!user) {
        return res.status(400).json({message: "user not found"});
    }

    return res.status(200).json(user);
  } catch(error) {
    return res.status(400).json({message: "get current user error"});
  }
}



export const updateAssistant = async (req, res) => {
  try {
    const {assistantName, imageUrl} = req.body;
    
    let assistantImage;

    if(req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path)
    } else if(imageUrl){
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(req.userId, {
      assistantName, assistantImage
    }, {new: true}).select("-password")

    return res.status(200).json(user)

  } catch(error) {
    return res.status(400).json({message: "Updata assistant error"});
  }
}


const urlMap = {
  youtube: 'https://www.youtube.com',
  google: 'https://www.google.com',
  gmail: 'https://mail.google.com',
  instagram: 'https://www.instagram.com',
  facebook: 'https://www.facebook.com',
  linkedin: 'https://www.linkedin.com',
  twitter: 'https://twitter.com',
  whatsapp: 'https://web.whatsapp.com',
  spotify: 'https://open.spotify.com',
  weather: 'https://www.google.com/search?q=weather',
  calculator: 'https://www.google.com/search?q=calculator',
  maps: 'https://www.google.com/maps',
  youtube: 'https://www.youtube.com',
  news: 'https://news.google.com',
  amazon: 'https://www.amazon.com',
  flipkart: 'https://www.flipkart.com',
  chatgpt: 'https://chat.openai.com',
  netflix: 'https://www.netflix.com',
  prime: 'https://www.primevideo.com',
  disney: 'https://www.disneyplus.com',
  github: 'https://github.com',
  code: 'https://www.codewithharry.com',
  w3schools: 'https://www.w3schools.com',
  geeksforgeeks: 'https://www.geeksforgeeks.org',
};

export const askToAssistant = async(req, res) => {
  try {
    const {command} = req.body;
    if (!command) {
      return res.status(400).json({ response: "No command provided" });
    }

    const user = await User.findById(req.userId);
    user.history.push(command)
    await user.save()

    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse(command, assistantName, userName);

    if (!result) {
      return res.json({
        type: "general",
        userInput: command,
        response: "I'm here to help. What would you like me to do?"
      });
    }

    let gemResult;
    try {
      const jsonMatch = result.match(/{[\s\S]*}/)
      if (jsonMatch) {
        gemResult = JSON.parse(jsonMatch[0]);
      }
    } catch(e) {
      console.log("JSON parse error:", e);
    }

    if (!gemResult) {
      return res.json({
        type: "general",
        userInput: command,
        response: "Hello! I'm here to help. What would you like me to do?"
      });
    }

    const type = gemResult.type?.toLowerCase();
    const responseText = gemResult.response || gemResult.response_message;

    if (urlMap[type]) {
      let targetUrl = urlMap[type];
      
      if (type === 'google' || type === 'youtube') {
        const searchQuery = encodeURIComponent(gemResult.userInput || command);
        targetUrl = type === 'google' 
          ? `https://www.google.com/search?q=${searchQuery}`
          : `https://www.youtube.com/results?search_query=${searchQuery}`;
      }
      
      return res.json({
        type,
        userInput: gemResult.userInput,
        response: responseText || `Opening ${type} for you.`,
        url: targetUrl
      });
    }

    return res.json({
      type: type || "general",
      userInput: gemResult.userInput,
      response: responseText || "How can I help you?"

    });

  } catch(error) {
    console.log("askToAssistant error:", error.message);
    return res.json({
      type: "general",
      userInput: "",
      response: "I'm here to help. What would you like me to do?"
    });
  }
}