import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function ResetPassword() {
  const [form,setForm]=useState({email:"",code:"",password:""}),[message,setMessage]=useState(""),[error,setError]=useState(""); const nav=useNavigate();
  async function submit(e){e.preventDefault();setError("");try{const r=await api.post("/auth/reset-password",form);setMessage(r.data.message);setTimeout(()=>nav("/login"),1000)}catch(e){setError(e.response?.data?.message||"Reset failed")}}
  return <main className="auth-page"><div className="auth-card"><span className="eyebrow">ACCOUNT RECOVERY</span><h1>Reset password</h1><form onSubmit={submit}><label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>6-digit code<input required inputMode="numeric" value={form.code} onChange={e=>setForm({...form,code:e.target.value})}/></label><label>New password<input type="password" minLength="6" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>{error&&<div className="error">{error}</div>}{message&&<div className="success">{message}</div>}<button className="primary-btn full">Reset password</button></form><Link to="/login" className="back-link">Back to login</Link></div></main>
}