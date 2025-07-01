"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";


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

export default function OrderDetails() {
  const { order_id } = useParams();
   const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${order_id}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data);
        setLoading(false);
      });
  }, [order_id]);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found.</div>;

    return (
    <div>
      <h1>Order #{order.order_id}</h1>
      <div>Status: {order.status}</div>
      <div>Date: {new Date(order.created_at).toLocaleString()}</div>
         {order.ready_in_days && (
        <div>Estimated ready time: {order.ready_in_days} days</div>
      )}
      <div>
        <strong>Items:</strong>
        <ul>
          {order.items && Array.isArray(order.items)
            ? order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} x {item.quantity}
                </li>
              ))
            : null}
        </ul>
      </div>
      <div>
        Total: ₦{order.total_amount}
      </div>
    </div>
  );
}