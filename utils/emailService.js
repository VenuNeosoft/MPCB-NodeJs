const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: `"NeoSoft Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Your Secure OTP Code",
    text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent successfully!");
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

module.exports = { sendOtpEmail };
