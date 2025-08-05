import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { customerService, addressService } from '@/services/customerService';

// GET all addresses for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get customer by email
    const customer = await customerService.findByEmail(session.user.email);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get all addresses for the customer
    const addresses = await addressService.findAllByCustomerId(customer.id);

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

// POST create a new address
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customer = await customerService.findByEmail(session.user.email);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const body = await req.json();
    const { 
      streetAddress, 
      city, 
      state, 
      postalCode, 
      country = 'Nigeria',
      isDefault = false
    } = body;

    // Validate required fields
    if (!streetAddress || !city || !state || !postalCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the new address
    const address = await addressService.create(customer.id, {
      streetAddress,
      city,
      state,
      postalCode,
      country,
      isDefault
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}
