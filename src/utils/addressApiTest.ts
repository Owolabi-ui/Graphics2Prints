// Tests for the address API endpoints

// Function to test the API endpoints
async function testAddressAPI() {
  console.log('Testing Address API endpoints...');
  
  // 1. Fetch all addresses
  console.log('\n1. Fetching all addresses...');
  try {
    const response = await fetch('/api/address');
    if (!response.ok) {
      throw new Error(`Failed to fetch addresses: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Success! Fetched addresses:', data.addresses.length);
  } catch (error) {
    console.error('Error fetching addresses:', error);
  }
  
  // 2. Create a new address
  console.log('\n2. Creating a new address...');
  let newAddressId;
  try {
    const newAddress = {
      street_address: '123 Test Street',
      city: 'Test City',
      state: 'Lagos',
      postal_code: '100001',
      country: 'Nigeria',
      address_type: 'shipping',
      is_default: true
    };
    
    const response = await fetch('/api/address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAddress)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create address: ${errorData.error}`);
    }
    
    const data = await response.json();
    newAddressId = data.address.address_id;
    console.log('Success! Created new address with ID:', newAddressId);
  } catch (error) {
    console.error('Error creating address:', error);
  }
  
  // 3. Update the address (if we have an ID)
  if (newAddressId) {
    console.log('\n3. Updating the address...');
    try {
      const updatedAddress = {
        street_address: '123 Updated Street',
        city: 'Updated City',
        state: 'Lagos',
        is_default: true
      };
      
      const response = await fetch(`/api/address/${newAddressId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAddress)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update address: ${errorData.error}`);
      }
      
      const data = await response.json();
      console.log('Success! Updated address:', data.address);
    } catch (error) {
      console.error('Error updating address:', error);
    }
  }
  
  // 4. Delete the address (if we have an ID)
  if (newAddressId) {
    console.log('\n4. Deleting the address...');
    try {
      const response = await fetch(`/api/address/${newAddressId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete address: ${errorData.error}`);
      }
      
      console.log('Success! Deleted address');
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  }
  
  console.log('\nAddress API tests completed!');
}

// Run the tests
// testAddressAPI();

export { testAddressAPI };
