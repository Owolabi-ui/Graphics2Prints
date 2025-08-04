"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AddressProvider, useAddresses, CustomerAddress } from '@/context/AddressContext';
import { AddressList, AddressForm } from '@/components/Address';
import PageTransition from '@/components/PageTransition/PageTransition';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// Mock cart item interface
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Mock cart data for example purposes
const mockCart: CartItem[] = [
  { id: 1, name: "Business Cards (Double-sided)", price: 15000, quantity: 100 },
  { id: 2, name: "Flyers (A5)", price: 25000, quantity: 200 }
];

// Wrapper component to provide AddressContext
const CheckoutPage = () => {
  return (
    <AddressProvider>
      <CheckoutContent />
    </AddressProvider>
  );
};

// Main checkout content using address context
const CheckoutContent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addresses, loading: addressesLoading, getDefaultAddress } = useAddresses();
  
  // Mock cart functions
  const cart = mockCart;
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const clearCart = () => console.log("Cart cleared");
  
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [orderNotes, setOrderNotes] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  // Set default address when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = getDefaultAddress();
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    }
  }, [addresses, getDefaultAddress, selectedAddress]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create order API call will go here
      // Then redirect to payment page or success page

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Order placed successfully!');
      clearCart();
      router.push('/orders');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Order submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || addressesLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center bg-[#E5E4E2]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-black border-t-transparent rounded-full"
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="page-with-header-spacing min-h-screen bg-[#E5E4E2] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main checkout form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-xl p-6"
              >
                <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                
                {isAddingAddress ? (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Add New Address</h3>
                    <AddressForm 
                      onClose={() => setIsAddingAddress(false)} 
                    />
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Select Address</h3>
                        <button
                          onClick={() => setIsAddingAddress(true)}
                          className="text-sm px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600"
                        >
                          Add New
                        </button>
                      </div>
                      
                      {addresses.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                          <p className="text-gray-600">You don't have any saved addresses.</p>
                          <button
                            onClick={() => setIsAddingAddress(true)}
                            className="mt-2 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
                          >
                            Add Address
                          </button>
                        </div>
                      ) : (
                        <AddressList
                          showAddNew={false}
                          onSelect={setSelectedAddress}
                          selectedAddressId={selectedAddress?.address_id}
                        />
                      )}
                    </div>
                  </>
                )}

                <h2 className="text-xl font-bold mt-8 mb-6">Payment Method</h2>
                <div className="space-y-4">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paystack"
                      checked={paymentMethod === 'paystack'}
                      onChange={() => setPaymentMethod('paystack')}
                      className="h-5 w-5 text-primary-500"
                    />
                    <span className="ml-3 font-medium">Paystack (Credit/Debit Card)</span>
                  </label>
                  
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank-transfer"
                      checked={paymentMethod === 'bank-transfer'}
                      onChange={() => setPaymentMethod('bank-transfer')}
                      className="h-5 w-5 text-primary-500"
                    />
                    <span className="ml-3 font-medium">Bank Transfer</span>
                  </label>
                </div>

                <h2 className="text-xl font-bold mt-8 mb-6">Order Notes (Optional)</h2>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Add any special instructions or notes about your order"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </motion.div>
            </div>
            
            {/* Order summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg shadow-xl p-6 sticky top-20"
              >
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cart.map((item: CartItem) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <p>Subtotal</p>
                    <p className="font-medium">₦{totalPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p>Shipping</p>
                    <p className="font-medium">Calculated at next step</p>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4">
                    <p>Total</p>
                    <p>₦{totalPrice.toLocaleString()}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleSubmitOrder}
                  disabled={isLoading || !selectedAddress || cart.length === 0}
                  className="w-full py-3 bg-primary-500 text-white rounded-md font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Place Order'}
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CheckoutPage;
