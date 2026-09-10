const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

const User = require('../models/User');
const Employee = require('../models/Employee');
const Trip = require('../models/Trip');
const Inquiry = require('../models/Inquiry');
const Organizer = require('../models/Organizer');
const RouteModel = require('../models/RouteModel');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully.');

    // Clear existing collections
    await User.deleteMany();
    await Employee.deleteMany();
    await Trip.deleteMany();
    await Inquiry.deleteMany();
    await Organizer.deleteMany();
    await RouteModel.deleteMany();

    console.log('🧹 Existing collections cleared.');

    // Create ONLY Admin User
    const adminUser = await User.create({
      name: 'Shekar Babu Sabbineni',
      email: 'shekarbabu.sabbineni@gmail.com',
      password: 'SSRC@2026',
      role: 'admin',
    });

    console.log('\n=========================================');
    console.log('🎉 ADMIN USER CREATED IN MONGODB!');
    console.log('=========================================');
    console.log(`Name:     ${adminUser.name}`);
    console.log(`Email:    ${adminUser.email}`);
    console.log(`Password: SSRC@2026`);
    console.log(`Role:     ${adminUser.role}`);
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
