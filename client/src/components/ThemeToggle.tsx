import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Moon, Sun } from "lucide-react";
import type { AppDispatch, RootState } from "../store/store";
import { toggleTheme } from "../store/slices/themeSlice";

const ThemeToggle = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <button
    className="max-sm:hidden p-2 rounded-full transition-colors duration-300"
    onClick={() => dispatch(toggleTheme())}
    >
      {theme == "dark" ? (
        <Sun className="h-6 w-6 text-yellow-300" />
      ) : (
        <Moon className="h-6 w-6 text-blue-900" />
      )}
    </button>
  );
};

export default ThemeToggle;
