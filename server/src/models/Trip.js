const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    tripNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    tripDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: Date.now,
    },
    totalDays: {
      type: Number,
      default: 1,
      min: 1,
    },
    vehicleNumber: {
      type: String,
      trim: true,
      default: '',
    },
    vehicleStatus: {
      type: String,
      enum: ['RUN', 'HOLD'],
      default: 'RUN',
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
    },
    routeName: {
      type: String,
      trim: true,
      default: '',
    },
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organizer',
    },
    operatorName: {
      type: String,
      trim: true,
      default: '',
    },
    clientName: {
      type: String,
      trim: true,
      default: '',
    },
    clientPhone: {
      type: String,
      trim: true,
      default: '',
    },
    clientEmail: {
      type: String,
      trim: true,
      default: '',
    },
    pickupLocation: {
      type: String,
      trim: true,
      default: '',
    },
    dropLocation: {
      type: String,
      trim: true,
      default: '',
    },
    routeDescription: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Driver', 'Helper', 'Captain'],
      required: true,
    },
    assignedEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    assignedEmployeeName: {
      type: String,
      required: true,
    },
    advanceAmount: {
      type: Number,
      default: 0,
    },
    advancePaymentMode: {
      type: String,
      enum: ['Cash', 'Online', 'UPI', 'Bank Transfer', 'None'],
      default: 'Cash',
    },
    salaryAmount: {
      type: Number,
      default: 0,
    },
    salaryPaymentMode: {
      type: String,
      enum: ['Cash', 'Online', 'UPI', 'Bank Transfer'],
      default: 'Online',
    },
    dueAmount: {
      type: Number,
      default: 0,
    },
    tripAmount: {
      type: Number,
      default: 0,
    },
    employeePayout: {
      type: Number,
      default: 0,
    },
    commissionAmount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Partial'],
      default: 'Pending',
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    tripStatus: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    tripType: {
      type: String,
      enum: ['One-Way', 'Round-Trip', 'Full-Day', 'Monthly Contract', 'Outstation'],
      default: 'Full-Day',
    },
    // Multi-member crew assignment
    driver1: {
      employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
      employeeName: { type: String, default: '' },
      category: { type: String, default: 'Driver' },
      salaryAmount: { type: Number, default: 0 },
      advanceAmount: { type: Number, default: 0 },
      advancePaymentMode: { type: String, default: 'Cash' },
      salaryPaymentMode: { type: String, default: 'Online' },
      dueAmount: { type: Number, default: 0 },
      paymentStatus: { type: String, default: 'Pending' },
    },
    driver2: {
      employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
      employeeName: { type: String, default: '' },
      category: { type: String, default: 'Driver' },
      salaryAmount: { type: Number, default: 0 },
      advanceAmount: { type: Number, default: 0 },
      advancePaymentMode: { type: String, default: 'Cash' },
      salaryPaymentMode: { type: String, default: 'Online' },
      dueAmount: { type: Number, default: 0 },
      paymentStatus: { type: String, default: 'Pending' },
    },
    helper: {
      employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
      employeeName: { type: String, default: '' },
      category: { type: String, default: 'Helper' },
      salaryAmount: { type: Number, default: 0 },
      advanceAmount: { type: Number, default: 0 },
      advancePaymentMode: { type: String, default: 'Cash' },
      salaryPaymentMode: { type: String, default: 'Online' },
      dueAmount: { type: Number, default: 0 },
      paymentStatus: { type: String, default: 'Pending' },
    },
    remarks: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Auto-generate tripNumber and calculate commission
tripSchema.pre('save', async function () {
  if (!this.tripNumber) {
    const count = await mongoose.model('Trip').countDocuments();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    this.tripNumber = `TRP-${dateStr}-${String(count + 1).padStart(4, '0')}`;
  }
  if (!this.startDate) {
    this.startDate = this.tripDate || new Date();
  }
  if (!this.endDate) {
    this.endDate = this.startDate;
  }
  if (!this.totalDays || this.totalDays < 1) {
    const diffMs = new Date(this.endDate) - new Date(this.startDate);
    this.totalDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);
  }

  // Calculate crew dues
  if (this.driver1?.employee) {
    const sal = Number(this.driver1.salaryAmount || 0);
    const adv = Number(this.driver1.advanceAmount || 0);
    this.driver1.dueAmount = this.driver1.paymentStatus === 'Paid' ? 0 : Math.max(0, sal - adv);
  }
  if (this.driver2?.employee) {
    const sal = Number(this.driver2.salaryAmount || 0);
    const adv = Number(this.driver2.advanceAmount || 0);
    this.driver2.dueAmount = this.driver2.paymentStatus === 'Paid' ? 0 : Math.max(0, sal - adv);
  }
  if (this.helper?.employee) {
    const sal = Number(this.helper.salaryAmount || 0);
    const adv = Number(this.helper.advanceAmount || 0);
    this.helper.dueAmount = this.helper.paymentStatus === 'Paid' ? 0 : Math.max(0, sal - adv);
  }

  // Total Salary & Advance from crew if provided
  const crewSalary = (Number(this.driver1?.salaryAmount || 0) + Number(this.driver2?.salaryAmount || 0) + Number(this.helper?.salaryAmount || 0));
  const crewAdvance = (Number(this.driver1?.advanceAmount || 0) + Number(this.driver2?.advanceAmount || 0) + Number(this.helper?.advanceAmount || 0));
  
  if (crewSalary > 0) {
    this.salaryAmount = crewSalary;
    this.employeePayout = crewSalary;
    this.advanceAmount = crewAdvance;
  } else {
    this.salaryAmount = Number(this.salaryAmount !== undefined ? this.salaryAmount : this.employeePayout || 0);
    this.employeePayout = this.salaryAmount;
    this.advanceAmount = Number(this.advanceAmount || 0);
  }

  if (this.paymentStatus === 'Paid') {
    this.dueAmount = 0;
  } else {
    this.dueAmount = Math.max(0, (this.salaryAmount || 0) - (this.advanceAmount || 0));
  }

  // Commission = Trip Amount - Employee Payout
  if (this.tripAmount && this.employeePayout) {
    this.commissionAmount = Math.max(0, this.tripAmount - this.employeePayout);
  }
});

module.exports = mongoose.model('Trip', tripSchema);
