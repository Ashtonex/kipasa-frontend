import { useEffect, useState } from 'react';
import {
  uploadBanner,
  getBanners,
  deleteBanner,
  updateBanner,
  storage,
  ID,
} from '../utils/appwrite';

export default function AdminBanners() {
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