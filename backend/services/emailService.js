import SibApiV3Sdk from "@sendinblue/client";
import dotenv from "dotenv";
// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
  try {
    // Initialize API client
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // Set API key correctly
    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 32px; font-weight: bold; color: #9333ea; }
        .otp-box { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 5px; margin: 10px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TeaBreak ☕</div>
          <p>Your OTP for verification</p>
        </div>
        <div class="otp-box">
          <p>Your OTP Code:</p>
          <div class="otp-code">${otp}</div>
          <p style="font-size: 14px; margin-top: 10px;">Valid for 10 minutes</p>
        </div>
        <p>Use this code to complete your signup/login process.</p>
        <p><strong>Never share this code with anyone!</strong></p>
        <div class="footer">
          <p>If you didn't request this code, please ignore this email.</p>
          <p>© 2024 TeaBreak. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.sender = {
      email: "1rn20is099.nitishkrmaurya@gmail.com",
      name: "TeaBreak",
    };
    sendSmtpEmail.subject = "Your TeaBreak OTP Code";
    sendSmtpEmail.htmlContent = htmlContent;

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent successfully:", result);
    return true;
  } catch (error) {
    console.error(
      "❌ Email send error:",
      error.response?.body || error.message
    );
    throw new Error("Failed to send email");
  }
};
