import { AlertCircle, Gavel } from "lucide-react";

interface ConfirmBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bidAmount: number;
  currentPrice: number;
  productTitle: string;
}

export default function ConfirmBidModal({
  isOpen,
  onClose,
  onConfirm,
  bidAmount,
  currentPrice,
  productTitle,
}: ConfirmBidModalProps) {
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
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Gavel className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Confirm Your Bid</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You are about to place a bid on{" "}
            <span className="font-semibold text-foreground">
              {productTitle}
            </span>
          </p>
        </div>

        {/* Bid Details */}
        <div className="px-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Current Price:
              </span>
              <span className="text-lg font-semibold">
                ${currentPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-sm text-muted-foreground">Your Bid:</span>
              <span className="text-2xl font-bold text-primary">
                ${bidAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Note:
                </p>
                <p className="text-blue-800 dark:text-blue-200">
                  By confirming, you agree to purchase this item at your bid
                  price if you win the auction. Make sure you have reviewed all
                  product details before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 flex justify-end gap-3 bg-gray-50 dark:bg-slate-800/50 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition-colors hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-md bg-black text-white hover:bg-gray-600 transition-colors shadow-sm flex items-center gap-2 hover:cursor-pointer"
          >
            <Gavel className="h-4 w-4" />
            Confirm Bid
          </button>
        </div>
      </div>
    </div>
  );
}
