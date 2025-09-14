import { login as _login, createAdmin as _createAdmin, changePassword as _changePassword, getProfile as _getProfile } from "./service";
import { info, error as _error } from "../../utils/logger";

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const result = await _login(email, password);

      info("Admin login successful", { email });

      res.json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      _error("Login failed", {
        email: req.body.email,
        error: error.message,
      });

      if (error.message === "Invalid credentials") {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      res.status(500).json({
        success: false,
        message: "Login failed",
      });
    }
  }

  static async createAdmin(req, res) {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Only owner can create new admins
      if (req.user.role !== "owner") {
        return res.status(403).json({
          success: false,
          message: "Only owners can create new admin accounts",
        });
      }

      const user = await _createAdmin(email, password, role);

      info("New admin created", {
        createdBy: req.user.email,
        newUser: email,
        role: role || "editor",
      });

      res.status(201).json({
        success: true,
        message: "Admin account created successfully",
        data: user,
      });
    } catch (error) {
      _error("Admin creation failed", {
        error: error.message,
        createdBy: req.user?.email,
      });

      if (error.message === "User already exists") {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create admin account",
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

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters long",
        });
      }

      await _changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );

      info("Password changed successfully", { userId: req.user.id });

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      _error("Password change failed", {
        userId: req.user.id,
        error: error.message,
      });

      if (error.message === "Current password is incorrect") {
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

  static async getProfile(req, res) {
    try {
      const profile = await _getProfile(req.user.id);

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      _error("Get profile failed", {
        userId: req.user.id,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to get profile",
      });
    }
  }
}

export default AuthController;
