const Mileage = require('../models/Mileage');

// @desc    Get all mileage records
// @route   GET /api/mileage
// @access  Private (Admin)
const getMileageRecords = async (req, res) => {
  try {
    const { vehicleNumber, startDate, endDate } = req.query;

    const query = {};

    if (vehicleNumber) {
      query.vehicleNumber = new RegExp(vehicleNumber, 'i');
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }

    const records = await Mileage.find(query).sort({ date: -1, createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching mileage records:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create new mileage record
// @route   POST /api/mileage
// @access  Private (Admin)
const createMileageRecord = async (req, res) => {
  try {
    const { vehicleNumber, date, roundTripFrom, roundTripTo, lastFuelKm, endTripKm, fuelQuantity, fuelCost = 0 } = req.body;
    const lastKm = Number(lastFuelKm);
    const endKm = Number(endTripKm);
    const fuel = Number(fuelQuantity);
    const totalKm = Math.max(0, endKm - lastKm);
    const mileage = fuel > 0 ? Number((totalKm / fuel).toFixed(2)) : 0;

    if (!vehicleNumber || !date || !roundTripFrom || !roundTripTo || !Number.isFinite(lastKm) || !Number.isFinite(endKm) || endKm < lastKm || !Number.isFinite(fuel) || fuel <= 0) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const record = await Mileage.create({
      vehicleNumber,
      date,
      roundTripFrom,
      roundTripTo,
      lastFuelKm: lastKm,
      endTripKm: endKm,
      totalKm,
      mileage,
      odometerReading: lastKm,
      fuelQuantity: fuel,
      fuelCost: Number(fuelCost) || 0,
      kmsCovered: totalKm,
    });

    res.status(201).json(record);
  } catch (error) {
    console.error('Error creating mileage record:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update mileage record
// @route   PUT /api/mileage/:id
// @access  Private (Admin)
const updateMileageRecord = async (req, res) => {
  try {
    const { vehicleNumber, date, roundTripFrom, roundTripTo, lastFuelKm, endTripKm, fuelQuantity, fuelCost } = req.body;

    const record = await Mileage.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Mileage record not found' });
    }

    record.vehicleNumber = vehicleNumber || record.vehicleNumber;
    record.date = date || record.date;
    const lastKm = lastFuelKm !== undefined ? Number(lastFuelKm) : Number(record.lastFuelKm ?? record.odometerReading ?? 0);
    const endKm = endTripKm !== undefined ? Number(endTripKm) : Number(record.endTripKm ?? (lastKm + Number(record.kmsCovered || 0)));
    const fuel = fuelQuantity !== undefined ? Number(fuelQuantity) : Number(record.fuelQuantity || 0);
    const totalKm = Math.max(0, endKm - lastKm);
    record.roundTripFrom = roundTripFrom !== undefined ? roundTripFrom : record.roundTripFrom;
    record.roundTripTo = roundTripTo !== undefined ? roundTripTo : record.roundTripTo;
    record.lastFuelKm = lastKm;
    record.endTripKm = endKm;
    record.totalKm = totalKm;
    record.mileage = fuel > 0 ? Number((totalKm / fuel).toFixed(2)) : 0;
    record.odometerReading = lastKm;
    record.fuelQuantity = fuel;
    record.fuelCost = fuelCost !== undefined ? Number(fuelCost) : record.fuelCost;
    record.kmsCovered = totalKm;

    const updatedRecord = await record.save();

    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error('Error updating mileage record:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete mileage record
// @route   DELETE /api/mileage/:id
// @access  Private (Admin)
const deleteMileageRecord = async (req, res) => {
  try {
    const record = await Mileage.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Mileage record not found' });
    }

    await record.deleteOne();

    res.status(200).json({ message: 'Mileage record removed' });
  } catch (error) {
    console.error('Error deleting mileage record:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getMileageRecords,
  createMileageRecord,
  updateMileageRecord,
  deleteMileageRecord,
};
