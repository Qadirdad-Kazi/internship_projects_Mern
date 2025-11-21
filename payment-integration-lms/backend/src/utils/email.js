import nodemailer from 'nodemailer';
import logger from './logger.js';

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production: Use actual SMTP service
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Development: Use Ethereal for testing
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  }
};

// Send email function
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.FROM_NAME || 'Payment LMS'} <${process.env.FROM_EMAIL || 'noreply@paymentlms.com'}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const info = await transporter.sendMail(mailOptions);
    
    logger.info(`Email sent: ${info.messageId}`);
    
    if (process.env.NODE_ENV !== 'production') {
      logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return info;
  } catch (error) {
    logger.error('Email sending failed:', error);
    throw error;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h2 style="color: #333;">Welcome to Payment Integration LMS!</h2>
      <p>Hi ${user.name},</p>
      <p>Welcome to our learning platform! We're excited to have you on board.</p>
      <p>Here's what you can do:</p>
      <ul>
        <li>Browse our extensive course catalog</li>
        <li>Enroll in free courses immediately</li>
        <li>Purchase individual courses or get a premium subscription</li>
        <li>Track your learning progress</li>
      </ul>
      <p>Happy learning!</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Welcome to Payment Integration LMS',
    html
  });
};

// Send course purchase confirmation
export const sendPurchaseConfirmation = async (user, course, payment) => {
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h2 style="color: #28a745;">Purchase Confirmation</h2>
      <p>Hi ${user.name},</p>
      <p>Thank you for your purchase! You now have access to:</p>
      <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 5px;">
        <h3>${course.title}</h3>
        <p>Amount: $${payment.amount.value}</p>
        <p>Payment ID: ${payment.reference}</p>
      </div>
      <a href="${process.env.FRONTEND_URL}/courses/${course._id}/learn" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Start Learning
      </a>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: `Course Access Granted: ${course.title}`,
    html
  });
};