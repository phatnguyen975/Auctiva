import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getHeaders } from "../../../utils/getHeaders";
import { axiosInstance } from "../../../lib/axios";

import toast from "react-hot-toast";

import {
  Award,
  Star,
  ThumbsDown,
  ThumbsUp,
  Trophy,
  XCircle,
  Eye,
} from "lucide-react";

interface Item {
  id: number | string;
  images: any[];
  title: string;
  currentPrice: number;
  seller: {
    id: string;
    username: string;
    fullName: string;
    ratingPositive: number;
    ratingCount: number;
  };
  sellerRating: number;
  rated: boolean;
  wonDate: string;
  transactions: [{ id: number; status: string }];
}

const WonAuctionsPage = () => {
  const [wonAuctions, setWonAuctions] = useState<Item[]>([]);
  const [itemToRate, setItemToRate] = useState<Item | null>(null);
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadWinAuctions = async () => {
      try {
        const headers = getHeaders();
        const { data } = await axiosInstance.get("/products/won", { headers });

        console.log(data);

        if (data.success) {
          setWonAuctions(data.data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Failed to load won auctions", error);
      }
    };

    loadWinAuctions();
  }, []); // Thêm mảng rỗng để chỉ chạy 1 lần khi mount

  const handleSubmitRating = async () => {
    if (!rating) {
      toast.error("Please select thumbs up or down");
      return;
    }

    if (!review || review.trim().length === 0) {
      toast.error("Please write a review comment");
      return;
    }

    if (!itemToRate?.transactions?.[0]?.id) {
      toast.error("Transaction ID not found");
      return;
    }

    try {
      setIsLoading(true);

      const score = rating === "up" ? 1 : -1;

      const headers = getHeaders();
      const response = await axiosInstance.post(
        `/transactions/${itemToRate.transactions[0].id}/rate`,
        {
          score: score,
          comment: review,
        },
        { headers }
      );

      if (response.data.success) {
        toast.success("Rating submitted successfully!");

        // Reset modal state
        setItemToRate(null);
        setRating(null);
        setReview("");

        // Refresh won auctions list
        const { data } = await axiosInstance.get("/products/won", { headers });
        if (data.success) {
          setWonAuctions(data.data);
        }
      }
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      toast.error(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex flex-col gap-6 rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Won Auctions</h2>
              <p className="text-muted-foreground">Your auction victories</p>
            </div>
            <span
              className="inline-flex items-center bg-gray-200 justify-center rounded-md px-2 py-1 text-xm font-medium w-fit whitespace-nowrap 
                  text-primary border-primary shrink-0 gap-1"
            >
              {wonAuctions.length} items
            </span>
          </div>

          {wonAuctions.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-semibold mb-2">
                No won auctions yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Keep bidding to win your first item
              </p>
              <button
                className="rounded-md px-4 py-2 text-sm text-white bg-slate-900 font-medium transition-colors shadow-sm hover:bg-slate-400 hover:cursor-pointer"
                onClick={() => navigate("/products")}
              >
                Browse Auctions
              </button>
            </div>
          ) : (
            <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex flex-col gap-6 rounded-xl border border-[hsl(var(--border))] transition-colors duration-300">
              <div className="relative w-full overflow-x-auto">
                {/* Cấu trúc table thuần không phụ thuộc component ngoài */}
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                        Product
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                        Winning Price
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                        Seller
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                        Status
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="[&_tr:last-child]:border-0">
                    {wonAuctions.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        {/* Cột Products */}
                        <td className="p-2 align-middle whitespace-nowrap">
                          <div
                            className="flex items-center gap-3 hover:cursor-pointer"
                            onClick={() => navigate(`/products/${item.id}`)}
                          >
                            <img
                              src={item.images[0]?.url}
                              alt={item.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <span className="font-medium">{item.title}</span>
                          </div>
                        </td>

                        {/* Cột Winning Prices */}
                        <td className="p-2 align-middle whitespace-nowrap font-bold text-primary">
                          ${item.currentPrice.toLocaleString()}
                        </td>

                        {/* Cột Seller & Rating */}
                        <td className="p-2 align-middle whitespace-nowrap">
                          <div>
                            <div className="font-medium">
                              {typeof item.seller === "string"
                                ? item.seller
                                : item.seller?.fullName ||
                                  item.seller?.username ||
                                  "Unknown"}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-amber-600">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span>
                                {(
                                  (item.seller?.ratingPositive /
                                    (item.seller?.ratingCount || 1)) *
                                  100
                                ).toFixed(2)}
                                %
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Cột Status */}
                        <td className="p-2 align-middle whitespace-nowrap">
                          <span
                            className={
                              item.transactions?.[0]?.status === "completed"
                                ? "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                                : item.transactions?.[0]?.status === "shipped"
                                ? "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                                : item.transactions?.[0]?.status === "paid"
                                ? "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200"
                                : item.transactions?.[0]?.status === "pending"
                                ? "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"
                                : item.transactions?.[0]?.status === "cancelled"
                                ? "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200"
                                : "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200"
                            }
                          >
                            {item.transactions?.[0]?.status
                              ? item.transactions[0].status
                                  .charAt(0)
                                  .toUpperCase() +
                                item.transactions[0].status.slice(1)
                              : "N/A"}
                          </span>
                        </td>

                        {/* Cột Actions */}
                        <td className="p-2 align-middle">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/transaction/${item.transactions?.[0]?.id}`
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors hover:cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>

                            {!item.rated ? (
                              <button
                                onClick={() => setItemToRate(item)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors hover:cursor-pointer"
                              >
                                <Award className="h-4 w-4" />
                                Rate
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-green-50 text-green-700 border border-green-200">
                                <Award className="h-3 w-3" />
                                Rated
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {itemToRate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay nền đen mờ + blur */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => {
              setItemToRate(null);
              setRating(null);
              setReview("");
            }}
          />

          {/* Nội dung Hộp thoại (Card) */}
          <div className="relative bg-white border border-slate-200 w-full max-w-md rounded-xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            {/* Header Popup */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                Rate{" "}
                {typeof itemToRate.seller === "string"
                  ? itemToRate.seller
                  : itemToRate.seller?.fullName ||
                    itemToRate.seller?.username ||
                    "Seller"}
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                How was your experience with this seller?
              </p>
            </div>

            {/* Body: Thumbs Buttons */}
            <div className="space-y-6">
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setRating("up")}
                  className={`group flex-1 h-24 flex flex-col items-center justify-center rounded-xl border-2 transition-all ${
                    rating === "up"
                      ? "border-green-500 bg-green-50"
                      : "border-slate-100 bg-slate-50 hover:border-green-500 hover:bg-green-50"
                  }`}
                >
                  <ThumbsUp
                    className={`h-8 w-8 mb-1 transition-colors ${
                      rating === "up"
                        ? "text-green-600"
                        : "text-slate-400 group-hover:text-green-600"
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      rating === "up"
                        ? "text-green-700"
                        : "text-slate-600 group-hover:text-green-700"
                    }`}
                  >
                    Thumbs Up
                  </span>
                  <span className="text-xs text-slate-400">(+1)</span>
                </button>

                <button
                  onClick={() => setRating("down")}
                  className={`group flex-1 h-24 flex flex-col items-center justify-center rounded-xl border-2 transition-all ${
                    rating === "down"
                      ? "border-red-500 bg-red-50"
                      : "border-slate-100 bg-slate-50 hover:border-red-500 hover:bg-red-50"
                  }`}
                >
                  <ThumbsDown
                    className={`h-8 w-8 mb-1 transition-colors ${
                      rating === "down"
                        ? "text-red-600"
                        : "text-slate-400 group-hover:text-red-600"
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      rating === "down"
                        ? "text-red-700"
                        : "text-slate-600 group-hover:text-red-700"
                    }`}
                  >
                    Thumbs Down
                  </span>
                  <span className="text-xs text-slate-400">(-1)</span>
                </button>
              </div>

              {/* Body: Comment Area */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Share more details about the product or delivery..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                  rows={4}
                />
              </div>

              {/* Footer: Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    setItemToRate(null);
                    setRating(null);
                    setReview("");
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors hover:cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-900 hover:cursor-pointer"
                  onClick={handleSubmitRating}
                  disabled={isLoading || !rating || !review.trim()}
                >
                  {isLoading ? "Submitting..." : "Submit Rating"}
                </button>
              </div>
            </div>

            {/* Nút X đóng nhanh ở góc */}
            <button
              onClick={() => {
                setItemToRate(null);
                setRating(null);
                setReview("");
              }}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WonAuctionsPage;
