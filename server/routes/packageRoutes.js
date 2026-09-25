import express from 'express';
import {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
} from '../controllers/packageController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes: Anyone can see packages
router.get('/', getAllPackages);
router.get('/:id', getPackageById);

// Admin-only routes: Only the Admin can create, edit, or delete packages
router.post('/', verifyToken, isAdmin, createPackage);
router.put('/:id', verifyToken, isAdmin, updatePackage);
router.delete('/:id', verifyToken, isAdmin, deletePackage);

export default router;
