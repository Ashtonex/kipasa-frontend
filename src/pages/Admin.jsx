import { useEffect, useState } from 'react';
import {
  getSession,
  uploadProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
} from '../utils/appwrite';
import { useNavigate, Link } from 'react-router-dom';

export default function Admin() {
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