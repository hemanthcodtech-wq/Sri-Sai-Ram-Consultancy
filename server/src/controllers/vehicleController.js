const Vehicle = require('../models/Vehicle');
const store = require('../config/store');

// @desc  Get all vehicles (optionally filtered by status)
// @route GET /api/vehicles
// @access Protected
const getVehicles = async (req, res) => {
  try {
    const { status } = req.query;

    if (store.isMongo()) {
      const filter = {};
      if (status && status !== 'All') filter.status = status;
      const vehicles = await Vehicle.find(filter).sort({ vehicleNumber: 1 });
      return res.json({ success: true, data: vehicles, count: vehicles.length });
    }

    // In-memory fallback
    let data = [...(store.data.vehicles || [])];
    if (status && status !== 'All') {
      data = data.filter((v) => v.status === status);
    }
    data.sort((a, b) => a.vehicleNumber.localeCompare(b.vehicleNumber));
    res.json({ success: true, data, count: data.length });
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).json({ success: false, message: 'Server error fetching vehicles.' });
  }
};

// @desc  Create a new vehicle
// @route POST /api/vehicles
// @access Protected
const createVehicle = async (req, res) => {
  try {
    const { vehicleNumber, status, notes } = req.body;
    if (!vehicleNumber || !vehicleNumber.trim()) {
      return res.status(400).json({ success: false, message: 'Vehicle number is required.' });
    }
    const vNum = vehicleNumber.trim().toUpperCase();

    if (store.isMongo()) {
      const existing = await Vehicle.findOne({ vehicleNumber: vNum });
      if (existing) {
        return res.status(400).json({ success: false, message: `Vehicle number ${vNum} already exists.` });
      }
      const vehicle = await Vehicle.create({
        vehicleNumber: vNum,
        status: status || 'Active',
        notes: notes || '',
      });
      return res.status(201).json({ success: true, data: vehicle, message: 'Vehicle added successfully.' });
    }

    // In-memory fallback
    if (!store.data.vehicles) store.data.vehicles = [];
    const existing = store.data.vehicles.find((v) => v.vehicleNumber === vNum);
    if (existing) {
      return res.status(400).json({ success: false, message: `Vehicle number ${vNum} already exists.` });
    }
    const newVehicle = {
      _id: `veh-${Date.now()}`,
      vehicleNumber: vNum,
      status: status || 'Active',
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.data.vehicles.push(newVehicle);
    res.status(201).json({ success: true, data: newVehicle, message: 'Vehicle added successfully.' });
  } catch (err) {
    console.error('Error creating vehicle:', err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Vehicle number already exists.' });
    }
    res.status(500).json({ success: false, message: 'Server error creating vehicle.' });
  }
};

// @desc  Update a vehicle
// @route PUT /api/vehicles/:id
// @access Protected
const updateVehicle = async (req, res) => {
  try {
    const { vehicleNumber, status, notes } = req.body;
    const updateData = {};

    if (store.isMongo()) {
      if (vehicleNumber !== undefined) {
        if (!vehicleNumber.trim()) {
          return res.status(400).json({ success: false, message: 'Vehicle number cannot be empty.' });
        }
        const vNum = vehicleNumber.trim().toUpperCase();
        const existing = await Vehicle.findOne({ vehicleNumber: vNum, _id: { $ne: req.params.id } });
        if (existing) {
          return res.status(400).json({ success: false, message: `Vehicle number ${vNum} already exists.` });
        }
        updateData.vehicleNumber = vNum;
      }
      if (status !== undefined) updateData.status = status;
      if (notes !== undefined) updateData.notes = notes;

      const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
      if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });
      return res.json({ success: true, data: vehicle, message: 'Vehicle updated successfully.' });
    }

    // In-memory fallback
    if (!store.data.vehicles) store.data.vehicles = [];
    const index = store.data.vehicles.findIndex((v) => String(v._id) === String(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, message: 'Vehicle not found.' });

    if (vehicleNumber !== undefined) {
      const vNum = vehicleNumber.trim().toUpperCase();
      const dup = store.data.vehicles.find((v) => v.vehicleNumber === vNum && String(v._id) !== String(req.params.id));
      if (dup) return res.status(400).json({ success: false, message: `Vehicle number ${vNum} already exists.` });
      updateData.vehicleNumber = vNum;
    }
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    store.data.vehicles[index] = { ...store.data.vehicles[index], ...updateData, updatedAt: new Date() };
    res.json({ success: true, data: store.data.vehicles[index], message: 'Vehicle updated successfully.' });
  } catch (err) {
    console.error('Error updating vehicle:', err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Vehicle number already exists.' });
    }
    res.status(500).json({ success: false, message: 'Server error updating vehicle.' });
  }
};

// @desc  Delete a vehicle
// @route DELETE /api/vehicles/:id
// @access Protected
const deleteVehicle = async (req, res) => {
  try {
    if (store.isMongo()) {
      const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
      if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });
      return res.json({ success: true, message: `Vehicle ${vehicle.vehicleNumber} deleted successfully.` });
    }

    // In-memory fallback
    if (!store.data.vehicles) store.data.vehicles = [];
    const vehicle = store.data.vehicles.find((v) => String(v._id) === String(req.params.id));
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    store.data.vehicles = store.data.vehicles.filter((v) => String(v._id) !== String(req.params.id));
    res.json({ success: true, message: `Vehicle ${vehicle.vehicleNumber} deleted successfully.` });
  } catch (err) {
    console.error('Error deleting vehicle:', err);
    res.status(500).json({ success: false, message: 'Server error deleting vehicle.' });
  }
};

module.exports = { getVehicles, createVehicle, updateVehicle, deleteVehicle };
