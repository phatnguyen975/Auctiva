import { supabase } from "../lib/supabaseClient";

type UploadAvatarParams = {
  file: File;
  userId: string;
  bucket?: string;
};

export const uploadAvatar = async ({
  file,
  userId,
  bucket = "avatars",
}: UploadAvatarParams): Promise<string | null> => {
  try {
    const ext = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      console.error("Error uploading avatar:", error.message);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error("Upload avatar exception:", error);
    return null;
  }
};

export const deleteAvatarByUrl = async (
  publicUrl: string,
  bucket = "avatars"
): Promise<boolean> => {
  try {
    const path = publicUrl.split(`/storage/v1/object/public/${bucket}/`)[1];
    if (!path) return false;

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error("Error deleting avatar:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete avatar exception:", error);
    return false;
  }
};
