import { prisma } from "../configs/prisma.js";

let cache = null;
let lastFetch = 0;
const TTL = 60 * 1000; // 60s

const AdminSettingService = {
  getAdminSettings: async () => {
    const now = Date.now();

    if (cache && now - lastFetch < TTL) {
      return cache;
    }

    const settings = await prisma.adminSetting.findMany({
      select: {
        key: true,
        value: true,
      },
    });

    cache = settings.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    lastFetch = now;
    return cache;
  },

  updateAdminSettings: async (settings) => {
    const entries = Object.entries(settings);

    const updatedSettings = await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.adminSetting.update({
          where: { key },
          data: { value },
        })
      )
    );

    cache = null;
    lastFetch = 0;

    return updatedSettings;
  },
};

export default AdminSettingService;
