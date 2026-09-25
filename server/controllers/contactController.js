import pool from '../config/db.js';
import { sendContactMessageNotificationEmail } from '../services/emailService.js';

/**
 * Submit Contact Us form message
 * POST /api/contact
 */
export const submitContactForm = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      travelDate,
      destination,
      subject,
      message
    } = req.body;

    const contactName = (name || '').trim();
    const contactEmail = (email || '').trim().toLowerCase();
    const contactPhone = (phone || '').trim();
    const contactSubject = (subject || 'General Inquiry').trim();
    const contactMessage = (message || '').trim();

    if (!contactName || !contactEmail || !contactMessage) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.'
      });
    }

    // 1. Save into contact_messages table
    try {
      await pool.query(
        `INSERT INTO contact_messages (name, email, phone, subject, message, status)
         VALUES (?, ?, ?, ?, ?, 'unread')`,
        [
          contactName,
          contactEmail,
          contactPhone || null,
          `[${destination || 'General'}] ${contactSubject}`,
          contactMessage
        ]
      );
    } catch (dbErr) {
      console.warn('[Contact] contact_messages insert warning:', dbErr.message);
    }

    // 2. Also save into enquiries table so it shows up in Admin Panel's Enquiries tab
    try {
      await pool.query(
        `INSERT INTO enquiries (name, email, phone, date1, message, status)
         VALUES (?, ?, ?, ?, ?, 'unread')`,
        [
          contactName,
          contactEmail,
          contactPhone || 'Not provided',
          travelDate || 'Flexible',
          `[Destination: ${destination || 'General'}] [Subject: ${contactSubject}] ${contactMessage}`
        ]
      );
    } catch (enquiryErr) {
      console.warn('[Contact] enquiries insert warning:', enquiryErr.message);
    }

    // 3. Send email notification to Admin Gmail via Nodemailer
    const emailData = {
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      destination: destination || '',
      travelDate: travelDate || '',
      subject: contactSubject,
      message: contactMessage
    };

    sendContactMessageNotificationEmail(emailData).catch(err => {
      console.error('[Contact] Email notification background error:', err);
    });

    return res.status(200).json({
      success: true,
      message: 'Your message has been received! Our travel team will contact you shortly.'
    });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit message. Please try again later.'
    });
  }
};
