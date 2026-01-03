import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import type { RootState } from "../../store/store";
import { axiosInstance } from "../../lib/axios";
import { getHeaders } from "../../utils/getHeaders";

import {
  Heart,
  Star,
  User,
  AlertCircle,
  ShoppingCart,
  Calendar,
  Package,
  BanknoteArrowUp,
  Gavel,
} from "lucide-react";

import type { ProductDetail } from "../../types/product";
import {
  dummyBidHistory,
  dummyRelatedProducts,
} from "../../assets/assets";

import CountdownTimer from "../../components/product/details/CountdownTimer";
import { formatPostDate } from "../../utils/date";
import Input from "../../components/ui/Input";

import BanModal from "../../components/product/details/BanModal";
import ProductDetailTabs from "../../components/product/details/ProductDetailTabs";
import ProductImageGallery from "../../components/product/details/ProductImageGallery";
import toast from "react-hot-toast";

const ProductDetailPage = () => {
  const authUser = useSelector((state: RootState) => state.auth.authUser);
  const role = authUser?.profile?.role as
    | "admin"
    | "bidder"
    | "seller"
    | undefined;
  const currentUserId = authUser?.user?.id; // Use Supabase user ID
  const [product, setProduct] = useState<ProductDetail | null>();

  const [selectedImage, setSelectedImage] = useState(0);
  const [currentTab, setCurrentTab] = useState("description");
  const tabsSectionRef = useRef<HTMLDivElement>(null);

  const [bidAmount, setBidAmount] = useState("");
  //const [question, setQuestion] = useState("");
  const [qaItems, setQaItems] = useState<any[]>([]);
  const [banningInfo, setBanningInfo] = useState<{
    bid: any;
    index: number;
  } | null>(null);

  const userRating = 92; // Mock Rating of User

  const suggestedBid = (product?.currentPrice || 0) + (product?.bidStep || 0);

  const { id: productID } = useParams();

  // Mock fetch data
  const loadProduct = async () => {
    //const res = dummyProductDetails.find((p) => p.id === productID);
    const headers = getHeaders();
    const res = await axiosInstance.get(`/products/${productID}`, { headers });

    if (res && res.data) {
      setProduct(res.data.data);
    } else {
      setProduct(null);
    }
  };

  const fetchQA = async () => {
    if (!productID) return;
    try {
      const headers = getHeaders();
      const data = await axiosInstance.get(`/qa/${productID}`, { headers });

      setQaItems(data.data);
    } catch (error) {
      console.error("Failed to fetch QA:", error);
    }
  };

  useEffect(() => {
    loadProduct();

    fetchQA();
  }, [productID]);

  const handleConfirmBan = () => {
    if (!banningInfo) return;

    console.log("Banning user:", banningInfo.bid.bidder);

    setBanningInfo(null);
  };

  const handleViewQuestions = () => {
    console.log("Clicked");
    setCurrentTab("qa");

    // Cuộn màn hình xuống vị trí Tabs
    if (tabsSectionRef.current) {
      tabsSectionRef.current.scrollIntoView({
        behavior: "smooth", // Cuộn mượt
        block: "start", // Canh đầu phần tử lên đầu màn hình
      });
    }
  };

  // Xử lý gửi câu hỏi
  const handlePostQuestion = async (content: string) => {
    try {
      const headers = getHeaders();
      await axiosInstance.post(
        "/qa/ask",
        {
          productId: Number(productID),
          question: content,
        },
        { headers }
      );
      fetchQA(); // Reload lại danh sách sau khi gửi
    } catch (error: any) {
      console.error("Failed to post question:", error);
      toast.error(error.response?.data?.message || "Failed to post question");
    }
  };

  // Xử lý trả lời (Seller)
  const handlePostAnswer = async (questionId: number, content: string) => {
    try {
      const headers = getHeaders();
      await axiosInstance.post(
        "/qa/reply",
        {
          questionId,
          answer: content,
        },
        { headers }
      );
      fetchQA(); // Reload lại danh sách sau khi trả lời
    } catch (error: any) {
      console.error("Failed to post answer:", error);
      toast.error(error.response?.data?.message || "Failed to post answer");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Images */}
          <ProductImageGallery
            images={product?.images || []}
            title={product?.title || "Product Image"}
          />

          {/* Right Column - Info & Bidding */}
          <div className="space-y-6">
            {/* Title with Seller Badge */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold">{product?.title}</h1>
                {product?.seller.id === currentUserId && (
                  <span
                    className=" inline-flex items-center  justify-center rounded-md border px-2 py-0.5 text-xs font-medium  w-fit whitespace-nowrap 
                    bg-gray-400/60 text-primary border-primary shrink-0 gap-1"
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
                    <div className="font-medium">
                      {product?.seller.fullName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">
                    {product?.seller?.ratingPositive &&
                    product?.seller?.ratingCount
                      ? (
                          (product.seller.ratingPositive /
                            product.seller.ratingCount) *
                          100
                        ).toFixed(1)
                      : "0.0"}
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-card rounded-lg p-6 space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Current Bid
                </div>
                <div className="text-4xl font-bold text-primary">
                  ${product?.currentPrice.toLocaleString()}
                </div>
                <div className="flex items-center justify-between gap-2 mt-2">
                  <div className="text-sm text-muted-foreground">
                    {product?._count?.bids} bids · Top bidder:{" "}
                    {product?.winner?.fullName || "N/A"}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-amber-600">
                      {product?.winner?.ratingPositive &&
                      product?.winner?.ratingCount
                        ? (
                            (product.winner?.ratingPositive /
                              product.winner?.ratingCount) *
                            100
                          ).toFixed(1)
                        : "0.0"}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {product?.buyNowPrice && (
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-1">
                    Buy It Now
                  </div>
                  <div className="text-2xl font-bold">
                    ${product?.buyNowPrice.toLocaleString()}
                  </div>
                </div>
              )}

              {/* Countdown */}
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-2">
                  Time Left
                </div>
                {product?.endDate && (
                  <CountdownTimer endTime={product?.endDate} />
                )}
              </div>

              {/* Posted Date */}
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Posted:</span>
                  <span className="font-medium">
                    {product?.postDate && formatPostDate(product.postDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bidding Controls OR Seller Performance Stats */}
            {!(product?.seller.id === currentUserId) ? (
              /* Bidding Controls - For Bidders/Guests */
              <div className="bg-card rounded-lg p-6 space-y-4">
                {userRating < 80 ? (
                  <div className="relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[20px_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start text-destructive bg-card border-destructive">
                    {/* Icon AlertCircle */}
                    <AlertCircle className="text-red-400 h-4 w-4 translate-y-0.5 text-destructive" />
                    {/* Nội dung AlertDescription */}
                    <div className="col-start-2 text-sm text-red-500 leading-relaxed text-destructive/90">
                      You need a rating of at least 80% to place bids. Your
                      current rating: {userRating}%
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Enter Your Bid
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            icon={BanknoteArrowUp}
                            type="number"
                            placeholder={`Min $${suggestedBid}`}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="text-lg"
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            Suggested: ${suggestedBid} (Current + $
                            {product?.bidStep})
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="flex justify-center items-center w-full bg-black text-white px-4 py-3 rounded-lg cursor-pointer text-sm font-semibold">
                      <Gavel className="size-5 mr-2" />
                      Place Bid
                    </button>
                  </>
                )}

                {product?.buyNowPrice && (
                  <button className="flex justify-center items-center w-full bg-gray-300 text-black px-4 py-3 rounded-lg cursor-pointer text-sm font-semibold">
                    <ShoppingCart className="size-5 mr-2" />
                    Buy Now - ${product.buyNowPrice}
                  </button>
                )}

                <button className="flex justify-center items-center w-full bg-transparent hover:bg-gray-200 text-black px-4 py-3 rounded-lg cursor-pointer text-sm font-semibold">
                  <Heart className="size-5 mr-2" />
                  Add to Watchlist
                </button>
              </div>
            ) : (
              /* Seller Performance Stats - For Seller */
              <div className="bg-card rounded-lg p-6 space-y-6">
                {/* Quick Actions */}
                <div className="pt-4 border-t space-y-2">
                  <button className="w-full flex items-center justify-start  bg-gray-300 text-black px-4 py-1 rounded-lg cursor-pointer text-sm font-semibold">
                    <Package className="h-4 w-4 mr-2" />
                    View in Dashboard
                  </button>
                  <button
                    className="w-full flex items-center justify-start bg-transparent text-gray-400 px-4 py-1 rounded-lg cursor-pointer text-sm font-semibold hover:bg-gray-300/20 hover:text-black/70"
                    onClick={handleViewQuestions}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    View Questions ({qaItems.length})
                  </button>
                </div>

                {/* Alert */}
                <div className="relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[20px_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start justify-center text-destructive bg-card border-destructive bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  {/* Icon AlertCircle */}
                  <AlertCircle className="h-4 w-4 translate-y-0.5 text-black dark:text-blue-400" />
                  {/* Nội dung AlertDescription */}
                  <div className="col-start-2 text-sm leading-relaxed text-destructive/90 text-blue-800 dark:text-blue-200">
                    You cannot bid on your own products. Manage bids in the "Bid
                    History" tab.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div ref={tabsSectionRef} className="mt-10">
          <ProductDetailTabs
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            role={role || ""}
            userId={currentUserId}
            productSellerId={product?.sellerId || product?.seller?.id}
            description={product?.description}
            bidHistory={dummyBidHistory}
            qaItems={qaItems}
            relatedProducts={dummyRelatedProducts}
            onPostQuestion={handlePostQuestion}
            onPostAnswer={handlePostAnswer}
            onBanUser={(bid, index) => setBanningInfo({ bid, index })}
          />
        </div>
      </div>

      {banningInfo && (
        <BanModal
          isOpen={true} // Luôn true vì ta control bằng việc render có điều kiện (banningInfo &&)
          onClose={() => setBanningInfo(null)} // Đóng modal bằng cách set null
          onConfirm={handleConfirmBan}
          // Truyền data vào
          bidderName={banningInfo.bid.bidder}
          isHighestBidder={banningInfo.index === 0}
          nextBidderName={dummyBidHistory[1]?.bidder}
          nextBidderAmount={dummyBidHistory[1]?.amount}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
