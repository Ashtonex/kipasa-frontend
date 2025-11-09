import { useState } from 'react';

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://kipasa-backend.onrender.com/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: product.name, // ✅ matches Appwrite schema
          price: product.price * 100, // ✅ convert to cents for Stripe
        }),
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url; // ✅ redirect to Stripe
      } else {
        console.error('Stripe URL missing');
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <img
        src={product.image}
        alt={product.name}
        style={{ width: '70%', borderRadius: '9px' }}
      />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button className="btn buy" onClick={handleBuy} disabled={loading}>
        {loading ? 'Redirecting...' : 'Buy'}
      </button>
    </div>
  );
}