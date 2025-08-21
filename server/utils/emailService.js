const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Hum Gmail use kar rahe hain
    auth: {
      user: process.env.EMAIL_USER, // config.env se aayega
      pass: process.env.EMAIL_PASS, // config.env se aayega (App Password)
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: `Vision'25 Team <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // 3. Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.email}`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${options.email}:`, error);
    return false;
  }
};

// OTP bhejne ke liye ek specific function
const sendOTPEmail = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #007bff;">Vision'25 Verification Code</h2>
      <p>Please use the following One-Time Password (OTP) to complete your action.</p>
      <p style="background: #f0f0f0; padding: 10px 15px; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center;">${otp}</p>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <hr/>
      <p style="font-size: 12px; color: #777;">Thank you,<br/>Team Vision'25</p>
    </div>
  `;
  return await sendEmail({ email, subject: `Your OTP for Vision'25`, html });
};

// Welcome email bhejne ke liye ek specific function
const sendWelcomeEmail = async (email, userId) => {
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #28a745;">Welcome to Vision'25!</h2>
        <p>Your registration is complete. We are excited to have you with us.</p>
        <p>Your unique Vision ID is:</p>
        <p style="background: #f0f0f0; padding: 10px 15px; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center;">${userId}</p>
        <p>Please keep this ID safe. You will need it to log in and register for events.</p>
        <hr/>
        <p style="font-size: 12px; color: #777;">Thank you,<br/>Team Vision'25</p>
      </div>
    `;
    return await sendEmail({ email, subject: `Welcome to Vision'25! Your Vision ID`, html });
};


module.exports = { sendOTPEmail, sendWelcomeEmail };