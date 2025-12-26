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

  updateAdminSetting: async (setting) => {
    const updatedSetting = await prisma.adminSetting.update({
      where: { key: setting.key },
      data: { value: setting.value },
    });

    cache = null;
    lastFetch = 0;

    return updatedSetting;
  },
};

export default AdminSettingService;
