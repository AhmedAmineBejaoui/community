const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateUsers() {
  try {
    console.log('Starting user migration...');

    // Get all users without role
    const users = await prisma.user.findMany({
      where: {
        role: null
      }
    });

    console.log(`Found ${users.length} users without role`);

    if (users.length === 0) {
      console.log('No users need migration');
      return;
    }

    // Update each user
    for (const user of users) {
      const role = user.email === 'admin@example.com' ? 'ADMIN' : 'USER';
      
      await prisma.user.update({
        where: { id: user.id },
        data: { role }
      });

      console.log(`Updated user ${user.email} with role: ${role}`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateUsers();
