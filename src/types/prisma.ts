// This file contains types for our customer-related models
// These types reflect the actual database schema structure

// Define the CustomerAddress type to match the database schema
export type CustomerAddress = {
  address_id: string | number;  // Using string or number for flexibility with different query results
  customer_id: string | number;
  street_address: string;
  city: string;
  state: string;
  country: string;
  is_default: boolean;
  address_type: string;
  created_at: Date | string;
  updated_at?: Date | string;
};

// Define the Customer type directly
export type Customer = {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  addresses?: CustomerAddress[];
};
