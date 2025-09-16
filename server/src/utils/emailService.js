import nodemailer from "nodemailer";
import crypto from "crypto";

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // إنشاء token تفعيل
  generateVerificationToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  // إرسال إيميل التفعيل
  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/admin/verify-email/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@sandymacrame.com",
      to: email,
      subject: "تفعيل حساب الإدارة - ساندي مكرمية",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #8b5f8c; color: white; padding: 20px; text-align: center;">
            <h1>ساندي مكرمية</h1>
            <h2>تفعيل حساب الإدارة</h2>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h3>مرحباً،</h3>
            <p>تم إنشاء حساب إدارة جديد بهذا الإيميل. لتفعيل الحساب واستكمال عملية التسجيل، يرجى الضغط على الرابط أدناه:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: #8b5f8c; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                تفعيل الحساب
              </a>
            </div>
            
            <p><strong>هام:</strong> هذا الرابط صالح لمدة 24 ساعة فقط.</p>
            
            <p>إذا لم تكن قد طلبت إنشاء هذا الحساب، يرجى تجاهل هذا الإيميل.</p>
            
            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              هذا إيميل تلقائي، يرجى عدم الرد عليه.
            </p>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export default new EmailService();
