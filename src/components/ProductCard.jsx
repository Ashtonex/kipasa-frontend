// src/components/ProductCard.jsx

export default function ProductCard({ product }) {
  const handleBuy = async () => {
    const res = await fetch('https://kipasa-backend.onrender.com/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: product.name, // ✅ matches Appwrite schema
        price: product.price * 100, // ✅ convert to cents for Stripe
      }),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div className="card">
      <img
        src={product.image}
        alt={product.name} // ✅ use correct field
        style={{ width: '70%', borderRadius: '9px' }}
      />
      <h3>{product.name}</h3> {/* ✅ use correct field */}
      <p>${product.price}</p>
      <button className="btn buy" onClick={handleBuy}>Buy</button>
    </div>
  );
}