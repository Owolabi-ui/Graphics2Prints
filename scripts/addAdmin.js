const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addAdminUser() {
  try {
    console.log('🔍 Checking current customers...');
    
    // Check current customers
    const allCustomers = await prisma.customer.findMany({
      select: { email: true, name: true, role: true, is_admin: true }
    });
    
    console.log('📋 Current customers in database:');
    if (allCustomers.length === 0) {
      console.log('  (No customers found)');
    } else {
      allCustomers.forEach(c => {
        console.log(`  - ${c.email} (role: ${c.role || 'user'}, admin: ${c.is_admin})`);
      });
    }

    // Check if graphics2prints@gmail.com exists
    const existing = await prisma.customer.findUnique({
      where: { email: 'graphics2prints@gmail.com' }
    });

    if (existing) {
      console.log('\n✏️  Updating existing user to admin...');
      const updated = await prisma.customer.update({
        where: { email: 'graphics2prints@gmail.com' },
        data: { 
          role: 'admin',
          is_admin: true 
        }
      });
      console.log('✅ Updated:', updated.email);
    } else {
      console.log('\n➕ Creating new admin user...');
      const newAdmin = await prisma.customer.create({
        data: {
          name: 'Graphics2Prints Admin',
          email: 'graphics2prints@gmail.com',
          role: 'admin',
          is_admin: true,
          oauth_provider: 'google'
        }
      });
      console.log('✅ Created new admin:', newAdmin.email);
    }

    // Show final admin list
    console.log('\n🔐 Final admin users:');
    const admins = await prisma.customer.findMany({
      where: { 
        OR: [
          { role: 'admin' },
          { is_admin: true }
        ]
      },
      select: { email: true, name: true, role: true, is_admin: true }
    });

    admins.forEach(admin => {
      console.log(`  ✅ ${admin.email} (${admin.name})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAdminUser();
