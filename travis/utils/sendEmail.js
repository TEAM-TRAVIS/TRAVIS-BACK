const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL_USERNAME,
    pass: process.env.SMTP_EMAIL_PASSWORD,
  },
});

async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL_USERNAME,
      to,
      subject,
      html,
    });
    console.log('이메일 전송 완료');
  } catch (error) {
    console.error('이메일 전송 오류:', error);
    throw error;
  }
}

module.exports = sendEmail;
