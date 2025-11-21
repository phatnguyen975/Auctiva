import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="bg-black flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center text-sm max-md:px-4 py-20">
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
          404 Not Found
        </h1>
        <div className="h-px w-80 rounded bg-linear-to-r from-gray-400 to-gray-800 my-5 md:my-7"></div>
        <p className="md:text-lg text-gray-400 max-w-xl text-center">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="group flex items-center gap-1 bg-white hover:bg-gray-200 px-7 py-2.5 text-gray-800 rounded-full mt-10 font-medium active:scale-95 transition-all"
        >
          Back to Home
          <ArrowRight className="size-4.5 group-hover:translate-x-0.5 transition" />
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
