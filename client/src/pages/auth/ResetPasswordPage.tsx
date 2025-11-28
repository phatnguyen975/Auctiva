import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../../components/ui/Input";
import { resetPasswordSchema } from "../../utils/validation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { resetPasswordThunk } from "../../store/slices/authSlice";
import { supabase } from "../../lib/supabaseClient";

const ResetPasswordPage = () => {
  const loading = useSelector((state: RootState) => state.auth.loading);
  const dispatch = useDispatch<AppDispatch>();

  const [errors, setErrors] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const result = resetPasswordSchema.safeParse({ password, confirmPassword });

    if (!result.success) {
      const formatted = result.error.format();

      const allErrors: string[] = [];

      Object.values(formatted).forEach((value: any) => {
        if (value?._errors) {
          allErrors.push(...value._errors);
        }
      });

      setErrors(allErrors);
      return;
    }

    try {
      await dispatch(resetPasswordThunk(password)).unwrap();
      await supabase.auth.signOut();

      sessionStorage.removeItem("isPasswordReset");

      toast.success("Password changed successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error as string);
    }
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

          {/* Errors */}
          {errors.length > 0 && (
            <div className="w-full px-4 py-2 bg-red-200 border-2 border-red-500 text-red-600 rounded-lg text-xs">
              <ul className="list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 text-white font-bold text-lg bg-black hover:bg-black/85 rounded-lg cursor-pointer disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
