import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gavel, Lock, Mail, MapPin, User } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../../components/ui/Input";
import PasswordStrengthMeter from "../../components/auth/PasswordStrengthMeter";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(formData.email + " " + formData.password);
    navigate("/");
    toast.success("Logged in successfully");
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

        {/* Login Form */}
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
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
              required
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
              required
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
              required
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
              required
            />
            {formData.password && <PasswordStrengthMeter password={formData.password} />}
          </div>

          {/* Terms Checkbox */}
          <div className="flex gap-2 items-center">
            <input id="terms" type="checkbox" className="cursor-pointer accent-gray-600" required />
            <label htmlFor="terms" className="text-sm cursor-pointer">
              I agree to the <span className="hover:underline">Terms of Service</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-white font-bold text-lg bg-black hover:bg-black/85 rounded-lg cursor-pointer disabled:cursor-not-allowed"
          >
            Register
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
