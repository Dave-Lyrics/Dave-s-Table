import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function ForgotPassword() {
  const [email,setEmail]=useState(""),[sent,setSent]=useState(false),[error,setError]=useState("");
  async function submit(e){e.preventDefault();setError("");try{await api.post("/auth/forgot-password",{email});setSent(true)}catch(e){setError(e.response?.data?.message||"Request failed")}}
  return <main className="auth-page"><div className="auth-card"><span className="eyebrow">ACCOUNT RECOVERY</span><h1>Forgot password?</h1><p>We'll send a reset code to the email on your account.</p>{sent?<><div className="success">Reset code sent. Check your email.</div><Link className="primary-btn full" to="/reset-password">Enter reset code</Link></>:<form onSubmit={submit}><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>{error&&<div className="error">{error}</div>}<button className="primary-btn full">Send reset code</button></form>}<Link to="/login" className="back-link">Back to login</Link></div></main>
}