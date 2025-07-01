"use client"
import { useState, useEffect } from 'react'
import PageTransition from '@/components/PageTransition/PageTransition'
import { toast } from 'react-toastify'
import AuthGuard from '@/components/auth/AuthGuard'
import type { Session } from "next-auth"
import Link from "next/link";

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

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  // Fetch orders when session changes
  useEffect(() => {
    if (!session) return;
    setIsLoading(true);
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        toast.error('Failed to load orders');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [session]);

  // Render AuthGuard and update session state in a useEffect
 return (
    <AuthGuard>
      {(sess: Session | null) => {
        // update session state
        useEffect(() => {
          if (session !== sess) setSession(sess);
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [sess]);

        if (!session || isLoading) return <div>Loading...</div>;
        return (
          <PageTransition>
            <div className="container mx-auto px-6 py-24">
              <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
              {orders.length === 0 ? (
                <p>No orders found</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.order_id} className="border p-6 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                          Order #{order.order_id}
                        </h3>
                        <span className="px-3 py-1 rounded-full bg-gray-100">
                          {order.status}
                        </span>
                      </div>
                      <div className="mb-2 text-sm text-gray-500">
                        Placed on: {new Date(order.created_at).toLocaleString()}
                      </div>
                      {order.ready_in_days && (
                        <div className="mb-2 text-sm text-gray-700">
                          Estimated ready in: {order.ready_in_days} days
                        </div>
                      )}
                      <div>
                        <strong>Items:</strong>
                        <ul className="list-disc ml-6">
                          {order.items && Array.isArray(order.items)
                            ? order.items.map((item, idx) => (
                                <li key={idx}>
                                  {item.name} x {item.quantity}
                                </li>
                              ))
                            : null}
                        </ul>
                      </div>
                      <div className="mt-2 font-semibold">
                        Total: ₦{order.total_amount}
                      </div>
                      <Link
                        href={`/orders/${order.order_id}`}
                        className="mt-4 underline text-blue-600 block"
                      >
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PageTransition>
        )
      }}
    </AuthGuard>
  )
}