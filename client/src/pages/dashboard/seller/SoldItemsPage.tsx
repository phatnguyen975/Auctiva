import { useState } from "react";
import {
  PackageCheck,
  Star,
  Award,
  ThumbsUp,
  ThumbsDown,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { dumpySoldItems } from "../../../assets/assets";

const SoldItemsPage = () => {
  const [showRateDialog, setShowRateDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [ratingComment, setRatingComment] = useState("");

  // Use mock data from assets
  const soldItems = dumpySoldItems;

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
      {soldItems.length === 0 ? (
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
                  <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
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
                {soldItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[hsl(var(--border))] transition-colors hover:bg-[hsl(var(--muted)/0.5)]"
                  >
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <span className="font-medium">{item.title}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div>
                        <div className="font-medium">{item.winner}</div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-amber-600">
                            {item.winnerRating}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle font-bold text-[hsl(var(--primary))]">
                      ${item.soldPrice.toLocaleString()}
                    </td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                          item.paymentStatus === "paid"
                            ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                            : "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]"
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        {!item.rated && (
                          <button
                            onClick={() => {
                              setSelectedItem(item.id);
                              setShowRateDialog(true);
                            }}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:ring-[hsl(var(--ring)/0.5)] focus-visible:ring-[3px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] hover:cursor-pointer h-8 px-3"
                          >
                            <Award className="h-4 w-4" />
                            Rate Buyer
                          </button>
                        )}

                        {item.paymentStatus === "pending" && (
                          <button
                            onClick={() => {
                              setSelectedItem(item.id);
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
                <button className="flex-1 h-20 flex flex-col items-center justify-center rounded-md border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] hover:cursor-pointer transition-all">
                  <ThumbsUp className="h-8 w-8 mb-2 text-green-600" />
                  <span>Thumbs Up</span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    (+1)
                  </span>
                </button>
                <button className="flex-1 h-20 flex flex-col items-center justify-center rounded-md border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] hover:cursor-pointer transition-all">
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
                  onClick={() => {
                    // Handle submit rating
                    setShowRateDialog(false);
                    setRatingComment("");
                  }}
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
                <AlertTriangle className="h-5 w-5 text-[hsl(var(--destructive))] flex-shrink-0 mt-0.5" />
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
                  onClick={() => {
                    // Handle cancel transaction
                    setShowCancelDialog(false);
                  }}
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
