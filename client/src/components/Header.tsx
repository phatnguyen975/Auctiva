import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronRight,
  Gavel,
  Heart,
  Menu,
  Search,
  X,
} from "lucide-react";
import Input from "./ui/Input";
import ThemeToggle from "./ui/ThemeToggle";
import ProfileMenu from "./ProfileMenu";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { dummyAllCategories } from "../assets/assets";

const Header = ({ isDashboard = false }: { isDashboard?: boolean }) => {
  const authUser = useSelector((state: RootState) => state.auth.authUser);
  const role = authUser?.profile?.role;

  const [searchQuery, setSearchQuery] = useState("");
  const [categorySidebarOpen, setCategorySidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setCategorySidebarOpen(false);
      }
    };
    if (categorySidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categorySidebarOpen]);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex h-16 md:h-20 items-center justify-between gap-2 md:gap-4">
            {/* Logo + All Categories */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Logo */}
              <button
                className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="bg-black rounded-lg p-2">
                  <Gavel className="size-5 md:size-6 text-white" />
                </div>
                <span className="text-xl md:text-2xl font-bold hidden sm:inline">
                  Auctiva
                </span>
              </button>

              {/* All Categories */}
              {!isDashboard && (
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer shrink-0"
                  onClick={() => setCategorySidebarOpen(true)}
                >
                  <Menu className="size-5" />
                  <span className="text-sm font-semibold">All Categories</span>
                </button>
              )}
            </div>

            {/* Search Bar */}
            {!isDashboard && (
              <div className="flex-1 max-w-2xl hidden md:block">
                <div className="relative">
                  <Input
                    icon={Search}
                    type="text"
                    placeholder="Search for anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        navigate(`/products?keyword=${searchQuery}`);
                        setSearchQuery("");
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Watchlist */}
              {authUser && role !== "admin" && !isDashboard && (
                <button
                  className="relative p-2 shrink-0 hover:bg-gray-200 cursor-pointer rounded-lg"
                  onClick={() => navigate("/dashboard")}
                >
                  <Heart className="size-5" />
                  <div className="absolute -top-0.5 -right-0.5 flex items-center justify-center size-5 bg-black rounded-full text-white text-xs">
                    3
                  </div>
                </button>
              )}

              {/* Notifications */}
              {authUser && role !== "admin" && !isDashboard && (
                <button className="relative p-2 shrink-0 hover:bg-gray-200 cursor-pointer rounded-lg">
                  <Bell className="size-5" />
                  <div className="absolute -top-0.5 -right-0.5 flex items-center justify-center size-5 bg-black rounded-full text-white text-xs">
                    5
                  </div>
                </button>
              )}

              {/* User Avatar */}
              {authUser ? (
                <ProfileMenu userProfile={authUser.profile} isDashboard={isDashboard} />
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    className="sm:hidden bg-black text-white px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold"
                    onClick={() => navigate("/login")}
                  >
                    Get Started
                  </button>
                  <button
                    className="hidden sm:flex bg-black text-white px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                  <button
                    className="hidden sm:flex bg-black text-white px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {!isDashboard && <div className="border-t border-gray-300 md:hidden">
          <div className="container mx-auto px-4 py-3">
            <Input
              icon={Search}
              type="text"
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/products?keyword=${searchQuery}`);
                  setSearchQuery("");
                }
              }}
            />
          </div>
        </div>}
      </header>

      {/* Category Side Bar */}
      {categorySidebarOpen && !isDashboard && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 transition-opacity" />

          {/* Sidebar */}
          <div
            className="relative bg-white w-80 max-w-full h-full shadow-lg overflow-y-auto transition-transform transform translate-x-0"
            ref={sidebarRef}
          >
            {/* Header */}
            <div className="sticky top-0 w-full flex justify-between items-center px-4 py-2.5 shadow-sm bg-white">
              <h2 className="text-lg font-bold">All Categories</h2>
              <button
                className="p-2 hover:bg-gray-200 rounded-full cursor-pointer transition-colors"
                onClick={() => setCategorySidebarOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="flex flex-col p-2">
              {dummyAllCategories.map((category) => {
                const isOpen = expandedCategories.includes(category.name);
                return (
                  <div key={category.name} className="border-b border-gray-300">
                    <button
                      className="w-full flex justify-between items-center px-3 py-2 hover:bg-gray-200 transition-colors rounded-md cursor-pointer"
                      onClick={() => toggleCategory(category.name)}
                    >
                      <span className="font-semibold">{category.name}</span>
                      <ChevronRight
                        className={`size-4 ${
                          isOpen && "rotate-90 transition-transform"
                        }`}
                      />
                    </button>

                    {/* Subcategories */}
                    {isOpen &&
                      category.subcategories.map((subcategory) => (
                        <div
                          key={subcategory.name}
                          className="w-full px-3 hover:bg-gray-200"
                        >
                          <button
                            className="w-full py-2 text-sm text-left cursor-pointer"
                            onClick={() => {
                              navigate(
                                `/products?category=${subcategory.slug}`
                              );
                              setCategorySidebarOpen(false);
                            }}
                          >
                            {subcategory.name}
                          </button>
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
