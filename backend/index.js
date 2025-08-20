import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import geminiResponse from "./gemini.js";


const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser())



app.get("/",  (req, res) => {
  res.send("Start...");        
});


app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)



// app.get("/", async (req, res) => {
//   let prompt = req.query.prompt;

//   let data = await geminiResponse(prompt)
//   res.json(data);

   
// })



app.listen(port, () => {
     connectDB();
    console.log("Server started");
})




