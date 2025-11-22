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
      className="p-2 rounded-full cursor-pointer transition-colors duration-300"
      onClick={() => dispatch(toggleTheme())}
    >
      {theme == "dark" ? (
        <Sun className="size-5 text-yellow-500 fill-yellow-500" />
      ) : (
        <Moon className="size-5 text-blue-800 fill-blue-800" />
      )}
    </button>
  );
};

export default ThemeToggle;
