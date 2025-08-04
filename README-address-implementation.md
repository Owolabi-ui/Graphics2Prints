# Customer Address System Integration

This document outlines the changes made to implement customer address management to work with the existing database schema.

## Database Changes

We've created a migration script (`prisma/migrations/add_address_type.sql`) to:
- Add `address_type` column (if missing)
- Add `postal_code` column (if missing)
- Add `updated_at` column (if missing)

## API Updates

Updated API endpoints to work with the existing schema:

1. **GET /api/address**
   - Retrieves all addresses for the logged-in customer
   - Updated to work with `address_id` instead of `id`

2. **POST /api/address**
   - Creates a new address for the logged-in customer
   - Supports `address_type` field (shipping/billing)
   - Removed `phone_number` field since it's already in the customers table

3. **PUT /api/address/[id]**
   - Updates an existing address by `address_id`
   - Only updates the specified fields
   - Maintains address type when toggling default status

4. **DELETE /api/address/[id]**
   - Deletes an address by `address_id`
   - Prevents deletion of the only address of a given type
   - Sets a new default address if needed

## React Components

Modified components to use the new database schema field names:

1. **AddressContext.tsx**
   - Updated interface to match database schema
   - Modified API paths to use `/api/address` instead of `/api/customer/addresses`
   - Updated functions to work with `address_id` instead of `id`

2. **AddressForm.tsx**
   - Changed form fields to match database column names:
     - `streetAddress` → `street_address`
     - `postalCode` → `postal_code`
     - `addressType` → `address_type`
     - `isDefault` → `is_default`
   - Removed `phoneNumber` field

3. **AddressList.tsx**
   - Updated to display addresses using the new field names
   - Modified to work with `address_id` instead of `id`

## Testing

Created a test utility at `src/utils/addressApiTest.ts` to verify that the API endpoints are working correctly with the new implementation.

## Integration Points

The address system is integrated with:
1. The profile page for managing addresses
2. The checkout process for selecting shipping/billing addresses

## Future Improvements

Possible future improvements:
1. Add address validation
2. Implement address autocomplete
3. Add support for international addresses with country-specific fields
4. Create admin interface for managing customer addresses
