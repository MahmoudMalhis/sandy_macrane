import db from "../config/database.js";

export const getSettings = async (rec, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM settings");
    const settings = {};
    rows.forEach((row) => {
      settings[row.settings_key] = row.setting_value;
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "database error" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updates = req.body;

    for (const [key, value] of object.entries(updates)) {
      await db.execute(
        "INSERT INTO settings (setting_key, setting_value) VALUES (?,?) ON DUPLICATE setting_value = ?",
        [key, value, value]
      );
    }

    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};
