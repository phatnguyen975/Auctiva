import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../../components/ui/Input";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    toast.success("Password reset successfully");
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="w-full max-w-lg p-6">
      <div className="flex gap-6 flex-col border border-gray-300 rounded-2xl shadow-lg p-8">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold">Reset Your Password</h2>
          <p className="text-gray-500">Enter your new password below</p>
        </div>

        {/* Reset Form */}
        <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
          {/* New Password */}
          <div>
            <label htmlFor="new-password" className="font-bold">
              New Password
            </label>
            <Input
              icon={Lock}
              type="password"
              id="new-password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm-password" className="font-bold">
              Confirm New Password
            </label>
            <Input
              icon={Lock}
              type="password"
              id="-confirm-password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 text-white font-bold text-lg bg-black hover:bg-black/85 rounded-lg cursor-pointer disabled:cursor-not-allowed"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
