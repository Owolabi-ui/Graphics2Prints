import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

// Define address type to match the database schema
export interface CustomerAddress {
  address_id: string;
  customer_id: string;
  street_address: string;
  city: string;
  state: string;
  postal_code?: string;
  country?: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

// Define context type
interface AddressContextType {
  addresses: CustomerAddress[];
  loading: boolean;
  error: string | null;
  fetchAddresses: () => Promise<void>;
  addAddress: (address: Omit<CustomerAddress, 'address_id' | 'customer_id' | 'created_at' | 'updated_at'>) => Promise<CustomerAddress | null>;
  updateAddress: (id: string, address: Partial<Omit<CustomerAddress, 'address_id' | 'customer_id' | 'created_at' | 'updated_at'>>) => Promise<CustomerAddress | null>;
  deleteAddress: (id: string) => Promise<boolean>;
  getDefaultAddress: (type?: string) => CustomerAddress | null;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all addresses
  const fetchAddresses = async () => {
    if (status !== 'authenticated') return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/customer/addresses');
      
      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }
      
      const data = await response.json();
      setAddresses(data.addresses);
    } catch (err) {
      setError((err as Error).message);
      toast.error('Failed to load your addresses');
    } finally {
      setLoading(false);
    }
  };

  // Add a new address
  const addAddress = async (address: Omit<CustomerAddress, 'address_id' | 'customer_id' | 'created_at' | 'updated_at'>): Promise<CustomerAddress | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/customer/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add address');
      }
      
      const data = await response.json();
      setAddresses(prev => [...prev, data.address]);
      toast.success('Address added successfully');
      return data.address;
    } catch (err) {
      setError((err as Error).message);
      toast.error((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing address
  const updateAddress = async (id: string, address: Partial<Omit<CustomerAddress, 'address_id' | 'customer_id' | 'created_at' | 'updated_at'>>): Promise<CustomerAddress | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/customer/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update address');
      }
      
      const data = await response.json();
      setAddresses(prev => 
        prev.map(addr => addr.address_id === id ? data.address : addr)
      );
      toast.success('Address updated successfully');
      return data.address;
    } catch (err) {
      setError((err as Error).message);
      toast.error((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete an address
  const deleteAddress = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/customer/addresses/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete address');
      }
      
      setAddresses(prev => prev.filter(addr => addr.address_id !== id));
      toast.success('Address deleted successfully');
      return true;
    } catch (err) {
      setError((err as Error).message);
      toast.error((err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get default address of a specific type
  const getDefaultAddress = (type: string = 'shipping'): CustomerAddress | null => {
    const defaultAddress = addresses.find(addr => addr.is_default);
    
    if (defaultAddress) return defaultAddress;
    
    // If no default address found, return the first address
    const firstAddress = addresses[0];
    return firstAddress || null;
  };

  // Load addresses when session changes
  useEffect(() => {
    if (status === 'authenticated') {
      fetchAddresses();
    }
  }, [status]);

  return (
    <AddressContext.Provider
      value={{
        addresses,
        loading,
        error,
        fetchAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        getDefaultAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

// Custom hook to use the address context
export const useAddresses = () => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddresses must be used within an AddressProvider');
  }
  return context;
};
