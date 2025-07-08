"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  order_number: string;
  status: string;
  created_at: string;
  items: OrderItem[];
  total_amount: number;
  ready_in_days?: number;
}

export default function OrderDetails() {
  const { order_id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/orders/${order_id}`, { cache: "no-store" })
      .then(async (res) => {
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          setError("Invalid JSON response from server");
          setLoading(false);
          return;
        }
        if (!res.ok) {
          setError(data.error || "Failed to fetch order data");
          setOrder(null);
        } else {
          setOrder(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Network error while fetching order data");
        setLoading(false);
      });
  }, [order_id]);

  if (loading) return <div className="text-center py-24">Loading...</div>;
  if (error) return <div className="text-center py-24 text-red-600">{error}</div>;
  if (!order) return <div className="text-center py-24 text-red-600">Order not found.</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-20 mb-20">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">
        Order <span className="text-blue-700">#{order.order_number}</span>
      </h1>
      <div className="mb-2 flex items-center gap-2">
        <span className="font-semibold text-gray-700">Status:</span>
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
      <div className="mb-2 text-gray-600">
        <span className="font-semibold">Placed on:</span> {new Date(order.created_at).toLocaleString()}
      </div>
      {order.ready_in_days && (
        <div className="mb-4 text-gray-700">
          <span className="font-semibold">Estimated ready time:</span> {order.ready_in_days} days
        </div>
      )}
      <div className="mb-4">
        <strong className="block mb-2 text-gray-800">Items:</strong>
        <ul className="list-disc ml-6 space-y-1">
          {order.items && Array.isArray(order.items)
            ? order.items.map((item, idx) => (
                <li key={idx} className="text-gray-700">
                  <span className="font-medium">{item.name}</span> &times; {item.quantity}
                </li>
              ))
            : <li>No items found.</li>}
        </ul>
      </div>
      <div className="text-xl font-bold text-gray-900 border-t pt-4">
        Total: <span className="text-blue-700">
          ₦{typeof order.total_amount === "number" ? order.total_amount.toLocaleString() : "0"}
        </span>
      </div>
    </div>
  );
}
