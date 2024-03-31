import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from 'helmet';
import { ScoreRouter } from "./router/scoreboard";
import { ChallengeRouter } from "./router/challenges";
import authrouter from "./router/auth";
import adminRouter from "./admin/adminRouter";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from "swagger-jsdoc";

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

  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'PROJECT-0',
        version: '1.0.0',
        description: 'Documentation for the endpoint of the plateform project-0',
      },
    },
    apis: ['./router/*.ts'], // Paths to API files
  };
  
  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(helmet());  
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