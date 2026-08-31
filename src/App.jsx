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

// Protected route component for Admin
function ProtectedAdminRoute({ children }) {
  const role = localStorage.getItem('userRole');
  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <CartProvider>
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/profile" element={<Profile />} />

            {/* Information Routes */}
            <Route path="/information" element={<Information />} />
            <Route path="/information/cara-penyewaan" element={<InfoCaraPenyewaan />} />
            <Route path="/information/aturan-rental" element={<InfoAturanRental />} />
            <Route path="/information/denda-kerusakan" element={<InfoDendaKerusakan />} />
            <Route path="/information/keterlambatan" element={<InfoKeterlambatan />} />
            <Route path="/information/lokasi-rental" element={<InfoLokasiRental />} />
            <Route path="/information/hubungi-kami" element={<InfoHubungiKami />} />

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