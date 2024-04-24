import express from 'express';
import { requireAdminRole ,adminController } from './adminController';
const adminRouter = express.Router();

adminRouter.get('/users', requireAdminRole, adminController.getUsers);
adminRouter.get('/users/:userId', requireAdminRole,adminController.getUserDetails);

adminRouter.post('/challenge',requireAdminRole,adminController.createChallenge)
adminRouter.patch('/challenge/:id',requireAdminRole, adminController.updateChallenge);
adminRouter.delete('/challenge/:id',requireAdminRole, adminController.deleteChallenge);
adminRouter.get('/challenge',requireAdminRole, adminController.getAllChallenges);
adminRouter.get('/challenge/:challengeId',requireAdminRole, adminController.getChallengeDetails);
adminRouter.post('/enbaleChallenge',requireAdminRole,adminController.enableChallengesPerWave)

adminRouter.get('/verse',requireAdminRole, adminController.getAllVerses);
adminRouter.get('/verse/:id',requireAdminRole, adminController.getVerseById);










export default adminRouter;
