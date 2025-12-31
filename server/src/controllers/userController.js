import UserService from "../services/userService.js";

const UserController = {
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
};

export default UserController;
