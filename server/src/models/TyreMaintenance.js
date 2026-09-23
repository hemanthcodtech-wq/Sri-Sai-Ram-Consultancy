const mongoose = require('mongoose');

const tyreMaintenanceSchema = new mongoose.Schema(
  {
    purchaseDate: {
      type: Date,
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    kilometre: {
      type: Number,
      required: true,
      min: 0,
    },
    tyreNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

tyreMaintenanceSchema.index({ vehicleNumber: 1, tyreNumber: 1 });

tyreMaintenanceSchema.index({ purchaseDate: -1 });

module.exports = mongoose.model('TyreMaintenance', tyreMaintenanceSchema);
