// This file contains types for our customer-related models

// Customer Address type
export interface CustomerAddressType {
  id: number;
  customerId: number;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
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
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

// Input for updating an address
export interface UpdateAddressInput {
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}
