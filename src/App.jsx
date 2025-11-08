import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getSession, login, uploadProduct, getAllProducts, deleteProduct, updateProduct } from './utils/appwrite';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import BannerCarousel from './components/BannerCarousel';
import TrendingProducts from './components/TrendingProducts';


//Navbar and Footer
function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

//Home
 function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts().then(setProducts);
  }, []);

  return (
    <div className="home">
      <BannerCarousel />

      <section className="tagline">
        <h1>Welcome to Kipasa</h1>
        <p>Explore our curated collections:</p>
        <div className="grid">
          {['Tactical', 'Jewelry', 'Perfumes', 'Zimbo Wear'].map((cat) => (
            <Link key={cat} to={`/store?category=${cat.toLowerCase()}`} className="card">
              <h3>{cat}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="trending">
        <TrendingProducts />

        <h2>Trending Products</h2>
        <div className="grid">
          {products.slice(0, 4).map((p) => (
            <div key={p.$id} className="card">
              <img
                src={typeof p.image === 'string' ? p.image : '/fallback.jpg'}
                alt={p.title}
                style={{
                  width: '80%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                }}
                onError={(e) => (e.target.src = '/fallback.jpg')}
              />
              <p>{p.title}</p>
              <p>{p.price}€</p>
              <p>{p.category}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


//Store Categories
const categories = [
  'Tactical Wear', 'Biker Wear', 'Outdoors', 'Games', 'Perfumes', 'Ornaments',
  'Bags & Wallets', 'Jewelry', 'General Gifts', 'Dog Accessories',
  'Headgear', 'Zimbo Wear', 'Lingerie'
];
//Store
 function Store() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const all = await getAllProducts();
      setProducts(all);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search')?.toLowerCase() || '';
    const category = params.get('category') || '';
    const sort = params.get('sort') || '';

    let result = [...products];

    if (query) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(query)
      );
    }

    if (category) {
      result = result.filter(p =>
        p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (sort === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    setFiltered(result);
  }, [location.search, products]);

  const setCategory = (cat) => {
    const params = new URLSearchParams(location.search);
    params.set('category', cat);
    navigate(`/store?${params.toString()}`);
  };

  const setSort = (e) => {
    const params = new URLSearchParams(location.search);
    params.set('sort', e.target.value);
    navigate(`/store?${params.toString()}`);
  };

  return (
    <div className="store">
      <h2>Store</h2>

      <div className="filters">
        <div className="category-buttons">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        <div className="sort-dropdown">
          <label>Sort by price:</label>
          <select onChange={setSort} defaultValue="">
            <option value="">None</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid">
        {filtered.map((product) => (
          <ProductCard key={product.$id} product={product} />
        ))}
      </div>
    </div>
  );
  
}

//Checkout
 function Checkout() {
  useEffect(() => {
    createCheckoutSession();
  }, []);

  return (
    <div className="container">
      <h2>Redirecting to payment...</h2>
    </div>
  );
}

//Confirm
function Confirm() {
  return (
    <div className="container">
      <h2>Thank you for your purchase!</h2>
      <p>Your order has been confirmed. NDOKUTENGERA PATA PATA Ndokutengra Slippers.</p>
    </div>
  );
}

//Admin Login
 function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      window.location.href = '/admin';
    } catch (err) {
      setError('Login failed. Check credentials or Appwrite setup.');
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );


  return (
    <div className="login-page">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

//Admin Dashboard
 function Admin() {
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: '',
    image: null,
  });
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        navigate('/admin-login');
      }
    });
    refreshProducts();
  }, []);

  const refreshProducts = () => {
    getAllProducts().then(setProducts);
  };

  const handleUpload = async () => {
    if (!form.image) return alert('Please select an image');
    await uploadProduct(form);
    resetForm();
  };

  const handleSave = async () => {
    if (!editing) return;
    const updates = {
      title: form.title,
      price: form.price,
      category: form.category,
    };

    if (form.image) {
      updates.image = form.image;
    }

    await updateProduct(editing, updates);
    resetForm();
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    refreshProducts();
  };

  const resetForm = () => {
    setForm({ title: '', price: '', category: '', image: null });
    setEditing(null);
    refreshProducts();
  };

  return (
    <div className="container">
      <h2>{editing ? 'Edit Product' : 'Upload Product'}</h2>
      <input
        placeholder="Name"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        placeholder="Price"
        type="number"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />
      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />
      <input
        type="file"
        onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
      />

      {form.image && (
        <img
    src={URL.createObjectURL(form.image)}
    alt="Preview"
    className="preview-img"
    style={{
      width: '160px',
      height: '160px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginBottom: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    }}
  />
      )}

      {editing ? (
        <button className="btn" onClick={handleSave}>Save Changes</button>
      ) : (
        <button className="btn" onClick={handleUpload}>Upload</button>
      )}

      <Link to="/admin-banners" className="btn" style={{ marginLeft: '10px' }}>
        Manage Banners
      </Link>

      <h3>Existing Products</h3>
      <div className="grid">
        {products.map((p) => (
          <div key={p.$id} className="card">
            <img
  src={typeof p.image === 'string' ? p.image : '/fallback.jpg'}
  alt={p.title}
  className="preview-img"
  style={{
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '0.5rem',
  }}
  onError={(e) => (e.target.src = '/fallback.jpg')}
/>
            <p>{p.title}</p>
            <p>{p.price}€</p>
            <p>{p.category}</p>
            <button className="btn" onClick={() => handleDelete(p.$id)}>Delete</button>
            <button
              className="btn"
              onClick={() => {
                setEditing(p.$id);
                setForm({
                  title: p.title,
                  price: p.price,
                  category: p.category,
                  image: null,
                });
              }}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

//Admin Banners
 function AdminBanners() {
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    link: '',
    image: null,
    priority: 0,
  });
  const [banners, setBanners] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    refreshBanners();
  }, []);

  const refreshBanners = () => {
    getBanners().then(setBanners);
  };

  const handleUpload = async () => {
    if (!form.image) return alert('Please select an image');
    await uploadBanner(form);
    resetForm();
  };

  const handleSave = async () => {
    if (!editing) return;

    const updates = {
      name: form.title,
      subtitle: form.subtitle,
      link: form.link,
      priority: form.priority,
    };

    if (form.image) {
      const uploaded = await storage.createFile('690ceb4300336822a3cc', ID.unique(), form.image);
      updates.image = uploaded.$id;
    }

    await updateBanner(editing, updates);
    resetForm();
  };

  const handleDelete = async (id) => {
    await deleteBanner(id);
    refreshBanners();
  };

  const resetForm = () => {
    setForm({ title: '', subtitle: '', link: '', image: null, priority: 0 });
    setEditing(null);
    refreshBanners();
  };

  return (
    <div className="container">
      <h2>{editing ? 'Edit Banner' : 'Upload Homepage Banner'}</h2>
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        placeholder="Subtitle"
        value={form.subtitle}
        onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
      />
      <input
        placeholder="Link"
        value={form.link}
        onChange={(e) => setForm({ ...form, link: e.target.value })}
      />
      <input
        type="number"
        placeholder="Priority (0 = first)"
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) })}
      />
      <input
        type="file"
        onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
      />

      {form.image && (
        <img
          src={URL.createObjectURL(form.image)}
          alt="Preview"
          className="banner-thumb"
          style={{ maxWidth: '300px', marginTop: '1rem', borderRadius: '8px' }}
        />
      )}

      {editing ? (
        <button className="btn" onClick={handleSave}>Save Changes</button>
      ) : (
        <button className="btn" onClick={handleUpload}>Upload Banner</button>
      )}

      {editing && (
        <button className="btn" onClick={resetForm}>Cancel</button>
      )}

      <h3>Existing Banners</h3>
      <div className="grid">
        {banners.map((b) => (
          <div key={b.$id} className="card">
            <img
              src={typeof b.image === 'string' ? b.image : '/fallback.jpg'}
              alt={b.name}
              className="banner-thumb"
              style={{
                width: '50%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '1rem',
              }}
              onError={(e) => (e.target.src = '/fallback.jpg')}
            />
            <h4>{b.name}</h4>
            <p>{b.subtitle}</p>
            <a href={b.link} target="_blank" rel="noreferrer">Visit Link</a>
            <p>Priority: {b.priority}</p>
            <button className="btn" onClick={() => {
              setEditing(b.$id);
              setForm({
                title: b.name,
                subtitle: b.subtitle,
                link: b.link,
                image: null,
                priority: b.priority,
              });
            }}>Edit</button>
            <button className="btn" onClick={() => handleDelete(b.$id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

//Not Found
function NotFound() {
  return (
    <div className="container">
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

//App Component with Routing
export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-banners" element={<AdminBanners />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}