import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";

export default function PaymentCallback() {
  const [params] = useSearchParams();

  const [state, setState] = useState("verifying");
  const [message, setMessage] = useState(
    "Please wait while we verify your transaction directly with Paystack."
  );

  useEffect(() => {
    const ref = params.get("reference");

    if (!ref) {
      setState("error");
      setMessage("No payment reference was returned.");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const verifyPayment = async () => {
      attempts++;

      try {
        const response = await api.get(
          `/payments/verify/${encodeURIComponent(ref)}`,
          {
            timeout: 15000
          }
        );

        if (cancelled) return;

        setState("success");
        setMessage(
          response.data.message || "Payment verified and order confirmed."
        );
      } catch (error) {
        if (cancelled) return;

        console.error("Payment verification attempt failed:", error);

        // Retry a few times for temporary Render/network issues
        if (attempts < 5) {
          setMessage(
            `Verifying your payment... Attempt ${attempts} of 5`
          );

          setTimeout(() => {
            if (!cancelled) {
              verifyPayment();
            }
          }, 2000);

          return;
        }

        setState("error");
        setMessage(
          error.response?.data?.message ||
            "We could not verify your payment. Please try again."
        );
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [params]);

  return (
    <main className="page-center">
      <div className="result-card">
        <div className={`result-icon ${state}`}>
          {state === "success"
            ? "✓"
            : state === "error"
            ? "!"
            : "…"}
        </div>

        <h1>
          {state === "verifying"
            ? "Verifying payment"
            : state === "success"
            ? "Order confirmed"
            : "Payment issue"}
        </h1>

        <p>{message}</p>

        {state !== "verifying" && (
          <Link
            className="primary-btn"
            to={state === "success" ? "/orders" : "/checkout"}
          >
            {state === "success"
              ? "View my orders"
              : "Return to checkout"}
          </Link>
        )}
      </div>
    </main>
  );
}