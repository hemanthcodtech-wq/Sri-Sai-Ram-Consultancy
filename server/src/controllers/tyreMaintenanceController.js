const TyreMaintenance = require('../models/TyreMaintenance');
const store = require('../config/store');

const normalizePayload = (body) => ({
  purchaseDate: body.purchaseDate,
  vehicleNumber: String(body.vehicleNumber || '').trim().toUpperCase(),
  kilometre: Number(body.kilometre),
  tyreNumber: String(body.tyreNumber || '').trim(),
});

const validatePayload = (payload) => {
  if (!payload.purchaseDate || !payload.vehicleNumber || !payload.tyreNumber) {
    return 'Purchase date, vehicle number, kilometre, and tyre number are required.';
  }
  if (!Number.isFinite(payload.kilometre) || payload.kilometre < 0) {
    return 'Kilometre must be a valid non-negative number.';
  }
  return null;
};

const getTyreMaintenance = async (req, res) => {
  try {
    const { search, vehicleNumber } = req.query;
    const query = {};
    if (vehicleNumber && vehicleNumber !== 'All') query.vehicleNumber = vehicleNumber;
    if (search) {
      query.$or = [
        { vehicleNumber: { $regex: search, $options: 'i' } },
        { tyreNumber: { $regex: search, $options: 'i' } },
      ];
    }

    if (store.isMongo()) {
      const records = await TyreMaintenance.find(query).sort({ purchaseDate: -1, createdAt: -1 });
      return res.json({ success: true, data: records, count: records.length });
    }

    let records = [...(store.data.tyreMaintenance || [])];
    if (vehicleNumber && vehicleNumber !== 'All') {
      records = records.filter((record) => record.vehicleNumber === vehicleNumber);
    }
    if (search) {
      const term = search.toLowerCase();
      records = records.filter((record) =>
        record.vehicleNumber.toLowerCase().includes(term) || record.tyreNumber.toLowerCase().includes(term)
      );
    }
    records.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
    res.json({ success: true, data: records, count: records.length });
  } catch (error) {
    console.error('Error fetching tyre maintenance records:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tyre maintenance records.' });
  }
};

const createTyreMaintenance = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);
    const validationError = validatePayload(payload);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    if (store.isMongo()) {
      const record = await TyreMaintenance.create(payload);
      return res.status(201).json({ success: true, data: record, message: 'Tyre maintenance record added.' });
    }

    if (!store.data.tyreMaintenance) store.data.tyreMaintenance = [];
    const record = { _id: `tyre-${Date.now()}`, ...payload, createdAt: new Date(), updatedAt: new Date() };
    store.data.tyreMaintenance.push(record);
    res.status(201).json({ success: true, data: record, message: 'Tyre maintenance record added.' });
  } catch (error) {
    console.error('Error creating tyre maintenance record:', error);
    res.status(500).json({ success: false, message: 'Failed to add tyre maintenance record.' });
  }
};

const updateTyreMaintenance = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);
    const validationError = validatePayload(payload);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    if (store.isMongo()) {
      const record = await TyreMaintenance.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
      if (!record) return res.status(404).json({ success: false, message: 'Tyre maintenance record not found.' });
      return res.json({ success: true, data: record, message: 'Tyre maintenance record updated.' });
    }

    const records = store.data.tyreMaintenance || [];
    const index = records.findIndex((record) => String(record._id) === String(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, message: 'Tyre maintenance record not found.' });
    records[index] = { ...records[index], ...payload, updatedAt: new Date() };
    res.json({ success: true, data: records[index], message: 'Tyre maintenance record updated.' });
  } catch (error) {
    console.error('Error updating tyre maintenance record:', error);
    res.status(500).json({ success: false, message: 'Failed to update tyre maintenance record.' });
  }
};

const deleteTyreMaintenance = async (req, res) => {
  try {
    if (store.isMongo()) {
      const record = await TyreMaintenance.findByIdAndDelete(req.params.id);
      if (!record) return res.status(404).json({ success: false, message: 'Tyre maintenance record not found.' });
      return res.json({ success: true, message: 'Tyre maintenance record deleted.' });
    }

    const records = store.data.tyreMaintenance || [];
    const record = records.find((item) => String(item._id) === String(req.params.id));
    if (!record) return res.status(404).json({ success: false, message: 'Tyre maintenance record not found.' });
    store.data.tyreMaintenance = records.filter((item) => String(item._id) !== String(req.params.id));
    res.json({ success: true, message: 'Tyre maintenance record deleted.' });
  } catch (error) {
    console.error('Error deleting tyre maintenance record:', error);
    res.status(500).json({ success: false, message: 'Failed to delete tyre maintenance record.' });
  }
};

module.exports = {
  getTyreMaintenance,
  createTyreMaintenance,
  updateTyreMaintenance,
  deleteTyreMaintenance,
};
