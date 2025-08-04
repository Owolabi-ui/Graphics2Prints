# Customer Address Implementation Plan

## 1. Working with Your Existing Database Schema

You've mentioned that you already have a `customers` table that captures phone numbers and a `customer_addresses` table with the following fields:

- address_id
- customer_id
- street_address
- city
- state
- country
- is_default
- created_at

Let's check if we need to add any additional fields to your existing schema for better address management:

```sql
-- Add missing fields to customer_addresses table if they don't exist
ALTER TABLE customer_addresses ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);
ALTER TABLE customer_addresses ADD COLUMN IF NOT EXISTS address_type VARCHAR(20) DEFAULT 'shipping';
ALTER TABLE customer_addresses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Add index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);

-- Make sure foreign key constraint exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'customer_addresses_customer_id_fkey'
    ) THEN
        ALTER TABLE customer_addresses 
        ADD CONSTRAINT customer_addresses_customer_id_fkey 
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
    END IF;
END
$$;
```

## 2. Profile Page Address Collection

Let's update your Profile page to collect shipping addresses.

### Step 1: Create Address Form Component

```tsx
// src/components/AddressForm.tsx
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface AddressFormProps {
  existingAddress?: {
    id?: number;
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone_number?: string;
  };
  onSave: (address: any) => void;
  onCancel?: () => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({ 
  existingAddress, 
  onSave, 
  onCancel 
}) => {
  const [address, setAddress] = useState({
    street_address: existingAddress?.street_address || '',
    city: existingAddress?.city || '',
    state: existingAddress?.state || '',
    postal_code: existingAddress?.postal_code || '',
    country: existingAddress?.country || 'Nigeria',
    phone_number: existingAddress?.phone_number || '',
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate form
      if (!address.street_address || !address.city || !address.state || !address.postal_code) {
        toast.error('Please fill all required fields');
        return;
      }
      
      onSave(address);
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Street Address *
        </label>
        <input
          type="text"
          name="street_address"
          value={address.street_address}
          onChange={handleChange}
          className="input-enhanced mt-1"
          required
          placeholder="House number and street name"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            className="input-enhanced mt-1"
            required
            placeholder="City"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            State *
          </label>
          <select
            name="state"
            value={address.state}
            onChange={handleChange}
            className="input-enhanced mt-1"
            required
          >
            <option value="">Select State</option>
            <option value="Abia">Abia</option>
            <option value="Adamawa">Adamawa</option>
            <option value="Akwa Ibom">Akwa Ibom</option>
            <option value="Anambra">Anambra</option>
            <option value="Bauchi">Bauchi</option>
            <option value="Bayelsa">Bayelsa</option>
            <option value="Benue">Benue</option>
            <option value="Borno">Borno</option>
            <option value="Cross River">Cross River</option>
            <option value="Delta">Delta</option>
            <option value="Ebonyi">Ebonyi</option>
            <option value="Edo">Edo</option>
            <option value="Ekiti">Ekiti</option>
            <option value="Enugu">Enugu</option>
            <option value="FCT">Federal Capital Territory</option>
            <option value="Gombe">Gombe</option>
            <option value="Imo">Imo</option>
            <option value="Jigawa">Jigawa</option>
            <option value="Kaduna">Kaduna</option>
            <option value="Kano">Kano</option>
            <option value="Katsina">Katsina</option>
            <option value="Kebbi">Kebbi</option>
            <option value="Kogi">Kogi</option>
            <option value="Kwara">Kwara</option>
            <option value="Lagos">Lagos</option>
            <option value="Nasarawa">Nasarawa</option>
            <option value="Niger">Niger</option>
            <option value="Ogun">Ogun</option>
            <option value="Ondo">Ondo</option>
            <option value="Osun">Osun</option>
            <option value="Oyo">Oyo</option>
            <option value="Plateau">Plateau</option>
            <option value="Rivers">Rivers</option>
            <option value="Sokoto">Sokoto</option>
            <option value="Taraba">Taraba</option>
            <option value="Yobe">Yobe</option>
            <option value="Zamfara">Zamfara</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Postal Code *
          </label>
          <input
            type="text"
            name="postal_code"
            value={address.postal_code}
            onChange={handleChange}
            className="input-enhanced mt-1"
            required
            placeholder="Postal code"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={address.country}
            onChange={handleChange}
            className="input-enhanced mt-1 bg-gray-50"
            readOnly
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone Number (for delivery)
        </label>
        <input
          type="tel"
          name="phone_number"
          value={address.phone_number}
          onChange={handleChange}
          className="input-enhanced mt-1"
          placeholder="Phone number for delivery"
        />
      </div>
      
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1"
        >
          {loading ? 'Saving...' : 'Save Address'}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-ghost flex-1"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
```

