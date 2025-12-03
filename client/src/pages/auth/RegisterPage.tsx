import { useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gavel, Lock, Mail, MapPin, User } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import Input from "../../components/ui/Input";
import PasswordStrengthMeter from "../../components/auth/PasswordStrengthMeter";
import { registerSchema } from "../../utils/validation";
import type { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  registerThunk,
  setIsPasswordReset,
} from "../../store/slices/authSlice";
import HCaptcha from "@hcaptcha/react-hcaptcha";

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const loading = useSelector((state: RootState) => state.auth.loading);
  const dispatch = useDispatch<AppDispatch>();

  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<RegisterForm>({
    fullName: "",
    address: "",
    email: "",
    password: "",
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const formatted = result.error.format();

      const allErrors: string[] = [];
      Object.values(formatted).forEach((val: any) => {
        if (val?._errors) allErrors.push(...val._errors);
      });

      setErrors(allErrors);
      return;
    }

    try {
      await dispatch(
        registerThunk({
          full_name: formData.fullName,
          address: formData.address,
          email: formData.email,
          password: formData.password,
          captchaToken: captchaToken || "",
        })
      ).unwrap();

      dispatch(setIsPasswordReset(false));
      sessionStorage.setItem("verificationEmail", formData.email);

      setCaptchaToken(null);
      captchaRef?.current?.resetCaptcha();

      navigate("/verify-email", { replace: true });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <div className="w-full max-w-lg p-6">
      <div className="flex gap-6 flex-col border border-gray-300 rounded-2xl shadow-lg p-8">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <button
            className="flex items-center gap-2 lg:hidden cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="bg-gray-300 rounded-lg p-2">
              <Gavel className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary">Auctiva</span>
          </button>
          <h2 className="text-3xl font-bold">Create your account</h2>
          <p className="text-gray-500">Fill in the details to get started</p>
        </div>

        {/* Register Form */}
        <form className="flex flex-col gap-2" onSubmit={handleRegister}>
          {/* Full Name */}
          <div>
            <label htmlFor="fullname" className="font-bold">
              Full Name
            </label>
            <Input
              icon={User}
              type="text"
              id="fullname"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="font-bold">
              Address
            </label>
            <Input
              icon={MapPin}
              type="text"
              id="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

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
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="font-bold">
              Password
            </label>
            <Input
              icon={Lock}
              type="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {formData.password && (
              <PasswordStrengthMeter password={formData.password} />
            )}
          </div>

          {/* reCAPTCHA */}
          <HCaptcha
            ref={captchaRef}
            sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY ?? ""}
            onVerify={setCaptchaToken}
          />

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
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center text-sm">
          <span>Already have an account? </span>
          <Link to="/login" className="font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
