import { ThumbsUp, ThumbsDown, Edit, Loader2 } from "lucide-react";

interface RatingStepProps {
  rating: "up" | "down" | null;
  setRating: (value: "up" | "down") => void;
  review: string;
  setReview: (value: string) => void;
  isEditingReview: boolean;
  setIsEditingReview: (value: boolean) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const RatingStep = ({
  rating,
  setRating,
  review,
  setReview,
  isEditingReview,
  setIsEditingReview,
  onSubmit,
  isLoading = false,
}: RatingStepProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Step 4: Rate This Transaction
        </h2>
        <p className="text-sm text-muted-foreground">
          Share your experience with this transaction
        </p>
      </div>

      <div className="space-y-4">
        {/* 1. Rating Buttons */}
        <div>
          <label className="text-sm font-medium mb-3 block">
            How was your experience?
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              className={`flex justify-center items-center p-2 rounded-xl font-semibold hover:cursor-pointer ${
                rating === "up"
                  ? "bg-green-400 text-white"
                  : "bg-gray-400/30 text-black hover:bg-gray-400/60"
              }`}
              onClick={() => setRating("up")}
            >
              <ThumbsUp className="h-5 w-5 mr-2" />
              Thumbs Up
            </button>

            <button
              className={`flex justify-center items-center p-2 rounded-xl font-semibold hover:cursor-pointer ${
                rating === "down"
                  ? "bg-red-400 text-white"
                  : "bg-gray-400/30 text-black hover:bg-gray-400/60"
              }`}
              //className="flex justify-center items-center p-2 rounded-xl bg-gray-400/30 text-black font-semibold hover:cursor-pointer hover:bg-gray-400/60"
              onClick={() => setRating("down")}
            >
              <ThumbsDown className="h-5 w-5 mr-2" />
              Thumbs Down
            </button>
          </div>
        </div>

        {/* 2. Review Textarea */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Write a Review (Optional)
          </label>
          <textarea
            placeholder="Share your experience..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={5}
            // Logic disable: Nếu đã rate và không ở chế độ edit thì khóa lại
            disabled={!isEditingReview && rating !== null}
            className="resize-none flex field-sizing-content min-h-16 w-full rounded-md border  px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
        </div>

        {/* 3. Action Buttons (Submit vs Edit Logic) */}
        {rating && !isEditingReview ? (
          // Trạng thái đã chọn rating -> Hiện nút Edit & Confirm
          <div className="grid grid-cols-2 gap-2">
            <button
              className="flex justify-center items-center p-2 rounded-xl bg-gray-400/30 text-black font-semibold hover:cursor-pointer hover:bg-gray-400/60 disabled:opacity-50"
              onClick={() => setIsEditingReview(true)}
              disabled={isLoading}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Review
            </button>
            <button
              className="flex-1 p-2 rounded-xl bg-black text-white font-semibold hover:cursor-pointer hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={onSubmit}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Submitting..." : "Confirm Rating"}
            </button>
          </div>
        ) : (
          // Trạng thái chưa chọn hoặc đang edit -> Hiện nút Submit
          <button
            className="w-full flex-1 p-2 rounded-xl bg-black text-white font-semibold hover:cursor-pointer hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={onSubmit}
            disabled={isLoading || !rating}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Submitting..." : "Submit Rating"}
          </button>
        )}
      </div>

      {/* 4. Note Box */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> You can edit your review later by clicking the
          "Edit Review" button.
        </p>
      </div>
    </div>
  );
};

export default RatingStep;