### Step 2: Create API Endpoints for Address Management

Adjust the API endpoints to match your existing database schema:

```tsx
// src/app/api/address/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import db from '@/lib/db';

// Get all addresses for current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get customer_id from email
    const customer = await db.query(
      "SELECT id FROM customers WHERE email = $1",
      [session.user.email]
    );
    
    if (!customer.rows.length) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    const customerId = customer.rows[0].id;
    
    // Get addresses for this customer
    const addresses = await db.query(
      "SELECT * FROM customer_addresses WHERE customer_id = $1 ORDER BY is_default DESC, created_at DESC",
      [customerId]
    );
    
    return NextResponse.json({ addresses: addresses.rows });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

// Create new address
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { 
      street_address, 
      city, 
      state, 
      postal_code, 
      country, 
      is_default,
      address_type
    } = body;
    
    // Validate required fields
    if (!street_address || !city || !state) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Get customer_id from email
    const customer = await db.query(
      "SELECT id FROM customers WHERE email = $1",
      [session.user.email]
    );
    
    if (!customer.rows.length) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    const customerId = customer.rows[0].id;
    
    // If this is default address, unset any existing default
    if (is_default) {
      await db.query(
        "UPDATE customer_addresses SET is_default = false WHERE customer_id = $1 AND address_type = $2",
        [customerId, address_type || 'shipping']
      );
    }
    
    // Insert new address
    const result = await db.query(
      `INSERT INTO customer_addresses (
        customer_id, 
        street_address, 
        city, 
        state, 
        postal_code, 
        country, 
        is_default,
        address_type,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
      [
        customerId,
        street_address,
        city,
        state,
        postal_code || '',
        country || 'Nigeria',
        is_default === false ? false : true, // Default to true if not specified
        address_type || 'shipping'
      ]
    );
    
    return NextResponse.json({ address: result.rows[0] });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}
```
```

