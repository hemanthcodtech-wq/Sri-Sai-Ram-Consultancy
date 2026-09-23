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
