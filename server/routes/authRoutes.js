import express from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (any authenticated user)
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);

export default router;
