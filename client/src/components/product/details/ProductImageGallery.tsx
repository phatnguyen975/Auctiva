import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

// Helper để gộp class
const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

interface ProductImageGalleryProps {
  images: any[];
  title: string;
  className?: string;
}

const ProductImageGallery = ({
  images = [], // Mặc định là mảng rỗng để tránh lỗi null/undefined
  title,
  className,
}: ProductImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-play slideshow
  useEffect(() => {
    if (!isAutoPlay || images.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => {
        const newIndex = prev === images.length - 1 ? 0 : prev + 1;
        return newIndex;
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay, images.length]);

  const handleImageChange = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSelectedImage(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handlePrev = () => {
    const newIndex =
      selectedImage === 0 ? images.length - 1 : selectedImage - 1;
    handleImageChange(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      selectedImage === images.length - 1 ? 0 : selectedImage + 1;
    handleImageChange(newIndex);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

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
      {/* Main Image with Controls */}
      <div className="relative aspect-square bg-card rounded-lg overflow-hidden border bg-white group">
        {/* Image with fade transition */}
        <img
          key={selectedImage}
          src={images[selectedImage]?.url}
          alt={`${title} - Main View`}
          className="w-full h-full object-cover transition-opacity duration-500 ease-in-out cursor-zoom-in animate-fadeIn"
        />

        {/* Navigation arrows - only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Auto-play toggle */}
            <button
              onClick={toggleAutoPlay}
              className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label={isAutoPlay ? "Pause slideshow" : "Play slideshow"}
            >
              {isAutoPlay ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {selectedImage + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {/* Chỉ hiện thumbnails nếu có nhiều hơn 1 ảnh */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageChange(index)}
              className={cn(
                "aspect-square rounded-lg overflow-hidden border-2 transition-all bg-white",
                selectedImage === index
                  ? "border-gray-800 ring-2 ring-gray-200 scale-95" // Active state
                  : "border-transparent hover:border-muted hover:opacity-80" // Inactive state
              )}
            >
              <img
                src={image?.url}
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
