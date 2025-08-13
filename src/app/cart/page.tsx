"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "react-toastify";
import Image from "next/image";
import PageTransition from "@/components/PageTransition/PageTransition";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Define PaystackPop type at module level
interface PaystackPopInterface {
  setup: (config: {
    key: string;
    email: string;
    amount: number;
    currency: string;
    ref: string;

    channels?: string[];
    metadata: {
      custom_fields: Array<{
        display_name: string;
        variable_name: string;
        value: string;
      }>;
    };
    onClose: () => void;
    callback: (response: { reference: string }) => void;
  }) => {
    openIframe: () => void;
  };
}

// Declare PaystackPop as a global variable
declare global {
  interface Window {
    PaystackPop: PaystackPopInterface;
  }
}

export default function Cart() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isPaystackReady, setIsPaystackReady] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 50;

    const checkPaystack = () => {
      attempts++;
      console.log(`Checking Paystack (attempt ${attempts})`);

      if (typeof window !== "undefined" && window.PaystackPop) {
        console.log("Paystack initialized successfully");
        setIsPaystackReady(true);
        return;
      }

      if (attempts < maxAttempts) {
        setTimeout(checkPaystack, 200);
      } else {
        console.error("Failed to initialize Paystack");
        toast.error("Payment system failed to initialize");
      }
    };

    checkPaystack();

    return () => {
      attempts = maxAttempts; // Stop checking on unmount
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(price);
  };

  // Calculate total directly
  const total = items.reduce((sum, item) => {
    const pricePerPiece = item.amount / item.minimum_order;
    return sum + pricePerPiece * item.quantity;
  }, 0);

  useEffect(() => {
    console.log("Public key:", process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);
    console.log("Callback URL:", process.env.NEXT_PUBLIC_PAYSTACK_CALLBACK_URL);
  }, []);

  const handleCheckout = async () => {
    if (!session) {
      router.push("/login?redirect=/cart");
      return;
    }
    if (!isPaystackReady) {
      toast.error("Payment system is initializing. Please try again.");
      return;
    }
    try {
      setIsLoading(true);
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        email: session.user?.email || "customer@email.com",
        amount: Math.round(total * 100), // Ensure amount is rounded
        currency: "NGN",
        ref: `ref-${Math.ceil(Math.random() * 10e10)}`,
        metadata: {
          custom_fields: [
            {
              display_name: "Cart Items",
              variable_name: "cart_items",
              value: JSON.stringify(items),
            },
          ],
        },
        onClose: () => {
          setIsLoading(false);
          toast.error("Payment cancelled");
        },
        callback: (response) => {
          console.log("Payment response:", response);
          setIsLoading(false);
          toast.success("Payment complete! Reference: " + response.reference);
          router.push(`/payment/callback?reference=${response.reference}`);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Checkout error:", error);
      setIsLoading(false);
      console.error("Checkout error:", error);
      toast.error("Checkout failed");
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-6 py-24 pt-32">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Shopping Cart
        </h1>
        {items.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => {
                const pricePerPiece = item.amount / item.minimum_order;
                const itemTotal = pricePerPiece * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 border-b pb-4 dark:border-gray-700"
                  >
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        ₦{formatPrice(pricePerPiece)} per piece
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <label className="text-gray-600 dark:text-gray-400">
                            Quantity:
                          </label>
                          <input
                            type="number"
                            min={item.minimum_order}
                            step={item.minimum_order}
                            value={item.quantity || ""}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || item.minimum_order;
                              if (newQuantity < item.minimum_order) {
                                toast.error(
                                  `Minimum order is ${item.minimum_order} pieces`
                                );
                                return;
                              }
                              updateQuantity(item.id, newQuantity);
                            }}
                            className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-[#FF0000] dark:bg-gray-800 dark:border-gray-600"
                          />
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Subtotal: ₦{formatPrice(itemTotal)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 border-t pt-8 dark:border-gray-700">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                Total: ₦{formatPrice(total)}
              </p>
              {!session && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    <strong>Please log in to proceed with checkout.</strong> We need your account information to process your order and send you updates.
                  </p>
                </div>
              )}
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className={`mt-4 w-full py-4 rounded-lg transition-colors ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-[#FF0000]"
                } text-white`}
              >
                {isLoading ? "Processing..." : session ? "Proceed to Checkout" : "Login to Checkout"}
              </button>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}
