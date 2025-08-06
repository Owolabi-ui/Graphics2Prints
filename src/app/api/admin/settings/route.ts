import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Default settings structure
const DEFAULT_SETTINGS = {
  general: {
    site_name: 'Graphics2Prints',
    site_description: 'Professional printing services in Nigeria',
    contact_email: 'graphics2prints@gmail.com',
    phone_number: '+234 XXX XXX XXXX',
    business_address: 'Lagos, Nigeria'
  },
  payment: {
    paystack_mode: 'live',
    currency: 'NGN',
    tax_rate: 7.5,
    minimum_order: 1000
  },
  security: {
    two_factor_auth: false,
    session_timeout: 60,
    admin_email_notifications: true,
    failed_login_attempts: 5
  },
  notifications: {
    new_order_notifications: true,
    low_stock_alerts: true,
    customer_registration_alerts: true,
    payment_notifications: true
  },
  website: {
    maintenance_mode: false,
    customer_registration: true,
    guest_checkout: false,
    order_approval_required: true
  }
};

// GET - Fetch current settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
      // Check if settings table exists, create if not
      await client.query(`
        CREATE TABLE IF NOT EXISTS site_settings (
          id SERIAL PRIMARY KEY,
          category VARCHAR(50) NOT NULL,
          setting_key VARCHAR(100) NOT NULL,
          setting_value TEXT NOT NULL,
          data_type VARCHAR(20) DEFAULT 'string',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(category, setting_key)
        )
      `);

      // Get all current settings
      const result = await client.query('SELECT * FROM site_settings ORDER BY category, setting_key');
      
      // If no settings exist, create defaults
      if (result.rows.length === 0) {
        await initializeDefaultSettings(client);
        const newResult = await client.query('SELECT * FROM site_settings ORDER BY category, setting_key');
        return NextResponse.json(formatSettings(newResult.rows));
      }

      return NextResponse.json(formatSettings(result.rows));
      
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT - Update settings
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { category, setting_key, setting_value, data_type = 'string' } = await req.json();

    if (!category || !setting_key || setting_value === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      // Update or insert setting
      await client.query(`
        INSERT INTO site_settings (category, setting_key, setting_value, data_type, updated_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        ON CONFLICT (category, setting_key) 
        DO UPDATE SET 
          setting_value = EXCLUDED.setting_value,
          data_type = EXCLUDED.data_type,
          updated_at = CURRENT_TIMESTAMP
      `, [category, setting_key, setting_value, data_type]);

      return NextResponse.json({ 
        message: 'Setting updated successfully',
        category,
        setting_key,
        setting_value
      });
      
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}

// POST - Bulk update settings
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { settings } = await req.json();

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update multiple settings
      for (const [category, categorySettings] of Object.entries(settings)) {
        for (const [key, value] of Object.entries(categorySettings as any)) {
          const dataType = typeof value === 'boolean' ? 'boolean' : 
                          typeof value === 'number' ? 'number' : 'string';
          
          await client.query(`
            INSERT INTO site_settings (category, setting_key, setting_value, data_type, updated_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            ON CONFLICT (category, setting_key) 
            DO UPDATE SET 
              setting_value = EXCLUDED.setting_value,
              data_type = EXCLUDED.data_type,
              updated_at = CURRENT_TIMESTAMP
          `, [category, key, String(value), dataType]);
        }
      }

      await client.query('COMMIT');

      return NextResponse.json({ 
        message: 'Settings updated successfully',
        updated_count: Object.keys(settings).length
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error bulk updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

// Helper functions
async function initializeDefaultSettings(client: any) {
  for (const [category, settings] of Object.entries(DEFAULT_SETTINGS)) {
    for (const [key, value] of Object.entries(settings)) {
      const dataType = typeof value === 'boolean' ? 'boolean' : 
                      typeof value === 'number' ? 'number' : 'string';
      
      await client.query(`
        INSERT INTO site_settings (category, setting_key, setting_value, data_type)
        VALUES ($1, $2, $3, $4)
      `, [category, key, String(value), dataType]);
    }
  }
}

function formatSettings(rows: any[]) {
  const formatted: any = {};
  
  rows.forEach(row => {
    if (!formatted[row.category]) {
      formatted[row.category] = {};
    }
    
    let value = row.setting_value;
    
    // Convert based on data type
    if (row.data_type === 'boolean') {
      value = value === 'true';
    } else if (row.data_type === 'number') {
      value = parseFloat(value);
    }
    
    formatted[row.category][row.setting_key] = value;
  });
  
  return formatted;
}
