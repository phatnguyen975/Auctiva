import { useSelector } from "react-redux";
import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { RootState } from "../../../store/store";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";

interface IPersonalInfo {
  username: string | null;
  fullName: string | null;
  email: string;
  address: string | null;
  birthDate: string | null;
}

interface IPasswordInfo {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountSettingsPage = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const authUser = useSelector((state: RootState) => state.auth.authUser);

  const navigate = useNavigate();

  const [infoData, setInfoData] = useState<IPersonalInfo>({
    username: "",
    fullName: "",
    email: "",
    address: "",
    birthDate: "",
  });

  const [initialInfoData, setInitialInfoData] = useState<IPersonalInfo | null>(
    null
  );

  const [passwordData, setPasswordData] = useState<IPasswordInfo>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const sanitizeData = (data: any): IPersonalInfo => ({
    username: data.username || "",
    fullName: data.fullName || "",
    email: data.email || "",
    address: data.address || "",
    birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
  });

  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);

      const { data } = await axiosInstance.get("/users/me", {
        headers: {
          "x-api-key": import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (data.success) {
        const cleanData = sanitizeData(data.data);
        setInfoData(cleanData);
        setInitialInfoData(cleanData);
      }
    } catch (error: any) {
      console.error("Error loading user information:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleUpdateInfo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!initialInfoData) {
      return;
    }

    const changedFields: Partial<IPersonalInfo> = {};

    (Object.keys(infoData) as Array<keyof IPersonalInfo>).forEach((key) => {
      const currentValue = infoData[key];
      const initialValue = initialInfoData[key];

      if (
        currentValue !== initialValue &&
        currentValue !== null &&
        currentValue !== undefined
      ) {
        (changedFields as any)[key] = currentValue;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      toast("No changes detected", { icon: "ℹ️" });
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        username: infoData.username,
        fullName: infoData.fullName,
        email: infoData.email,
        address: infoData.address,
        birthDate: infoData.birthDate,
      };

      const { data } = await axiosInstance.put("/users/profile", payload, {
        headers: {
          "x-api-key": import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (data.success) {
        toast.success(data.message);
        setInitialInfoData({ ...initialInfoData, ...changedFields });
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error(
        "Error updating information:",
        error.response?.data?.message
      );
      toast.error(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordData.newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    try {
      const userId = authUser?.user?.id;
      await supabase.auth.signOut();
      navigate("/login");

      setIsLoading(true);

      const payload = {
        userId,
        newPassword: passwordData.newPassword,
      };

      const { data } = await axiosInstance.put("/users/password", payload, {
        headers: {
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
      });

      if (data.success) {
        toast.success("Password updated successfully. Please login again.");

        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error("Error updating password:", error.response?.data?.message);
      toast.error(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex flex-col gap-6 rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Account Settings</h2>
          <p className="text-[hsl(var(--muted-foreground))]">
            Update your personal information and security
          </p>
        </div>

        {/* Personal Information Form */}
        <form onSubmit={handleUpdateInfo} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Personal Information</h3>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md px-4 py-2 text-sm text-white bg-black/80 font-medium transition-colors hover:bg-slate-200 hover:text-black cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin size-4 mr-2" />
                  Updating...
                </div>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="text-sm text-[hsl(var(--muted-foreground))] mb-2 block"
              >
                Username
              </label>
              <input
                id="username"
                placeholder="Enter your username"
                value={infoData.username || ""}
                onChange={(e) =>
                  setInfoData({ ...infoData, username: e.target.value })
                }
                className="w-full rounded-lg px-3 py-2 text-base bg-gray-100 border-[hsl(var(--input))] focus:bg-white focus:border-[hsl(var(--primary))]"
              />
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="text-sm text-[hsl(var(--muted-foreground))] mb-2 block"
              >
                Full Name
              </label>
              <input
                id="fullName"
                placeholder="Enter your full name"
                value={infoData.fullName || ""}
                onChange={(e) =>
                  setInfoData({ ...infoData, fullName: e.target.value })
                }
                className="w-full rounded-lg px-3 py-2 text-base bg-gray-100 border-[hsl(var(--input))] focus:bg-white focus:border-[hsl(var(--primary))]"
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
                placeholder="Enter your email"
                value={infoData.email || ""}
                onChange={(e) =>
                  setInfoData({ ...infoData, email: e.target.value })
                }
                className="w-full rounded-lg px-3 py-2 text-base bg-gray-100 border-[hsl(var(--input))] focus:bg-white focus:border-[hsl(var(--primary))]"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="text-sm text-[hsl(var(--muted-foreground))] mb-2 block"
              >
                Address
              </label>
              <input
                id="address"
                placeholder="Enter your address"
                value={infoData.address || ""}
                onChange={(e) =>
                  setInfoData({ ...infoData, address: e.target.value })
                }
                className="w-full rounded-lg px-3 py-2 text-base bg-gray-100 border-[hsl(var(--input))] focus:bg-white focus:border-[hsl(var(--primary))]"
              />
            </div>

            <div>
              <label
                htmlFor="birthDate"
                className="text-sm text-[hsl(var(--muted-foreground))] mb-2 block"
              >
                Date of Birth (Optional)
              </label>
              <input
                id="birthDate"
                type="date"
                value={infoData.birthDate || ""}
                onChange={(e) =>
                  setInfoData({ ...infoData, birthDate: e.target.value })
                }
                className="w-full rounded-lg px-3 py-2 text-base bg-gray-100 border-[hsl(var(--input))] focus:bg-white focus:border-[hsl(var(--primary))]"
              />
            </div>
          </div>
        </form>

        {/* Security / Change Password */}
        <form
          onSubmit={handleUpdatePassword}
          className="space-y-6 pt-6 border-t"
        >
          <h3 className="text-xl font-semibold">Security & Password</h3>

          <div className="space-y-4">
            {/* --- OLD PASSWORD --- */}
            <div>
              <label
                htmlFor="oldPassword"
                className="text-sm text-[hsl(var(--muted-foreground))] mb-2 block"
              >
                Old Password
              </label>
              <div className="relative">
                <input
                  id="oldPassword"
                  type={showOldPass ? "text" : "password"}
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-lg pl-3 pr-10 py-2 text-base bg-gray-100 border-[hsl(var(--input))] focus:bg-white focus:border-[hsl(var(--primary))]"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPass(!showOldPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showOldPass ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            {/* --- NEW PASSWORD --- */}
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
                  type={showNewPass ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-lg pl-3 pr-10 py-2 text-base bg-gray-100 border-[hsl(var(--input))] focus:bg-white focus:border-[hsl(var(--primary))]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPass ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            {/* --- CONFIRM PASSWORD --- */}
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
                  type={showConfirmPass ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-lg pl-3 pr-10 py-2 text-base bg-gray-100 border-[hsl(var(--input))] focus:bg-white focus:border-[hsl(var(--primary))]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPass ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md px-4 py-2 text-sm text-white bg-black/80 font-medium transition-colors hover:bg-slate-200 hover:text-black cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin size-4 mr-2" />
                  Updating...
                </div>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
