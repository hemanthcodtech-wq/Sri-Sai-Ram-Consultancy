const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema(
  {
    fromCity: {
      type: String,
      required: true,
      trim: true,
    },
    toCity: {
      type: String,
      required: true,
      trim: true,
    },
    routeName: {
      type: String,
      trim: true,
      default: '',
    },
    distanceKm: {
      type: Number,
      default: 0,
    },
    estimatedHours: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Auto compute routeName before saving if empty
routeSchema.pre('save', function () {
  if (!this.routeName || !this.routeName.trim()) {
    this.routeName = `${this.fromCity} → ${this.toCity}`;
  }
});

module.exports = mongoose.model('Route', routeSchema);
