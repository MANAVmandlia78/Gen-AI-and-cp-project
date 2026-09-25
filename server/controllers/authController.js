import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import dotenv from 'dotenv';
import { sendRegistrationNotificationEmail } from '../services/emailService.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'maharaja_travels_jwt_secret_key_2026_secure';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Register a new customer
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user (role is always 'customer' for public registration)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), normalizedEmail, hashedPassword, phone ? phone.trim() : null, 'customer']
    );

    const userId = result.insertId;

    // Generate JWT token
    const token = jwt.sign(
      {
        id: userId,
        email: normalizedEmail,
        name: name.trim(),
        role: 'customer'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Send email notification to Admin Gmail via Nodemailer
    sendRegistrationNotificationEmail({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : '',
      role: 'customer'
    }).catch(err => {
      console.error('[Auth] Registration email notification background error:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone || null,
        role: 'customer'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again later.'
    });
  }
};

/**
 * Login user (Customer or Admin)
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const [users] = await pool.query(
      'SELECT id, name, email, password, phone, role FROM users WHERE email = ?',
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const user = users[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again later.'
    });
  }
};

/**
 * Get current logged in user details
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.status(200).json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving user data.'
    });
  }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, password, currentPassword } = req.body;
    const userId = req.user.id;

    // If changing password, verify current password
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to set a new password.'
        });
      }

      const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
      const isMatch = await bcrypt.compare(currentPassword, users[0].password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    }

    if (name || phone !== undefined) {
      const updates = [];
      const values = [];

      if (name) {
        updates.push('name = ?');
        values.push(name.trim());
      }
      if (phone !== undefined) {
        updates.push('phone = ?');
        values.push(phone ? phone.trim() : null);
      }

      values.push(userId);
      await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    const [updatedUsers] = await pool.query(
      'SELECT id, name, email, phone, role FROM users WHERE id = ?',
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUsers[0]
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating profile.'
    });
  }
};
