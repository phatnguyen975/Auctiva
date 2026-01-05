import UserService from "../services/userService.js";

const UserController = {
  getAll: async (req, res) => {
    try {
      const { keyword } = req.validated.query;
      const users = await UserService.getUsers(keyword);
      res.ok("Users retrieved successfully", users);
    } catch (error) {
      res.error(error.message);
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const profile = req.validated.body;
      const updatedProfile = await UserService.updateUserProfile({
        userId,
        profile,
      });
      res.ok("Profile updated successfully", updatedProfile);
    } catch (error) {
      res.error(error.message);
    }
  },

  updateEmail: async (req, res) => {
    try {
      const userId = req.user.id;
      const { email } = req.validated.body;
      await UserService.updateUserEmail({
        userId,
        email,
      });
      res.ok("Email update requested. Please verify new email.", null);
    } catch (error) {
      res.error(error.message);
    }
  },

  updatePassword: async (req, res) => {
    try {
      const userId = req.user.id;
      const { password } = req.validated.body;
      await UserService.updateUserPassword({
        userId,
        password,
      });
      res.ok("Password updated successfully", null);
    } catch (error) {
      res.error(error.message);
    }
  },

  resetPassword: async (req, res) => {
    try {
      const userId = req.validated.params.id;
      await UserService.resetUserPassword(userId);
      res.ok("Password reset successfully", null);
    } catch (error) {
      res.error(error.message);
    }
  },

  deleteById: async (req, res) => {
    try {
      const userId = req.validated.params.id;
      await UserService.deleteUserByAdmin(userId);
      res.ok("User deleted successfully", null);
    } catch (error) {
      res.error(error.message);
    }
  },
};

export default UserController;
