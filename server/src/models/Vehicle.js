const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    registrationDate: {
      type: Date,
    },
    fitnessValidUpto: {
      type: Date,
    },
    taxValidUpto: {
      type: Date,
    },
    insuranceValidUpto: {
      type: Date,
    },
    puccValidUpto: {
      type: Date,
    },
    permitValidUpto: {
      type: Date,
    },
    aitpValidUpto: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
