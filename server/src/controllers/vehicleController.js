const Vehicle = require('../models/Vehicle');

// @desc  Get all vehicles (optionally filtered by status)
// @route GET /api/vehicles
// @access Protected
const getVehicles = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }
    const vehicles = await Vehicle.find(filter).sort({ vehicleNumber: 1 });
    res.json({ success: true, data: vehicles, count: vehicles.length });
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

    const existing = await Vehicle.findOne({ vehicleNumber: vehicleNumber.trim().toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: `Vehicle number ${vehicleNumber.toUpperCase()} already exists.` });
    }

    const vehicle = await Vehicle.create({
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      status: status || 'Active',
      notes: notes || '',
    });

    res.status(201).json({ success: true, data: vehicle, message: 'Vehicle added successfully.' });
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

    if (vehicleNumber !== undefined) {
      if (!vehicleNumber.trim()) {
        return res.status(400).json({ success: false, message: 'Vehicle number cannot be empty.' });
      }
      // Check for duplicate (excluding current doc)
      const existing = await Vehicle.findOne({
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        _id: { $ne: req.params.id },
      });
      if (existing) {
        return res.status(400).json({ success: false, message: `Vehicle number ${vehicleNumber.toUpperCase()} already exists.` });
      }
      updateData.vehicleNumber = vehicleNumber.trim().toUpperCase();
    }
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    res.json({ success: true, data: vehicle, message: 'Vehicle updated successfully.' });
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
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }
    res.json({ success: true, message: `Vehicle ${vehicle.vehicleNumber} deleted successfully.` });
  } catch (err) {
    console.error('Error deleting vehicle:', err);
    res.status(500).json({ success: false, message: 'Server error deleting vehicle.' });
  }
};

module.exports = { getVehicles, createVehicle, updateVehicle, deleteVehicle };
