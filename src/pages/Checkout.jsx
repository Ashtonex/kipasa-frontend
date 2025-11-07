// src/pages/Checkout.jsx
import { useEffect } from 'react';
import { createCheckoutSession } from '../utils/stripe';

export default function Checkout() {
  useEffect(() => {
    createCheckoutSession();
  }, []);

  return (
    <div className="container">
      <h2>Redirecting to payment...</h2>
    </div>
  );
}