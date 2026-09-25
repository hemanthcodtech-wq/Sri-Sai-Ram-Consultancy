const mongoose = require('mongoose');

const cleaningPaymentSchema = new mongoose.Schema(
  {
    stationName: { type: String, required: true, trim: true },
    city: { type: String, trim: true, default: '' },
    helperName: { type: String, trim: true, default: '' },
    month: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paidDate: { type: Date, required: true },
    paymentMode: { type: String, enum: ['Cash', 'Online', 'UPI', 'Bank Transfer'], default: 'Cash' },
    remarks: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

cleaningPaymentSchema.index({ stationName: 1, month: 1 });
cleaningPaymentSchema.index({ paidDate: -1 });

module.exports = mongoose.model('CleaningPayment', cleaningPaymentSchema);
