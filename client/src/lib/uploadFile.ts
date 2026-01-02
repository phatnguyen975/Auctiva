import { supabase } from "./supabaseClient";

export const uploadTransactionFile = async (
  file: File,
  folder: "payment-proofs" | "shipping-receipts",
  transactionId: string
): Promise<string> => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `${transactionId}_${timestamp}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("transaction-files")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("transaction-files").getPublicUrl(filePath);

    return publicUrl;
  } catch (error: any) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteTransactionFile = async (fileUrl: string): Promise<void> => {
  try {
    // Extract file path from URL
    const urlParts = fileUrl.split("/transaction-files/");
    if (urlParts.length !== 2) {
      throw new Error("Invalid file URL");
    }
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from("transaction-files")
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error: any) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
