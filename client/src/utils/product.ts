import { supabase } from "../lib/supabaseClient";
import type { Product } from "../types/product";
import type { ProductCardProps } from "../components/product/ProductCard";

type UploadProductImageParams = {
  file: File;
  parentCategory: string;
  subCategory: string;
  bucket?: string;
};

export const uploadProductImage = async ({
  file,
  parentCategory,
  subCategory,
  bucket = "product-images",
}: UploadProductImageParams): Promise<string | null> => {
  try {
    const ext = file.name.split(".").pop();
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const fileName = `${baseName}-${Date.now()}.${ext}`;

    const filePath = `${parentCategory}/${subCategory}/${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error("Error uploading product image:", error.message);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Upload product image exception:", error);
    return null;
  }
};

export const deleteProductImage = async (
  publicUrl: string,
  bucket = "product-images"
): Promise<boolean> => {
  try {
    const path = publicUrl.split(`/storage/v1/object/public/${bucket}/`)[1];
    if (!path) return false;

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error("Error deleting product image:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete product image exception:", error);
    return false;
  }
};

export const mapProductToCard = (product: Product): ProductCardProps => {
  return {
    id: product.id,
    image: product.images[0].url,
    title: product.name,
    currentBid: product.currentPrice,
    buyNowPrice: product.buyNowPrice,
    topBidder: product.winner?.fullName ?? product.winner?.username ?? null,
    totalBids: product._count.bids,
    postDate: new Date(product.postDate),
    endDate: new Date(product.endDate),
    isNew: product.isNew,
    isWatched: product.isWatched,
  };
};
