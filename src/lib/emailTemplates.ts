// This is a simplified version of the password reset email template
// In a real implementation, you would use a proper email templating system

/**
 * Creates an HTML email template for password reset
 * @param name User's name
 * @param resetLink URL to reset password
 * @returns HTML string for email content
 */
export function createPasswordResetEmailTemplate(name: string, resetLink: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your B'Dazzle Cafe password</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      max-width: 150px;
      margin: 0 auto;
    }
    h1 {
      color: #6F4E37;
      font-size: 24px;
      margin: 20px 0;
      text-align: center;
    }
    .content {
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .button {
      display: inline-block;
      background-color: #6F4E37;
      color: white !important;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 5px;
      font-weight: bold;
      margin: 20px 0;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #8898aa;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
    .link {
      color: #6F4E37;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://b-dazzle-cafe.vercel.app/img/logo.png" alt="B'Dazzle Cafe" class="logo">
      <h1>Password Reset Request</h1>
    </div>
    
    <div class="content">
      <p>Hello ${name},</p>
      
      <p>We received a request to reset your password for your B'Dazzle Cafe account. If you didn't make this request, you can safely ignore this email.</p>
      
      <p>To reset your password, click the button below. This link will expire in 30 minutes.</p>
      
      <div class="button-container">
        <a href="${resetLink}" class="button">Reset your password</a>
      </div>
      
      <p>If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
      
      <p><a href="${resetLink}" class="link">${resetLink}</a></p>
      
      <p>Thank you for choosing B'Dazzle Cafe!</p>
    </div>
    
    <div class="footer">
      © 2025 B'Dazzle Cafe. All rights reserved.<br>
      Manila, Philippines
    </div>
  </div>
</body>
</html>
  `;
}