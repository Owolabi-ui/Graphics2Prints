// Script to run production migration via API
async function runProductionMigration() {
  const PRODUCTION_URL = 'https://www.graphics2prints.com';
  const API_ENDPOINT = '/api/admin/migrate-product-availability';
  
  try {
    console.log('🚀 Running production migration...');
    
    const response = await fetch(`${PRODUCTION_URL}${API_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authorization: 'migrate-product-availability-2025'
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Migration successful!');
      console.log('📊 Results:', JSON.stringify(result, null, 2));
    } else {
      console.error('❌ Migration failed:', result);
    }
    
    return result;
  } catch (error) {
    console.error('💥 Error calling migration API:', error);
    throw error;
  }
}

// For Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runProductionMigration };
}

// For browser usage
if (typeof window !== 'undefined') {
  window.runProductionMigration = runProductionMigration;
}
