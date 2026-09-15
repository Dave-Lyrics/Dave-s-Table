import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import api from "../../services/api";
import { io } from "socket.io-client";

export default function AdminDashboard() {
  const [orders,setOrders]=useState([]),[stats,setStats]=useState({orders:0,menu:0,customers:0}),[filter,setFilter]=useState("All");
  async function load(){const [o,s]=await Promise.all([api.get("/orders/admin/all"),api.get("/admin/stats")]);setOrders(o.data.data);setStats(s.data.data)}
  useEffect(()=>{load();const socket=io("/");socket.emit("join:admin");socket.on("order:new",order=>setOrders(x=>[order,...x]));return()=>socket.disconnect()},[]);
  async function status(id,status){const r=await api.patch(`/orders/${id}/status`,{status});setOrders(x=>x.map(o=>o._id===id?r.data.data:o))}
  const filtered=filter==="All"?orders:orders.filter(o=>o.orderStatus===filter);
  return <main className="admin-content"><div className="admin-head"><div><span className="eyebrow">DAVE'S TABLE • PRIVATE TABLE</span><h1>Order Dashboard</h1><p>Incoming paid orders appear here in real time.</p></div><div className="head-actions"><button className="secondary-btn" onClick={load}><RefreshCw size={17}/> Refresh</button><Link className="primary-btn" to="/admin/menu"><Plus size={18}/> Manage menu</Link></div></div>
  <div className="stat-grid"><div><small>TOTAL ORDERS</small><b>{stats.orders}</b></div><div><small>MENU ITEMS</small><b>{stats.menu}</b></div><div><small>CUSTOMERS</small><b>{stats.customers}</b></div></div>
  <div className="filter-bar">{["All","Incoming","Preparing","Ready","Completed","Cancelled"].map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{x}</button>)}</div>
  <div className="admin-orders">{filtered.map(o=><article className="admin-order" key={o._id}><div className="order-top"><div><small>#{o._id.slice(-8).toUpperCase()}</small><h2>₦{o.totalPrice.toLocaleString()}</h2></div><span className={`status status-${o.orderStatus.toLowerCase()}`}>{o.orderStatus}</span></div><div className="customer-info"><b>{o.customer?.name}</b><span>{o.customer?.email}</span><span>{o.deliveryAddress}</span></div><div className="order-items">{o.items.map((i,n)=><div key={n}><span>{i.name} × {i.quantity}</span><b>₦{(i.price*i.quantity).toLocaleString()}</b></div>)}</div><div className="status-actions">{o.orderStatus!=="Cancelled"&&o.orderStatus!=="Completed"&&["Incoming","Preparing","Ready","Completed","Cancelled"].map(s=><button key={s} disabled={o.orderStatus===s} onClick={()=>status(o._id,s)}>{s}</button>)}</div></article>)}</div>{!filtered.length&&<div className="empty-state">No orders in this status.</div>}</main>
}