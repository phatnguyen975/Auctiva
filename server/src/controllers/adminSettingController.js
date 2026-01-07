import AdminSettingService from "../services/adminSettingService.js";

const AdminSettingController = {
  getSettings: async (req, res) => {
    try {
      const settings = await AdminSettingService.getAdminSettings();
      res.ok("Settings retrieved successfully", settings);
    } catch (error) {
      res.error(error.message);
    }
  },

  updateSettings: async (req, res) => {
    try {
      const settings = req.body;
      const newSettings = await AdminSettingService.updateAdminSettings(settings);
      res.ok("Settings updated successfully", newSettings);
    } catch (error) {
      res.error(error.message);
    }
  },
};

export default AdminSettingController;
