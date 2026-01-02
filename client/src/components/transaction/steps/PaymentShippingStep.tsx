import React from "react";
import { Upload, Package, Loader2 } from "lucide-react";

interface PaymentShippingStepProps {
  userRole: "winner" | "seller" | string;
  shippingAddress: string;
  setShippingAddress: (value: string) => void;
  paymentProof: File | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const PaymentShippingStep = ({
  userRole,
  shippingAddress,
  setShippingAddress,
  paymentProof,
  onFileUpload,
  onSubmit,
  isLoading = false,
}: PaymentShippingStepProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Step 1: Payment & Shipping Information
        </h2>
        <p className="text-sm text-muted-foreground">
          {userRole === "winner"
            ? "Please provide your shipping address and upload payment proof"
            : "Waiting for the winner to submit payment information"}
        </p>
      </div>

      {userRole === "winner" ? (
        <div className="space-y-4">
          {/* 1. Nhập địa chỉ */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Shipping Address
            </label>
            <textarea
              placeholder="Enter your full shipping address..."
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows={4}
              className="resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
          </div>

          {/* 2. Upload ảnh */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Payment Proof
            </label>
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/5">
              <input
                type="file"
                id="payment-upload"
                className="hidden"
                accept="image/*,.pdf"
                onChange={onFileUpload}
              />
              <label htmlFor="payment-upload" className="cursor-pointer block">
                <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {paymentProof
                    ? paymentProof.name
                    : "Click to upload payment proof"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG or PDF up to 10MB
                </p>
              </label>
            </div>
          </div>

          {/* 3. Nút Submit */}
          <button
            onClick={onSubmit}
            disabled={isLoading || !shippingAddress || !paymentProof}
            className="w-full p-2 rounded-xl bg-black text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Submitting..." : "Submit Payment"}
          </button>
        </div>
      ) : (
        // Giao diện chờ cho Seller
        <div className="py-12 text-center bg-muted/10 rounded-lg border border-dashed">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground font-medium">
            Waiting for buyer to submit payment information...
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentShippingStep;
