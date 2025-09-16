import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import db, { fn } from "../../db/knex.js";
import emailService from "../../utils/emailService.js";

const { sign } = jwt;
class AuthService {
  // تحقق من وجود أي admin
  static async hasAnyAdmin() {
    const [result] = await db("admin_users").count("* as count");
    return parseInt(result.count) > 0;
  }

  // إنشاء أول حساب إدارة (غير مفعل)
  static async createFirstAdmin(email, password) {
    try {
      // تحقق أنه لا يوجد أي admin
      const hasAdmin = await this.hasAnyAdmin();
      if (hasAdmin) {
        throw new Error("Admin account already exists");
      }

      // hash كلمة المرور
      const passwordHash = await hash(password, 10);

      // إنشاء token التفعيل
      const verificationToken = emailService.generateVerificationToken();
      const verificationExpiresAt = new Date();
      verificationExpiresAt.setHours(verificationExpiresAt.getHours() + 24); // 24 ساعة

      // إنشاء الحساب
      const [userId] = await db("admin_users").insert({
        email,
        password_hash: passwordHash,
        role: "owner",
        email_verified: false,
        verification_token: verificationToken,
        verification_sent_at: fn.now(),
        verification_expires_at: verificationExpiresAt,
        created_at: fn.now(),
        updated_at: fn.now(),
      });

      // إرسال إيميل التفعيل
      await emailService.sendVerificationEmail(email, verificationToken);

      return {
        id: userId,
        email,
        message: "تم إنشاء الحساب. يرجى التحقق من إيميلك لتفعيل الحساب.",
      };
    } catch (error) {
      throw error;
    }
  }

  // تفعيل الحساب
  static async verifyEmail(token) {
    try {
      const user = await db("admin_users")
        .where("verification_token", token)
        .where("verification_expires_at", ">", new Date())
        .where("email_verified", false)
        .first();

      if (!user) {
        throw new Error("Invalid or expired verification token");
      }

      // تفعيل الحساب
      await db("admin_users").where("id", user.id).update({
        email_verified: true,
        verification_token: null,
        verification_sent_at: null,
        verification_expires_at: null,
        updated_at: fn.now(),
      });

      return {
        success: true,
        message: "تم تفعيل الحساب بنجاح. يمكنك الآن تسجيل الدخول.",
      };
    } catch (error) {
      throw error;
    }
  }

  // تسجيل الدخول (مع التحقق من التفعيل)
  static async login(email, password) {
    try {
      const user = await db("admin_users").where("email", email).first();

      if (!user) {
        throw new Error("Invalid credentials");
      }

      // تحقق من تفعيل الإيميل
      if (!user.email_verified) {
        throw new Error("Please verify your email before logging in");
      }

      // تحقق من كلمة المرور
      const isPasswordValid = await compare(password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // تحديث آخر دخول
      await db("admin_users").where("id", user.id).update({
        last_login_at: fn.now(),
        updated_at: fn.now(),
      });

      // إنشاء JWT
      const token = sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          last_login_at: new Date(),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async changePassword(userId, currentPassword, newPassword) {
    try {
      // جلب المستخدم
      const user = await db("admin_users").where("id", userId).first();

      if (!user) {
        throw new Error("User not found");
      }

      // التحقق من كلمة المرور الحالية
      const isCurrentPasswordValid = await compare(
        currentPassword,
        user.password_hash
      );
      if (!isCurrentPasswordValid) {
        throw new Error("Invalid current password");
      }

      // hash كلمة المرور الجديدة
      const newPasswordHash = await hash(newPassword, 10);

      // تحديث كلمة المرور
      await db("admin_users").where("id", userId).update({
        password_hash: newPasswordHash,
        updated_at: fn.now(),
      });

      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
