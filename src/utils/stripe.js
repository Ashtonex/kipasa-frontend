// src/utils/stripe.js
export async function createCheckoutSession(product) {
  const stripe = Stripe('pk_test_51SH5XVDDhIHq1hVmYVCVyZmli8eWXk7KQKPEAoEgMZm1B60vWrDP7F9J1C7tq3KKC4lKH498ZxjsJV0BM8YEwTZ100Bel7PetO');

  const session = await fetch('https://kipasa-backend.onrender.com/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: product.title,
      price: product.price * 100, // convert to cents
    }),
  }).then((res) => res.json());

  stripe.redirectToCheckout({ sessionId: session.id });
}