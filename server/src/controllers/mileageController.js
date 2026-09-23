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
    const { vehicleNumber, date, odometerReading, fuelQuantity, fuelCost, kmsCovered } = req.body;

    if (!vehicleNumber || !date || odometerReading === undefined || fuelQuantity === undefined || fuelCost === undefined || kmsCovered === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const record = await Mileage.create({
      vehicleNumber,
      date,
      odometerReading,
      fuelQuantity,
      fuelCost,
      kmsCovered,
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
    const { vehicleNumber, date, odometerReading, fuelQuantity, fuelCost, kmsCovered } = req.body;

    const record = await Mileage.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Mileage record not found' });
    }

    record.vehicleNumber = vehicleNumber || record.vehicleNumber;
    record.date = date || record.date;
    record.odometerReading = odometerReading !== undefined ? odometerReading : record.odometerReading;
    record.fuelQuantity = fuelQuantity !== undefined ? fuelQuantity : record.fuelQuantity;
    record.fuelCost = fuelCost !== undefined ? fuelCost : record.fuelCost;
    record.kmsCovered = kmsCovered !== undefined ? kmsCovered : record.kmsCovered;

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
