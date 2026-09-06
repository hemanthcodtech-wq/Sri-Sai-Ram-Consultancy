require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Employee = require('../models/Employee');
const Trip = require('../models/Trip');
const Inquiry = require('../models/Inquiry');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ssrc_db';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully for seeding.');

    // Clear existing data
    await User.deleteMany();
    await Employee.deleteMany();
    await Trip.deleteMany();
    await Inquiry.deleteMany();

    console.log('Existing collections cleared.');

    // 1. Create Default Admin User
    const adminUser = await User.create({
      name: 'Sri Sai Ram Admin',
      email: 'admin@ssrc.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`Admin user created: ${adminUser.email}`);

    // 2. Create Employees across Captain, Driver, Helper
    const employeesData = [
      {
        employeeId: 'CPT-0001',
        name: 'Rajesh Sharma',
        mobileNumber: '+91 98765 43210',
        alternateNumber: '+91 98765 43211',
        category: 'Captain',
        experience: '8 Years',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        address: {
          street: '45 Lake View Road',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500034',
          fullAddress: 'Plot 45, Lake View Road, Banjara Hills, Hyderabad, Telangana - 500034',
        },
        documents: {
          aadhaarNumber: 'XXXX-XXXX-8921',
          licenseNumber: 'TS092015003492',
          badgeNumber: 'CPT-TS-884',
          policeVerificationStatus: 'Verified',
        },
        status: 'Available',
        dailyRate: 1500,
        monthlyRate: 38000,
        rating: 4.9,
        specialSkills: ['Luxury Sedans & SUVs', 'VIP Protocol Escort', 'Outstation Nav Expert'],
        notes: 'Highly recommended for VIP delegates and corporate fleet management.',
      },
      {
        employeeId: 'DRV-0002',
        name: 'M. Ramesh Kumar',
        mobileNumber: '+91 98480 12345',
        alternateNumber: '+91 98480 54321',
        category: 'Driver',
        experience: '6 Years',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        address: {
          street: '12 Temple Street, Kukatpally',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500072',
          fullAddress: 'H.No 12, Temple Street, Kukatpally, Hyderabad - 500072',
        },
        documents: {
          aadhaarNumber: 'XXXX-XXXX-4532',
          licenseNumber: 'TS092018009988',
          badgeNumber: 'DRV-TS-412',
          policeVerificationStatus: 'Verified',
        },
        status: 'On Duty',
        dailyRate: 900,
        monthlyRate: 24000,
        rating: 4.8,
        specialSkills: ['Commercial License (HMV & LMV)', 'Night Driving', 'Automatic & Manual'],
        notes: 'Punctual, polite, zero traffic violations on record.',
      },
      {
        employeeId: 'DRV-0003',
        name: 'Suresh Babu',
        mobileNumber: '+91 97000 88776',
        category: 'Driver',
        experience: '4 Years',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        address: {
          street: '88 MG Road, Secunderabad',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500003',
          fullAddress: '88 MG Road, Clock Tower Area, Secunderabad - 500003',
        },
        documents: {
          aadhaarNumber: 'XXXX-XXXX-7721',
          licenseNumber: 'TS102020004512',
          policeVerificationStatus: 'Verified',
        },
        status: 'Available',
        dailyRate: 850,
        monthlyRate: 22000,
        rating: 4.7,
        specialSkills: ['City Navigation', 'Airport Transfers', 'English & Hindi Fluent'],
        notes: 'Great client feedback for family airport pickups.',
      },
      {
        employeeId: 'HLP-0004',
        name: 'K. Venkatesh',
        mobileNumber: '+91 99887 66554',
        category: 'Helper',
        experience: '3 Years',
        photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
        address: {
          street: '14 Auto Nagar, LB Nagar',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500074',
          fullAddress: 'Plot 14, Auto Nagar, LB Nagar, Hyderabad - 500074',
        },
        documents: {
          aadhaarNumber: 'XXXX-XXXX-1144',
          policeVerificationStatus: 'Verified',
        },
        status: 'Available',
        dailyRate: 650,
        monthlyRate: 16000,
        rating: 4.8,
        specialSkills: ['Heavy Cargo Handling', 'Warehouse Loading', 'Fast Delivery Support'],
        notes: 'Hardworking, dedicated to logistical dispatch and warehouse packing.',
      },
      {
        employeeId: 'HLP-0005',
        name: 'G. Anand Rao',
        mobileNumber: '+91 91234 56789',
        category: 'Helper',
        experience: '2 Years',
        photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
        address: {
          street: '56 Industrial Estate, Sanath Nagar',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500018',
          fullAddress: '56 Industrial Estate, Sanath Nagar, Hyderabad - 500018',
        },
        documents: {
          aadhaarNumber: 'XXXX-XXXX-9900',
          policeVerificationStatus: 'Verified',
        },
        status: 'Available',
        dailyRate: 600,
        monthlyRate: 15000,
        rating: 4.6,
        specialSkills: ['House Relocation', 'Packaging', 'Commercial Transport Support'],
        notes: 'Very honest and quick worker for retail and home logistics.',
      },
      {
        employeeId: 'CPT-0006',
        name: 'Prashant Verma',
        mobileNumber: '+91 96543 21098',
        category: 'Captain',
        experience: '10 Years',
        photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
        address: {
          street: '7 Gachibowli High Street',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500032',
          fullAddress: '7 Gachibowli High Street, Financial District, Hyderabad - 500032',
        },
        documents: {
          aadhaarNumber: 'XXXX-XXXX-6633',
          licenseNumber: 'TS092013007812',
          badgeNumber: 'CPT-TS-102',
          policeVerificationStatus: 'Verified',
        },
        status: 'On Duty',
        dailyRate: 1600,
        monthlyRate: 42000,
        rating: 5.0,
        specialSkills: ['Corporate Executive Escort', 'Inter-state Logistics Lead', 'Fleet Supervisor'],
        notes: 'Supervises captain assignments across high-profile client contracts.',
      },
    ];

    const createdEmployees = await Employee.insertMany(employeesData);
    console.log(`Inserted ${createdEmployees.length} employees.`);

    // 3. Create Sample Trips
    const empCaptain1 = createdEmployees[0];
    const empDriver1 = createdEmployees[1];
    const empDriver2 = createdEmployees[2];
    const empHelper1 = createdEmployees[3];
    const empHelper2 = createdEmployees[4];
    const empCaptain2 = createdEmployees[5];

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    const tripsData = [
      {
        tripNumber: 'TRP-20260906-0001',
        tripDate: today,
        clientName: 'Tata Consultancy Services (Corporate Fleet)',
        clientPhone: '+91 98490 00112',
        pickupLocation: 'Hitec City, Madhapur',
        dropLocation: 'RGIA Airport, Shamshabad',
        routeDescription: 'VIP Delegate Airport Escort & Executive Pickup',
        category: 'Captain',
        assignedEmployee: empCaptain1._id,
        assignedEmployeeName: empCaptain1.name,
        tripAmount: 3200,
        employeePayout: 2200,
        commissionAmount: 1000,
        paymentStatus: 'Paid',
        paidAmount: 3200,
        tripStatus: 'Completed',
        tripType: 'Round-Trip',
        remarks: 'Client gave a 5-star rating for timely arrival and spotless vehicle maintenance.',
      },
      {
        tripNumber: 'TRP-20260906-0002',
        tripDate: today,
        clientName: 'Dr. Srinivas Reddy',
        clientPhone: '+91 99080 33445',
        pickupLocation: 'Jubilee Hills Checkpost',
        dropLocation: 'Continental Hospital, Gachibowli',
        routeDescription: 'Full Day Personal Chauffeur Duty',
        category: 'Driver',
        assignedEmployee: empDriver1._id,
        assignedEmployeeName: empDriver1.name,
        tripAmount: 1600,
        employeePayout: 1100,
        commissionAmount: 500,
        paymentStatus: 'Paid',
        paidAmount: 1600,
        tripStatus: 'In Progress',
        tripType: 'Full-Day',
        remarks: 'Full day hospital and family commute assignment.',
      },
      {
        tripNumber: 'TRP-20260905-0003',
        tripDate: yesterday,
        clientName: 'Sri Sai Logistics & Warehousing',
        clientPhone: '+91 94400 55667',
        pickupLocation: 'Medchal Industrial Area',
        dropLocation: 'Kukatpally Depot',
        routeDescription: 'Warehouse Heavy Carton Loading & Unloading',
        category: 'Helper',
        assignedEmployee: empHelper1._id,
        assignedEmployeeName: empHelper1.name,
        tripAmount: 1200,
        employeePayout: 850,
        commissionAmount: 350,
        paymentStatus: 'Paid',
        paidAmount: 1200,
        tripStatus: 'Completed',
        tripType: 'Full-Day',
        remarks: 'Assisted 8 hours in freight dispatch smoothly.',
      },
      {
        tripNumber: 'TRP-20260905-0004',
        tripDate: yesterday,
        clientName: 'Ananya Construction Materials',
        clientPhone: '+91 91000 66778',
        pickupLocation: 'Sanath Nagar Hub',
        dropLocation: 'Kokapet Construction Site',
        routeDescription: 'Material Relocation and Site Unloading',
        category: 'Helper',
        assignedEmployee: empHelper2._id,
        assignedEmployeeName: empHelper2.name,
        tripAmount: 1100,
        employeePayout: 800,
        commissionAmount: 300,
        paymentStatus: 'Pending',
        paidAmount: 0,
        tripStatus: 'Completed',
        tripType: 'One-Way',
        remarks: 'Payment invoice sent to accounts department.',
      },
      {
        tripNumber: 'TRP-20260904-0005',
        tripDate: twoDaysAgo,
        clientName: 'K. V. Rao & Associates',
        clientPhone: '+91 93910 88990',
        pickupLocation: 'Banjara Hills Rd No. 12',
        dropLocation: 'Vijayawada Highway (Outstation)',
        routeDescription: 'Outstation 2-Day Executive Driving Duty',
        category: 'Captain',
        assignedEmployee: empCaptain2._id,
        assignedEmployeeName: empCaptain2.name,
        tripAmount: 4800,
        employeePayout: 3400,
        commissionAmount: 1400,
        paymentStatus: 'Paid',
        paidAmount: 4800,
        tripStatus: 'Completed',
        tripType: 'Outstation',
        remarks: 'Smooth outstation trip. Client tipped directly.',
      },
      {
        tripNumber: 'TRP-20260903-0006',
        tripDate: threeDaysAgo,
        clientName: 'Pooja Agarwal',
        clientPhone: '+91 98112 33445',
        pickupLocation: 'Secunderabad Station',
        dropLocation: 'Kondapur, Hitec City',
        routeDescription: 'Family Pickup with Luggage',
        category: 'Driver',
        assignedEmployee: empDriver2._id,
        assignedEmployeeName: empDriver2.name,
        tripAmount: 1300,
        employeePayout: 900,
        commissionAmount: 400,
        paymentStatus: 'Paid',
        paidAmount: 1300,
        tripStatus: 'Completed',
        tripType: 'One-Way',
        remarks: 'Night arrival pickup executed on time.',
      },
    ];

    await Trip.insertMany(tripsData);
    console.log(`Inserted ${tripsData.length} trips.`);

    // 4. Create Sample Website Inquiries / Bookings
    const inquiriesData = [
      {
        name: 'Venkata Krishna Murthy',
        phone: '+91 98855 12345',
        email: 'vkmurthy@gmail.com',
        serviceType: 'Driver',
        bookingType: 'Full-Day',
        pickupLocation: 'Manikonda, Hyderabad',
        serviceDate: new Date(Date.now() + 86400000), // Tomorrow
        duration: '2 Days',
        message: 'Need an experienced driver for Innova Crysta for outstation family wedding in Tirupati.',
        status: 'New',
        notes: 'Priority high. Inquired via web booking form.',
      },
      {
        name: 'Sunita Mehra',
        phone: '+91 97110 44556',
        email: 'sunita.m@outlook.com',
        serviceType: 'Helper',
        bookingType: 'Full-Day',
        pickupLocation: 'Begumpet',
        serviceDate: new Date(Date.now() + 172800000), // Day after tomorrow
        duration: '1 Day',
        message: 'Need 2 helpers for house shifting & packing fragile crockery items.',
        status: 'Contacted',
        notes: 'Quoted Rs. 1400. Client confirmed verbal willingness.',
      },
      {
        name: 'Aakash Singhania',
        phone: '+91 99499 88776',
        email: 'aakash@singhaniagroup.com',
        serviceType: 'Captain',
        bookingType: 'Monthly Contract',
        pickupLocation: 'Financial District, Nanakramguda',
        serviceDate: new Date(),
        duration: 'Monthly',
        message: 'Looking for an experienced corporate Captain / Chauffeur for CEO daily commute (Audi A6).',
        status: 'Assigned',
        notes: 'Interview scheduled with Captain Rajesh Sharma.',
      },
    ];

    await Inquiry.insertMany(inquiriesData);
    console.log(`Inserted ${inquiriesData.length} inquiries.`);

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
