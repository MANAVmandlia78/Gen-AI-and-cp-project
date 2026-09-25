import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create Nodemailer Transporter with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const ADMIN_RECIPIENT = process.env.EMAIL_TO || process.env.EMAIL_USER || 'manavmandalia077@gmail.com';

/**
 * Base HTML Email Wrapper for Maharaja Tours & Travels
 */
function createEmailTemplate({ title, badgeText, badgeColor, introText, detailsTable, actionUrl, actionText }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; line-height: 1.6; }
    .email-wrapper { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0; }
    .email-header { background: #0f172a; padding: 32px 28px; text-align: center; color: #ffffff; border-bottom: 3px solid #f33f3f; }
    .brand-title { font-size: 22px; font-weight: 800; letter-spacing: 0.5px; margin: 0 0 6px 0; color: #ffffff; }
    .brand-title span { color: #f33f3f; font-style: italic; }
    .brand-subtitle { font-size: 13px; color: #94a3b8; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
    .email-body { padding: 32px 28px; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: ${badgeColor || '#fee2e2'}; color: ${badgeColor === '#fef3c7' ? '#92400e' : '#b91c1c'}; margin-bottom: 16px; }
    .headline { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0; }
    .intro { font-size: 14px; color: #64748b; margin: 0 0 24px 0; }
    .details-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; background: #f8fafc; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
    .details-table td { padding: 12px 16px; font-size: 13.5px; border-bottom: 1px solid #e2e8f0; }
    .details-table tr:last-child td { border-bottom: none; }
    .label-cell { font-weight: 600; color: #475569; width: 38%; background: #f1f5f9; }
    .value-cell { font-weight: 500; color: #0f172a; }
    .message-box { background: #ffffff; border: 1px solid #cbd5e1; border-left: 4px solid #f33f3f; padding: 14px; border-radius: 6px; font-size: 13.5px; color: #334155; margin: 8px 0; font-style: italic; }
    .action-btn-container { text-align: center; margin: 28px 0 12px 0; }
    .action-btn { display: inline-block; padding: 12px 28px; background: #f33f3f; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 14px; }
    .email-footer { background: #f8fafc; padding: 20px 28px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
    .email-footer a { color: #64748b; text-decoration: none; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-header">
      <h1 class="brand-title">Maharaja Tours <span>&amp; Travels</span></h1>
      <p class="brand-subtitle">Notification Alert System</p>
    </div>
    <div class="email-body">
      <span class="status-badge">${badgeText}</span>
      <h2 class="headline">${title}</h2>
      <p class="intro">${introText}</p>
      
      ${detailsTable}

      ${actionUrl ? `
      <div class="action-btn-container">
        <a href="${actionUrl}" class="action-btn">${actionText || 'Open Admin Dashboard'}</a>
      </div>` : ''}
    </div>
    <div class="email-footer">
      <p style="margin: 0 0 6px 0;">© ${new Date().getFullYear()} Maharaja Tours &amp; Travels, Junagadh, Gujarat.</p>
      <p style="margin: 0;">This is an automated notification sent directly to your administrative Gmail inbox.</p>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Send Booking Notification Email
 */
export async function sendBookingNotificationEmail(booking) {
  try {
    const detailsTable = `
      <table class="details-table">
        <tr>
          <td class="label-cell">Customer Name</td>
          <td class="value-cell"><strong>${booking.full_name || 'N/A'}</strong></td>
        </tr>
        <tr>
          <td class="label-cell">Email Address</td>
          <td class="value-cell"><a href="mailto:${booking.email}" style="color: #2563eb;">${booking.email || 'N/A'}</a></td>
        </tr>
        <tr>
          <td class="label-cell">Phone / WhatsApp</td>
          <td class="value-cell"><a href="tel:${booking.phone}" style="color: #2563eb; font-weight: 700;">${booking.phone || 'N/A'}</a></td>
        </tr>
        ${booking.package_title ? `
        <tr>
          <td class="label-cell">Selected Package</td>
          <td class="value-cell"><strong style="color: #f33f3f;">${booking.package_title}</strong></td>
        </tr>` : ''}
        <tr>
          <td class="label-cell">Pickup Location</td>
          <td class="value-cell">${booking.pickup_location || 'N/A'}</td>
        </tr>
        <tr>
          <td class="label-cell">Return Location</td>
          <td class="value-cell">${booking.return_location || 'N/A'}</td>
        </tr>
        <tr>
          <td class="label-cell">Pickup Date / Time</td>
          <td class="value-cell">${booking.pickup_date || 'N/A'}</td>
        </tr>
        <tr>
          <td class="label-cell">Return Date / Time</td>
          <td class="value-cell">${booking.return_date || 'N/A'}</td>
        </tr>
        ${booking.notes ? `
        <tr>
          <td class="label-cell">Special Requests</td>
          <td class="value-cell"><div class="message-box">${booking.notes}</div></td>
        </tr>` : ''}
        <tr>
          <td class="label-cell">Submission Time</td>
          <td class="value-cell">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</td>
        </tr>
      </table>
    `;

    const htmlContent = createEmailTemplate({
      title: 'New Holiday Booking Request',
      badgeText: 'New Booking Received',
      badgeColor: '#dcfce7',
      introText: `A customer has just submitted a new tour booking reservation on the Maharaja Tours website. Details are outlined below:`,
      detailsTable,
      actionUrl: 'http://localhost:5173/admin',
      actionText: 'View Bookings in Admin Panel'
    });

    const mailOptions = {
      from: `"Maharaja Tours & Travels" <${process.env.EMAIL_USER}>`,
      to: ADMIN_RECIPIENT,
      subject: `New Booking Request from ${booking.full_name} - Maharaja Tours`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[EmailService] Booking notification email sent successfully! MessageId:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EmailService] Error sending booking email:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send Package Details Enquiry Notification Email
 */
export async function sendEnquiryNotificationEmail(enquiry) {
  try {
    const detailsTable = `
      <table class="details-table">
        <tr>
          <td class="label-cell">Tour Package</td>
          <td class="value-cell"><strong style="color: #f33f3f;">${enquiry.package_title || 'General Package Enquiry'}</strong></td>
        </tr>
        <tr>
          <td class="label-cell">Customer Name</td>
          <td class="value-cell"><strong>${enquiry.name || 'N/A'}</strong></td>
        </tr>
        <tr>
          <td class="label-cell">Email Address</td>
          <td class="value-cell"><a href="mailto:${enquiry.email}" style="color: #2563eb;">${enquiry.email || 'N/A'}</a></td>
        </tr>
        <tr>
          <td class="label-cell">Phone Number</td>
          <td class="value-cell"><a href="tel:${enquiry.phone}" style="color: #2563eb; font-weight: 700;">${enquiry.phone || 'N/A'}</a></td>
        </tr>
        <tr>
          <td class="label-cell">Preferred Travel Window</td>
          <td class="value-cell">${enquiry.date1 || 'Flexible'} to ${enquiry.date2 || 'Flexible'}</td>
        </tr>
        <tr>
          <td class="label-cell">Inquiry Message</td>
          <td class="value-cell"><div class="message-box">${enquiry.message || 'No additional message provided.'}</div></td>
        </tr>
        <tr>
          <td class="label-cell">Submission Time</td>
          <td class="value-cell">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</td>
        </tr>
      </table>
    `;

    const htmlContent = createEmailTemplate({
      title: `Package Inquiry: ${enquiry.package_title || 'Tour Inquiry'}`,
      badgeText: 'Package Inquiry',
      badgeColor: '#fef3c7',
      introText: `A prospective traveler has inquired about <strong>${enquiry.package_title || 'a holiday package'}</strong>. Here are the submission details:`,
      detailsTable,
      actionUrl: 'http://localhost:5173/admin',
      actionText: 'View Enquiries in Admin Panel'
    });

    const mailOptions = {
      from: `"Maharaja Tours & Travels" <${process.env.EMAIL_USER}>`,
      to: ADMIN_RECIPIENT,
      subject: `New Package Enquiry: ${enquiry.package_title || 'Tour Inquiry'} - ${enquiry.name}`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[EmailService] Package enquiry notification email sent successfully! MessageId:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EmailService] Error sending enquiry email:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send Contact Us Form Notification Email
 */
export async function sendContactMessageNotificationEmail(contact) {
  try {
    const detailsTable = `
      <table class="details-table">
        <tr>
          <td class="label-cell">Full Name</td>
          <td class="value-cell"><strong>${contact.name || 'N/A'}</strong></td>
        </tr>
        <tr>
          <td class="label-cell">Email Address</td>
          <td class="value-cell"><a href="mailto:${contact.email}" style="color: #2563eb;">${contact.email || 'N/A'}</a></td>
        </tr>
        <tr>
          <td class="label-cell">Phone Number</td>
          <td class="value-cell"><a href="tel:${contact.phone}" style="color: #2563eb; font-weight: 700;">${contact.phone || 'Not provided'}</a></td>
        </tr>
        ${contact.destination ? `
        <tr>
          <td class="label-cell">Destination of Interest</td>
          <td class="value-cell"><strong style="color: #0f172a;">${contact.destination}</strong></td>
        </tr>` : ''}
        ${contact.travelDate ? `
        <tr>
          <td class="label-cell">Approx. Travel Date</td>
          <td class="value-cell">${contact.travelDate}</td>
        </tr>` : ''}
        <tr>
          <td class="label-cell">Subject</td>
          <td class="value-cell"><strong>${contact.subject || 'General Contact Message'}</strong></td>
        </tr>
        <tr>
          <td class="label-cell">Message Content</td>
          <td class="value-cell"><div class="message-box">${contact.message || 'N/A'}</div></td>
        </tr>
        <tr>
          <td class="label-cell">Submission Time</td>
          <td class="value-cell">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</td>
        </tr>
      </table>
    `;

    const htmlContent = createEmailTemplate({
      title: `Contact Message: ${contact.subject || 'New Inquiry'}`,
      badgeText: 'Contact Form Message',
      badgeColor: '#fee2e2',
      introText: `A visitor has submitted a new inquiry via the Contact Us form on the Maharaja Tours website.`,
      detailsTable,
      actionUrl: 'http://localhost:5173/admin',
      actionText: 'Open Admin Dashboard'
    });

    const mailOptions = {
      from: `"Maharaja Tours & Travels" <${process.env.EMAIL_USER}>`,
      to: ADMIN_RECIPIENT,
      subject: `Contact Form: ${contact.subject || 'New Message'} from ${contact.name}`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[EmailService] Contact message notification email sent successfully! MessageId:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EmailService] Error sending contact message email:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send New User Registration Notification Email (Bonus)
 */
export async function sendRegistrationNotificationEmail(user) {
  try {
    const detailsTable = `
      <table class="details-table">
        <tr>
          <td class="label-cell">User Full Name</td>
          <td class="value-cell"><strong>${user.name || 'N/A'}</strong></td>
        </tr>
        <tr>
          <td class="label-cell">Email Address</td>
          <td class="value-cell"><a href="mailto:${user.email}" style="color: #2563eb;">${user.email || 'N/A'}</a></td>
        </tr>
        <tr>
          <td class="label-cell">Phone Number</td>
          <td class="value-cell">${user.phone || 'Not provided'}</td>
        </tr>
        <tr>
          <td class="label-cell">Account Role</td>
          <td class="value-cell"><span style="text-transform: capitalize; font-weight: 700; color: #16a34a;">${user.role || 'Customer'}</span></td>
        </tr>
        <tr>
          <td class="label-cell">Registration Time</td>
          <td class="value-cell">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</td>
        </tr>
      </table>
    `;

    const htmlContent = createEmailTemplate({
      title: `New User Registration: ${user.name}`,
      badgeText: 'New Account Created',
      badgeColor: '#eff6ff',
      introText: `A new customer account has been registered on the Maharaja Tours database.`,
      detailsTable,
      actionUrl: 'http://localhost:5173/admin',
      actionText: 'View Users in Admin Panel'
    });

    const mailOptions = {
      from: `"Maharaja Tours & Travels" <${process.env.EMAIL_USER}>`,
      to: ADMIN_RECIPIENT,
      subject: `New User Registration: ${user.name} - Maharaja Tours`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[EmailService] User registration notification email sent! MessageId:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EmailService] Error sending registration email:', error.message);
    return { success: false, error: error.message };
  }
}

export default transporter;
