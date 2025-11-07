import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/global.css';
import logo from '../assets/logo.svg';
import { account } from '../utils/appwrite';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    account.getSession('current')
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/store?search=${encodeURIComponent(search.trim())}`;
    }
  };

  const handleLogout = async () => {
    await account.deleteSession('current');
    window.location.href = '/admin-login';
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={logo} alt="Kipasa Logo" className="logo-img" />
      </Link>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/store">Store</Link>
        {isLoggedIn ? (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin-banners">Banners</Link>
            <span className="admin-greeting">Welcome, admin</span>
            <button className="btn logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/admin-login">Admin</Link>
        )}
      </div>
    </nav>
  );
}