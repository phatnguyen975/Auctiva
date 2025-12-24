import { supabase } from "../lib/supabaseClient";

export const uploadImage = async (
  file: File,
  bucket: string
): Promise<string | null> => {
  const filePath = `${file.name}-${Date.now()}`;

  const { error } = await supabase.storage.from(bucket).upload(filePath, file);

  if (error) {
    console.error("Error uploading image:", error.message);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return data.publicUrl;
};
