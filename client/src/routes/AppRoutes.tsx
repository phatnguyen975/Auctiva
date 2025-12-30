import { Route, Routes } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";

import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/public/HomePage";
import ProductListPage from "../pages/public/ProductListPage";
import ProductDetailPage from "../pages/public/ProductDetailPage";
import ProtectedRoute from "./ProtectedRoute";
import TransactionPage from "../pages/public/TransactionPage";

import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

import DashboardLayout from "../layouts/DashboardLayout";
import ProfileOverviewPage from "../pages/dashboard/user/ProfileOverviewPage";
import AccountSettingsPage from "../pages/dashboard/user/AccountSettingsPage";
import WatchlistPage from "../pages/dashboard/user/WatchlistPage";
import MyBidsPage from "../pages/dashboard/user/MyBidsPage";
import WonAuctionsPage from "../pages/dashboard/user/WonAuctionsPage";
import SellerUpgradePage from "../pages/dashboard/user/SellerUpgradePage";

import SellerOverviewPage from "../pages/dashboard/seller/SellerOverviewPage";
import CreateListingPage from "../pages/dashboard/seller/CreateListingPage";
import UpdateListingPage from "../pages/dashboard/seller/UpdateListingPage";
import ActiveListingsPage from "../pages/dashboard/seller/ActiveListingsPage";
import SoldItemsPage from "../pages/dashboard/seller/SoldItemsPage";

import AdminProfilePage from "../pages/dashboard/admin/AdminProfilePage";
import UserManagementPage from "../pages/dashboard/admin/UserManagementPage";
import CategoryManagementPage from "../pages/dashboard/admin/CategoryManagementPage";
import ProductManagementPage from "../pages/dashboard/admin/ProductManagementPage";
import SellerApprovalsPage from "../pages/dashboard/admin/SellerApprovalsPage";
import SystemSettingsPage from "../pages/dashboard/admin/SystemSettingsPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route
          path="transaction/:id"
          element={
            <ProtectedRoute allowedRoles={["bidder", "seller"]}>
              <TransactionPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Dashboard Routes */}
      <Route element={<ProtectedRoute allowedRoles={["bidder", "seller"]} />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Common (Bidder & Seller) */}
          <Route index element={<ProfileOverviewPage />} />
          <Route path="profile" element={<ProfileOverviewPage />} />
          <Route path="settings" element={<AccountSettingsPage />} />
          <Route path="watchlist" element={<WatchlistPage />} />
          <Route path="my-bids" element={<MyBidsPage />} />
          <Route path="won-auctions" element={<WonAuctionsPage />} />
          {/* Upgrade (Bidder) */}
          <Route path="upgrade" element={<SellerUpgradePage />} />
        </Route>
      </Route>

      {/* Seller Routes */}
      <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
        <Route path="/seller" element={<DashboardLayout />}>
          <Route index element={<SellerOverviewPage />} />
          <Route path="overview" element={<SellerOverviewPage />} />
          <Route path="create" element={<CreateListingPage />} />
          <Route path="update/:id" element={<UpdateListingPage />} />
          <Route path="active" element={<ActiveListingsPage />} />
          <Route path="sold" element={<SoldItemsPage />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<AdminProfilePage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="categories" element={<CategoryManagementPage />} />
          <Route path="products" element={<ProductManagementPage />} />
          <Route path="approvals" element={<SellerApprovalsPage />} />
          <Route path="settings" element={<SystemSettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
