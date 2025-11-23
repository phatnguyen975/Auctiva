import { useNavigate } from "react-router-dom";
import {
  Gavel,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";
import Input from "./ui/Input";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-white shadow-sm mt-auto transition-colors duration-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            {/* Logo */}
            <button
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="bg-black rounded-lg p-2">
                <Gavel className="size-5 md:size-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold">Auctiva</span>
            </button>
            <p className="text-sm text-gray-700 max-w-[250px]">
              Your trusted online auction platform. Discover unique items, bid
              smart, and win big.
            </p>
            {/* Social Media */}
            <div className="flex gap-2 md:gap-3">
              <a
                href="#"
                className="size-9 rounded-full hover:bg-gray-800 hover:text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href="#"
                className="size-9 rounded-full hover:bg-gray-800 hover:text-white flex items-center justify-center transition-colors"
              >
                <Twitter className="size-4" />
              </a>
              <a
                href="#"
                className="size-9 rounded-full hover:bg-gray-800 hover:text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="#"
                className="size-9 rounded-full hover:bg-gray-800 hover:text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="size-4" />
              </a>
            </div>
          </div>

          {/* Column 2: About Us */}
          <div>
            <h3 className="font-semibold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Press & Media
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h3 className="font-semibold mb-4">Customer Care</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  How to Bid
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  How to Sell
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Send Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-700 mb-4">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <div className="flex gap-2">
              <Input icon={Mail} type="email" placeholder="Your email" />
              <button className="text-xs md:text-sm px-2 py-1 font-semibold bg-black hover:opacity-80 text-white rounded-lg cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-400">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-700">
            <p>
              &copy; {new Date().getFullYear()} Auctiva. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-900 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
