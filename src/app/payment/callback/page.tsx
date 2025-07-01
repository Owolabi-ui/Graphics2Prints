"use client"
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const reference = searchParams.get("reference");
    if (!reference) {
      setStatus("error");
      setMessage("No payment reference found.");
      return;
    }

    fetch(`/api/payment/verify?reference=${reference}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setStatus("success");
          setMessage("Payment verified and order created! You can now track your order.");
        } else {
          setStatus("error");
          setMessage(data.error || "Payment verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("An error occurred while verifying payment.");
      });
  }, [searchParams]);

  return (
    <div className="container mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold mb-8">Payment Status</h1>
      <p className="mb-8">{message}</p>
      {status === "success" && (
        <button
          onClick={() => router.push("/orders")}
          className="bg-black text-white px-6 py-3 rounded"
        >
          View My Orders
        </button>
      )}
      {status === "error" && (
        <button
          onClick={() => router.push("/prints")}
          className="bg-gray-200 text-black px-6 py-3 rounded"
        >
          Continue Shopping
        </button>
      )}
    </div>
  );
}