```tsx
// src/app/api/address/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import db from '@/lib/db';

// Update address
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get customer_id from email
    const customer = await db.query(
      "SELECT id FROM customers WHERE email = $1",
      [session.user.email]
    );
    
    if (!customer.rows.length) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    const customerId = customer.rows[0].id;
    
    // Verify the address belongs to this customer
    const addressCheck = await db.query(
      "SELECT address_id, address_type FROM customer_addresses WHERE address_id = $1 AND customer_id = $2",
      [id, customerId]
    );
    
    if (!addressCheck.rows.length) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    
    const body = await req.json();
    const { 
      street_address, 
      city, 
      state, 
      postal_code, 
      country, 
      is_default,
      address_type 
    } = body;
    
    // Validate required fields
    if (!street_address || !city || !state) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // If making this the default address, unset other defaults of the same type
    if (is_default) {
      const addressTypeToUse = address_type || addressCheck.rows[0].address_type || 'shipping';
      await db.query(
        "UPDATE customer_addresses SET is_default = false WHERE customer_id = $1 AND address_type = $2 AND address_id != $3",
        [customerId, addressTypeToUse, id]
      );
    }
    
    // Update the address
    const result = await db.query(
      `UPDATE customer_addresses SET 
        street_address = $1, 
        city = $2, 
        state = $3, 
        postal_code = $4, 
        country = $5, 
        is_default = $6,
        address_type = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE address_id = $8 AND customer_id = $9 RETURNING *`,
      [
        street_address,
        city,
        state,
        postal_code || '',
        country || 'Nigeria',
        is_default === false ? false : true,
        address_type || addressCheck.rows[0].address_type || 'shipping',
        id,
        customerId
      ]
    );
    
    return NextResponse.json({ address: result.rows[0] });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

// Delete address
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get customer_id from email
    const customer = await db.query(
      "SELECT id FROM customers WHERE email = $1",
      [session.user.email]
    );
    
    if (!customer.rows.length) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    const customerId = customer.rows[0].id;
    
    // Verify the address belongs to this customer
    const addressCheck = await db.query(
      "SELECT address_id, is_default, address_type FROM customer_addresses WHERE address_id = $1 AND customer_id = $2",
      [id, customerId]
    );
    
    if (!addressCheck.rows.length) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    
    // Don't allow deleting the default address if it's the only one of its type
    const isDefault = addressCheck.rows[0].is_default;
    const addressType = addressCheck.rows[0].address_type || 'shipping';
    
    if (isDefault) {
      const addressCount = await db.query(
        "SELECT COUNT(*) FROM customer_addresses WHERE customer_id = $1 AND address_type = $2",
        [customerId, addressType]
      );
      
      if (parseInt(addressCount.rows[0].count) === 1) {
        return NextResponse.json({ 
          error: 'Cannot delete the only address. Please add another address first.' 
        }, { status: 400 });
      }
    }
    
    // Delete the address
    await db.query(
      "DELETE FROM customer_addresses WHERE address_id = $1 AND customer_id = $2",
      [id, customerId]
    );
    
    // If we deleted the default address, make another one the default
    if (isDefault) {
      await db.query(
        "UPDATE customer_addresses SET is_default = true WHERE customer_id = $1 AND address_type = $2 ORDER BY created_at DESC LIMIT 1",
        [customerId, addressType]
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
```
```

### Step 3: Update Profile Page to Include Addresses

```tsx
// src/app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AddressForm } from "@/components/AddressForm";

