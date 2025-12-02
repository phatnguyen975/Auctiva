import { useState } from "react";

// Helper để gộp class
const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

interface ProductImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

const ProductImageGallery = ({
  images = [], // Mặc định là mảng rỗng để tránh lỗi null/undefined
  title,
  className,
}: ProductImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  // Nếu không có ảnh nào thì hiển thị placeholder hoặc null
  if (!images || images.length === 0) {
    return (
      <div
        className={cn(
          "aspect-square bg-muted rounded-lg flex items-center justify-center",
          className
        )}
      >
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image */}
      <div className="aspect-square bg-card rounded-lg overflow-hidden border bg-white">
        <img
          src={images[selectedImage]}
          alt={`${title} - Main View`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-zoom-in"
        />
      </div>

      {/* Thumbnails */}
      {/* Chỉ hiện thumbnails nếu có nhiều hơn 1 ảnh */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "aspect-square rounded-lg overflow-hidden border-2 transition-all bg-white",
                selectedImage === index
                  ? "border-gray-800 ring-2 ring-gray-200 scale-95" // Active state
                  : "border-transparent hover:border-muted hover:opacity-80" // Inactive state
              )}
            >
              <img
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
