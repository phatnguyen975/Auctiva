import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyEmailSchema } from "../../utils/validation";
import { verifyEmailThunk } from "../../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";

const VerifyEmailPage = () => {
  const loading = useSelector((state: RootState) => state.auth.loading);
  const dispatch = useDispatch<AppDispatch>();

  const [errors, setErrors] = useState<string[]>([]);
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);

  const navigate = useNavigate();
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];

    // Paste multiple characters
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Focus to the next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (e?: FormEvent) => {
    e?.preventDefault();
    setErrors([]);

    const verificationCode = code.join("");
    const result = verifyEmailSchema.safeParse({ code: verificationCode });

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
      const email = sessionStorage.getItem("verificationEmail") || "";
      await dispatch(
        verifyEmailThunk({ email, code: verificationCode })
      ).unwrap();

      sessionStorage.removeItem("verificationEmail");
      const isPasswordReset =
        sessionStorage.getItem("isPasswordReset") === "true";

      if (isPasswordReset) {
        navigate("/reset-password", { replace: true });
      } else {
        sessionStorage.removeItem("isPasswordReset");
        navigate("/", { replace: true });
      }

      toast.success("Email verified successfully");
    } catch (error) {
      toast.error(error as string);
    }
  };

  // Auto-submit when all inputs filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleVerifyCode();
    }
  }, [code]);

  return (
    <div className="w-full max-w-lg p-6">
      <div className="flex gap-6 flex-col border border-gray-300 rounded-2xl shadow-lg p-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold">Verify Your Email</h2>
          <p className="text-gray-500">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleVerifyCode}>
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="size-12 text-center text-2xl font-bold bg-gray-400/50 rounded-lg border-2 border-gray-700 focus-visible:ring-2 focus-visible:ring-black/50"
              />
            ))}
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
            disabled={loading || code.some((digit) => !digit)}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
