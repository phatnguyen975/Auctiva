import { useState, useEffect } from "react";

import { Send, MessageCircle, AlertTriangle, Loader2 } from "lucide-react";

import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { getHeaders } from "../../utils/getHeaders";
import { uploadTransactionFile } from "../../utils/uploadFile";

import Progress from "./Progress";
import PaymentShippingStep from "./steps/PaymentShippingStep";
import Input from "../ui/Input";
import ConfirmationStep from "./steps/ConfirmationStep";
import DeliveryStep from "./steps/DeliveryStep";
import RatingStep from "./steps/RatingStep";
import CancelTransactionModal from "./steps/CancelTransactionModal";

interface TransactionFlowProps {
  transactionId: string;
  userRole: "winner" | "seller";
  partnerName: string;
  productTitle: string;
  winningBid: string;
}

type TransactionStep = 1 | 2 | 3 | 4;

interface TransactionData {
  id: string;
  status: string;
  shippingAddress?: string;
  paymentProofUrl?: string;
  shippingReceiptUrl?: string;
  buyerRating?: "up" | "down";
  sellerRating?: "up" | "down";
  buyerReview?: string;
  sellerReview?: string;
}

const TransactionFlow = ({
  transactionId,
  userRole,
  partnerName,
  productTitle,
  winningBid,
}: TransactionFlowProps) => {
  const [currentStep, setCurrentStep] = useState<TransactionStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [shippingReceipt, setShippingReceipt] = useState<File | null>(null);
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [review, setReview] = useState("");
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "partner",
      text: "Hi! Looking forward to completing this transaction.",
      time: "10:30 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Fetch transaction details
  useEffect(() => {
    fetchTransactionDetail();
  }, [transactionId]);

  const fetchTransactionDetail = async () => {
    try {
      setIsFetching(true);
      const headers = getHeaders();
      const response = await axiosInstance.get(
        `/transactions/${transactionId}`,
        { headers }
      );

      if (response.data) {
        const rawData = response.data.data || response.data;

        // Map backend field names to frontend (paymentProof -> paymentProofUrl)
        const data: TransactionData = {
          ...rawData,
          paymentProofUrl: rawData.paymentProof || rawData.paymentProofUrl,
          shippingReceiptUrl:
            rawData.shippingReceipt || rawData.shippingReceiptUrl,
        };

        setTransactionData(data);

        // Set current step based on status
        switch (data.status) {
          case "pending":
            setCurrentStep(1);
            break;
          case "paid":
            setCurrentStep(2);
            break;
          case "shipped":
            setCurrentStep(3);
            break;
          case "completed":
            setCurrentStep(4);
            break;
          default:
            setCurrentStep(1);
        }

        // Load existing data
        if (data.shippingAddress) setShippingAddress(data.shippingAddress);
        if (data.buyerRating) setRating(data.buyerRating);
        if (data.sellerRating) setRating(data.sellerRating);
        if (userRole === "winner" && data.buyerReview)
          setReview(data.buyerReview);
        if (userRole === "seller" && data.sellerReview)
          setReview(data.sellerReview);
      }
    } catch (error: any) {
      console.error("Error fetching transaction:", error);
      toast.error(
        error.response?.data?.message || "Failed to load transaction"
      );
    } finally {
      setIsFetching(false);
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "payment" | "shipping"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      if (type === "payment") {
        setPaymentProof(file);
        toast.success("Payment proof selected");
      } else {
        setShippingReceipt(file);
        toast.success("Shipping receipt selected");
      }
    }
  };

  const handleSubmitPayment = async () => {
    if (!shippingAddress || !paymentProof) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);

      // Upload file to Supabase Storage first
      const paymentProofUrl = await uploadTransactionFile(
        paymentProof,
        "payment-proofs",
        transactionId
      );

      // Send URL to backend
      const authHeaders = getHeaders();
      const response = await axiosInstance.post(
        `/transactions/${transactionId}/payment`,
        {
          shippingAddress,
          paymentProofUrl,
        },
        {
          headers: authHeaders,
        }
      );

      if (response.data.success) {
        toast.success("Payment submitted! Waiting for seller confirmation.");
        await fetchTransactionDetail(); // Refresh data
      }
    } catch (error: any) {
      console.error("Error submitting payment:", error);
      toast.error(error.response?.data?.message || "Failed to submit payment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!shippingReceipt) {
      toast.error("Please upload shipping receipt");
      return;
    }

    try {
      setIsLoading(true);

      // Upload file to Supabase Storage first
      const shippingReceiptUrl = await uploadTransactionFile(
        shippingReceipt,
        "shipping-receipts",
        transactionId
      );

      // Send URL to backend
      const authHeaders = getHeaders();
      const response = await axiosInstance.post(
        `/transactions/${transactionId}/ship`,
        {
          shippingReceiptUrl,
        },
        {
          headers: authHeaders,
        }
      );

      if (response.data.success) {
        toast.success("Payment confirmed! Package is on the way.");
        await fetchTransactionDetail(); // Refresh data
      }
    } catch (error: any) {
      console.error("Error confirming shipping:", error);
      toast.error(
        error.response?.data?.message || "Failed to confirm shipping"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelivery = async () => {
    try {
      setIsLoading(true);

      const headers = getHeaders();
      const response = await axiosInstance.post(
        `/transactions/${transactionId}/receive`,
        {},
        { headers }
      );

      if (response.data.success) {
        toast.success("Package received! Please rate this transaction.");
        await fetchTransactionDetail(); // Refresh data
      }
    } catch (error: any) {
      console.error("Error confirming delivery:", error);
      toast.error(
        error.response?.data?.message || "Failed to confirm delivery"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!rating) {
      toast.error("Please select thumbs up or down");
      return;
    }

    if (!review || review.trim().length === 0) {
      toast.error("Please write a review comment");
      return;
    }

    try {
      setIsLoading(true);

      // Convert thumbs up/down to score: +1 or -1
      const score = rating === "up" ? 1 : -1;

      const headers = getHeaders();
      const response = await axiosInstance.post(
        `/transactions/${transactionId}/rate`,
        {
          score: score,
          comment: review,
        },
        { headers }
      );

      if (response.data.success) {
        toast.success("Rating submitted successfully!");
        setIsEditingReview(false);
        await fetchTransactionDetail(); // Refresh data
      }
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      toast.error(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "me",
        text: newMessage,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setNewMessage("");
  };

  const handleCancelTransaction = async () => {
    try {
      setIsLoading(true);

      const headers = getHeaders();
      const response = await axiosInstance.post(
        `/transactions/${transactionId}/cancel`,
        {},
        { headers }
      );

      if (response.data.success) {
        toast.error("Transaction cancelled. Negative rating applied.");
        await fetchTransactionDetail(); // Refresh data
      }
    } catch (error: any) {
      console.error("Error cancelling transaction:", error);
      toast.error(
        error.response?.data?.message || "Failed to cancel transaction"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCancel = () => {
    handleCancelTransaction();
    setIsCancelModalOpen(false);
  };

  // Show loading state while fetching
  if (isFetching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <span
            className="mb-4 inline-flex items-center bg-transparent hover:bg-amber-600 justify-center rounded-md border px-2 py-0.5 text-xs font-medium  w-fit whitespace-nowrap 
                  text-primary border-primary shrink-0 gap-1"
          >
            Transaction in Progress
          </span>
          <h1 className="text-2xl font-bold mb-2">{productTitle}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Final Bid: {winningBid}</span>
            <span>•</span>
            <span>
              {userRole === "winner" ? "Seller" : "Winner"}: {partnerName}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress currentStep={currentStep} />
        </div>

        {/* Main Content: Split View */}
        <div className="grid lg:grid-cols-[65%_35%] gap-6">
          {/* Left Column: Transaction Steps */}
          <div>
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border transition-colors duration-300 p-6">
              {/* Step 1: Payment & Shipping */}
              {currentStep === 1 && (
                <PaymentShippingStep
                  userRole={userRole}
                  shippingAddress={shippingAddress}
                  setShippingAddress={setShippingAddress}
                  paymentProof={paymentProof}
                  onFileUpload={(e) => handleFileUpload(e, "payment")}
                  onSubmit={handleSubmitPayment}
                  isLoading={isLoading}
                />
              )}

              {/* Step 2: Confirmation */}
              {currentStep === 2 && (
                <ConfirmationStep
                  userRole={userRole}
                  shippingAddress={shippingAddress}
                  paymentProof={paymentProof}
                  paymentProofUrl={transactionData?.paymentProofUrl}
                  shippingReceipt={shippingReceipt}
                  onFileUpload={(e) => handleFileUpload(e, "shipping")}
                  onConfirm={handleConfirmPayment}
                  isLoading={isLoading}
                />
              )}

              {/* Step 3: Delivery */}
              {currentStep === 3 && (
                <DeliveryStep
                  userRole={userRole}
                  shippingReceipt={shippingReceipt}
                  shippingReceiptUrl={transactionData?.shippingReceiptUrl}
                  onConfirm={handleConfirmDelivery}
                  isLoading={isLoading}
                />
              )}

              {/* Step 4: Rating */}
              {currentStep === 4 && (
                <RatingStep
                  rating={rating}
                  setRating={setRating}
                  review={review}
                  setReview={setReview}
                  isEditingReview={isEditingReview}
                  setIsEditingReview={setIsEditingReview}
                  onSubmit={handleSubmitRating}
                  isLoading={isLoading}
                />
              )}

              {/* Cancel Transaction Button */}
              {userRole === "seller" && currentStep < 4 && (
                <div className="mt-6 pt-6 border-t">
                  <button
                    className="w-full flex justify-center items-center p-2 rounded-xl bg-red-400/60 text-black font-semibold hover:cursor-pointer hover:bg-red-400"
                    onClick={() => setIsCancelModalOpen(true)} // Mở modal khi bấm
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Cancel Transaction
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Chat */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-card text-card-foreground h-[600px] flex flex-col gap-6 rounded-xl border transition-colors duration-300">
              {/* Chat Header */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="relative flex size-10 shrink-0 overflow-hidden rounded-full h-12 w-12 border-2 border-amber-400">
                    <div className="bg-yellow-300 flex size-full items-center justify-center rounded-full w-full h-full object-cover">
                      {partnerName.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Chat with {partnerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {userRole === "winner" ? "Seller" : "Winner"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex text-white font-medium ${
                      message.sender === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        message.sender === "me" ? "bg-cyan-800" : "bg-gray-800"
                      } rounded-lg px-4 py-2`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs mt-1 text-gray-400">
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t">
                <div className="grid grid-cols-[9fr_1fr] gap-2">
                  <Input
                    icon={MessageCircle}
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    className="inline-flex shrink-0 items-center justify-center gap-2 hover:cursor-pointer hover:bg-gray-200"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Transaction Confirm Modal */}
      <CancelTransactionModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </>
  );
};

export default TransactionFlow;
