import db, { fn } from "../../db/knex.js";

class SettingsService {
  // Get setting by key
  static async get(key) {
    try {
      const setting = await db("settings").where("key", key).first();

      if (!setting) {
        return null;
      }

      // Try to parse JSON, fallback to string value
      try {
        return JSON.parse(setting.value);
      } catch (error) {
        return setting.value;
      }
    } catch (error) {
      throw error;
    }
  }

  // Set setting value
  static async set(key, value) {
    try {
      const stringValue =
        typeof value === "object" ? JSON.stringify(value) : String(value);

      const exists = await db("settings").where("key", key).first();

      if (exists) {
        await db("settings").where("key", key).update({
          value: stringValue,
          updated_at: fn.now(),
        });
      } else {
        await db("settings").insert({
          key,
          value: stringValue,
          created_at: fn.now(),
          updated_at: fn.now(),
        });
      }

      return await this.get(key);
    } catch (error) {
      throw error;
    }
  }

  // Get multiple settings
  static async getMultiple(keys) {
    try {
      const settings = await db("settings").whereIn("key", keys);

      const result = {};

      settings.forEach((setting) => {
        try {
          result[setting.key] = JSON.parse(setting.value);
        } catch (error) {
          result[setting.key] = setting.value;
        }
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get all settings
  static async getAll() {
    try {
      const settings = await db("settings").orderBy("key", "asc");

      const result = {};

      settings.forEach((setting) => {
        try {
          result[setting.key] = JSON.parse(setting.value);
        } catch (error) {
          result[setting.key] = setting.value;
        }
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Set multiple settings
  static async setMultiple(settingsObject) {
    try {
      const results = {};

      for (const [key, value] of Object.entries(settingsObject)) {
        results[key] = await this.set(key, value);
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  // Get public settings (for frontend)
  static async getPublic() {
    try {
      const publicKeys = [
        "whatsapp_owner",
        "social_links",
        "site_meta",
        "home_slider",
      ];

      return await this.getMultiple(publicKeys);
    } catch (error) {
      throw error;
    }
  }

  // Delete setting
  static async delete(key) {
    try {
      const setting = await db("settings").where("key", key).first();

      if (!setting) {
        throw new Error("Setting not found");
      }

      await db("settings").where("key", key).del();

      return setting;
    } catch (error) {
      throw error;
    }
  }

  // Get WhatsApp owner number
  static async getWhatsAppOwner() {
    try {
      return (await this.get("whatsapp_owner")) || process.env.WHATSAPP_OWNER;
    } catch (error) {
      throw error;
    }
  }

  // Get social links
  static async getSocialLinks() {
    try {
      const links = await this.get("social_links");

      if (!links) {
        return {
          instagram: "",
          facebook: "",
          whatsapp: "",
        };
      }

      return links;
    } catch (error) {
      throw error;
    }
  }

  // Get site metadata
  static async getSiteMeta() {
    try {
      const meta = await this.get("site_meta");

      if (!meta) {
        return {
          title: "ساندي مكرمية - Sandy Macrame",
          description: "أجمل أعمال المكرمية والبراويز اليدوية من ساندي مكرمية",
          keywords: "مكرمية, براويز, ساندي, يدوية, فلسطين",
          logo: "/images/logo.png",
        };
      }

      return meta;
    } catch (error) {
      throw error;
    }
  }

  // Get home slider settings
  static async getHomeSlider() {
    try {
      const slider = await this.get("home_slider");

      if (!slider) {
        return {
          macrame: {
            title: "أعمال مكرمية فريدة",
            subtitle: "اكتشف جمال المكرمية اليدوية",
            button_text: "شاهد أعمال المكرمية",
            image: "/images/macrame-cover.jpg",
          },
          frames: {
            title: "براويز رائعة التصميم",
            subtitle: "براويز فنية تضفي جمالاً لمنزلك",
            button_text: "شاهد البراويز",
            image: "/images/frames-cover.jpg",
          },
        };
      }

      return slider;
    } catch (error) {
      throw error;
    }
  }

  // Update WhatsApp owner
  static async updateWhatsAppOwner(phoneNumber) {
    try {
      return await this.set("whatsapp_owner", phoneNumber);
    } catch (error) {
      throw error;
    }
  }

  // Update social links
  static async updateSocialLinks(links) {
    try {
      const currentLinks = await this.getSocialLinks();
      const updatedLinks = { ...currentLinks, ...links };

      return await this.set("social_links", updatedLinks);
    } catch (error) {
      throw error;
    }
  }

  // Update site metadata
  static async updateSiteMeta(meta) {
    try {
      const currentMeta = await this.getSiteMeta();
      const updatedMeta = { ...currentMeta, ...meta };

      return await this.set("site_meta", updatedMeta);
    } catch (error) {
      throw error;
    }
  }

  // Update home slider
  static async updateHomeSlider(slider) {
    try {
      const currentSlider = await this.getHomeSlider();
      const updatedSlider = {
        macrame: { ...currentSlider.macrame, ...(slider.macrame || {}) },
        frames: { ...currentSlider.frames, ...(slider.frames || {}) },
      };

      return await this.set("home_slider", updatedSlider);
    } catch (error) {
      throw error;
    }
  }
}

export default SettingsService;
