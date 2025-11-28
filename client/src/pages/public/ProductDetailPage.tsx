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

  const role = "bidder"; // Mock role
  const { id: productID } = useParams();

  // Mock fetch data
  useEffect(() => {
    const loadProduct = () => {
      const res = dummyProductDetails.find((p) => p.id === productID);

      if (res) setProduct(res);
    };

    loadProduct();
  }, []);

  return <></>;
};

export default ProductDetailPage;
