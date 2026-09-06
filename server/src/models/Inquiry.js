const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    serviceType: {
      type: String,
      enum: ['Driver', 'Helper', 'Captain', 'General Inquiry'],
      required: true,
      default: 'Driver',
    },
    bookingType: {
      type: String,
      enum: ['One-Way', 'Round-Trip', 'Full-Day', 'Monthly Contract', 'Outstation', 'Emergency/Instant'],
      default: 'Full-Day',
    },
    pickupLocation: {
      type: String,
      default: '',
    },
    serviceDate: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: String, // e.g. "1 Day", "3 Days", "Monthly"
      default: '1 Day',
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Assigned', 'Closed'],
      default: 'New',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
