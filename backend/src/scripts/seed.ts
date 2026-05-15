import dotenv from 'dotenv';
import { User } from '../models/user.model';
import { UserRole } from '../types/user.types';
import { connectDB, disconnectDB } from '../config/db';

dotenv.config();

const users = [
  {
    name: 'System Admin',
    email: 'admin@lms.com',
    password: 'Password@123',
    role: UserRole.ADMIN,
  },
  {
    name: 'Sales Manager',
    email: 'sales@lms.com',
    password: 'Password@123',
    role: UserRole.SALES,
  },
  {
    name: 'Sanction Officer',
    email: 'sanction@lms.com',
    password: 'Password@123',
    role: UserRole.SANCTION,
  },
  {
    name: 'Disbursement Officer',
    email: 'disbursement@lms.com',
    password: 'Password@123',
    role: UserRole.DISBURSEMENT,
  },
  {
    name: 'Collection Agent',
    email: 'collection@lms.com',
    password: 'Password@123',
    role: UserRole.COLLECTION,
  },
  {
    name: 'Test Borrower',
    email: 'borrower@lms.com',
    password: 'Password@123',
    role: UserRole.BORROWER,
  },
];

const seedUsers = async () => {
  try {
    await connectDB();
    console.log('🚀 Starting user seeding...');

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });

      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      } else {
        console.log(`⏭️  Skipped ${userData.role} (already exists): ${userData.email}`);
      }
    }

    console.log('✨ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

seedUsers();
