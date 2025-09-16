// server/src/modules/auth/controller.js
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

      Logger.info("First admin account created", { email }); // استخدام Logger

      res.status(201).json({
        success: true,
        message: result.message,
        data: { email: result.email },
      });
    } catch (error) {
      Logger.error("Setup first admin failed", { error: error.message }); // استخدام Logger

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

  // ... باقي الدوال مع استخدام Logger.info و Logger.error
}

// Named exports
export const checkSetupStatus = AuthController.checkSetupStatus;
export const setupFirstAdmin = AuthController.setupFirstAdmin;
export const verifyEmail = AuthController.verifyEmail;
export const login = AuthController.login;
export const getProfile = AuthController.getProfile;
export const changePassword = AuthController.changePassword;
