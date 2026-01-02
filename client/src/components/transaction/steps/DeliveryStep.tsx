import { CheckCircle2, Upload, Truck, Loader2 } from "lucide-react";

interface DeliveryStepProps {
  userRole: "winner" | "seller" | string;
  shippingReceipt: File | null;
  shippingReceiptUrl?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DeliveryStep = ({
  userRole,
  shippingReceipt,
  shippingReceiptUrl,
  onConfirm,
  isLoading = false,
}: DeliveryStepProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Step 3: Package Delivery</h2>
        <p className="text-sm text-muted-foreground">
          {userRole === "winner"
            ? "Confirm when you receive the package"
            : "Waiting for buyer to confirm delivery"}
        </p>
      </div>

      {/* Conditional Content */}
      {userRole === "winner" ? (
        <div className="space-y-4">
          {/* 1. Status Banner */}
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  Package is on the way!
                </p>
                <p className="text-sm text-green-700 mt-1">
                  The seller has confirmed shipment. Please confirm once you
                  receive the package.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Shipping Receipt Preview */}
          <div className="bg-muted/50 p-4 rounded-lg border">
            <p className="text-sm font-medium mb-2">
              Shipping Receipt (from Seller):
            </p>
            {shippingReceiptUrl ? (
              <div className="space-y-2">
                <img
                  src={shippingReceiptUrl}
                  alt="Shipping Receipt"
                  className="w-full max-h-96 object-contain rounded border"
                />
                <a
                  href={shippingReceiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Upload className="h-3 w-3" />
                  View full size
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-background p-2 rounded border">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate">
                  {shippingReceipt?.name || "No shipping receipt uploaded yet"}
                </span>
              </div>
            )}
          </div>

          {/* 3. Action Button */}
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full p-2 rounded-xl bg-black text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Confirming..." : "I Have Received the Package"}
          </button>
        </div>
      ) : (
        // Waiting State for Seller
        <div className="py-12 text-center bg-muted/10 rounded-lg border border-dashed">
          <Truck className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground font-medium">
            Waiting for buyer to confirm package delivery...
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryStep;
