import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { customerService, addressService } from '@/services/customerService';

// GET a specific address
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addressId = parseInt(resolvedParams.id);
    if (isNaN(addressId)) {
      return NextResponse.json({ error: 'Invalid address ID' }, { status: 400 });
    }

    const customer = await customerService.findByEmail(session.user.email);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get the address and verify it belongs to the customer
    const address = await addressService.findById(addressId, customer.id);

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json({ address });
  } catch (error) {
    console.error('Error fetching address:', error);
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
  }
}

// PUT update an address
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addressId = parseInt(resolvedParams.id);
    if (isNaN(addressId)) {
      return NextResponse.json({ error: 'Invalid address ID' }, { status: 400 });
    }

    const customer = await customerService.findByEmail(session.user.email);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Verify the address belongs to the customer
    const existingAddress = await addressService.findById(addressId, customer.id);

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    const body = await req.json();
    
    // Update the address
    const updatedAddress = await addressService.update(addressId, customer.id, body);

    return NextResponse.json({ address: updatedAddress });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

// DELETE an address
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addressId = parseInt(resolvedParams.id);
    if (isNaN(addressId)) {
      return NextResponse.json({ error: 'Invalid address ID' }, { status: 400 });
    }

    const customer = await customerService.findByEmail(session.user.email);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Verify the address belongs to the customer
    const existingAddress = await addressService.findById(addressId, customer.id);

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Delete the address
    await addressService.delete(addressId, customer.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
