import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyEmailSchema } from "../../utils/validation";

const VerifyEmailPage = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [email, setEmail] = useState<string | null>(null);

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

    sessionStorage.removeItem("verificationEmail");

    if (isPasswordReset) {
      navigate("/reset-password");
    } else {
      sessionStorage.removeItem("isPasswordReset");
      navigate("/");
    }

    toast.success("Email verified successfully");
  };

  const handleResendCode = async (e: MouseEvent) => {
    e.preventDefault();
    toast.success("Resent code successfully");
  };

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verificationEmail");
    if (!storedEmail) {
      navigate("/register");
      return;
    }

    const passwordResetFlag = sessionStorage.getItem("isPasswordReset");
    setIsPasswordReset(passwordResetFlag === "true");

    setEmail(storedEmail);
  }, []);

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

          <div className="text-sm flex gap-1 items-center justify-center">
            Didn't receive the code?
            <button
              className="font-semibold hover:underline cursor-pointer"
              onClick={handleResendCode}
            >
              Resend
            </button>
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
            disabled={code.some((digit) => !digit)}
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
