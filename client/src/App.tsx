import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/NotFoundPage";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/public/HomePage";
import ProductListPage from "./pages/public/ProductListPage";
import ProductDetailPage from "./pages/public/ProductDetailPage";

import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyOtpPage from "./pages/auth/VerifyOtpPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
