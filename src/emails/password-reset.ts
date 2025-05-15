import nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(name: string, email: string, resetUrl: string) {
  // Create a test account if no SMTP settings are provided
  const testAccount = await nodemailer.createTestAccount();

  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || testAccount.user,
      pass: process.env.EMAIL_PASSWORD || testAccount.pass,
    },
  });

  // Format the name for greeting
  const firstName = name ? name.split(' ')[0] : 'there';

  // Email content
  const mailOptions = {
    from: `"B'Dazzle Cafe" <${process.env.EMAIL_FROM || 'noreply@bdazzlecafe.com'}>`,
    to: email,
    subject: 'Reset Your Password - B\'Dazzle Cafe',
    text: `Hello ${firstName},

You requested to reset your password for your B'Dazzle Cafe account.

Please click the link below to reset your password:
${resetUrl}

This link will expire in 30 minutes.

If you did not request a password reset, please ignore this email or contact our support team if you have concerns.

Thank you,
B'Dazzle Cafe Team`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #8B5A2B;
      padding: 20px;
      text-align: center;
    }
    .header img {
      max-width: 150px;
    }
    .content {
      padding: 20px;
      background-color: #ffffff;
    }
    .button {
      display: inline-block;
      background-color: #F5C518;
      color: #8B5A2B;
      font-weight: bold;
      padding: 10px 20px;
      margin: 20px 0;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
    .expiry {
      font-size: 12px;
      color: #999999;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${process.env.NEXT_PUBLIC_APP_URL}/img/logo.png" alt="B'Dazzle Cafe" />
    </div>
    <div class="content">
      <h2>Hello ${firstName},</h2>
      <p>You recently requested to reset your password for your B'Dazzle Cafe account. Click the button below to reset it.</p>
      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      <p class="expiry">This password reset link is only valid for the next 30 minutes.</p>
      <p>If you did not request a password reset, please ignore this email or contact our support team if you have concerns.</p>
      <p>Thank you,<br />B'Dazzle Cafe Team</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} B'Dazzle Cafe. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);

  // If using Ethereal, log the preview URL
  if (!process.env.EMAIL_HOST) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }

  return info;
} 