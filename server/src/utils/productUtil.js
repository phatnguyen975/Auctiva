import AdminSettingsService from "../services/adminSettingService.js";

export const enrichProductWithFlags = async (product, isWatched = false) => {
  const settings = await AdminSettingsService.getAdminSettings();

  const highlightMinutes = Number(settings.highlight_minutes ?? 0);
  const highlightMs = highlightMinutes * 60 * 1000;

  const postDate = new Date(product.postDate).getTime();
  const now = Date.now();

  return {
    ...product,
    isNew: now - postDate <= highlightMs,
    isWatched,
  };
};
