import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";

import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Dashboard from "./pages/user/Dashboard";
import Products from "./pages/user/Products";
import ProductDetail from "./pages/user/ProductDetail";
import Cart from "./pages/user/Cart";
import Payment from "./pages/user/Payment";
import Profile from "./pages/user/Profile";
import CustomerOrders from "./pages/user/CustomerOrders";

import Information from "./pages/info/Information";
import InfoCaraPenyewaan from "./pages/info/InfoCaraPenyewaan";
import InfoAturanRental from "./pages/info/InfoAturanRental";
import InfoDendaKerusakan from "./pages/info/InfoDendaKerusakan";
import InfoKeterlambatan from "./pages/info/InfoKeterlambatan";
import InfoLokasiRental from "./pages/info/InfoLokasiRental";
import InfoHubungiKami from "./pages/info/InfoHubungiKami";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminEditProduct from "./pages/admin/AdminEditProduct";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";

import LandingPage from "./pages/user/LandingPage";

// Protected route component for Admin
function ProtectedAdminRoute({ children }) {
  const role = localStorage.getItem('userRole');
  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// Protected route component for Customer
function ProtectedCustomerRoute({ children }) {
  const role = localStorage.getItem('userRole');
  if (role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (role !== 'user') {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <CartProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Customer Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedCustomerRoute>
                  <Dashboard />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedCustomerRoute>
                  <Products />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProtectedCustomerRoute>
                  <ProductDetail />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedCustomerRoute>
                  <Cart />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedCustomerRoute>
                  <Payment />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedCustomerRoute>
                  <Profile />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="/riwayat"
              element={
                <ProtectedCustomerRoute>
                  <CustomerOrders />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="/riwayat-pemesanan"
              element={
                <ProtectedCustomerRoute>
                  <CustomerOrders />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="/riwayat/:id"
              element={
                <ProtectedCustomerRoute>
                  <CustomerOrders />
                </ProtectedCustomerRoute>
              }
            />

            {/* Protected Customer Information Routes */}
            <Route
              path="/information"
              element={
                <ProtectedCustomerRoute>
                  <Information />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="/information/cara-penyewaan"
              element={
                <ProtectedCustomerRoute>
                  <InfoCaraPenyewaan />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="/information/aturan-rental"
              element={
                <ProtectedCustomerRoute>
                  <InfoAturanRental />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="/information/denda-kerusakan"
              element={
                <ProtectedCustomerRoute>
                  <InfoDendaKerusakan />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="/information/keterlambatan"
              element={
                <ProtectedCustomerRoute>
                  <InfoKeterlambatan />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="/information/lokasi-rental"
              element={
                <ProtectedCustomerRoute>
                  <InfoLokasiRental />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="/information/hubungi-kami"
              element={
                <ProtectedCustomerRoute>
                  <InfoHubungiKami />
                </ProtectedCustomerRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedAdminRoute>
                  <AdminProducts />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/products/edit/:id"
              element={
                <ProtectedAdminRoute>
                  <AdminEditProduct />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedAdminRoute>
                  <AdminOrders />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/orders/:id"
              element={
                <ProtectedAdminRoute>
                  <AdminOrderDetail />
                </ProtectedAdminRoute>
              }
            />
          </Routes>
        </CartProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;