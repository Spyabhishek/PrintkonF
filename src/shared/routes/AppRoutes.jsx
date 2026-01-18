// shared/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* Auth pages */
import Login from "../../apps/auth/Login";
import Signup from "../../apps/auth/Signup";
import ActivateAccount from "../../apps/auth/ActivateAccount";
import RequestResetPassword from "../../apps/auth/RequestResetPassword";

/* User app */
import UserLayout from "../../apps/user/layouts/UserLayout";
import UserLandingPage from "../../apps/user/pages/UserLandingPage";
import UserDashboard from "../../apps/user/pages/UserDashboard";
import OrderHistory from "../../features/orders/components/OrderHistory";
import OrderDetails from "../../features/orders/components/OrderDetails";
import UpgradeRole from "../../apps/user/components/UpgradeRole";
import CheckoutPage from "../../apps/user/pages/CheckoutPage";
import CartPage from "../../features/cart/pages/CartPage";
// import WishlistPage from "../../apps/user/pages/WishlistPage"; 

/* Products (shared features) */
import ProductsListPage from "../../features/products/pages/ProductsListPage";
import ProductDetailsPage from "../../features/products/pages/ProductDetailsPage";

/* Admin app */
import AdminLayout from "../../apps/admin/layouts/AdminLayout";
import AdminDashboard from "../../apps/admin/pages/AdminDashboard";
import OperatorsList from "../../apps/admin/pages/OperatorsList";
import RoleRequests from "../../apps/admin/pages/RoleRequests";

/* Operator app */
import OperatorLayout from "../../apps/operator/layouts/OperatorLayout";
import OperatorDashboard from "../../apps/operator/pages/OperatorDashboard";

/* SuperAdmin app */
import SuperAdminLayout from "../../apps/superadmin/layouts/SuperAdminLayout";
import SuperAdminDashboard from "../../apps/superadmin/pages/SuperAdminDashboard";
import AllUsers from "../../apps/superadmin/pages/AllUsers";
import VerifyUpgrades from "../../apps/superadmin/pages/VerifyUpgrades";

/* Orders feature (shared between admin/operator) */
import AllOrders from "../../features/orders/AllOrders";
import AssignedOrders from "../../features/orders/AssignedOrders";
import UpdateOrderStatus from "../../features/orders/UpdateOrderStatus";

/* Guards & Errors */
import GuestGuard from "../../shared/routes/guards/GuestGuard";
import AuthGuard from "../../shared/routes/guards/AuthGuard";
import RoleGuard from "../../shared/routes/guards/RoleGuard";
import RefundPolicy from "../../features/landing/policies/RefundPolicy";
import TermsOfService from "../../features/landing/policies/TermsOfService";
import PrivacyPolicy from "../../features/landing/policies/PrivacyPolicy";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ✅ PUBLIC ROUTES - No authentication required, accessible to everyone */}
      <Route path="/" element={<UserLandingPage />} />
      <Route path="/products" element={<ProductsListPage />} />
      <Route path="/products/:productId" element={<ProductDetailsPage />} />

      {/* ✅ GUEST ONLY ROUTES - Only for non-authenticated users */}
      <Route element={<GuestGuard />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/activate" element={<ActivateAccount />} />
        <Route path="/activate/:token" element={<ActivateAccount />} />
        <Route path="/request-reset" element={<RequestResetPassword />} />
        <Route path="/request-reset/:token" element={<RequestResetPassword />} />
      </Route>

      {/* ✅ PROTECTED ROUTES - Require authentication */}
      <Route element={<AuthGuard />}>
        {/* User dashboard and features - for authenticated users */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
          <Route path="upgrade-role" element={<UpgradeRole />} />
          <Route path="cart" element={<CartPage />} />
          {/* <Route path="wishlist" element={<WishlistPage />} /> */}
        </Route>

        {/* Admin app - Role-based access */}
        <Route
          path="/admin/*"
          element={
            <RoleGuard allowedRoles={["admin", "superadmin"]} showUnauthorized>
              <AdminLayout />
            </RoleGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AllOrders />} />
          <Route path="assign" element={<AssignedOrders />} />
          <Route path="operators" element={<OperatorsList />} />
          <Route path="role-requests" element={<RoleRequests />} />
        </Route>

        {/* Operator app - Role-based access */}
        <Route
          path="/operator/*"
          element={
            <RoleGuard allowedRoles={["operator", "admin", "superadmin"]} showUnauthorized>
              <OperatorLayout />
            </RoleGuard>
          }
        >
          <Route index element={<OperatorDashboard />} />
          <Route path="assigned" element={<AssignedOrders />} />
          <Route path="update/:orderId" element={<UpdateOrderStatus />} />
        </Route>

        {/* SuperAdmin app - Role-based access */}
        <Route
          path="/superadmin/*"
          element={
            <RoleGuard allowedRoles={["superadmin"]} showUnauthorized>
              <SuperAdminLayout />
            </RoleGuard>
          }
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="verify-upgrades" element={<VerifyUpgrades />} />
        </Route>
      </Route>

      {/* ✅ POLICY PAGES - Public access */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />

      {/* ✅ FALLBACK - Redirect unknown routes to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}