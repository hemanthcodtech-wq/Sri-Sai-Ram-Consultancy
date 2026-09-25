const mongoose = require('mongoose');

const mileageSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    date: {
      type: Date,
      required: true,
    },
    roundTripFrom: {
      type: String,
      trim: true,
      default: '',
    },
    roundTripTo: {
      type: String,
      trim: true,
      default: '',
    },
    lastFuelKm: {
      type: Number,
      min: 0,
      default: 0,
    },
    endTripKm: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalKm: {
      type: Number,
      min: 0,
      default: 0,
    },
    mileage: {
      type: Number,
      min: 0,
      default: 0,
    },
    odometerReading: {
      type: Number,
      required: true,
      min: 0,
    },
    fuelQuantity: {
      type: Number, // In Liters
      required: true,
      min: 0,
    },
    fuelCost: {
      type: Number, // Total Cost
      required: true,
      min: 0,
    },
    kmsCovered: {
      type: Number, // KMS Covered
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

mileageSchema.index({ date: -1 });
mileageSchema.index({ vehicleNumber: 1 });

module.exports = mongoose.model('Mileage', mileageSchema);