interface Address {
  id: number;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number: string | null;
  is_default: boolean;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/login");
      return;
    }

    // Fetch user data
    setFormData({
      name: session.user?.name || "",
      email: session.user?.email || "",
      phone: session.user?.phone || "",
      address: "",
    });
    
    // Fetch addresses
    fetchAddresses();
    
    setIsLoading(false);
  }, [session, status, router]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/address");
      
      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }
      
      const data = await response.json();
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to fetch addresses");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };
  
  const handleAddAddress = async (addressData: any) => {
    try {
      const response = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add address");
      }
      
      toast.success("Address added successfully!");
      setShowAddressForm(false);
      fetchAddresses();
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
    }
  };
  
  const handleUpdateAddress = async (addressData: any) => {
    if (!editingAddress?.id) return;
    
    try {
      const response = await fetch(`/api/address/${editingAddress.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update address");
      }
      
      toast.success("Address updated successfully!");
      setEditingAddress(null);
      fetchAddresses();
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address");
    }
  };
  
  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    try {
      const response = await fetch(`/api/address/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete address");
      }
      
      toast.success("Address deleted successfully!");
      fetchAddresses();
    } catch (error: any) {
      console.error("Error deleting address:", error);
      toast.error(error.message || "Failed to delete address");
    }
  };
  
  const handleSetDefaultAddress = async (id: number) => {
    try {
      const addressToUpdate = addresses.find(addr => addr.id === id);
      if (!addressToUpdate) return;
      
      const response = await fetch(`/api/address/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...addressToUpdate, is_default: true }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to set default address");
      }
      
      toast.success("Default address updated!");
      fetchAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to set default address");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 page-with-header-spacing">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="input-enhanced"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="input-enhanced"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="input-enhanced"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn-primary w-full mt-4"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>

          {/* Shipping Addresses */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Shipping Addresses</h2>
                {!showAddressForm && !editingAddress && (
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    Add New Address
                  </button>
                )}
              </div>
              
              {/* Address Form */}
              {showAddressForm && (
                <div className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="text-lg font-medium mb-4">Add New Address</h3>
                  <AddressForm 
                    onSave={handleAddAddress} 
                    onCancel={() => setShowAddressForm(false)} 
                  />
                </div>
              )}
              
              {/* Edit Address Form */}
              {editingAddress && (
                <div className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="text-lg font-medium mb-4">Edit Address</h3>
                  <AddressForm 
                    existingAddress={editingAddress}
                    onSave={handleUpdateAddress} 
                    onCancel={() => setEditingAddress(null)} 
                  />
                </div>
              )}
              
              {/* Address List */}
              {addresses.length === 0 && !showAddressForm ? (
                <div className="text-center py-8 text-gray-500">
                  <p>You haven't added any addresses yet.</p>
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    className="btn-primary mt-4"
                  >
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div 
                      key={address.id} 
                      className={`border rounded-lg p-4 relative ${
                        address.is_default ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      {address.is_default && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                      
                      <div className="mt-2">
                        <p className="font-medium">{session?.user?.name}</p>
                        <p>{address.street_address}</p>
                        <p>{`${address.city}, ${address.state} ${address.postal_code}`}</p>
                        <p>{address.country}</p>
                        {address.phone_number && <p>Phone: {address.phone_number}</p>}
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <button 
                          onClick={() => setEditingAddress(address)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        
                        {!address.is_default && (
                          <button 
                            onClick={() => handleSetDefaultAddress(address.id)}
                            className="text-sm text-green-600 hover:text-green-800"
                          >
                            Set as Default
                          </button>
                        )}
                        
                        <button 
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Update the Checkout Process

When checking out, make sure to select a shipping address:

```tsx
// src/app/cart/page.tsx - Update to include address selection
// Add this to the checkout form:

// New state for address
const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
const [addresses, setAddresses] = useState<Address[]>([]);

// Fetch addresses on component mount
useEffect(() => {
  async function fetchAddresses() {
    try {
      const response = await fetch("/api/address");
      
      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }
      
      const data = await response.json();
      setAddresses(data.addresses || []);
      
      // Set default address if available
      const defaultAddress = data.addresses.find((addr: Address) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to fetch addresses");
    }
  }
  
  fetchAddresses();
}, []);

// In your checkout form JSX:
<div className="mb-4">
  <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
  
  {addresses.length === 0 ? (
    <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-lg">
      <p className="text-yellow-800">
        You need to add a shipping address before checkout.
      </p>
      <Link href="/profile" className="btn-primary mt-4 inline-block">
        Add Address
      </Link>
    </div>
  ) : (
    <div className="space-y-2">
      {addresses.map((address) => (
        <label
          key={address.id}
          className={`block border rounded-lg p-3 cursor-pointer ${
            selectedAddressId === address.id
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300'
          }`}
        >
          <input
            type="radio"
            name="address"
            value={address.id}
            checked={selectedAddressId === address.id}
            onChange={() => setSelectedAddressId(address.id)}
            className="mr-2"
          />
          <span className="font-medium">
            {address.is_default && '(Default) '}
            {address.street_address}, {address.city}, {address.state}
          </span>
        </label>
      ))}
      
      <Link 
        href="/profile" 
        className="text-red-600 text-sm hover:underline block mt-2"
      >
        Manage Addresses
      </Link>
    </div>
  )}
</div>

// Update your payment function to include the address
const handlePayment = async () => {
  if (!selectedAddressId) {
    toast.error("Please select a shipping address");
    return;
  }
  
  // ... rest of your payment logic
  // Include selectedAddressId in your payment request
  const paymentData = {
    // ...other payment data
    addressId: selectedAddressId
  };
};
```

### Step 5: Update the Order Database to Include Address

```sql
-- Add address_id to your orders table
ALTER TABLE orders ADD COLUMN address_id INTEGER;
ALTER TABLE orders ADD CONSTRAINT fk_address 
  FOREIGN KEY (address_id) REFERENCES customer_addresses(id);
```

### Step 6: Update Order Creation API

```typescript
// src/app/api/payment/verify/route.ts (or wherever you create orders)
// After verifying payment, store the address with the order

// Example:
const { addressId } = req.body;

// When creating the order
const orderResult = await db.query(
  `INSERT INTO orders (
    customer_id, 
    order_number, 
    total_amount, 
    status, 
    payment_status, 
    address_id,
    created_at
  ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING *`,
  [
    customerId,
    orderNumber,
    totalAmount,
    'pending',
    'paid',
    addressId,
  ]
);
```

## 3. Google Users Without Addresses

For Google users who might not have an address, implement a required step after registration:

### Create a First-Time Setup Page

```tsx
// src/app/account-setup/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AddressForm } from "@/components/AddressForm";

export default function AccountSetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.replace("/login");
      return;
    }
    
    // Check if user already has address
    async function checkAddress() {
      try {
        const response = await fetch("/api/address");
        const data = await response.json();
        
        if (data.addresses && data.addresses.length > 0) {
          // User already has addresses, redirect to dashboard
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Error checking addresses:", error);
      }
    }
    
    checkAddress();
  }, [session, status, router]);
  
  const handleSaveAddress = async (addressData: any) => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...addressData,
          is_default: true
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save address");
      }
      
      toast.success("Address saved successfully!");
      router.replace("/dashboard");
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  };
  
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 page-with-header-spacing">
      <div className="container-custom py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-medium p-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Account</h1>
          <p className="text-gray-600 mb-6">
            We need your shipping address to complete your profile.
          </p>
          
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <AddressForm 
              onSave={handleSaveAddress}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Update Auth Callback to Check for Address

```typescript
// Update your login/OAuth callback to check if user has an address
// src/app/api/auth/[...nextauth]/route.ts

callbacks: {
  async signIn({ user, account, profile }) {
    // Other sign in logic...
    
    // For OAuth providers, check if user needs to complete profile
    if (account?.provider === 'google') {
      // Check if user exists and already has an address
      const customer = await db.query(
        "SELECT c.id FROM customers c LEFT JOIN customer_addresses ca ON c.id = ca.customer_id WHERE c.email = $1",
        [user.email]
      );
      
      if (customer.rows.length > 0) {
        // User exists, check if they have an address
        const hasAddress = customer.rows[0].address_id != null;
        
        if (!hasAddress) {
          // Store this in the session so we can redirect after sign in
          user.needsProfileCompletion = true;
        }
      }
    }
    
    return true;
  },
  
  async session({ session, token }) {
    // Add user info to session
    session.user.needsProfileCompletion = token.needsProfileCompletion;
    return session;
  },
  
  async jwt({ token, user }) {
    if (user) {
      token.needsProfileCompletion = user.needsProfileCompletion;
    }
    return token;
  },
}

// Then in your auth success callback page or component:
useEffect(() => {
  if (session?.user?.needsProfileCompletion) {
    router.replace('/account-setup');
  } else {
    router.replace('/dashboard');
  }
}, [session, router]);
```

## 4. Address Verification Service (Optional Future Enhancement)

For even better user experience, consider integrating with an address verification service:

1. **Google Places API**: Autocomplete addresses as users type
2. **PostCoder.com**: Verify Nigerian addresses
3. **OkHi.com**: Nigerian address verification service

This will ensure all addresses are correctly formatted and valid.

## 5. Required Changes Summary

1. **Database**:
   - Create customer_addresses table
   - Add address_id to orders table

2. **Components**:
   - Create AddressForm component
   - Update Profile page with address management
   - Update Checkout process to select addresses
   - Create account setup flow for new users

3. **API Endpoints**:
   - Create address CRUD endpoints
   - Update order creation to include address

This implementation provides a complete solution for managing customer addresses in your Graphics2Prints application, with special consideration for Google OAuth users who might not have saved their address information.
