import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PackageCheck,
  Star,
  Award,
  ThumbsUp,
  ThumbsDown,
  XCircle,
  AlertTriangle,
  Eye,
} from "lucide-react";
import type { SoldProduct } from "../../../types/product";
import type { RootState } from "../../../store/store";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { maskName } from "../../../utils/masking";

const SoldItemsPage = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [soldProducts, setSoldProducts] = useState<SoldProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showRateDialog, setShowRateDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingScore, setRatingScore] = useState<number | null>(null);

  const handleRatingSubmit = async () => {
    try {
      setIsLoading(true);

      if (!selectedProduct || !ratingScore) {
        return;
      }

      const payload = {
        targetUserId: soldProducts[selectedProduct].winner.id,
        type: "seller_bidder",
        score: ratingScore,
        comment: ratingComment,
      };

      const { data } = await axiosInstance.post(
        `/products/${selectedProduct}/ratings`,
        payload,
        {
          headers: {
            "x-api-key": import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (data.success) {
        setRatingComment("");
        setRatingScore(null);
        setShowRateDialog(false);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error("Error rating winner:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelTransaction = async () => {
    try {
      setIsLoading(true);
      setShowCancelDialog(false);
    } catch (error: any) {
      console.error("Error canceling transaction:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSoldProducts = async () => {
    try {
      setIsLoading(true);

      const { data } = await axiosInstance.get("/products/sold", {
        headers: {
          "x-api-key": import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (data.success) {
        setSoldProducts(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error("Error loading sold products:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSoldProducts();
  }, []);

  console.log("Sold Products:", soldProducts);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Sold Items</h2>
        <p className="text-[hsl(var(--muted-foreground))]">
          Completed auctions and transactions
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : soldProducts.length === 0 ? (
        <div className="text-center py-16">
          <PackageCheck className="h-16 w-16 text-[hsl(var(--muted-foreground))] mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-semibold mb-2">No sold items yet</h3>
          <p className="text-[hsl(var(--muted-foreground))] mb-6">
            Your completed sales will appear here
          </p>
        </div>
      ) : (
        <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl border border-[hsl(var(--border))] transition-colors duration-300">
          <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b border-[hsl(var(--border))]">
                <tr className="border-b border-[hsl(var(--border))] transition-colors hover:bg-[hsl(var(--muted)/0.5)]">
                  <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                    Product
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                    Winner
                  </th>
                  <th className="h-12 min-w-25 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                    Sold Price
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                    Payment
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {soldProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[hsl(var(--border))] transition-colors hover:bg-[hsl(var(--muted)/0.5)]"
                  >
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div>
                        <div className="font-medium">
                          {maskName(product.winner.fullName) ||
                            maskName(product.winner.username || "Unknown")}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-amber-600">
                            {(
                              (product.winner.ratingPositive /
                                product.winner.ratingCount) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle font-bold text-[hsl(var(--primary))]">
                      ${product.currentPrice.toLocaleString()}
                    </td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                          product.transactions[0].status === "paid"
                            ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                            : "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]"
                        }`}
                      >
                        {product.transactions[0].status || "paid"}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        {/* NÚT VIEW TRANSACTION MỚI THÊM */}
                        <button
                          onClick={() =>
                            navigate(
                              `/transaction/${product.transactions[0]?.id}`
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:cursor-pointer h-9 px-3 w-full"
                        >
                          <Eye className="h-4 w-4" />
                          View Transaction
                        </button>

                        {!!product.ratings[0] && (
                          <button
                            onClick={() => {
                              setSelectedProduct(product.id);
                              setShowRateDialog(true);
                            }}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:ring-[hsl(var(--ring)/0.5)] focus-visible:ring-[3px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] hover:cursor-pointer h-8 px-3"
                          >
                            <Award className="h-4 w-4" />
                            Rate Buyer
                          </button>
                        )}

                        {product.transactions[0].status === "pending" && (
                          <button
                            onClick={() => {
                              setSelectedProduct(product.id);
                              setShowCancelDialog(true);
                            }}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:ring-[hsl(var(--ring)/0.5)] focus-visible:ring-[3px] bg-[hsl(var(--destructive))] text-white hover:bg-[hsl(var(--destructive)/0.9)] hover:cursor-pointer h-8 px-3"
                          >
                            <XCircle className="h-4 w-4" />
                            Cancel
                          </button>
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

      {/* Rate Dialog */}
      {showRateDialog && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-[hsl(var(--card))] rounded-lg shadow-lg max-w-lg w-full mx-4 p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Rate Buyer</h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  How was your experience with this buyer?
                </p>
              </div>

              <div className="flex gap-3 justify-center py-4">
                <button
                  onClick={() => setRatingScore(1)}
                  className="flex-1 h-20 flex flex-col items-center justify-center rounded-md border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] hover:cursor-pointer transition-all"
                >
                  <ThumbsUp className="h-8 w-8 mb-2 text-green-600" />
                  <span>Thumbs Up</span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    (+1)
                  </span>
                </button>
                <button
                  onClick={() => setRatingScore(-1)}
                  className="flex-1 h-20 flex flex-col items-center justify-center rounded-md border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] hover:cursor-pointer transition-all"
                >
                  <ThumbsDown className="h-8 w-8 mb-2 text-[hsl(var(--destructive))]" />
                  <span>Thumbs Down</span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    (-1)
                  </span>
                </button>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Comment (Optional)
                </label>
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Share your experience with this buyer..."
                  className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowRateDialog(false);
                    setRatingComment("");
                  }}
                  className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-all border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:cursor-pointer h-10 px-4"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRatingSubmit}
                  className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-all bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.9)] hover:cursor-pointer h-10 px-4"
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-[hsl(var(--card))] rounded-lg shadow-lg max-w-lg w-full mx-4 p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Cancel Transaction?</h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
                  Are you sure you want to cancel this transaction?
                </p>
              </div>

              <div className="bg-[hsl(var(--destructive)/0.1)] border border-[hsl(var(--destructive)/0.2)] rounded-lg p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-[hsl(var(--destructive))] shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-[hsl(var(--destructive))] mb-1">
                    Important:
                  </p>
                  <p>
                    Canceling will automatically rate the buyer (-1) with the
                    comment: "Buyer did not pay"
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-all border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:cursor-pointer h-10 px-4"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelTransaction}
                  className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-all bg-[hsl(var(--destructive))] text-white hover:bg-[hsl(var(--destructive)/0.9)] hover:cursor-pointer h-10 px-4"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoldItemsPage;
