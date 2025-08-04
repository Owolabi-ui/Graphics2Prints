"use client"
import { useEffect, useState } from "react";
import Link from "next/link";

interface Order {
  order_number: string;
  status: string;
  created_at: string;
  total_amount: number;
  ready_in_days?: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/orders", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.error || "Failed to fetch orders");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setOrders(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Network error while fetching orders");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center page-with-header-spacing py-24">Loading orders...</div>;
  if (error) return <div className="text-center page-with-header-spacing py-24 text-red-600">{error}</div>;
  if (orders.length === 0) return <div className="text-center page-with-header-spacing py-24">No orders found.</div>;

  return (
    <div className="max-w-4xl mx-auto page-with-header-spacing p-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      <ul className="space-y-4">
        {orders.map((order, index) => {
          const key = order.order_number ?? index;
          return (
            <li key={key} className="border rounded p-4 shadow-sm hover:shadow-md transition">
              <Link href={`/orders/${order.order_number}`} className="block">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg text-blue-700">Order #{order.order_number}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="text-gray-600 mt-1">
                  Placed on: {new Date(order.created_at).toLocaleString()}
                </div>
                <div className="text-gray-900 font-bold mt-2">
                  Total: ₦{typeof order.total_amount === "number" ? order.total_amount.toLocaleString() : "0"}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
