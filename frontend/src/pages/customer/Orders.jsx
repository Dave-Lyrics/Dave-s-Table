import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Orders() {
  const [orders, setOrders] = useState([]), [error, setError] = useState("");
  useEffect(() => { api.get("/orders/mine").then(r => setOrders(r.data.data)).catch(e => setError(e.response?.data?.message || "Could not load orders")); }, []);
  async function cancel(id) {
    try { const { data } = await api.patch(`/orders/${id}/cancel`); setOrders(o => o.map(x => x._id === id ? data.data : x)); }
    catch(e) { setError(e.response?.data?.message || "Could not cancel order"); }
  }
  return <main className="content narrow"><div className="section-heading"><span className="eyebrow">YOUR TABLE</span><h1>Order History</h1></div>{error && <div className="error">{error}</div>}
    <div className="orders-list">{orders.map(order => <article className="order-card" key={order._id}><div className="order-top"><div><small>ORDER #{order._id.slice(-7).toUpperCase()}</small><h3>₦{order.totalPrice.toLocaleString()}</h3></div><span className={`status status-${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span></div><div className="order-items">{order.items.map((i,idx)=><span key={idx}>{i.name} × {i.quantity}</span>)}</div><div className="order-bottom"><span>{new Date(order.createdAt).toLocaleString()}</span>{order.orderStatus === "Pending" && <button className="danger-link" onClick={() => cancel(order._id)}>Cancel order</button>}</div></article>)}</div>{!orders.length && <div className="empty-state">No orders yet.</div>}
  </main>
}