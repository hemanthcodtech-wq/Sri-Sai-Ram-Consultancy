const CleaningPayment = require('../models/CleaningPayment');
const store = require('../config/store');

const normalizePayload = (body) => ({
  stationName: String(body.stationName || '').trim(),
  month: String(body.month || '').trim(),
  amount: Number(body.amount),
  paidDate: body.paidDate,
  paymentMode: body.paymentMode || 'Cash',
  remarks: String(body.remarks || '').trim(),
});

const validatePayload = (payload) => {
  if (!payload.stationName || !/^\d{4}-\d{2}$/.test(payload.month) || !payload.paidDate) {
    return 'Station, month, and payment date are required.';
  }
  if (!Number.isFinite(payload.amount) || payload.amount < 0) {
    return 'Amount must be a valid non-negative number.';
  }
  if (!['Cash', 'Online', 'UPI', 'Bank Transfer'].includes(payload.paymentMode)) {
    return 'Please select a valid payment mode.';
  }
  return null;
};

const getCleaningPayments = async (req, res) => {
  try {
    const { search, month } = req.query;
    if (store.isMongo()) {
      const query = {};
      if (month && month !== 'All') query.month = month;
      if (search) query.stationName = { $regex: search, $options: 'i' };
      const records = await CleaningPayment.find(query).sort({ month: -1, paidDate: -1, createdAt: -1 });
      return res.json({ success: true, data: records, count: records.length });
    }

    let records = [...(store.data.cleaningPayments || [])];
    if (month && month !== 'All') records = records.filter((record) => record.month === month);
    if (search) {
      const term = search.toLowerCase();
      records = records.filter((record) => record.stationName.toLowerCase().includes(term) || record.remarks.toLowerCase().includes(term));
    }
    records.sort((a, b) => String(b.month).localeCompare(String(a.month)) || new Date(b.paidDate) - new Date(a.paidDate));
    res.json({ success: true, data: records, count: records.length });
  } catch (error) {
    console.error('getCleaningPayments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cleaning payment records.' });
  }
};

const createCleaningPayment = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);
    const validationError = validatePayload(payload);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    if (store.isMongo()) {
      const record = await CleaningPayment.create(payload);
      return res.status(201).json({ success: true, data: record, message: 'Cleaning payment record added.' });
    }

    if (!store.data.cleaningPayments) store.data.cleaningPayments = [];
    const record = { _id: `cleaning-${Date.now()}`, ...payload, createdAt: new Date(), updatedAt: new Date() };
    store.data.cleaningPayments.unshift(record);
    res.status(201).json({ success: true, data: record, message: 'Cleaning payment record added.' });
  } catch (error) {
    console.error('createCleaningPayment error:', error);
    res.status(500).json({ success: false, message: 'Failed to add cleaning payment record.' });
  }
};

const updateCleaningPayment = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);
    const validationError = validatePayload(payload);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    if (store.isMongo()) {
      const record = await CleaningPayment.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
      if (!record) return res.status(404).json({ success: false, message: 'Cleaning payment record not found.' });
      return res.json({ success: true, data: record, message: 'Cleaning payment record updated.' });
    }

    const records = store.data.cleaningPayments || [];
    const index = records.findIndex((record) => String(record._id) === String(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, message: 'Cleaning payment record not found.' });
    records[index] = { ...records[index], ...payload, updatedAt: new Date() };
    res.json({ success: true, data: records[index], message: 'Cleaning payment record updated.' });
  } catch (error) {
    console.error('updateCleaningPayment error:', error);
    res.status(500).json({ success: false, message: 'Failed to update cleaning payment record.' });
  }
};

const deleteCleaningPayment = async (req, res) => {
  try {
    if (store.isMongo()) {
      const record = await CleaningPayment.findByIdAndDelete(req.params.id);
      if (!record) return res.status(404).json({ success: false, message: 'Cleaning payment record not found.' });
      return res.json({ success: true, message: 'Cleaning payment record deleted.' });
    }

    const records = store.data.cleaningPayments || [];
    const exists = records.some((record) => String(record._id) === String(req.params.id));
    if (!exists) return res.status(404).json({ success: false, message: 'Cleaning payment record not found.' });
    store.data.cleaningPayments = records.filter((record) => String(record._id) !== String(req.params.id));
    res.json({ success: true, message: 'Cleaning payment record deleted.' });
  } catch (error) {
    console.error('deleteCleaningPayment error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete cleaning payment record.' });
  }
};

module.exports = {
  getCleaningPayments,
  createCleaningPayment,
  updateCleaningPayment,
  deleteCleaningPayment,
};
