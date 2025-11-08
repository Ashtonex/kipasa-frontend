// src/routes.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Store from './pages/Store.jsx';
import Admin from './pages/Admin.jsx';
import Checkout from './pages/Checkout.jsx';
import Confirm from './pages/Confirm.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminBanners from './pages/AdminBanners.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-banners" element={<AdminBanners />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}