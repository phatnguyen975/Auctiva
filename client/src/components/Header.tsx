import {
  Bell,
  ChevronDown,
  ChevronRight,
  Gavel,
  Heart,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./ui/Input";
import ThemeToggle from "./ThemeToggle";
import ProfileMenu from "./ProfileMenu";

const allCategories = [
  {
    name: "Electronics",
    subcategories: [
      {
        name: "Mobile Phones & Tablets",
        items: ["Smartphones", "Tablets", "Accessories", "Smart Watches"],
      },
      {
        name: "Computers & Laptops",
        items: ["Laptops", "Desktops", "Components", "Peripherals"],
      },
      {
        name: "Audio & Video",
        items: ["Headphones", "Speakers", "Cameras", "Microphones"],
      },
      {
        name: "Gaming",
        items: ["Consoles", "Games", "Accessories", "PC Gaming"],
      },
    ],
  },
  {
    name: "Sports",
    subcategories: [
      {
        name: "Team Sports",
        items: ["Football", "Basketball", "Baseball", "Soccer"],
      },
      {
        name: "Outdoor Recreation",
        items: ["Camping", "Hiking", "Cycling", "Fishing"],
      },
      {
        name: "Fitness Equipment",
        items: ["Cardio", "Weights", "Yoga", "Home Gym"],
      },
    ],
  },
  {
    name: "Fashion",
    subcategories: [
      {
        name: "Men's Fashion",
        items: ["Clothing", "Shoes", "Accessories", "Watches"],
      },
      {
        name: "Women's Fashion",
        items: ["Dresses", "Shoes", "Handbags", "Jewelry"],
      },
      {
        name: "Kids & Baby",
        items: ["Boys", "Girls", "Baby Clothing", "Toys"],
      },
    ],
  },
  {
    name: "Home & Garden",
    subcategories: [
      {
        name: "Furniture",
        items: ["Living Room", "Bedroom", "Office", "Outdoor"],
      },
      {
        name: "Home Decor",
        items: ["Wall Art", "Lighting", "Rugs", "Curtains"],
      },
      {
        name: "Kitchen & Dining",
        items: ["Cookware", "Appliances", "Dinnerware", "Storage"],
      },
      {
        name: "Garden & Outdoor",
        items: ["Plants", "Tools", "Patio", "Grills"],
      },
    ],
  },
  {
    name: "Health & Beauty",
    subcategories: [
      {
        name: "Skincare",
        items: ["Face Care", "Body Care", "Sun Protection", "Anti-Aging"],
      },
      {
        name: "Makeup",
        items: ["Face Makeup", "Eye Makeup", "Lip Products", "Nail Care"],
      },
      {
        name: "Hair Care",
        items: [
          "Shampoo & Conditioner",
          "Styling Products",
          "Hair Tools",
          "Hair Color",
        ],
      },
      {
        name: "Fragrance",
        items: ["Perfume", "Cologne", "Body Spray", "Gift Sets"],
      },
      {
        name: "Health & Wellness",
        items: ["Vitamins", "Supplements", "Fitness", "Personal Care"],
      },
    ],
  },
  {
    name: "Toys & Hobbies",
    subcategories: [
      {
        name: "Action Figures",
        items: ["Superheroes", "Movie Characters", "Vintage", "Modern"],
      },
      {
        name: "Building Toys",
        items: ["LEGO", "Model Kits", "Construction Sets", "Puzzles"],
      },
      {
        name: "Hobbies",
        items: ["RC Vehicles", "Drones", "Crafts", "Board Games"],
      },
    ],
  },
];

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySidebarOpen, setCategorySidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Dummy
  const user = true;
  const role: string = "bidder";

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
        <div className="container px-4 mx-auto">
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
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer shrink-0"
                onClick={() => setCategorySidebarOpen(true)}
              >
                <Menu className="size-5" />
                <span className="text-sm font-semibold">All Categories</span>
              </button>
            </div>

            {/* Search Bar */}
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
                      navigate("/products");
                    }
                  }}
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Watchlist */}
              {user && role !== "admin" && (
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
              {user && role !== "admin" && (
                <button className="relative p-2 shrink-0 hover:bg-gray-200 cursor-pointer rounded-lg">
                  <Bell className="size-5" />
                  <div className="absolute -top-0.5 -right-0.5 flex items-center justify-center size-5 bg-black rounded-full text-white text-xs">
                    5
                  </div>
                </button>
              )}

              {/* User Avatar */}
              {user ? (
                <ProfileMenu />
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
        <div className="border-t md:hidden">
          <div className="container mx-auto px-4 py-3">
            <Input
              icon={Search}
              type="text"
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate("/products");
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Category Side Bar */}
      {categorySidebarOpen && (
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
              {allCategories.map((category) => {
                const isOpen = expandedCategories.includes(category.name);
                return (
                  <div key={category.name} className="border-b border-gray-300">
                    <button
                      className="w-full flex justify-between items-center px-3 py-2 hover:bg-gray-200 transition-colors rounded-md cursor-pointer"
                      onClick={() => toggleCategory(category.name)}
                    >
                      <span className="font-semibold">{category.name}</span>
                      {isOpen ? (
                        <ChevronDown className="size-4 transition-transform" />
                      ) : (
                        <ChevronRight className="size-4 transition-transform" />
                      )}
                    </button>

                    {/* Subcategories */}
                    {isOpen &&
                      category.subcategories.map((subcategory) => (
                        <div key={subcategory.name} className="pl-6 py-1">
                          <p className="text-sm font-semibold">
                            {subcategory.name.toUpperCase()}
                          </p>
                          <ul className="text-sm text-gray-500 list-none pl-4 space-y-1">
                            {subcategory.items.map((item) => (
                              <li
                                key={item}
                                className="hover:text-gray-800 cursor-pointer"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
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
