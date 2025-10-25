import { initDatabase } from './initDatabase';

const runSeed = async () => {
  try {
    await initDatabase();
    console.log('✅ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

runSeed();


