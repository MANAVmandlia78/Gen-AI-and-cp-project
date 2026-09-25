import pool from '../config/db.js';
import { sendBookingNotificationEmail } from '../services/emailService.js';

/**
 * Submit a new tour booking
 * POST /api/bookings
 */
export const createBooking = async (req, res) => {
  try {
    const {
      package_id,
      user_id,
      fullName,
      full_name,
      email,
      phone,
      pickupLocation,
      pickup_location,
      returnLocation,
      return_location,
      pickupDateTime,
      pickup_date,
      returnDateTime,
      return_date,
      notes
    } = req.body;

    const customerName = (fullName || full_name || '').trim();
    const customerEmail = (email || '').trim().toLowerCase();
    const customerPhone = (phone || '').trim();
    const pickupLoc = pickupLocation || pickup_location || '';
    const returnLoc = returnLocation || return_location || '';
    const pickupDt = pickupDateTime || pickup_date || '';
    const returnDt = returnDateTime || return_date || '';

    if (!customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone number are required to submit a booking.'
      });
    }

    let packageTitle = '';
    const parsedPkgId = package_id ? parseInt(package_id, 10) : null;
    const parsedUserId = user_id ? parseInt(user_id, 10) : (req.user ? req.user.id : null);

    if (parsedPkgId) {
      try {
        const [[pkg]] = await pool.query('SELECT title FROM packages WHERE id = ?', [parsedPkgId]);
        if (pkg) {
          packageTitle = pkg.title;
        }
      } catch (err) {
        console.warn('[Booking] Package title lookup failed:', err.message);
      }
    }

    // Insert into MySQL bookings table
    const [result] = await pool.query(
      `INSERT INTO bookings 
        (user_id, package_id, full_name, email, phone, pickup_location, return_location, pickup_date, return_date, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        parsedUserId,
        parsedPkgId,
        customerName,
        customerEmail,
        customerPhone,
        pickupLoc,
        returnLoc,
        pickupDt,
        returnDt,
        notes || null
      ]
    );

    const bookingId = result.insertId;

    // Send email notification to Admin Gmail via Nodemailer
    const emailData = {
      booking_id: bookingId,
      full_name: customerName,
      email: customerEmail,
      phone: customerPhone,
      package_title: packageTitle,
      pickup_location: pickupLoc,
      return_location: returnLoc,
      pickup_date: pickupDt,
      return_date: returnDt,
      notes: notes || ''
    };

    // Send asynchronously without blocking response
    sendBookingNotificationEmail(emailData).catch(err => {
      console.error('[Booking] Email notification background error:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Booking submitted successfully! Our team will contact you shortly.',
      bookingId
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit booking reservation. Please try again later.'
    });
  }
};
