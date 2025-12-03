import { useState } from "react";

import { Send, MessageCircle, AlertTriangle } from "lucide-react";

import toast from "react-hot-toast";

import Progress from "./Progress";
import PaymentShippingStep from "./steps/PaymentShippingStep";
import Input from "../ui/Input";
import ConfirmationStep from "./steps/ConfirmationStep";
import DeliveryStep from "./steps/DeliveryStep";
import RatingStep from "./steps/RatingStep";
import CancelTransactionModal from "./steps/CancelTransactionModal";

interface TransactionFlowProps {
  userRole: "winner" | "seller";
  partnerName: string;
  productTitle: string;
  winningBid: string;
}

type TransactionStep = 1 | 2 | 3 | 4;

const TransactionFlow = ({
  userRole,
  partnerName,
  productTitle,
  winningBid,
}: TransactionFlowProps) => {
  const [currentStep, setCurrentStep] = useState<TransactionStep>(2);
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

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "payment" | "shipping"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "payment") {
        setPaymentProof(file);
        toast.success("Payment proof uploaded");
      } else {
        setShippingReceipt(file);
        toast.success("Shipping receipt uploaded");
      }
    }
  };

  const handleSubmitPayment = () => {
    if (!shippingAddress || !paymentProof) {
      toast.error("Please fill in all fields");
      return;
    }
    setCurrentStep(2);
    toast.success("Payment submitted! Waiting for seller confirmation.");
  };

  const handleConfirmPayment = () => {
    if (!shippingReceipt) {
      toast.error("Please upload shipping receipt");
      return;
    }
    setCurrentStep(3);
    toast.success("Payment confirmed! Package is on the way.");
  };

  const handleConfirmDelivery = () => {
    setCurrentStep(4);
    toast.success("Package received! Please rate this transaction.");
  };

  const handleSubmitRating = () => {
    if (!rating) {
      toast.error("Please select thumbs up or down");
      return;
    }
    toast.success("Rating submitted successfully!");
    setIsEditingReview(false);
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

  const handleCancelTransaction = () => {
    toast.error("Transaction cancelled. Negative rating applied.");
    // In real app: navigate back or show cancelled state
  };

  const handleConfirmCancel = () => {
    handleCancelTransaction(); // Gọi hàm xử lý logic khi cancel transaction
    setIsCancelModalOpen(false); // Đóng modal sau khi xong
  };

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
                  userRole={userRole} // "winner" hoặc "seller"
                  shippingAddress={shippingAddress}
                  setShippingAddress={setShippingAddress}
                  paymentProof={paymentProof}
                  onFileUpload={(e) => handleFileUpload(e, "payment")}
                  onSubmit={handleSubmitPayment}
                />
              )}

              {/* Step 2: Confirmation */}
              {currentStep === 2 && (
                <ConfirmationStep
                  userRole={userRole}
                  shippingAddress={shippingAddress}
                  paymentProof={paymentProof}
                  shippingReceipt={shippingReceipt}
                  onFileUpload={(e) => handleFileUpload(e, "shipping")}
                  onConfirm={handleConfirmPayment}
                />
              )}

              {/* Step 3: Delivery */}
              {currentStep === 3 && (
                <DeliveryStep
                  userRole={userRole}
                  shippingReceipt={shippingReceipt} // File receipt mà seller đã up ở bước trước
                  onConfirm={handleConfirmDelivery}
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
