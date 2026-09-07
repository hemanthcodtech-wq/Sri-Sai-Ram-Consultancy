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
      const totalPaid = trips.reduce((sum, t) => {
        if (t.paymentStatus === 'Paid') return sum + (t.tripAmount || 0);
        if (t.paymentStatus === 'Partial') return sum + (t.paidAmount || 0);
        return sum;
      }, 0);
      const totalPending = Math.max(0, totalAmount - totalPaid);

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
    const totalPaid = filtered.reduce((sum, t) => {
      if (t.paymentStatus === 'Paid') return sum + (t.tripAmount || 0);
      if (t.paymentStatus === 'Partial') return sum + (t.paidAmount || 0);
      return sum;
    }, 0);
    const totalPending = Math.max(0, totalAmount - totalPaid);

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
    const { assignedEmployee, tripAmount, employeePayout, startDate, endDate, tripDate } = req.body;
    const commissionAmount = Math.max(0, Number(tripAmount || 0) - Number(employeePayout || 0));

    const sDate = startDate ? new Date(startDate) : tripDate ? new Date(tripDate) : new Date();
    const eDate = endDate ? new Date(endDate) : sDate;
    const diffMs = eDate - sDate;
    const computedDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);
    const totalDays = Number(req.body.totalDays) || computedDays;

    if (store.isMongo()) {
      const employee = await Employee.findById(assignedEmployee);
      if (!employee) return res.status(404).json({ success: false, message: 'Assigned employee not found' });

      const trip = new Trip({
        ...req.body,
        assignedEmployeeName: employee.name,
        category: req.body.category || employee.category,
        commissionAmount,
        startDate: sDate,
        endDate: eDate,
        totalDays,
        tripDate: sDate,
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
      startDate: sDate,
      endDate: eDate,
      totalDays,
      tripDate: sDate,
      createdAt: new Date(),
    };

    store.data.trips.unshift(newTrip);
    res.status(201).json({ success: true, data: newTrip });
  } catch (error) {
    console.error('createTrip error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const payload = { ...req.body };
    if (payload.startDate || payload.endDate) {
      const sDate = payload.startDate ? new Date(payload.startDate) : payload.tripDate ? new Date(payload.tripDate) : new Date();
      const eDate = payload.endDate ? new Date(payload.endDate) : sDate;
      payload.startDate = sDate;
      payload.endDate = eDate;
      payload.tripDate = sDate;
      if (!payload.totalDays) {
        const diffMs = eDate - sDate;
        payload.totalDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);
      }
    }

    if (store.isMongo()) {
      if (payload.assignedEmployee) {
        const emp = await Employee.findById(payload.assignedEmployee);
        if (emp) {
          payload.assignedEmployeeName = emp.name;
          if (!payload.category) payload.category = emp.category;
        }
      }

      if (payload.tripAmount !== undefined && payload.employeePayout !== undefined) {
        payload.commissionAmount = Math.max(0, Number(payload.tripAmount) - Number(payload.employeePayout));
      }

      const trip = await Trip.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate(
        'assignedEmployee',
        'name category mobileNumber'
      );
      if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
      return res.json({ success: true, data: trip });
    }

    const index = store.data.trips.findIndex((t) => String(t._id) === String(id));
    if (index === -1) return res.status(404).json({ success: false, message: 'Trip not found' });

    let updatedObj = { ...store.data.trips[index], ...payload, updatedAt: new Date() };
    if (payload.assignedEmployee) {
      const emp = store.data.employees.find((e) => String(e._id) === String(payload.assignedEmployee));
      if (emp) {
        updatedObj.assignedEmployeeName = emp.name;
        if (!payload.category) updatedObj.category = emp.category;
      }
    }
    if (updatedObj.tripAmount !== undefined && updatedObj.employeePayout !== undefined) {
      updatedObj.commissionAmount = Math.max(0, Number(updatedObj.tripAmount) - Number(updatedObj.employeePayout));
    }

    store.data.trips[index] = updatedObj;
    res.json({ success: true, data: updatedObj });
  } catch (error) {
    console.error('updateTrip error:', error);
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
