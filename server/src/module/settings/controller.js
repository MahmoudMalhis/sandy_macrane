import {
  getPublic as _getPublic,
  getAll as _getAll,
  get,
  set as _set,
  setMultiple as _setMultiple,
  delete as _delete,
  updateWhatsAppOwner,
  updateSocialLinks as _updateSocialLinks,
  updateSiteMeta as _updateSiteMeta,
  updateHomeSlider as _updateHomeSlider,
} from "./service.js";
import { error as _error, info } from "../../utils/logger.js";

class SettingsController {
  // Get public settings (public)
  static async getPublic(req, res) {
    try {
      const settings = await _getPublic();

      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      _error("Get public settings failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch settings",
      });
    }
  }

  // Get all settings (admin)
  static async getAll(req, res) {
    try {
      const settings = await _getAll();

      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      _error("Get all settings failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch settings",
      });
    }
  }

  // Get setting by key (admin)
  static async getByKey(req, res) {
    try {
      const { key } = req.params;
      const value = await get(key);

      if (value === null) {
        return res.status(404).json({
          success: false,
          message: "Setting not found",
        });
      }

      res.json({
        success: true,
        data: {
          key,
          value,
        },
      });
    } catch (error) {
      _error("Get setting by key failed", {
        key: req.params.key,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to fetch setting",
      });
    }
  }

  // Set setting (admin)
  static async set(req, res) {
    try {
      const { key } = req.params;
      const { value } = req.body;

      const result = await _set(key, value);

      info("Setting updated", {
        key,
        updatedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Setting updated successfully",
        data: {
          key,
          value: result,
        },
      });
    } catch (error) {
      _error("Set setting failed", {
        key: req.params.key,
        updatedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update setting",
      });
    }
  }

  // Set multiple settings (admin)
  static async setMultiple(req, res) {
    try {
      const settingsObject = req.body;

      if (!settingsObject || typeof settingsObject !== "object") {
        return res.status(400).json({
          success: false,
          message: "Settings object is required",
        });
      }

      const results = await _setMultiple(settingsObject);

      info("Multiple settings updated", {
        keys: Object.keys(settingsObject),
        updatedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Settings updated successfully",
        data: results,
      });
    } catch (error) {
      _error("Set multiple settings failed", {
        updatedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update settings",
      });
    }
  }

  // Delete setting (admin)
  static async delete(req, res) {
    try {
      const { key } = req.params;
      const setting = await _delete(key);

      info("Setting deleted", {
        key,
        deletedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Setting deleted successfully",
        data: setting,
      });
    } catch (error) {
      if (error.message === "Setting not found") {
        return res.status(404).json({
          success: false,
          message: "Setting not found",
        });
      }

      _error("Delete setting failed", {
        key: req.params.key,
        deletedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to delete setting",
      });
    }
  }

  // Update WhatsApp owner (admin)
  static async updateWhatsApp(req, res) {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res.status(400).json({
          success: false,
          message: "Phone number is required",
        });
      }

      const result = await updateWhatsAppOwner(phoneNumber);

      info("WhatsApp owner updated", {
        phoneNumber,
        updatedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "WhatsApp number updated successfully",
        data: result,
      });
    } catch (error) {
      _error("Update WhatsApp owner failed", {
        updatedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update WhatsApp number",
      });
    }
  }

  // Update social links (admin)
  static async updateSocialLinks(req, res) {
    try {
      const links = req.body;

      const result = await _updateSocialLinks(links);

      info("Social links updated", {
        updatedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Social links updated successfully",
        data: result,
      });
    } catch (error) {
      _error("Update social links failed", {
        updatedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update social links",
      });
    }
  }

  // Update site metadata (admin)
  static async updateSiteMeta(req, res) {
    try {
      const meta = req.body;

      const result = await _updateSiteMeta(meta);

      info("Site metadata updated", {
        updatedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Site metadata updated successfully",
        data: result,
      });
    } catch (error) {
      _error("Update site metadata failed", {
        updatedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update site metadata",
      });
    }
  }

  // Update home slider (admin)
  static async updateHomeSlider(req, res) {
    try {
      const slider = req.body;

      const result = await _updateHomeSlider(slider);

      info("Home slider updated", {
        updatedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Home slider updated successfully",
        data: result,
      });
    } catch (error) {
      _error("Update home slider failed", {
        updatedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update home slider",
      });
    }
  }
}

export default SettingsController;
