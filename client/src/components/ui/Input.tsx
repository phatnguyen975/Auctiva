import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  type: string;
}

const Input = ({ icon: Icon, type, ...props }: InputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5" />
      </div>

      <input
        {...props}
        type={type === "password" && isPasswordVisible ? "text" : type}
        className={`w-full py-1.5 pl-10 rounded-lg border-2 border-gray-300 ${
          type === "password" ? "pr-10" : "pr-3"
        } transition duration-200`}
      />

      {type === "password" && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible ? (
            <Eye className="size-5" />
          ) : (
            <EyeOff className="size-5" />
          )}
        </button>
      )}
    </div>
  );
};

export default Input;
