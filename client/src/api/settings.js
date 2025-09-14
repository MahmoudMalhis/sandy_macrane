import { apiClient } from "./config.js";

export const settingsAPI = {
  getPublic: () => apiClient.get("/settings/public"),
};
