import { ArrowLeft, Mail } from "lucide-react";
import Input from "../../components/ui/Input";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/verify-code");
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
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-white font-bold text-lg bg-black hover:bg-black/85 rounded-lg cursor-pointer disabled:cursor-not-allowed"
          >
            Send Verification Code
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
