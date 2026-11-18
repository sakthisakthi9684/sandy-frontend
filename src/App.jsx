import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Customer layout & pages
import CustomerLayout from './components/layout/CustomerLayout';
import HomePage from './pages/customer/HomePage';
import ShopPage from './pages/customer/ShopPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CollectionsPage from './pages/customer/CollectionsPage';
import AboutUsPage from './pages/customer/AboutUsPage';
import ContactUsPage from './pages/customer/ContactUsPage';

// Admin layout & pages
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminRegisterPage from './pages/admin/AdminRegisterPage';
import AdminDashboardOverview from './pages/admin/AdminDashboardOverview';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminEnquiriesPage from './pages/admin/AdminEnquiriesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <SettingsProvider>
      <CartProvider>
        <AdminAuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Customer Website (No Login Required) */}
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<HomePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="collections" element={<CollectionsPage />} />
              <Route path="about" element={<AboutUsPage />} />
              <Route path="contact" element={<ContactUsPage />} />
            </Route>

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/register" element={<AdminRegisterPage />} />

            {/* Admin Dashboard (Protected by JWT) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardOverview />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="inventory" element={<AdminInventoryPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="enquiries" element={<AdminEnquiriesPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* 404 / Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AdminAuthProvider>
      </CartProvider>
    </SettingsProvider>
  );
}

export default App;
