import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import {
  Star,
  Mail,
  Calendar,
  MapPin,
  Trophy,
  Gavel,
  ThumbsUp,
  ThumbsDown,
  X,
} from "lucide-react";
import type { RootState } from "../../../store/store";
import { dumpyAllReviews } from "../../../assets/assets";
import { assets } from "../../../assets/assets";

interface Review {
  id: number | string;
  type: "positive" | "negative" | string;
  reviewer: string;
  date: string;
  comment: string;
}

const ProfileOverviewPage = () => {
  const authUser = useSelector((state: RootState) => state.auth.authUser);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);

  const [showAllReviews, setShowAllReviews] = useState(false);

  const calculateUserRating = () => {
    const ratingCount = authUser?.profile?.rating_count;
    const ratingPositive = authUser?.profile?.rating_positive;

    if (!ratingCount || !ratingPositive || ratingCount === 0) {
      return 0;
    }

    return ((ratingPositive / ratingCount) * 100).toFixed(1);
  };

  const userData = {
    username: authUser?.profile?.user_name,
    fullName: authUser?.profile?.full_name,
    email: authUser?.profile?.email,
    address: authUser?.profile?.address,
    dateOfBirth: authUser?.profile?.birth_date,
    avatarUrl: authUser?.profile?.avatar_url || "",
    rating: calculateUserRating(),
    role: authUser?.profile?.role,
    auctionsWon: 45, // Mock
    bidsPlaced: 127, // Mock
  };

  useEffect(() => {
    const loadReviews = async () => {
      // Call API
      setReviews(dumpyAllReviews);
      setRecentReviews(dumpyAllReviews.slice(0, 3));
    };

    loadReviews();
  }, []);

  return (
    <>
      <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex flex-col gap-6 rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-4 sm:p-6 lg:p-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Profile Overview</h2>
            <p className="text-[hsl(var(--muted-foreground))]">
              Your identity and reputation summary
            </p>
          </div>
          {/* Identity & Stats Section */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 pb-8 border-b">
            <div className="flex items-center gap-4">
              <img
                src={userData.avatarUrl || assets.avatar}
                alt={userData.fullName || "Avatar"}
                className="w-20 h-20 rounded-full object-cover border-4 border-[hsl(var(--primary))]/10"
              />
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {userData.fullName || userData.username}
                </h2>
                <span
                  className="inline-flex items-center bg-gray-200 justify-center rounded-lg px-2 py-1 text-xm font-medium w-fit whitespace-nowrap 
                  text-primary border-primary shrink-0 gap-1"
                >
                  {userData.role === "seller" ? "Seller" : "Bidder"}
                </span>
              </div>
            </div>
            <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex flex-col gap-6 rounded-xl border transition-colors duration-300 p-4 lg:p-6 min-w-[180px]">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                  <div className="text-4xl font-bold text-amber-600">
                    {userData.rating}%
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Reputation Score
                </p>
              </div>
            </div>
          </div>
          {/* Personal Information Section */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
            <div className="grid grid-rows-3 lg:grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Date of Birth
                    </p>
                    <p className="font-medium">
                      {userData.dateOfBirth
                        ? userData.dateOfBirth instanceof Date
                          ? userData.dateOfBirth.toString()
                          : userData.dateOfBirth
                        : "None"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Address
                    </p>
                    <p className="font-medium">
                      {userData.address ? userData.address : "None"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Activity Stats</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex flex-col gap-6 rounded-xl border transition-colors duration-300 p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{userData.auctionsWon}</p>
                    <p className="text-sm text-muted-foreground">
                      Auctions Won
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex flex-col gap-6 rounded-xl border transition-colors duration-300 p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/10 p-3 rounded-lg">
                    <Gavel className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{userData.bidsPlaced}</p>
                    <p className="text-sm text-muted-foreground">Bids Placed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reviews */}
          <div>
            {/* --- HEADER CỦA PHẦN REVIEWS --- */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Recent Reviews</h3>
              <button
                className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-200 hover:cursor-pointer"
                onClick={() => setShowAllReviews(true)}
              >
                View All
              </button>
            </div>

            {/* --- DANH SÁCH REVIEW GẦN ĐÂY (HIỂN THỊ MẶC ĐỊNH) --- */}
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL --- */}
      {showAllReviews && (
        // Overlay (Lớp nền tối)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          {/* Modal Container */}
          <div className="relative w-full max-w-2xl max-h-[80vh] bg-[hsl(var(--background))] rounded-xl shadow-2xl flex flex-col border animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-lg font-semibold">All Reviews</h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Complete history of your reviews ({reviews.length} total)
                </p>
              </div>
              <button
                className="h-6 w-6 rounded-md text-sm font-medium transition-colors hover:bg-slate-200 hover:cursor-pointer"
                onClick={() => setShowAllReviews(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>

          {/* Click outside to close (Optional) */}
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setShowAllReviews(false)}
          />
        </div>
      )}
    </>
  );
};

const ReviewItem = ({ review }: { review: Review }) => {
  return (
    <div className="flex items-start gap-4 p-4 bg-[hsl(var(--muted))]/30 rounded-lg border border-border/50">
      <div
        className={`p-2 rounded-lg shrink-0 ${
          review.type === "positive" ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {review.type === "positive" ? (
          <ThumbsUp className="h-5 w-5 text-green-600" />
        ) : (
          <ThumbsDown className="h-5 w-5 text-red-600" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{review.reviewer}</span>
          <span className="text-sm text-[hsl(var(--muted-foreground))]">
            · {review.date}
          </span>
        </div>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          {review.comment}
        </p>
      </div>
    </div>
  );
};

export default ProfileOverviewPage;
