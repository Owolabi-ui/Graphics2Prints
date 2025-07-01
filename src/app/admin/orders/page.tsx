"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  order_id: string;
  status: string;
  created_at: string;
  items: OrderItem[];
  total_amount: number;
  ready_in_days?: number;
}

export default function AdminOrders() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Redirect non-admins
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.role || session.user.role !== "admin") {
      router.replace("/"); // or show a 403 page
    }
  }, [session, status, router]);

  useEffect(() => {
    if (!session?.user?.role || session.user.role !== "admin") return;
    setIsLoading(true);
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, [session]);

  const handleReadyInDaysChange = (order_id: string, value: number) => {
    setOrders(orders =>
      orders.map(order =>
        order.order_id === order_id
          ? { ...order, ready_in_days: value }
          : order
      )
    );
  };

  const handleSave = async (order_id: string, ready_in_days?: number) => {
    if (!ready_in_days || isNaN(ready_in_days)) {
      alert("Please enter a valid number");
      return;
    }
    setSavingId(order_id);
    const res = await fetch(`/api/orders/${order_id}/ready`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ready_in_days }),
    });
    setSavingId(null);
    if (res.ok) {
      alert("Updated!");
    } else {
      alert("Failed to update");
    }
  };

  if (status === "loading" || isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold mb-8">Admin Orders</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Order ID</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Created At</th>
            <th className="border px-4 py-2">Ready In (days)</th>
            <th className="border px-4 py-2">Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.order_id}>
              <td className="border px-4 py-2">{order.order_id}</td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2">{new Date(order.created_at).toLocaleString()}</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  min={1}
                  value={order.ready_in_days ?? ""}
                  onChange={e =>
                    handleReadyInDaysChange(order.order_id, Number(e.target.value))
                  }
                  className="w-20 border px-2 py-1"
                />
              </td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  disabled={savingId === order.order_id}
                  onClick={() =>
                    handleSave(order.order_id, order.ready_in_days)
                  }
                >
                  {savingId === order.order_id ? "Saving..." : "Save"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}