import express from 'express';
import { requireAdminRole ,adminController } from './adminController';
const adminRouter = express.Router();

// Route to get all users 
adminRouter.get('/users', requireAdminRole, adminController.getUsers);
adminRouter.get('/users/:userId', requireAdminRole,adminController.getUserDetails);



export default adminRouter;
