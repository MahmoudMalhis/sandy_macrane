import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import db, { fn } from "../../db/knex";

class AuthService {
  static async login(email, password) {
    try {
      // Find user by email
      const user = await db("admin_users").where("email", email).first();

      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Check password
      const isPasswordValid = await compare(
        password,
        user.password_hash
      );
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // Update last login
      await db("admin_users").where("id", user.id).update({
        last_login_at: fn.now(),
        updated_at: fn.now(),
      });

      // Generate JWT token
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

  static async createAdmin(email, password, role = "editor") {
    try {
      // Check if user already exists
      const existingUser = await db("admin_users")
        .where("email", email)
        .first();

      if (existingUser) {
        throw new Error("User already exists");
      }

      // Hash password
      const saltRounds = 10;
      const passwordHash = await hash(password, saltRounds);

      // Create user
      const [userId] = await db("admin_users").insert({
        email,
        password_hash: passwordHash,
        role,
        created_at: fn.now(),
        updated_at: fn.now(),
      });

      const user = await db("admin_users").where("id", userId).first();

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      };
    } catch (error) {
      throw error;
    }
  }

  static async changePassword(userId, currentPassword, newPassword) {
    try {
      // Get user
      const user = await db("admin_users").where("id", userId).first();

      if (!user) {
        throw new Error("User not found");
      }

      // Verify current password
      const isCurrentPasswordValid = await compare(
        currentPassword,
        user.password_hash
      );

      if (!isCurrentPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      // Hash new password
      const saltRounds = 10;
      const newPasswordHash = await hash(newPassword, saltRounds);

      // Update password
      await db("admin_users").where("id", userId).update({
        password_hash: newPasswordHash,
        updated_at: fn.now(),
      });

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  static async getProfile(userId) {
    try {
      const user = await db("admin_users")
        .select("id", "email", "role", "last_login_at", "created_at")
        .where("id", userId)
        .first();

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
