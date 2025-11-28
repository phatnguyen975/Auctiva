import { useState, useRef, useEffect } from "react";
import { LogOut, LayoutDashboard } from "lucide-react";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { logoutThunk } from "../store/slices/authSlice";

const ProfileMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    dispatch(logoutThunk());
    toast.success("Logged out successfully");
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
        className="size-10 rounded-full overflow-hidden ring-2 ring-gray-400 cursor-pointer"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <img
          src={assets.avatar}
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
              src={assets.avatar}
              alt="avatar"
              className="size-12 rounded-full object-cover ring-2 ring-gray-400"
            />
            <div>
              <p className="font-semibold max-w-[150px] truncate">Phat Nguyen</p>
              <p className="text-gray-600 text-sm max-w-[150px] truncate">phatnguyen9725@gmail.com</p>
            </div>
          </div>

          <hr className="border-t" />

          <div className="flex flex-col gap-2 py-4 px-2">
            {/* Dashboard */}
            <button
              className="w-full flex items-center gap-2 hover:bg-gray-200 px-3 py-2 rounded-lg transition cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <LayoutDashboard className="size-5" />
              Dashboard
            </button>

            {/* Logout */}
            <button
              className="w-full flex items-center gap-2 text-red-500 hover:bg-gray-200 px-3 py-2 rounded-lg transition cursor-pointer"
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
