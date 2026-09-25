import express from 'express';
import {
  getAllUsers,
  getDashboardStats,
  deleteUser,
  getAllBookings,
  getAllEnquiries
} from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes are strictly guarded by verifyToken AND isAdmin
router.use(verifyToken, isAdmin);

// User management endpoints
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Dashboard overview & stats
router.get('/stats', getDashboardStats);

// Customer bookings & enquiries
router.get('/bookings', getAllBookings);
router.get('/enquiries', getAllEnquiries);

export default router;
