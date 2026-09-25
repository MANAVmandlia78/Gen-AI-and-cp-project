import pool from '../config/db.js';

/**
 * Get all registered users (Admin only)
 * GET /api/admin/users
 */
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, phone, role, created_at, updated_at FROM users ORDER BY created_at DESC'
    );

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving registered users.'
    });
  }
};

/**
 * Get dashboard statistics for Admin
 * GET /api/admin/stats
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [[userCount]] = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
    const [[customerCount]] = await pool.query("SELECT COUNT(*) as totalCustomers FROM users WHERE role = 'customer'");
    const [[bookingCount]] = await pool.query('SELECT COUNT(*) as totalBookings FROM bookings');
    const [[enquiryCount]] = await pool.query('SELECT COUNT(*) as totalEnquiries FROM enquiries');
    const [[messageCount]] = await pool.query('SELECT COUNT(*) as totalMessages FROM contact_messages');
    const [[blogCount]] = await pool.query('SELECT COUNT(*) as totalBlogs FROM blogs');

    // Recent registered users
    const [recentUsers] = await pool.query(
      'SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC LIMIT 5'
    );

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers: userCount.totalUsers || 0,
        totalCustomers: customerCount.totalCustomers || 0,
        totalBookings: bookingCount.totalBookings || 0,
        totalEnquiries: enquiryCount.totalEnquiries || 0,
        totalMessages: messageCount.totalMessages || 0,
        totalBlogs: blogCount.totalBlogs || 0
      },
      recentUsers
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving admin statistics.'
    });
  }
};

/**
 * Delete a user by ID (Admin only)
 * DELETE /api/admin/users/:id
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting self (admin)
    if (parseInt(id, 10) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.'
      });
    }

    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User successfully removed from database.'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting user.'
    });
  }
};

/**
 * Get all customer bookings (Admin only)
 * GET /api/admin/bookings
 */
export const getAllBookings = async (req, res) => {
  try {
    const [bookings] = await pool.query(
      `SELECT b.*, p.title as package_title 
       FROM bookings b 
       LEFT JOIN packages p ON b.package_id = p.id 
       ORDER BY b.created_at DESC`
    );

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving bookings.'
    });
  }
};

/**
 * Get all customer enquiries (Admin only)
 * GET /api/admin/enquiries
 */
export const getAllEnquiries = async (req, res) => {
  try {
    const [enquiries] = await pool.query(
      `SELECT e.*, p.title as package_title 
       FROM enquiries e 
       LEFT JOIN packages p ON e.package_id = p.id 
       ORDER BY e.created_at DESC`
    );

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving enquiries.'
    });
  }
};
