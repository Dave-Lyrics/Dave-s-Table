import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Auth({ mode = "login", admin = false }) {
  const { login, signup } = useAuth(); const nav = useNavigate(); const loc = useLocation();
  const [form, setForm] = useState({ name:"", email:"", password:"" }), [error,setError]=useState(""), [loading,setLoading]=useState(false);
  const isSignup = mode === "signup";
  async function submit(e) {
    e.preventDefault(); setLoading(true); setError("");
    try { if (isSignup && admin) { const { data } = await api.post("/auth/admin/signup", form); if(data.user) nav("/admin"); } else if(isSignup) { await signup(form); nav("/menu"); } else { await login({ ...form, expectedRole: admin ? "admin" : "customer" }); nav(admin ? "/admin" : (loc.state?.from || "/menu")); } }
    catch(e) { setError(e.response?.data?.message || "Something went wrong"); } finally { setLoading(false); }
  }
  return <main className="auth-page"><div className="auth-card"><Link to="/" className="brand center"><span>DT</span><div>Dave's Table<small>CURATED • FRESH • SIMPLE</small></div></Link><span className="eyebrow">{admin ? "PRIVATE TABLE" : "WELCOME"}</span><h1>{isSignup ? "Create your account" : admin ? "Admin sign in" : "Welcome back"}</h1><p>{admin ? "Restaurant management access." : isSignup ? "Set up your account and start ordering." : "Sign in to continue to your table."}</p>
  <form onSubmit={submit}>{isSignup && <label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>}<label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Password<input type="password" required minLength="6" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>{error&&<div className="error">{error}</div>}<button className="primary-btn full" disabled={loading}>{loading?"Please wait...":isSignup?"Create account":"Sign in"}</button></form>
  {!admin && <div className="auth-links">{isSignup ? <span>Already registered? <Link to="/login">Log in</Link></span> : <><Link to="/forgot-password">Forgot password?</Link><span>New here? <Link to="/signup">Create account</Link></span></>}</div>}
  {admin && <div className="auth-links"><Link to="/admin/forgot-password">Forgot admin password?</Link></div>}</div></main>
}