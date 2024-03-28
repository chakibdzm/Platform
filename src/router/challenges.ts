import {SubmitChallenge,challengebyId,VersebyId,allVerses} from '../controllers/challengesController';
import express from "express";
import { Auth} from '../middleware/authuser';



export const ChallengeRouter= express.Router();

//all verses
ChallengeRouter.get('/api/verses',Auth,)
//get all verse_id challenges
ChallengeRouter.get('/api/verse/:id/',Auth,VersebyId)
//get by id
ChallengeRouter.get('/api/challenges/:id',Auth,challengebyId)
//submit & check flag & update nbrbadge
ChallengeRouter.post('/api/submit',Auth ,SubmitChallenge)

