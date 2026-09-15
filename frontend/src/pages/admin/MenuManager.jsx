import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

const blank={name:"",description:"",price:"",category:"Main",availability:true,image:""};
export default function MenuManager(){
  const [items,setItems]=useState([]),[form,setForm]=useState(blank),[editing,setEditing]=useState(null),[error,setError]=useState("");
  async function load(){const r=await api.get("/menu");setItems(r.data.data)}
  useEffect(()=>{load()},[]);
  function edit(i){setEditing(i._id);setForm({...i})}
  async function submit(e){e.preventDefault();setError("");try{const data=new FormData();Object.entries(form).forEach(([k,v])=>data.append(k,v));if(editing)await api.put(`/menu/${editing}`,data);else await api.post("/menu",data);setForm(blank);setEditing(null);load()}catch(e){setError(e.response?.data?.message||"Could not save")}}
  async function remove(id){if(!confirm("Delete this menu item?"))return;await api.delete(`/menu/${id}`);load()}
  async function toggle(id){await api.patch(`/menu/${id}/toggle`);load()}
  return <main className="admin-content"><div className="admin-head"><div><span className="eyebrow">MENU MANAGEMENT</span><h1>{editing?"Edit menu item":"Add menu item"}</h1></div><Link className="secondary-btn" to="/admin">← Dashboard</Link></div>
  <form className="menu-form form-card" onSubmit={submit}><div className="form-row"><label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Category<input required value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/></label><label>Price<input required type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label></div><label>Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><label>Image URL<input value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/></label>{error&&<div className="error">{error}</div>}<div className="head-actions"><button className="primary-btn">{editing?"Save changes":"Add item"}</button>{editing&&<button type="button" className="secondary-btn" onClick={()=>{setEditing(null);setForm(blank)}}>Cancel</button>}</div></form>
  <div className="menu-admin-grid">{items.map(i=><article className="admin-menu-card" key={i._id}>{i.image?<img src={i.image} alt=""/>:<div className="image-placeholder">DT</div>}<div><span className="pill">{i.category}</span><h3>{i.name}</h3><p>{i.description}</p><b>₦{i.price.toLocaleString()}</b></div><div className="card-actions"><button onClick={()=>toggle(i._id)}>{i.availability?"Available":"Unavailable"}</button><button onClick={()=>edit(i._id?i:i)}>Edit</button><button className="danger-link" onClick={()=>remove(i._id)}>Delete</button></div></article>)}</div>
  </main>
}