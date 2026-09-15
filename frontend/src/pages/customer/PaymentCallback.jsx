import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";

export default function PaymentCallback() {
  const [params] = useSearchParams(), [state, setState] = useState("verifying"), [message, setMessage] = useState("");
  useEffect(() => {
    const ref = params.get("reference");
    if (!ref) { setState("error"); setMessage("No payment reference was returned."); return; }
    api.get(`/payments/verify/${encodeURIComponent(ref)}`).then(r => {
      setState("success"); setMessage(r.data.message);
    }).catch(e => { setState("error"); setMessage(e.response?.data?.message || "Payment verification failed."); });
  }, []);
  return <main className="page-center"><div className="result-card"><div className={`result-icon ${state}`}>{state === "success" ? "✓" : state === "error" ? "!" : "…"}</div><h1>{state === "verifying" ? "Verifying payment" : state === "success" ? "Order confirmed" : "Payment issue"}</h1><p>{message || "Please wait while we verify your transaction directly with Paystack."}</p>{state !== "verifying" && <Link className="primary-btn" to={state === "success" ? "/orders" : "/checkout"}>{state === "success" ? "View my orders" : "Return to checkout"}</Link>}</div></main>
}