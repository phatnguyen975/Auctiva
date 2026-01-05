import { EmailTemplates, sendEmail } from "../configs/nodemailer.js";
import { prisma } from "../configs/prisma.js";
import { supabase } from "../configs/supabase.js";
import { generateRandomPassword } from "../utils/userUtil.js";

const UserService = {
  getUsers: async (keyword) => {
    if (!keyword) {
      return prisma.profile.findMany({
        where: {
          status: "active",
          role: { not: "admin" },
        },
        select: {
          id: true,
          username: true,
          fullName: true,
          email: true,
          address: true,
          role: true,
          ratingPositive: true,
          ratingCount: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return prisma.$queryRaw`
      SELECT
        id,
        user_name       AS "userName",
        full_name       AS "fullName",
        email,
        address,
        role,
        rating_positive AS "ratingPositive",
        rating_count    AS "ratingCount",
        created_at      AS "createdAt"
      FROM profiles
      WHERE
        status = 'active' AND role IN ('bidder', 'seller')
        AND (
          search_vector @@ plainto_tsquery('english', ${keyword})
          OR COALESCE(full_name, '') ILIKE '%' || ${keyword} || '%'
          OR COALESCE(user_name, '') ILIKE '%' || ${keyword} || '%'
          OR email ILIKE '%' || ${keyword} || '%'
        )
      ORDER BY created_at DESC
    `;
  },

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

    if (!user) {
      throw new Error("User not found");
    }

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

  resetUserPassword: async (userId) => {
    const { data: user } = await supabase.auth.admin.getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const hasEmailProvider = user.user.identities?.some(
      (i) => i.provider === "email"
    );

    if (!hasEmailProvider) {
      throw new Error("Social login accounts cannot change password");
    }

    const newPassword = generateRandomPassword();

    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message);
    }

    const profile = await prisma.profile.findUnique({
      where: { id: userId },
    });

    sendEmail({
      to: user.user.email,
      subject: "Your password has been reset",
      html: EmailTemplates.resetPassword({
        fullName: profile.fullName,
        username: profile.username,
        email: profile.email,
        password: newPassword,
      }),
    });
  },

  deleteUserByAdmin: async (userId) => {
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
    });

    if (!profile) {
      throw new Error("User not found");
    }

    if (profile.status === "deleted") {
      throw new Error("User already deleted");
    }

    // const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    // if (authError) {
    //   throw new Error(authError.message);
    // }

    sendEmail({
      to: profile.email,
      subject: "Your Auctiva account has been deleted",
      html: EmailTemplates.accountDeleted({
        fullName: profile.fullName,
        username: profile.username,
        email: profile.email,
      }),
    });

    const archivedEmail = `deleted__${userId}__${profile.email}`;

    await prisma.profile.update({
      where: { id: userId },
      data: {
        email: archivedEmail,
        status: "deleted",
      },
    });
  },
};

export default UserService;
