// src/components/TrendingProducts.jsx
import { useEffect, useState } from 'react';
import { getProducts } from '../utils/appwrite';

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((all) => {
      const trending = all.slice(0, 3); // ✅ Replace with real trending logic later
      setProducts(trending);
    });
  }, []);

  return (
    <section className="trending-section">
      <h3>🔥 Nouvelle Collection</h3>
      <div className="grid">
        {products.map((p) => (
          <div key={p.$id} className="card">
            <img src={p.image.href} alt={p.title} />
            <h4>{p.title}</h4>
            <p>{p.price}€</p>
          </div>
        ))}
      </div>
    </section>
  );
}