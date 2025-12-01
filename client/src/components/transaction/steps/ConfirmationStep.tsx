import React from "react";
import { Upload, CreditCard } from "lucide-react";

interface ConfirmationStepProps {
  userRole: "winner" | "seller" | string;
  shippingAddress: string;
  paymentProof: File | null;
  shippingReceipt: File | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirm: () => void;
}

const ConfirmationStep = ({
  userRole,
  shippingAddress,
  paymentProof,
  shippingReceipt,
  onFileUpload,
  onConfirm,
}: ConfirmationStepProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Step 2: Payment Confirmation
        </h2>
        <p className="text-sm text-muted-foreground">
          {userRole === "seller"
            ? "Review the payment proof and confirm receipt"
            : "Seller is verifying your payment"}
        </p>
      </div>

      {/* Conditional Content */}
      {userRole === "seller" ? (
        <div className="space-y-4">
          {/* 1. Review Shipping Address */}
          <div className="bg-muted/50 p-4 rounded-lg border">
            <p className="text-sm font-medium mb-2">Shipping Address:</p>
            <p className="text-sm text-muted-foreground">
              {shippingAddress || "No address provided"}
            </p>
          </div>

          {/* 2. Review Payment Proof */}
          <div className="bg-muted/50 p-4 rounded-lg border">
            <p className="text-sm font-medium mb-2">
              Payment Proof (from Buyer):
            </p>
            <div className="flex items-center gap-2 bg-background p-2 rounded border">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm truncate">
                {paymentProof?.name || "payment_proof_placeholder.jpg"}
              </span>
            </div>
          </div>

          {/* 3. Upload Shipping Receipt (Hành động của Seller) */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Upload Shipping Receipt
            </label>
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/5">
              <input
                type="file"
                id="shipping-upload"
                className="hidden"
                accept="image/*,.pdf"
                onChange={onFileUpload}
              />
              <label htmlFor="shipping-upload" className="cursor-pointer block">
                <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {shippingReceipt
                    ? shippingReceipt.name
                    : "Click to upload shipping receipt"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG or PDF up to 10MB
                </p>
              </label>
            </div>
          </div>

          {/* 4. Action Button */}
          <button
            onClick={onConfirm}
            className="w-full p-2 rounded-xl bg-black text-white font-semibold"
          >
            Confirm Money Received & Upload Receipt
          </button>
        </div>
      ) : (
        // Waiting State cho Buyer
        <div className="py-12 text-center bg-muted/10 rounded-lg border border-dashed">
          <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground font-medium">
            Seller is verifying your payment...
          </p>
        </div>
      )}
    </div>
  );
};

export default ConfirmationStep;
