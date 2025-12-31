import { prisma } from "../configs/prisma.js";
import { supabase } from "../configs/supabase.js";

const UserService = {
  updateUserProfile: async ({ userId, profile }) => {
    return await prisma.profile.update({
      where: { id: userId },
      data: profile,
    });
  },

  updateUserEmail: async ({ userId, email }) => {
    const { data: user } = await supabase.auth.admin.getUserById(userId);

    const isSocialOnly = user.user.identities?.every(
      (i) => i.provider !== "email"
    );

    if (isSocialOnly) {
      throw new Error("Social login accounts cannot change email");
    }

    const { error } = await supabase.auth.admin.updateUserById(userId, {
      email,
    });

    if (error) {
      throw error;
    }

    await prisma.profile.update({
      where: { id: userId },
      data: { email },
    });
  },

  updateUserPassword: async ({ userId, password }) => {
    const { data: user } = await supabase.auth.admin.getUserById(userId);

    const hasEmailProvider = user.user.identities?.some(
      (i) => i.provider === "email"
    );

    if (!hasEmailProvider) {
      throw new Error("Social login accounts cannot change password");
    }

    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password,
    });

    if (error) {
      throw error;
    }
  },
};

export default UserService;
