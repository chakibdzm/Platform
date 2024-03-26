
import express from 'express';
import { signin } from '../controllers/userController';
import { signup } from '../controllers/userController';

const authrouter = express.Router();

authrouter.post('/signup', signup);
authrouter.post('/signin', signin);

export default authrouter;
