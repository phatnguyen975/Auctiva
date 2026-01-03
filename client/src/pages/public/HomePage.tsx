import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import CategoryBar from "../../components/CategoryBar";
import { ProductCard } from "../../components/product/ProductCard";
import { axiosInstance } from "../../lib/axios";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import type { Product } from "../../types/product";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { mapProductToCard } from "../../utils/product";

const banners = [
  {
    title: "Flash Sale Ending Soon",
    subtitle: "Up to 50% off on electronics",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop",
  },
  {
    title: "Luxury Watch Collection",
    subtitle: "Rare pieces from around the world",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=400&fit=crop",
  },
  {
    title: "Designer Fashion Week",
    subtitle: "Authentic items, verified sellers",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=400&fit=crop",
  },
];

const HomePage = () => {
  const authUser = useSelector((state: RootState) => state.auth.authUser);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [endingSoonProducts, setEndingSoonProducts] = useState<Product[]>([]);
  const [mostBidsProducts, setMostBidsProducts] = useState<Product[]>([]);
  const [highestPriceProducts, setHighestPriceProducts] = useState<Product[]>([]);

  const navigate = useNavigate();

  const fetchHomeProducts = async () => {
    try {
      setIsLoading(true);

      const headers: HeadersInit = {
        "x-api-key": import.meta.env.VITE_API_KEY,
      };

      if (authUser && accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const { data } = await axiosInstance.get("/products/home", { headers });

      if (data.success) {
        setEndingSoonProducts(data.data.endingSoon);
        setMostBidsProducts(data.data.mostBids)
        setHighestPriceProducts(data.data.highestPrice);
      }
    } catch (error: any) {
      console.error("Error fetching home products:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <CategoryBar />

      {/* Carousel */}
      <div className="w-full mb-8">
        <div className="container mx-auto p-4">
          <div className="relative h-[250px] sm:h-[300px] md:h-[400px] overflow-hidden rounded-lg">
            {/* Carousel Contents */}
            {banners.map((banner, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent flex items-center">
                  <div className="w-full px-8 sm:px-16 md:px-24">
                    <div className="max-w-xl text-white">
                      <h1 className="text-xl sm:text-3xl md:text-5xl font-bold mb-2">
                        {banner.title}
                      </h1>
                      <p className="text-sm text-gray-200 sm:text-lg md:text-xl mb-6">
                        {banner.subtitle}
                      </p>
                      <button
                        className="text-sm sm:text-lg bg-black px-4 py-1.5 rounded-lg cursor-pointer"
                        onClick={() => navigate("/products")}
                      >
                        Browse Auctions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Carousel Controls */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 cursor-pointer transition-colors"
              onClick={() =>
                setCurrentSlide(
                  (prev) => (prev - 1 + banners.length) % banners.length
                )
              }
            >
              <ChevronLeft className="size-5 md:size-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 cursor-pointer transition-colors"
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % banners.length)
              }
            >
              <ChevronRight className="size-5 md:size-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  className={`size-2 rounded-full transition-all ${
                    index === currentSlide ? "bg-white w-8" : "bg-white/50"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-12 mb-12">
        {/* Ending Soon Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-500/10 p-3 rounded-lg">
                <Clock className="size-7 text-red-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Ending Soon</h2>
                <p className="text-gray-700">
                  Don't miss out on these hot deals
                </p>
              </div>
            </div>
            <button
              className="flex gap-1 items-center justify-center px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 group transition-all duration-300"
              onClick={() => navigate("/products")}
            >
              View All
              <ArrowRight className="size-4 group-hover:translate-x-0.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {isLoading ? (
              <LoadingSpinner />
            ) : endingSoonProducts.length === 0 ? (
              <div>No Ending Soon Products</div>
            ) : endingSoonProducts.map((product) => (
              <ProductCard key={product.id} {...mapProductToCard(product)} />
            ))}
          </div>
        </section>

        {/* Most Bids Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/10 p-3 rounded-lg">
                <TrendingUp className="size-7 text-green-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Most Popular</h2>
                <p className="text-gray-700">
                  Highest bidding activity right now
                </p>
              </div>
            </div>
            <button
              className="flex gap-1 items-center justify-center px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 group transition-all duration-300"
              onClick={() => navigate("/products")}
            >
              View All
              <ArrowRight className="size-4 group-hover:translate-x-0.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {isLoading ? (
              <LoadingSpinner />
            ) : mostBidsProducts.length === 0 ? (
              <div>No Most Bids Products</div>
            ) : mostBidsProducts.map((product) => (
              <ProductCard key={product.id} {...mapProductToCard(product)} />
            ))}
          </div>
        </section>

        {/* Highest Price Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/10 p-3 rounded-lg">
                <DollarSign className="size-7 text-amber-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Premium Items</h2>
                <p className="text-gray-700">
                  Highest value auctions available
                </p>
              </div>
            </div>
            <button
              className="flex gap-1 items-center justify-center px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 group transition-all duration-300"
              onClick={() => navigate("/products")}
            >
              View All
              <ArrowRight className="size-4 group-hover:translate-x-0.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {isLoading ? (
              <LoadingSpinner />
            ) : highestPriceProducts.length === 0 ? (
              <div>No Highest Price Products</div>
            ) : highestPriceProducts.map((product) => (
              <ProductCard key={product.id} {...mapProductToCard(product)} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
