import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';
import { getAllProducts } from '../utils/appwrite';

export default function Home() {
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