import { Pool } from 'pg';
import { CustomerType, CustomerAddressType, CreateAddressInput, UpdateAddressInput } from '@/types/customer';

// Database connection pool
let pool: Pool;

// Initialize the pool
export const initPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }
  return pool;
};

// Get pool (initialize if needed)
export const getPool = () => {
  if (!pool) {
    return initPool();
  }
  return pool;
};

// Customer services
export const customerService = {
  // Find customer by email
  async findByEmail(email: string): Promise<CustomerType | null> {
    const client = await getPool().connect();
    try {
      const result = await client.query(
        'SELECT customer_id as id, name, email, phone_number as phone, created_at as "createdAt", updated_at as "updatedAt" FROM customers WHERE email = $1',
        [email]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0] as CustomerType;
    } finally {
      client.release();
    }
  },

  // Update customer profile
  async updateProfile(id: number, data: { name: string; phone?: string }): Promise<CustomerType> {
    const client = await getPool().connect();
    try {
      const result = await client.query(
        'UPDATE customers SET name = $1, phone_number = $2, updated_at = NOW() WHERE customer_id = $3 RETURNING customer_id as id, name, email, phone_number as phone, created_at as "createdAt", updated_at as "updatedAt"',
        [data.name, data.phone || null, id]
      );
      
      return result.rows[0] as CustomerType;
    } finally {
      client.release();
    }
  }
};

// Address services
export const addressService = {
  // Get all addresses for a customer
  async findAllByCustomerId(customerId: number): Promise<CustomerAddressType[]> {
    const client = await getPool().connect();
    try {
      const result = await client.query(
        `SELECT 
          id as "address_id", customer_id, street_address, city, state, postal_code, 
          country, is_default, created_at, updated_at
        FROM addresses 
        WHERE customer_id = $1
        ORDER BY is_default DESC, created_at DESC`,
        [customerId]
      );
      
      return result.rows as CustomerAddressType[];
    } finally {
      client.release();
    }
  },
  
  // Get a specific address
  async findById(id: number, customerId: number): Promise<CustomerAddressType | null> {
    const client = await getPool().connect();
    try {
      const result = await client.query(
        `SELECT 
          id as "address_id", customer_id, street_address, city, state, postal_code, 
          country, is_default, created_at, updated_at
        FROM addresses 
        WHERE id = $1 AND customer_id = $2`,
        [id, customerId]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0] as CustomerAddressType;
    } finally {
      client.release();
    }
  },
  
  // Create a new address
  async create(customerId: number, data: CreateAddressInput): Promise<CustomerAddressType> {
    const client = await getPool().connect();
    try {
      // Start transaction
      await client.query('BEGIN');
      
      // If setting as default, update existing addresses 
      if (data.isDefault) {
        await client.query(
          'UPDATE addresses SET is_default = FALSE WHERE customer_id = $1',
          [customerId]
        );
      }
      
      // Insert the new address
      const result = await client.query(
        `INSERT INTO addresses (
          customer_id, street_address, city, state, 
          postal_code, country, is_default
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING 
          id as "address_id", customer_id, street_address, city, state, postal_code, 
          country, is_default, created_at, updated_at`,
        [
          customerId,
          data.streetAddress,
          data.city,
          data.state,
          data.postalCode,
          data.country || 'Nigeria',
          data.isDefault || false
        ]
      );
      
      // Commit transaction
      await client.query('COMMIT');
      
      return result.rows[0] as CustomerAddressType;
    } catch (error) {
      // Rollback on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
  
  // Update an address
  async update(id: number, customerId: number, data: UpdateAddressInput): Promise<CustomerAddressType> {
    const client = await getPool().connect();
    try {
      // Get the current address to check for type changes
      const currentAddress = await this.findById(id, customerId);
      if (!currentAddress) {
        throw new Error('Address not found');
      }
      
      // Start transaction
      await client.query('BEGIN');
      
      // If setting as default, update existing addresses
      if (data.isDefault) {
        await client.query(
          'UPDATE addresses SET is_default = FALSE WHERE customer_id = $1 AND id != $2',
          [customerId, id]
        );
      }
      
      // Build update query dynamically based on provided fields
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;
      
      if (data.streetAddress !== undefined) {
        updates.push(`street_address = $${paramIndex++}`);
        values.push(data.streetAddress);
      }
      
      if (data.city !== undefined) {
        updates.push(`city = $${paramIndex++}`);
        values.push(data.city);
      }
      
      if (data.state !== undefined) {
        updates.push(`state = $${paramIndex++}`);
        values.push(data.state);
      }
      
      if (data.postalCode !== undefined) {
        updates.push(`postal_code = $${paramIndex++}`);
        values.push(data.postalCode);
      }
      
      if (data.country !== undefined) {
        updates.push(`country = $${paramIndex++}`);
        values.push(data.country);
      }
      
      if (data.isDefault !== undefined) {
        updates.push(`is_default = $${paramIndex++}`);
        values.push(data.isDefault);
      }
      
      updates.push(`updated_at = NOW()`);
      
      // Add the remaining parameters
      values.push(id);
      values.push(customerId);
      
      // Only update if there are fields to update
      if (updates.length > 1) { // More than just updated_at
        const result = await client.query(
          `UPDATE addresses SET ${updates.join(', ')}
          WHERE id = $${paramIndex++} AND customer_id = $${paramIndex++}
          RETURNING 
            id as "address_id", customer_id, street_address, city, state, postal_code, 
            country, is_default, created_at, updated_at`,
          values
        );
        
        // Commit transaction
        await client.query('COMMIT');
        
        return result.rows[0] as CustomerAddressType;
      } else {
        // No updates needed, just return the current address
        await client.query('COMMIT');
        return currentAddress;
      }
    } catch (error) {
      // Rollback on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
  
  // Delete an address
  async delete(id: number, customerId: number): Promise<void> {
    const client = await getPool().connect();
    try {
      // Start transaction
      await client.query('BEGIN');
      
      // Get the address to check if it's default
      const address = await this.findById(id, customerId);
      if (!address) {
        throw new Error('Address not found');
      }
      
      // Delete the address
      await client.query(
        'DELETE FROM addresses WHERE id = $1 AND customer_id = $2',
        [id, customerId]
      );
      
      // If the deleted address was default, set another address as default
      if (address.isDefault) {
        const nextAddressResult = await client.query(
          'SELECT id FROM addresses WHERE customer_id = $1 LIMIT 1',
          [customerId]
        );
        
        if (nextAddressResult.rows.length > 0) {
          await client.query(
            'UPDATE addresses SET is_default = TRUE WHERE id = $1',
            [nextAddressResult.rows[0].id]
          );
        }
      }
      
      // Commit transaction
      await client.query('COMMIT');
    } catch (error) {
      // Rollback on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};
