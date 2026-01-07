import { useState, useEffect } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { axiosInstance } from "../../../lib/axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

interface AdminProfile {
  username: string | null;
  fullName: string;
  email: string;
  birthDate: string | null;
}

const AdminProfilePage = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Profile Information
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // Password Change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState<
    string | null
  >(null);

  const sanitizeData = (data: any): AdminProfile => ({
    username: data.username || "",
    fullName: data.fullName || "",
    email: data.email || "",
    birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
  });

  const fetchAdminProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await axiosInstance.get("/users/me", {
        headers: {
          "x-api-key": import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (data.success) {
        const cleanData = sanitizeData(data.data);
        setFullName(cleanData.fullName || cleanData.username || "N/A");
        setEmail(cleanData.email);
        setBirthDate(cleanData.birthDate || "N/A");
      }
    } catch (error: any) {
      console.error("Error loading user information:", error.message);
      setError(error.response?.data?.message || "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const payload = {
        fullName,
        email,
        birthDate,
      };

      const { data } = await axiosInstance.put("/users/profile", payload, {
        headers: {
          "x-api-key": import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (data.success) {
        setSuccessMessage(data.message);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    setIsPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccessMessage(null);

    // Mock: Simulate success (remove this when backend is ready)
    await new Promise((resolve) => setTimeout(resolve, 800));
    setPasswordSuccessMessage("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSuccessMessage(null), 3000);
    setIsPasswordLoading(false);

    /* TODO: Uncomment when API is ready
    try {
      await axiosInstance.patch("/api/admin/change-password", {
        currentPassword,
        newPassword,
      });
      
      setPasswordSuccessMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccessMessage(null), 3000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || "Failed to update password");
    } finally {
      setIsPasswordLoading(false);
    }
    */
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold mb-2">Admin Profile</h2>
        <p className="text-[hsl(var(--muted-foreground))]">
          Manage your personal account information
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Personal Information Form */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Personal Information</h3>
          <button
            onClick={handleUpdateProfile}
            disabled={isLoading}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 h-11 px-8 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update My Profile"
            )}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="text-sm text-[hsl(var(--muted-foreground))] mb-2 block"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border bg-gray-100 px-3 py-2 text-sm ring-offset-[hsl(var(--background))] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:bg-white focus-visible:border-[hsl(var(--primary))] focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-sm text-[hsl(var(--muted-foreground))] mb-2 block"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border bg-gray-100 px-3 py-2 text-sm ring-offset-[hsl(var(--background))] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:bg-white focus-visible:border-[hsl(var(--primary))] focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="birthDate"
              className="text-sm text-[hsl(var(--muted-foreground))] mb-2 block"
            >
              Date of Birth
            </label>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border bg-gray-100 px-3 py-2 text-sm ring-offset-[hsl(var(--background))] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:bg-white focus-visible:border-[hsl(var(--primary))] focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Password Success Message */}
      {passwordSuccessMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
          {passwordSuccessMessage}
        </div>
      )}

      {/* Password Error Message */}
      {passwordError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          {passwordError}
        </div>
      )}

      {/* Change Password Form */}
      <div className="space-y-6 pt-6 border-t border-[hsl(var(--border))]">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Change Password</h3>
          <button
            onClick={handleUpdatePassword}
            disabled={isPasswordLoading}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 h-11 px-8 cursor-pointer"
          >
            {isPasswordLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="text-sm text-[hsl(var(--muted-foreground))] mb-2 block"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isPasswordLoading}
                className="flex h-10 w-full rounded-md border border-gray-400 bg-[hsl(var(--background))] px-3 py-2 pr-10 text-sm ring-offset-[hsl(var(--background))] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={isPasswordLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="text-sm text-[hsl(var(--muted-foreground))] mb-2 block"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isPasswordLoading}
                className="flex h-10 w-full rounded-md border border-gray-400 bg-[hsl(var(--background))] px-3 py-2 pr-10 text-sm ring-offset-[hsl(var(--background))] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your new password (min. 6 characters)"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isPasswordLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="text-sm text-[hsl(var(--muted-foreground))] mb-2 block"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isPasswordLoading}
                className="flex h-10 w-full rounded-md border border-gray-400 bg-[hsl(var(--background))] px-3 py-2 pr-10 text-sm ring-offset-[hsl(var(--background))] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isPasswordLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
