// src/routes.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Store from './pages/Store.jsx';
import Admin from './pages/Admin.jsx';
import Checkout from './pages/Checkout.jsx';
import Confirm from './pages/Confirm.jsx'; // ✅ Add this line

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/store" element={<Store />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/confirm" element={<Confirm />} /> {/* ✅ Add this route */}
    </Routes>
  );
}