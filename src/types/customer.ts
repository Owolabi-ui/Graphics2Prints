// This file contains types for our customer-related models

// Customer Address type
export interface CustomerAddressType {
  id: number;
  customerId: number;
  addressType: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  phoneNumber?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Customer type
export interface CustomerType {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  addresses?: CustomerAddressType[];
}

// Input for creating a new address
export interface CreateAddressInput {
  addressType?: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
  phoneNumber?: string;
}

// Input for updating an address
export interface UpdateAddressInput {
  addressType?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
  phoneNumber?: string;
}
