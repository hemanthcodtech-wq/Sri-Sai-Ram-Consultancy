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
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientPhone: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      trim: true,
      default: '',
    },
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
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
    tripAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    employeePayout: {
      type: Number,
      required: true,
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
    remarks: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Auto-generate tripNumber and calculate commission
tripSchema.pre('save', async function (next) {
  if (!this.tripNumber) {
    const count = await mongoose.model('Trip').countDocuments();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    this.tripNumber = `TRP-${dateStr}-${String(count + 1).padStart(4, '0')}`;
  }
  // Commission = Trip Amount - Employee Payout
  if (this.tripAmount && this.employeePayout) {
    this.commissionAmount = Math.max(0, this.tripAmount - this.employeePayout);
  }
  next();
});

module.exports = mongoose.model('Trip', tripSchema);
