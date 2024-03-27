import express from 'express';
import { requireAdminRole ,adminController } from './adminController';
const adminRouter = express.Router();

// Route to get all users 
adminRouter.get('/users', requireAdminRole, adminController.getUsers);



export default adminRouter;
