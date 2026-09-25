import pool from '../config/db.js';
import { sendEnquiryNotificationEmail } from '../services/emailService.js';

/**
 * Submit a package enquiry
 * POST /api/enquiries
 */
export const createEnquiry = async (req, res) => {
  try {
    const {
      package_id,
      package_title,
      name,
      email,
      phone,
      date1,
      date2,
      message
    } = req.body;

    const customerName = (name || '').trim();
    const customerEmail = (email || '').trim().toLowerCase();
    const customerPhone = (phone || '').trim();
    const msg = (message || '').trim();

    if (!customerName || !customerEmail || !customerPhone || !msg) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and inquiry message are required.'
      });
    }

    let pkgTitle = package_title || '';
    const parsedPkgId = package_id ? parseInt(package_id, 10) : null;

    if (parsedPkgId && !pkgTitle) {
      try {
        const [[pkg]] = await pool.query('SELECT title FROM packages WHERE id = ?', [parsedPkgId]);
        if (pkg) {
          pkgTitle = pkg.title;
        }
      } catch (err) {
        console.warn('[Enquiry] Package title lookup error:', err.message);
      }
    }

    // Insert into MySQL enquiries table
    const [result] = await pool.query(
      `INSERT INTO enquiries (package_id, name, email, phone, date1, date2, message, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'unread')`,
      [
        parsedPkgId,
        customerName,
        customerEmail,
        customerPhone,
        date1 || null,
        date2 || null,
        msg
      ]
    );

    const enquiryId = result.insertId;

    // Send email notification to Admin Gmail via Nodemailer
    const emailData = {
      enquiry_id: enquiryId,
      package_title: pkgTitle || 'General Tour Package Enquiry',
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      date1: date1 || 'Not specified',
      date2: date2 || 'Not specified',
      message: msg
    };

    sendEnquiryNotificationEmail(emailData).catch(err => {
      console.error('[Enquiry] Email notification background error:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! Our travel specialist will get in touch with you shortly.',
      enquiryId
    });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit enquiry. Please try again later.'
    });
  }
};
