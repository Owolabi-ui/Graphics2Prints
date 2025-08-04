# Customer Address System Implementation

This document outlines the implementation of the customer address management system for Graphics2Prints.

## Database Migration

1. First, run the database migration to create the `customer_addresses` table:

```bash
# On Unix/Linux/Mac:
chmod +x scripts/run-address-migration.sh
./scripts/run-address-migration.sh

# On Windows (using bash shell):
bash scripts/run-address-migration.sh

# Alternative: Run the SQL file directly with psql:
psql YOUR_DATABASE_URL -f prisma/migrations/customer_addresses.sql
```

2. After running the migration, update your Prisma client:

```bash
npx prisma generate
```

## Features Implemented

1. **Customer Address Management**:
   - Add, edit, and delete shipping and billing addresses
   - Set default addresses for faster checkout
   - View all saved addresses

2. **Profile Management**:
   - Update customer name and phone number
   - Manage addresses in a separate tab

3. **Checkout Process**:
   - Select shipping address from saved addresses
   - Add new address during checkout
   - Payment method selection

## API Endpoints

The following API endpoints have been implemented:

### Customer Profile

- `GET /api/customer/profile` - Get current user profile
- `PUT /api/customer/profile` - Update user profile

### Customer Addresses

- `GET /api/customer/addresses` - Get all addresses for current user
- `POST /api/customer/addresses` - Add a new address
- `GET /api/customer/addresses/[id]` - Get a specific address
- `PUT /api/customer/addresses/[id]` - Update an address
- `DELETE /api/customer/addresses/[id]` - Delete an address

## Components

The following components were created:

1. **AddressList**: Displays a list of saved addresses with options to edit or delete
2. **AddressForm**: Form for adding or editing addresses
3. **AddressProvider**: Context provider for managing address data across components

## Usage in Checkout

The address selection is integrated into the checkout process. Users can:

1. Select an existing address
2. Add a new address during checkout
3. See the selected address details in the order summary

## Next Steps

1. Integrate the selected address with order creation
2. Implement the payment processing with the selected address
3. Add address validation
4. Store the selected address with the order in the database

## Troubleshooting

If you encounter any issues:

1. Ensure the database migration ran successfully
2. Check that the Prisma schema was updated and the client was regenerated
3. Verify that the NextAuth session is properly configured to work with the customer model
4. Review browser console for any frontend errors
5. Check server logs for backend errors
