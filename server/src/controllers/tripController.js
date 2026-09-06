const Trip = require('../models/Trip');
const Employee = require('../models/Employee');
const store = require('../config/store');

const getTrips = async (req, res) => {
  try {
    const {
      search,
      category,
      paymentStatus,
      tripStatus,
      employeeId,
      startDate,
      endDate,
    } = req.query;

    if (store.isMongo()) {
      let query = {};
      if (category && category !== 'All') query.category = category;
      if (paymentStatus && paymentStatus !== 'All') query.paymentStatus = paymentStatus;
      if (tripStatus && tripStatus !== 'All') query.tripStatus = tripStatus;
      if (employeeId && employeeId !== 'All') query.assignedEmployee = employeeId;

      if (startDate || endDate) {
        query.tripDate = {};
        if (startDate) query.tripDate.$gte = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          query.tripDate.$lte = end;
        }
      }

      if (search) {
        query.$or = [
          { tripNumber: { $regex: search, $options: 'i' } },
          { clientName: { $regex: search, $options: 'i' } },
          { clientPhone: { $regex: search, $options: 'i' } },
          { pickupLocation: { $regex: search, $options: 'i' } },
          { dropLocation: { $regex: search, $options: 'i' } },
          { assignedEmployeeName: { $regex: search, $options: 'i' } },
        ];
      }

      const trips = await Trip.find(query)
        .populate('assignedEmployee', 'name category mobileNumber photo employeeId')
        .sort({ tripDate: -1, createdAt: -1 });

      const totalAmount = trips.reduce((sum, t) => sum + (t.tripAmount || 0), 0);
      const totalPayout = trips.reduce((sum, t) => sum + (t.employeePayout || 0), 0);
      const totalCommission = trips.reduce((sum, t) => sum + (t.commissionAmount || 0), 0);
      const totalPaid = trips
        .filter((t) => t.paymentStatus === 'Paid')
        .reduce((sum, t) => sum + (t.tripAmount || 0), 0);
      const totalPending = totalAmount - totalPaid;

      return res.json({
        success: true,
        count: trips.length,
        summary: { totalAmount, totalPayout, totalCommission, totalPaid, totalPending },
        data: trips,
      });
    }

    // Fallback store
    let filtered = [...store.data.trips];
    if (category && category !== 'All') {
      filtered = filtered.filter((t) => t.category === category);
    }
    if (paymentStatus && paymentStatus !== 'All') {
      filtered = filtered.filter((t) => t.paymentStatus === paymentStatus);
    }
    if (tripStatus && tripStatus !== 'All') {
      filtered = filtered.filter((t) => t.tripStatus === tripStatus);
    }
    if (employeeId && employeeId !== 'All') {
      filtered = filtered.filter((t) => String(t.assignedEmployee) === String(employeeId));
    }
    if (startDate) {
      filtered = filtered.filter((t) => new Date(t.tripDate) >= new Date(startDate));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((t) => new Date(t.tripDate) <= end);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          (t.tripNumber && t.tripNumber.toLowerCase().includes(s)) ||
          (t.clientName && t.clientName.toLowerCase().includes(s)) ||
          (t.clientPhone && t.clientPhone.toLowerCase().includes(s)) ||
          (t.pickupLocation && t.pickupLocation.toLowerCase().includes(s)) ||
          (t.dropLocation && t.dropLocation.toLowerCase().includes(s)) ||
          (t.assignedEmployeeName && t.assignedEmployeeName.toLowerCase().includes(s))
      );
    }

    const totalAmount = filtered.reduce((sum, t) => sum + (t.tripAmount || 0), 0);
    const totalPayout = filtered.reduce((sum, t) => sum + (t.employeePayout || 0), 0);
    const totalCommission = filtered.reduce((sum, t) => sum + (t.commissionAmount || 0), 0);
    const totalPaid = filtered
      .filter((t) => t.paymentStatus === 'Paid')
      .reduce((sum, t) => sum + (t.tripAmount || 0), 0);
    const totalPending = totalAmount - totalPaid;

    res.json({
      success: true,
      count: filtered.length,
      summary: { totalAmount, totalPayout, totalCommission, totalPaid, totalPending },
      data: filtered,
    });
  } catch (error) {
    console.error('getTrips error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    if (store.isMongo()) {
      const trip = await Trip.findById(id).populate('assignedEmployee', 'name category mobileNumber employeeId');
      if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
      return res.json({ success: true, data: trip });
    }

    const trip = store.data.trips.find((t) => String(t._id) === String(id) || t.tripNumber === id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTrip = async (req, res) => {
  try {
    const { assignedEmployee, tripAmount, employeePayout } = req.body;
    const commissionAmount = Math.max(0, Number(tripAmount || 0) - Number(employeePayout || 0));

    if (store.isMongo()) {
      const employee = await Employee.findById(assignedEmployee);
      if (!employee) return res.status(404).json({ success: false, message: 'Assigned employee not found' });

      const trip = new Trip({
        ...req.body,
        assignedEmployeeName: employee.name,
        category: req.body.category || employee.category,
        commissionAmount,
      });

      const saved = await trip.save();
      return res.status(201).json({ success: true, data: saved });
    }

    const emp = store.data.employees.find((e) => String(e._id) === String(assignedEmployee));
    const count = store.data.trips.length + 1;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const newTrip = {
      _id: `trp-${Date.now()}`,
      tripNumber: `TRP-${dateStr}-${String(count).padStart(4, '0')}`,
      ...req.body,
      assignedEmployeeName: emp ? emp.name : 'Assigned Staff',
      category: req.body.category || (emp ? emp.category : 'Driver'),
      commissionAmount,
      tripDate: req.body.tripDate ? new Date(req.body.tripDate) : new Date(),
      createdAt: new Date(),
    };

    store.data.trips.unshift(newTrip);
    res.status(201).json({ success: true, data: newTrip });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    if (store.isMongo()) {
      if (req.body.assignedEmployee) {
        const emp = await Employee.findById(req.body.assignedEmployee);
        if (emp) {
          req.body.assignedEmployeeName = emp.name;
          if (!req.body.category) req.body.category = emp.category;
        }
      }

      if (req.body.tripAmount !== undefined && req.body.employeePayout !== undefined) {
        req.body.commissionAmount = Math.max(0, Number(req.body.tripAmount) - Number(req.body.employeePayout));
      }

      const trip = await Trip.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).populate(
        'assignedEmployee',
        'name category mobileNumber'
      );
      if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
      return res.json({ success: true, data: trip });
    }

    const index = store.data.trips.findIndex((t) => String(t._id) === String(id));
    if (index === -1) return res.status(404).json({ success: false, message: 'Trip not found' });

    let updatedObj = { ...store.data.trips[index], ...req.body, updatedAt: new Date() };
    if (req.body.assignedEmployee) {
      const emp = store.data.employees.find((e) => String(e._id) === String(req.body.assignedEmployee));
      if (emp) {
        updatedObj.assignedEmployeeName = emp.name;
        if (!req.body.category) updatedObj.category = emp.category;
      }
    }
    if (updatedObj.tripAmount !== undefined && updatedObj.employeePayout !== undefined) {
      updatedObj.commissionAmount = Math.max(0, Number(updatedObj.tripAmount) - Number(updatedObj.employeePayout));
    }

    store.data.trips[index] = updatedObj;
    res.json({ success: true, data: updatedObj });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    if (store.isMongo()) {
      const trip = await Trip.findById(id);
      if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
      await trip.deleteOne();
      return res.json({ success: true, message: 'Trip removed successfully' });
    }

    store.data.trips = store.data.trips.filter((t) => String(t._id) !== String(id));
    res.json({ success: true, message: 'Trip removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTrips, getTripById, createTrip, updateTrip, deleteTrip };
