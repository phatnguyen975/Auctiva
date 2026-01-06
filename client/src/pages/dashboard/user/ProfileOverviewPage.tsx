import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import {
  Star,
  Mail,
  Calendar,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  X,
} from "lucide-react";
import type { RootState } from "../../../store/store";
import { assets } from "../../../assets/assets";
import { formatVietnamDateTime } from "../../../utils/date";
import { axiosInstance } from "../../../lib/axios";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

interface Review {
  id: number;
  reviewer: string;
  score: 1 | -1 | number;
  comment: string;
  role: string;
  ratedAt: string;
}

const ReviewItem = ({ review }: { review: Review }) => {
  return (
    <div className="flex items-start gap-4 p-4 bg-[hsl(var(--muted))]/30 rounded-lg border border-border/50">
      <div
        className={`p-2 rounded-lg shrink-0 ${
          review.score === 1 ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {review.score === 1 ? (
          <ThumbsUp className="h-5 w-5 text-green-600" />
        ) : (
          <ThumbsDown className="h-5 w-5 text-red-600" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">
            {review.reviewer} ({review.role})
          </span>
          <span className="text-sm text-[hsl(var(--muted-foreground))]">
            · {new Date(review.ratedAt).toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          {review.comment}
        </p>
      </div>
    </div>
  );
};

const ProfileOverviewPage = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const authUser = useSelector((state: RootState) => state.auth.authUser);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);

  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const calculateUserRating = () => {
    const ratingCount = authUser?.profile?.rating_count;
    const ratingPositive = authUser?.profile?.rating_positive;

    if (!ratingCount || !ratingPositive || ratingCount === 0) {
      return 0;
    }

    return ((ratingPositive / ratingCount) * 100).toFixed(1);
  };

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const userData = {
    username: authUser?.profile?.user_name,
    fullName: authUser?.profile?.full_name,
    email: authUser?.profile?.email,
    address: authUser?.profile?.address,
    dateOfBirth: authUser?.profile?.birth_date,
    avatarUrl: authUser?.profile?.avatar_url || "",
    rating: calculateUserRating(),
    role: authUser?.profile?.role,
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);

        const { data } = await axiosInstance.get("/users/ratings", {
          headers: {
            "x-api-key": import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (data.success) {
          setReviews(data.data);
          setRecentReviews(data.data.slice(0, 3));
        }
      } catch (error: any) {
        console.error("Error loading reviews:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
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
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
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
                          ? formatVietnamDateTime(userData.dateOfBirth)
                          : formatDate(userData.dateOfBirth)
                        : "N/A"}
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
                      {userData.address ? userData.address : "N/A"}
                    </p>
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
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex items-center justify-center text-gray-500">
                No recent reviews
              </div>
            ) : (
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </div>
            )}
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
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : reviews.length === 0 ? (
                <div className="flex items-center justify-center text-gray-500">
                  No reviews
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewItem key={review.id} review={review} />
                  ))}
                </div>
              )}
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

export default ProfileOverviewPage;
