import express from 'express';
import { login } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/register', () => {});


export default authRouter;