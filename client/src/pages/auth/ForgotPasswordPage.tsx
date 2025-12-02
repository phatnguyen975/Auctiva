import { useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import Input from "../../components/ui/Input";
import { forgotPasswordSchema } from "../../utils/validation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { sendOtpThunk, setIsPasswordReset } from "../../store/slices/authSlice";
import toast from "react-hot-toast";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const ForgotPasswordPage = () => {
  const loading = useSelector((state: RootState) => state.auth.loading);
  const dispatch = useDispatch<AppDispatch>();

  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState("");

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha | null>(null);

  const navigate = useNavigate();

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const result = forgotPasswordSchema.safeParse({ email });

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
      await dispatch(
        sendOtpThunk({ email, captchaToken: captchaToken || "" })
      ).unwrap();

      dispatch(setIsPasswordReset(true));
      sessionStorage.setItem("verificationEmail", email);

      navigate("/verify-email");
      toast.success("Verification code sent to your email");
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <div className="w-full max-w-lg p-6">
      <div className="flex gap-6 flex-col border border-gray-300 rounded-2xl shadow-lg p-8">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold">Forgot Password?</h2>
          <p className="text-gray-500">
            Enter your email address and we'll send you a verification code
          </p>
        </div>

        {/* Forgot Form */}
        <form className="flex flex-col gap-4" onSubmit={handleForgotPassword}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="font-bold">
              Email
            </label>
            <Input
              icon={Mail}
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* reCAPTCHA */}
          <div>
            <HCaptcha
              ref={captchaRef}
              sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY ?? ""}
              onVerify={setCaptchaToken}
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
            {loading ? "Sending..." : "Send Code"}
          </button>
        </form>

        <Link
          to="/login"
          className="group text-sm flex gap-1 items-center justify-center hover:underline"
        >
          <ArrowLeft
            className="size-4 group-hover:-translate-x-0.5 transition duration-200"
            strokeWidth={1}
          />
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
