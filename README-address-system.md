# Graphics2Prints - Customer Address Management System

This project implements a comprehensive customer address management system for Graphics2Prints, allowing customers to save and manage multiple shipping and billing addresses.

## Features

- **Address Management**
  - Add, edit, and delete shipping and billing addresses
  - Set default addresses for faster checkout
  - View saved addresses in user profile

- **Profile Management**
  - Update personal information (name, phone)
  - Manage addresses in a dedicated tab

- **Checkout Integration**
  - Select shipping address during checkout
  - Add new address during checkout process

## Technical Implementation

### Database Schema

The implementation adds a `customer_addresses` table with the following structure:

```sql
CREATE TABLE customer_addresses (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  address_type VARCHAR(20) NOT NULL DEFAULT 'shipping',
  street_address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'Nigeria',
  is_default BOOLEAN NOT NULL DEFAULT TRUE,
  phone_number VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
```

### API Endpoints

- `GET /api/customer/profile` - Get current user profile
- `PUT /api/customer/profile` - Update user profile
- `GET /api/customer/addresses` - Get all addresses for current user
- `POST /api/customer/addresses` - Add a new address
- `GET /api/customer/addresses/[id]` - Get a specific address
- `PUT /api/customer/addresses/[id]` - Update an address
- `DELETE /api/customer/addresses/[id]` - Delete an address

### Components

- **AddressContext** - React context for managing address state
- **AddressList** - Display and manage addresses
- **AddressForm** - Add or edit addresses

## Getting Started

1. **Run Database Migration**

   ```bash
   # From project root
   bash scripts/run-address-migration.sh
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the Development Server**

   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── customer/
│   │       ├── addresses/
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── addresses/
│   │       │   └── route.ts
│   │       └── profile/
│   │           └── route.ts
│   ├── checkout/
│   │   └── page.tsx
│   └── profile/
│       └── page.tsx
├── components/
│   └── Address/
│       ├── AddressForm.tsx
│       ├── AddressList.tsx
│       └── index.ts
├── context/
│   └── AddressContext.tsx
├── lib/
│   └── prisma.ts
└── services/
    └── customerService.ts
```

## Developer Notes

- The system supports both shipping and billing addresses
- Addresses can be set as default per address type
- The database migration ensures backward compatibility
