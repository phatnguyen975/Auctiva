import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Shield,
  Home,
} from "lucide-react";
import toast from "react-hot-toast";
import type { AppDispatch } from "../store/store";
import { logoutThunk } from "../store/slices/authSlice";
import type { Profile } from "../types/profile";
import { assets } from "../assets/assets";

interface ProfileMenuProps {
  userProfile: Profile | null;
  isDashboard: boolean;
}

const ProfileMenu = ({ userProfile, isDashboard }: ProfileMenuProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const role = userProfile?.role;

  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      navigate("/");
    } catch (error) {
      toast.error(error as string);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar */}
      <button
        className="size-9 rounded-full overflow-hidden ring-2 ring-gray-500 cursor-pointer"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <img
          src={userProfile?.avatar_url || assets.avatar}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </button>

      {/* Dropdown */}
      {menuOpen && (
        <div className="absolute right-0 min-w-[250px] bg-white border border-gray-300 rounded-xl shadow-sm z-50">
          {/* Information */}
          <div className="flex items-center gap-3 p-4">
            <img
              src={userProfile?.avatar_url || assets.avatar}
              alt="avatar"
              className="size-12 rounded-full object-cover ring-2 ring-gray-400"
            />
            <div>
              <p className="font-semibold max-w-[150px] truncate">
                {userProfile?.full_name || userProfile?.user_name}
              </p>
              <p className="text-gray-600 text-sm max-w-[150px] truncate">
                {userProfile?.email}
              </p>
            </div>
          </div>

          <hr className="border-t" />

          {/* Action Buttons */}
          <div className="flex flex-col py-4 px-2">
            {/* Back to Home */}
            {isDashboard && (
              <button
                className="w-full flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg transition cursor-pointer"
                onClick={() => navigate("/")}
              >
                <Home className="size-5" />
                Back to Home
              </button>
            )}

            {/* User Dashboard */}
            {role !== "admin" && (
              <button
                className="w-full flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg transition cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                <LayoutDashboard className="size-5" />
                Dashboard
              </button>
            )}

            {/* Seller Studio */}
            {role === "seller" && (
              <button
                className="w-full flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg transition cursor-pointer"
                onClick={() => navigate("/seller")}
              >
                <ShoppingBag className="size-5" />
                Seller Studio
              </button>
            )}

            {/* Admin Console */}
            {role === "admin" && (
              <button
                className="w-full flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg transition cursor-pointer"
                onClick={() => navigate("/admin")}
              >
                <Shield className="size-5" />
                Admin Console
              </button>
            )}

            {/* Logout */}
            <button
              className="w-full flex items-center gap-4 text-red-500 hover:bg-gray-200 px-3 py-2 rounded-lg transition cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="size-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
