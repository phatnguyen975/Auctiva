import { Outlet } from "react-router-dom";
import AuthBrandSide from "../components/auth/AuthBrandSide";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - Brand */}
      <AuthBrandSide />

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
