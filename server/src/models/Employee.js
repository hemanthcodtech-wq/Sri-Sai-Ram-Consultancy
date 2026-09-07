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
      aadhaarDoc: { type: String, default: '' }, // Cloudinary URL (PDF or Image)
      panNumber: { type: String, default: '' },
      panDoc: { type: String, default: '' }, // Cloudinary URL (PDF or Image)
      licenseNumber: { type: String, default: '' }, // For drivers/captains
      licenseDoc: { type: String, default: '' }, // Cloudinary URL (PDF or Image)
      experienceDoc: { type: String, default: '' }, // Cloudinary URL (PDF or Image)
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

// Auto-generate unique employeeId if not set
employeeSchema.pre('save', async function () {
  if (!this.employeeId) {
    const prefix = this.category === 'Driver' ? 'DRV' : this.category === 'Helper' ? 'HLP' : 'CPT';
    let idGenerated = false;
    let attempt = 0;
    while (!idGenerated && attempt < 20) {
      const count = await mongoose.model('Employee').countDocuments({ category: this.category });
      const candidateId = `${prefix}-${String(count + 1 + attempt).padStart(4, '0')}`;
      const existing = await mongoose.model('Employee').findOne({ employeeId: candidateId });
      if (!existing) {
        this.employeeId = candidateId;
        idGenerated = true;
      }
      attempt++;
    }
    if (!this.employeeId) {
      this.employeeId = `${prefix}-${Date.now().toString().slice(-4)}`;
    }
  }
});

module.exports = mongoose.model('Employee', employeeSchema);
