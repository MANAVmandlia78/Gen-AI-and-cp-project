import express from 'express';
import { submitContactForm } from '../controllers/contactController.js';

const router = express.Router();

// POST /api/contact - Submit Contact Us form message (Public)
router.post('/', submitContactForm);

export default router;
