import {SubmitChallenge,challengebyId,VersebyId,allVerses,checkVerseCompleted} from '../controllers/challengesController';
import express from "express";
import { middleware} from '../middleware/authuser';



export const ChallengeRouter= express.Router();

//all verses
ChallengeRouter.get('/api/verses',[middleware.Auth],allVerses)
//get all verse_id challenges
ChallengeRouter.get('/api/verse/:id/',[middleware.Auth],VersebyId)
//
ChallengeRouter.get('/api/verse/:verse_id/completed',[middleware.Auth],checkVerseCompleted)
//get by id
ChallengeRouter.get('/api/verse/:verse_id/challenges/:id',[middleware.Auth],challengebyId)
//submit & check flag
ChallengeRouter.post('/api/submit/:id',[middleware.Auth,] ,SubmitChallenge)


/**
 * @swagger
 * /api/verses:
 *   get:
 *     summary: Get all verses
 *     tags:
 *       - Challenges
 *     responses:
 *       '200':
 *         description: A list of verses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Verse'
 *       '500':
 *         description: Internal server error
 *
 * 
 * /api/verse/{id}:
 *   get:
 *     summary: Get challenges by verse ID
 *     tags:
 *       - Challenges
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the verse
 *     responses:
 *       '200':
 *         description: A list of challenges for the specified verse
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Challenge'
 *       '404':
 *         description: Verse not found
 *       '500':
 *         description: Internal server error
 *
 * 
 * 
 * /api/verse/{verse_id}/completed:
 *   get:
 *     summary: Check if verse is completed
 *     tags:
 *       - Challenges
 *     parameters:
 *       - in: path
 *         name: verse_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the verse
 *     responses:
 *       '200':
 *         description: Message indicating verse completion
 *       '404':
 *         description: Verse not found or not completed
 *       '500':
 *         description: Internal server error
 *
 * 
 * 
 * /api/verse/{verse_id}/challenges/{id}:
 *   get:
 *     summary: Get challenge by ID
 *     tags:
 *       - Challenges
 *     parameters:
 *       - in: path
 *         name: verse_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the verse
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the challenge
 *     responses:
 *       '200':
 *         description: Challenge details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Challenge'
 *       '404':
 *         description: Challenge not found
 *       '500':
 *         description: Internal server error
 *
 * 
 * 
 * /api/submit/{id}:
 *   post:
 *     summary: Submit a challenge
 *     tags:
 *       - Challenges
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the challenge
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flag:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Congratulations message if flag is correct
 *       '404':
 *         description: Challenge not found
 *       '500':
 *         description: Internal server error
 **/