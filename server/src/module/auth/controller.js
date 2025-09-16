import AuthService from "./service.js";
import Logger from "../../utils/logger.js";

class AuthController {
  static async checkSetupStatus(req, res) {
    try {
      const hasAdmin = await AuthService.hasAnyAdmin();
      res.json({
        success: true,
        data: { needsSetup: !hasAdmin, hasAdmin },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  static async setupFirstAdmin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const result = await AuthService.createFirstAdmin(email, password);

      Logger.info("First admin account created", { email });

      res.status(201).json({
        success: true,
        message: result.message,
        data: { email: result.email },
      });
    } catch (error) {
      Logger.error("Setup first admin failed", { error: error.message });

      if (error.message === "Admin account already exists") {
        return res.status(409).json({
          success: false,
          message: "Admin account already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create admin account",
      });
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      const result = await AuthService.verifyEmail(token);

      Logger.info("Email verified successfully", {
        token: token.substring(0, 8) + "...",
      });

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      Logger.error("Email verification failed", { error: error.message });

      if (error.message === "Invalid or expired verification token") {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification token",
        });
      }

      res.status(500).json({
        success: false,
        message: "Email verification failed",
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      Logger.info("User logged in", { email });

      res.json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      Logger.error("Login failed", {
        email: req.body.email,
        error: error.message,
      });

      if (error.message === "Invalid credentials") {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      if (error.message === "Please verify your email before logging in") {
        return res.status(401).json({
          success: false,
          message: "Please verify your email before logging in",
        });
      }

      res.status(500).json({
        success: false,
        message: "Login failed",
      });
    }
  }

  static async getProfile(req, res) {
    try {
      res.json({
        success: true,
        data: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get profile",
      });
    }
  }

  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required",
        });
      }

      await AuthService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );

      Logger.info("Password changed", {
        userId: req.user.id,
        email: req.user.email,
      });

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      Logger.error("Change password failed", {
        userId: req.user.id,
        error: error.message,
      });

      if (error.message === "Invalid current password") {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to change password",
      });
    }
  }
}

// Named exports
export const checkSetupStatus = AuthController.checkSetupStatus;
export const setupFirstAdmin = AuthController.setupFirstAdmin;
export const verifyEmail = AuthController.verifyEmail;
export const login = AuthController.login;
export const getProfile = AuthController.getProfile;
export const changePassword = AuthController.changePassword;
