import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { ScoreRouter } from "./router/scoreboard";
import { ChallengeRouter } from "./router/challenges";
import authrouter from "./router/auth";
import adminRouter from "./admin/adminRouter";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app=express();

const corsOptions = {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST','PUT'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    Credential: true,
    optionSuccessStatus:200,
  };
  
app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.use("/",ScoreRouter);
app.use("/",ChallengeRouter);
app.use(authrouter);
app.use(adminRouter);

app.listen(PORT,() =>  {
    console.log('listening on port '+PORT);
})