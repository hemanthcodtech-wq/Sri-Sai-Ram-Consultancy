const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    alternateNumber: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: ['Driver', 'Helper', 'Captain'],
      default: 'Driver',
    },
    experience: {
      type: String, // e.g., "5 Years", "3 Years 6 Months"
      required: true,
      default: '1 Year',
    },
    photo: {
      type: String, // URL or base64 or placeholder
      default: '',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      fullAddress: { type: String, default: '' },
    },
    documents: {
      aadhaarNumber: { type: String, default: '' },
      licenseNumber: { type: String, default: '' }, // For drivers/captains
      badgeNumber: { type: String, default: '' },
      policeVerificationStatus: {
        type: String,
        enum: ['Verified', 'Pending', 'In Progress', 'Not Applicable'],
        default: 'Verified',
      },
      documentUrls: [{ name: String, url: String }],
    },
    status: {
      type: String,
      enum: ['Available', 'On Duty', 'Inactive', 'Leave'],
      default: 'Available',
    },
    dailyRate: {
      type: Number,
      default: 800,
    },
    monthlyRate: {
      type: Number,
      default: 20000,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    specialSkills: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate employeeId if not set
employeeSchema.pre('save', async function (next) {
  if (!this.employeeId) {
    const prefix = this.category === 'Driver' ? 'DRV' : this.category === 'Helper' ? 'HLP' : 'CPT';
    const count = await mongoose.model('Employee').countDocuments();
    this.employeeId = `${prefix}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
