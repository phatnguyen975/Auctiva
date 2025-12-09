import { useSelector } from "react-redux";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import type { RootState } from "../../../store/store";

interface IPersonalInfo {
  fullName: string;
  email: string;
  address: string;
  dateOfBirth?: string;
}

interface IPasswordInfo {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountSettingsPage = () => {
  const authUser = useSelector((state: RootState) => state.auth.authUser);

  const initialInfoData: IPersonalInfo = {
    fullName: authUser?.profile?.full_name || "",
    email: authUser?.profile?.email || "",
    address:
      authUser?.profile?.address || "227 NVC, Cho Quan Ward, Ho Chi Minh City",
    dateOfBirth: authUser?.profile?.birth_date
      ? new Date(authUser.profile.birth_date).toISOString().split("T")[0]
      : "",
  };

  const [infoData, setInfoData] = useState<IPersonalInfo>(initialInfoData);
  const [passwordData, setPasswordData] = useState<IPasswordInfo>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleUpdateInfo = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    alert(`
      Full Name: ${infoData.fullName}
      Email: ${infoData.email}
      Address: ${infoData.address}
      DateOfBirth: ${infoData.dateOfBirth}
    `);
  };

  const handleUpdatePassword = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    alert(`
      oldPassword: ${passwordData.oldPassword}
      newPassword: ${passwordData.newPassword}
      confirmPassword: ${passwordData.confirmPassword}
    `);
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
              className="rounded-md px-4 py-2 text-sm text-white bg-black/80 font-medium transition-colors hover:bg-slate-400 hover:cursor-pointer"
            >
              Update Profile
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
                value={infoData.fullName}
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
                value={infoData.email}
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
                value={infoData.address}
                onChange={(e) =>
                  setInfoData({ ...infoData, address: e.target.value })
                }
                className="w-full rounded-lg px-3 py-2 text-base bg-gray-100 border-[hsl(var(--input))] focus:bg-white focus:border-[hsl(var(--primary))]"
              />
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="text-sm text-[hsl(var(--muted-foreground))] mb-2 block"
              >
                Date of Birth (Optional)
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={infoData.dateOfBirth}
                onChange={(e) =>
                  setInfoData({ ...infoData, dateOfBirth: e.target.value })
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
                  // Kiểm tra state để đổi type giữa "text" và "password"
                  type={showOldPass ? "text" : "password"}
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  // Thêm pr-10 để chữ không bị đè lên icon
                  className="w-full rounded-lg pl-3 pr-10 py-2 text-base bg-gray-100 border-[hsl(var(--input))] focus:bg-white focus:border-[hsl(var(--primary))]"
                />
                <button
                  type="button" // Quan trọng: type="button" để không submit form
                  onClick={() => setShowOldPass(!showOldPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
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
                  {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
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
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="rounded-md px-4 py-2 text-sm text-white bg-black/80 font-medium transition-colors hover:bg-slate-400 hover:cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
