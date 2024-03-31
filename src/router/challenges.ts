import {SubmitChallenge,challengebyId,VersebyId,allVerses,checkVerseCompleted} from '../controllers/challengesController';
import express from "express";
import { middleware} from '../middleware/authuser';



export const ChallengeRouter= express.Router();

//all verses
ChallengeRouter.get('/api/verses',[middleware.Auth,middleware.limiter],allVerses)
//get all verse_id challenges
ChallengeRouter.get('/api/verse/:id/',[middleware.Auth,middleware.limiter],VersebyId)
//
ChallengeRouter.get('/api/verse/:verse_id/completed',[middleware.Auth,middleware.limiter],checkVerseCompleted)
//get by id
ChallengeRouter.get('/api/verse/:verse_id/challenges/:id',[middleware.Auth,middleware.limiter],challengebyId)
//submit & check flag
ChallengeRouter.post('/api/submit/:id',[middleware.Auth,middleware.limiter] ,SubmitChallenge)

