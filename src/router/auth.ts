
import express from 'express';
import { signin } from '../controllers/userController';
import { signup } from '../controllers/userController';

const authrouter = express.Router();

authrouter.post('auth/signup', signup);
authrouter.post('auth/signin', signin);

export default authrouter;


/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Sign in a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User signed in successfully
 *         headers:
 *           Authorization:
 *             schema:
 *               type: string
 *               format: Bearer {token}
 *       '401':
 *         description: Invalid credentials
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
