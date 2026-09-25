import express from 'express';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Admin-protected routes
router.post('/', verifyToken, isAdmin, createBlog);
router.put('/:id', verifyToken, isAdmin, updateBlog);
router.delete('/:id', verifyToken, isAdmin, deleteBlog);

export default router;
