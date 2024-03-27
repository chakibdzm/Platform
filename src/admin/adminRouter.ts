import express from 'express';
import { requireAdminRole ,adminController } from './adminController';
const adminRouter = express.Router();

adminRouter.get('/users', requireAdminRole, adminController.getUsers);
adminRouter.get('/users/:userId', requireAdminRole,adminController.getUserDetails);

adminRouter.post('/challenge',requireAdminRole,adminController.createChallenge)
adminRouter.put('/challenge/:id',requireAdminRole, adminController.updateChallenge);
adminRouter.delete('/challenge/:id',requireAdminRole, adminController.deleteChallenge);
adminRouter.get('/challenge',requireAdminRole, adminController.getAllChallenges);
adminRouter.get('/challenge/:challengeId',requireAdminRole, adminController.getChallengeDetails);





export default adminRouter;
