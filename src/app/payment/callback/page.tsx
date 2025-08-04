"use client"
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your payment...");
  const [reference, setReference] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams.get("reference");
    setReference(ref);
    if (!ref) {
      setStatus("error");
      setMessage("No payment reference found.");
      return;
    }

    fetch(`/api/payment/verify?reference=${ref}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setStatus("success");
          setMessage("Payment verified and order created! You can now track your order.");
          setOrderId(data.orderId?.toString() ?? null); // Save the orderId from backend
          useCartStore.getState().clearCart();
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
        <>
          <p className="mb-4 text-green-600">
            Payment successful! Reference: {reference}
          </p>
          <button
            onClick={() =>
              orderId
                ? router.push(`/orders/${orderId}`)
                : router.push("/orders")
            }
            className="bg-black text-white px-6 py-3 rounded"
          >
            {orderId ? "Track This Order" : "View My Orders"}
          </button>
        </>
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

export default function PaymentCallback() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div></div>}>
      <PaymentCallbackContent />
    </Suspense>
  );
}