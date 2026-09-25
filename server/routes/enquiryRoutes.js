import express from 'express';
import { createEnquiry } from '../controllers/enquiryController.js';

const router = express.Router();

// POST /api/enquiries - Submit tour package enquiry (Public)
router.post('/', createEnquiry);

export default router;
