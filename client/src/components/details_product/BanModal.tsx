// BanModal.tsx
import { AlertCircle, Ban } from "lucide-react";

interface BanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  // Dữ liệu truyền vào để hiển thị logic
  bidderName: string;
  isHighestBidder: boolean; // Thay vì truyền index, ta truyền boolean cho dễ hiểu
  nextBidderName?: string;
  nextBidderAmount?: number;
}

export default function BanModal({
  isOpen,
  onClose,
  onConfirm,
  bidderName,
  isHighestBidder,
  nextBidderName,
  nextBidderAmount,
}: BanModalProps) {
  // Nếu không mở thì không render gì cả (return null)
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-lg shadow-xl border overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <h2 className="text-lg font-semibold mb-2">
            Reject Bidder & Cancel Bid?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to reject bidder{" "}
            <span className="font-semibold text-foreground text-black dark:text-white">
              {bidderName}
            </span>
            ? They will be permanently banned from bidding on this product.
          </p>
        </div>

        {/* Logic Explanation Box (Phần logic màu vàng bạn muốn giữ) */}
        <div className="px-6">
          <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  Note:
                </p>
                <p className="text-amber-800 dark:text-amber-200">
                  {isHighestBidder ? (
                    <>
                      This user holds the current highest bid. The highest price
                      will automatically revert to the second highest bidder (
                      <span className="font-semibold">{nextBidderName}</span> at
                      ${nextBidderAmount}).
                    </>
                  ) : (
                    <>
                      This action will remove this user's bid from the auction.
                      The current highest bid will remain unchanged.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (Buttons) */}
        <div className="p-6 flex justify-end gap-3 bg-gray-50 dark:bg-slate-800/50 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
          >
            Confirm Ban
          </button>
        </div>
      </div>
    </div>
  );
}
