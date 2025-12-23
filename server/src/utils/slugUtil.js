import slugify from "slugify";

export const createSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: "vi",
    trim: true,
  });
}
