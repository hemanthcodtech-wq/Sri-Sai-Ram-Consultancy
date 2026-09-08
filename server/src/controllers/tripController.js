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
          { vehicleNumber: { $regex: search, $options: 'i' } },
          { routeName: { $regex: search, $options: 'i' } },
          { operatorName: { $regex: search, $options: 'i' } },
          { clientName: { $regex: search, $options: 'i' } },
          { clientPhone: { $regex: search, $options: 'i' } },
          { pickupLocation: { $regex: search, $options: 'i' } },
          { dropLocation: { $regex: search, $options: 'i' } },
          { assignedEmployeeName: { $regex: search, $options: 'i' } },
        ];
      }

      const trips = await Trip.find(query)
        .populate('assignedEmployee', 'name category mobileNumber photo employeeId isBlocked blockReason')
        .populate('operator', 'name phone company')
        .populate('route', 'fromCity toCity routeName')
        .sort({ tripDate: -1, createdAt: -1 });

      const totalAmount = trips.reduce((sum, t) => sum + (t.tripAmount || 0), 0);
      const totalSalary = trips.reduce((sum, t) => sum + (t.salaryAmount || t.employeePayout || 0), 0);
      const totalAdvance = trips.reduce((sum, t) => sum + (t.advanceAmount || 0), 0);
      const totalDue = trips.reduce((sum, t) => {
        if (t.paymentStatus === 'Paid') return sum;
        return sum + (t.dueAmount !== undefined ? t.dueAmount : Math.max(0, (t.salaryAmount || t.employeePayout || 0) - (t.advanceAmount || 0)));
      }, 0);
      const totalPayout = totalSalary;
      const totalCommission = trips.reduce((sum, t) => sum + (t.commissionAmount || 0), 0);
      const totalPaid = trips.reduce((sum, t) => {
        if (t.paymentStatus === 'Paid') return sum + (t.salaryAmount || t.employeePayout || 0);
        return sum + (t.advanceAmount || 0);
      }, 0);
      const totalPending = totalDue;

      return res.json({
        success: true,
        count: trips.length,
        summary: { totalAmount, totalSalary, totalAdvance, totalDue, totalPayout, totalCommission, totalPaid, totalPending },
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
          (t.vehicleNumber && t.vehicleNumber.toLowerCase().includes(s)) ||
          (t.routeName && t.routeName.toLowerCase().includes(s)) ||
          (t.operatorName && t.operatorName.toLowerCase().includes(s)) ||
          (t.clientName && t.clientName.toLowerCase().includes(s)) ||
          (t.clientPhone && t.clientPhone.toLowerCase().includes(s)) ||
          (t.pickupLocation && t.pickupLocation.toLowerCase().includes(s)) ||
          (t.dropLocation && t.dropLocation.toLowerCase().includes(s)) ||
          (t.assignedEmployeeName && t.assignedEmployeeName.toLowerCase().includes(s))
      );
    }

    const totalAmount = filtered.reduce((sum, t) => sum + (t.tripAmount || 0), 0);
    const totalSalary = filtered.reduce((sum, t) => sum + (t.salaryAmount || t.employeePayout || 0), 0);
    const totalAdvance = filtered.reduce((sum, t) => sum + (t.advanceAmount || 0), 0);
    const totalDue = filtered.reduce((sum, t) => {
      if (t.paymentStatus === 'Paid') return sum;
      return sum + (t.dueAmount !== undefined ? t.dueAmount : Math.max(0, (t.salaryAmount || t.employeePayout || 0) - (t.advanceAmount || 0)));
    }, 0);
    const totalPayout = totalSalary;
    const totalCommission = filtered.reduce((sum, t) => sum + (t.commissionAmount || 0), 0);
    const totalPaid = filtered.reduce((sum, t) => {
      if (t.paymentStatus === 'Paid') return sum + (t.salaryAmount || t.employeePayout || 0);
      return sum + (t.advanceAmount || 0);
    }, 0);
    const totalPending = totalDue;

    res.json({
      success: true,
      count: filtered.length,
      summary: { totalAmount, totalSalary, totalAdvance, totalDue, totalPayout, totalCommission, totalPaid, totalPending },
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
      const trip = await Trip.findById(id).populate('assignedEmployee', 'name category mobileNumber employeeId isBlocked');
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

// Helper to validate employee driving license validity (must not be expired or expiring within 2 days)
const validateEmployeeLicenseForTrip = (employee, taskStartDate) => {
  if (!employee) return { valid: true };
  if (employee.isBlocked) {
    return {
      valid: false,
      message: `Cannot assign ${employee.name}: Employee is blocked by administration (${employee.blockReason || 'Disciplinary / Policy restriction'}).`,
    };
  }
  
  const licenseExpiry = employee.documents?.licenseExpiryDate;
  if (!licenseExpiry) return { valid: true };

  const expiryDate = new Date(licenseExpiry);
  if (isNaN(expiryDate.getTime())) return { valid: true };

  const targetDate = taskStartDate ? new Date(taskStartDate) : new Date();
  expiryDate.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffMs = expiryDate.getTime() - targetDate.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const expiryFormatted = expiryDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  if (diffDays < 0) {
    return {
      valid: false,
      message: `Cannot assign ${employee.name}: Driving License expired on ${expiryFormatted}. Task assignment blocked until renewed.`,
    };
  }

  if (diffDays <= 2) {
    return {
      valid: false,
      message: `Cannot assign ${employee.name}: Driving License expires on ${expiryFormatted} (within 2 days validation window). Task assignment restricted.`,
    };
  }

  return { valid: true };
};

const createTrip = async (req, res) => {
  try {
    const { 
      assignedEmployee, 
      tripAmount, 
      employeePayout, 
      salaryAmount,
      advanceAmount,
      advancePaymentMode,
      salaryPaymentMode,
      startDate, 
      endDate, 
      tripDate,
      blockEmployee,
      remarks,
      paymentStatus
    } = req.body;

    const finalSalary = Number(salaryAmount !== undefined ? salaryAmount : employeePayout || 0);
    const finalAdvance = Number(advanceAmount || 0);
    const finalPaymentStatus = paymentStatus || 'Pending';
    const finalDue = finalPaymentStatus === 'Paid' ? 0 : Math.max(0, finalSalary - finalAdvance);
    const commissionAmount = Math.max(0, Number(tripAmount || 0) - finalSalary);

    const sDate = startDate ? new Date(startDate) : tripDate ? new Date(tripDate) : new Date();
    const eDate = endDate ? new Date(endDate) : sDate;
    const diffMs = eDate - sDate;
    const computedDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);
    const totalDays = Number(req.body.totalDays) || computedDays;

    if (store.isMongo()) {
      const employee = await Employee.findById(assignedEmployee);
      if (!employee) return res.status(404).json({ success: false, message: 'Assigned employee not found' });

      // Check if blocked or license invalid
      const licenseCheck = validateEmployeeLicenseForTrip(employee, sDate);
      if (!licenseCheck.valid) {
        return res.status(400).json({ success: false, message: licenseCheck.message });
      }

      // If admin opted to block employee based on task
      if (blockEmployee) {
        employee.isBlocked = true;
        employee.blockReason = remarks || 'Blocked after task review';
        employee.status = 'Blocked';
        await employee.save();
      }

      const trip = new Trip({
        ...req.body,
        assignedEmployeeName: employee.name,
        category: req.body.category || employee.category,
        salaryAmount: finalSalary,
        employeePayout: finalSalary,
        advanceAmount: finalAdvance,
        advancePaymentMode: advancePaymentMode || 'Cash',
        salaryPaymentMode: salaryPaymentMode || 'Online',
        dueAmount: finalDue,
        paymentStatus: finalPaymentStatus,
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
    if (!emp) return res.status(404).json({ success: false, message: 'Assigned employee not found' });

    // Check if blocked or license invalid in fallback store
    const licenseCheck = validateEmployeeLicenseForTrip(emp, sDate);
    if (!licenseCheck.valid) {
      return res.status(400).json({ success: false, message: licenseCheck.message });
    }

    if (blockEmployee) {
      emp.isBlocked = true;
      emp.blockReason = remarks || 'Blocked after task review';
      emp.status = 'Blocked';
    }

    const count = store.data.trips.length + 1;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const newTrip = {
      _id: `trp-${Date.now()}`,
      tripNumber: `TRP-${dateStr}-${String(count).padStart(4, '0')}`,
      ...req.body,
      assignedEmployeeName: emp.name,
      category: req.body.category || emp.category,
      salaryAmount: finalSalary,
      employeePayout: finalSalary,
      advanceAmount: finalAdvance,
      advancePaymentMode: advancePaymentMode || 'Cash',
      salaryPaymentMode: salaryPaymentMode || 'Online',
      dueAmount: finalDue,
      paymentStatus: finalPaymentStatus,
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

    let sDate = payload.startDate ? new Date(payload.startDate) : payload.tripDate ? new Date(payload.tripDate) : null;
    let eDate = payload.endDate ? new Date(payload.endDate) : null;

    if (sDate || eDate) {
      sDate = sDate || new Date();
      eDate = eDate || sDate;
      payload.startDate = sDate;
      payload.endDate = eDate;
      payload.tripDate = sDate;
      if (!payload.totalDays) {
        const diffMs = eDate - sDate;
        payload.totalDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);
      }
    }

    const finalSalary = Number(payload.salaryAmount !== undefined ? payload.salaryAmount : payload.employeePayout !== undefined ? payload.employeePayout : 0);
    const finalAdvance = Number(payload.advanceAmount !== undefined ? payload.advanceAmount : 0);
    payload.salaryAmount = finalSalary;
    payload.employeePayout = finalSalary;
    payload.advanceAmount = finalAdvance;

    if (payload.paymentStatus === 'Paid') {
      payload.dueAmount = 0;
    } else if (payload.salaryAmount !== undefined || payload.advanceAmount !== undefined) {
      payload.dueAmount = Math.max(0, finalSalary - finalAdvance);
    }

    if (payload.tripAmount !== undefined && finalSalary !== undefined) {
      payload.commissionAmount = Math.max(0, Number(payload.tripAmount) - finalSalary);
    }

    if (store.isMongo()) {
      if (payload.assignedEmployee) {
        const emp = await Employee.findById(payload.assignedEmployee);
        if (emp) {
          const licenseCheck = validateEmployeeLicenseForTrip(emp, sDate || new Date());
          if (!licenseCheck.valid) {
            return res.status(400).json({ success: false, message: licenseCheck.message });
          }
          payload.assignedEmployeeName = emp.name;
          if (!payload.category) payload.category = emp.category;
          
          if (payload.blockEmployee) {
            emp.isBlocked = true;
            emp.blockReason = payload.remarks || 'Blocked after task review';
            emp.status = 'Blocked';
            await emp.save();
          }
        }
      }

      const trip = await Trip.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate(
        'assignedEmployee',
        'name category mobileNumber isBlocked'
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
        const licenseCheck = validateEmployeeLicenseForTrip(emp, sDate || updatedObj.startDate || new Date());
        if (!licenseCheck.valid) {
          return res.status(400).json({ success: false, message: licenseCheck.message });
        }
        updatedObj.assignedEmployeeName = emp.name;
        if (!payload.category) updatedObj.category = emp.category;

        if (payload.blockEmployee) {
          emp.isBlocked = true;
          emp.blockReason = payload.remarks || 'Blocked after task review';
          emp.status = 'Blocked';
        }
      }
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

