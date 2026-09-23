const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true, trim: true, uppercase: true },
    quantity: { type: Number, required: true, min: 1 },
    usedDate: { type: Date, required: true },
    odometer: { type: Number, min: 0, default: 0 },
    remarks: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    partNumber: { type: String, trim: true, uppercase: true, default: '' },
    category: { type: String, trim: true, default: 'Spare Part' },
    brand: { type: String, trim: true, default: '' },
    unit: { type: String, trim: true, default: 'Piece' },
    supplier: { type: String, trim: true, default: '' },
    purchaseDate: { type: Date, required: true },
    quantityReceived: { type: Number, required: true, min: 0 },
    quantityUsed: { type: Number, default: 0, min: 0 },
    unitCost: { type: Number, default: 0, min: 0 },
    notes: { type: String, trim: true, default: '' },
    usageRecords: { type: [usageSchema], default: [] },
  },
  { timestamps: true }
);

productSchema.virtual('stock').get(function () {
  return Math.max(0, this.quantityReceived - this.quantityUsed);
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });
productSchema.index({ name: 1, partNumber: 1 });

module.exports = mongoose.model('Product', productSchema);
