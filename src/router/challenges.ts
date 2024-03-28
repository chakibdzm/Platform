import {SubmitChallenge,challengebyId,VersebyId,allVerses} from '../controllers/challengesController';
import express from "express";
import { middleware} from '../middleware/authuser';



export const ChallengeRouter= express.Router();

//all verses
ChallengeRouter.get('/api/verses',[middleware.Auth,middleware.limiter],allVerses)
//get all verse_id challenges
ChallengeRouter.get('/api/verse/:id/',[middleware.Auth,middleware.limiter],VersebyId)
//get by id
ChallengeRouter.get('/api/challenges/:id',[middleware.Auth,middleware.limiter],challengebyId)
//submit & check flag & update nbrbadge
ChallengeRouter.post('/api/submit',[middleware.Auth,middleware.limiter] ,SubmitChallenge)

