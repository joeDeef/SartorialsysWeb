import express from 'express';
import * as authController from '../controllers/authController.js'

const router = express.Router();

router.post("/login", authController.loggingUser);

export default router;