import { useEffect, useState } from "react";

import {
  Heart,
  Star,
  User,
  AlertCircle,
  ShoppingCart,
  Calendar,
  Award,
  Ban,
  TrendingUp,
  DollarSign,
  Eye,
  Package,
} from "lucide-react";

import type { ProductDetail } from "../../types/product";
import {
  dummyProductDetails,
  dummyBidHistory,
  dummyQAItems,
  dummyRelatedProducts,
} from "../../assets/assets";
import { useParams } from "react-router-dom";

const ProductDetailPage = () => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const role = "seller"; // Mock role
  const { id: productID } = useParams();

  // Mock fetch data
  useEffect(() => {
    const loadProduct = () => {
      const res = dummyProductDetails.find((p) => p.id === productID);

      if (res) setProduct(res);
    };

    loadProduct();
  }, []);

  console.log(product);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-card rounded-lg overflow-hidden">
              <img
                src={product?.images?.[selectedImage]}
                alt={product?.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product?.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-primary scale-95"
                      : "border-transparent hover:border-muted"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Info & Bidding */}
          <div className="space-y-6">
            {/* Title with Seller Badge */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold">{product?.title}</h1>
                {role == "seller" && (
                  <span
                    className=" inline-flex items-center  justify-center rounded-md border px-2 py-0.5 text-xs font-medium  w-fit whitespace-nowrap 
                    bg-primary/10 text-primary border-primary "
                    shrink-0
                    gap-1
                  >
                    <Package className="h-3 w-3" />
                    Your Product
                  </span>
                )}
              </div>

              {/* Seller Info */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-400/50 p-2 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{product?.seller.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {product?.seller.totalSales} sales
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{product?.seller.rating}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
