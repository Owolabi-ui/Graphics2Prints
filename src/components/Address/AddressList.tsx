import React, { useState } from 'react';
import { CustomerAddress, useAddresses } from '@/context/AddressContext';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { BiPlus } from 'react-icons/bi';
import { motion } from 'framer-motion';
import AddressForm from '@/components/Address/AddressForm';

interface AddressListProps {
  showAddNew?: boolean;
  onSelect?: (address: CustomerAddress) => void;
  selectedAddressId?: string;
}

const AddressList: React.FC<AddressListProps> = ({ 
  showAddNew = true, 
  onSelect, 
  selectedAddressId 
}) => {
  const { addresses, loading, deleteAddress } = useAddresses();
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Filter addresses - since there's no address_type, show all addresses
  const allAddresses = addresses;

  const handleEditClick = (address: CustomerAddress) => {
    setEditingAddress(address);
    setIsAddingNew(false);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await deleteAddress(id);
    }
  };

  const handleSelectAddress = (address: CustomerAddress) => {
    if (onSelect) {
      onSelect(address);
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingAddress(null);
  };

  const handleFormClose = () => {
    setIsAddingNew(false);
    setEditingAddress(null);
  };

  if (loading && addresses.length === 0) {
    return <div className="text-center py-4">Loading addresses...</div>;
  }

  const renderAddresses = (addresses: CustomerAddress[], title: string) => {
    if (addresses.length === 0) {
      return null;
    }

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {addresses.map(address => (
            <motion.div 
              key={address.address_id}
              className={`border p-4 rounded-lg relative ${
                selectedAddressId === address.address_id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
              } ${onSelect ? 'cursor-pointer' : ''}`}
              whileHover={{ scale: 1.01 }}
              onClick={() => onSelect && handleSelectAddress(address)}
            >
              {address.is_default && (
                <span className="absolute top-2 right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                  Default
                </span>
              )}
              <p className="font-medium">{address.street_address}</p>
              <p>{address.city}, {address.state}</p>
              <p>{address.postal_code || ''}, {address.country || 'Nigeria'}</p>
              
              {!onSelect && (
                <div className="mt-3 flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(address);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <AiOutlineEdit size={18} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(address.address_id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <AiOutlineDelete size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {showAddNew && !isAddingNew && !editingAddress && (
        <button 
          onClick={handleAddNew}
          className="mb-6 flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <BiPlus />
          Add New Address
        </button>
      )}

      {isAddingNew && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Add New Address</h3>
          <AddressForm onClose={handleFormClose} />
        </div>
      )}

      {editingAddress && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Edit Address</h3>
          <AddressForm address={editingAddress} onClose={handleFormClose} />
        </div>
      )}

      {!isAddingNew && !editingAddress && (
        <>
          {renderAddresses(allAddresses, "My Addresses")}
          
          {addresses.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              You don't have any saved addresses yet.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AddressList;
