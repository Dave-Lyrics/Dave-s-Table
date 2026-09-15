import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function Checkout() {
  const { cart, total } = useCart();
  const { user, refresh } = useAuth();
  const [address, setAddress] = useState(user?.savedDeliveryAddress || "");
  const [loading, setLoading] = useState(false), [error, setError] = useState("");
  const navigate = useNavigate();

  async function pay() {
    try {
      setLoading(true); setError("");
      const order = await api.post("/orders", { deliveryAddress: address });
      const payment = await api.post("/payments/initialize", { orderId: order.data.data._id });
      window.location.href = payment.data.data.authorization_url;
    } catch (e) { setError(e.response?.data?.message || "Could not start payment"); setLoading(false); }
  }
  if (!cart.items.length) return <main className="page-center">Your cart is empty.</main>;
  return <main className="content narrow"><div className="section-heading"><span className="eyebrow">FINAL STEP</span><h1>Checkout</h1></div>
    <div className="checkout-layout"><section className="form-card"><h2>Delivery details</h2><label>Delivery address<textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter your full delivery address"/></label>{error && <div className="error">{error}</div>}<button className="primary-btn full" disabled={loading || !address.trim()} onClick={pay}>{loading ? "Opening secure payment..." : `Pay ₦${total.toLocaleString()}`}</button></section>
    <aside className="summary"><span className="eyebrow">YOUR ORDER</span>{cart.items.map(i => <div className="summary-line" key={i.menuItem._id}><span>{i.menuItem.name} × {i.quantity}</span><b>₦{(i.menuItem.price*i.quantity).toLocaleString()}</b></div>)}<div className="summary-line total"><span>Total</span><b>₦{total.toLocaleString()}</b></div></aside></div>
  </main>
}