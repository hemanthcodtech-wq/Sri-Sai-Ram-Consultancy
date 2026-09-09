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
      if (employeeId && employeeId !== 'All') {
        query.$or = [
          { assignedEmployee: employeeId },
          { 'driver1.employee': employeeId },
          { 'driver2.employee': employeeId },
          { 'helper.employee': employeeId },
        ];
      }

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
        const sRegex = { $regex: search, $options: 'i' };
        query.$or = [
          { tripNumber: sRegex },
          { vehicleNumber: sRegex },
          { routeName: sRegex },
          { operatorName: sRegex },
          { clientName: sRegex },
          { clientPhone: sRegex },
          { pickupLocation: sRegex },
          { dropLocation: sRegex },
          { assignedEmployeeName: sRegex },
          { 'driver1.employeeName': sRegex },
          { 'driver2.employeeName': sRegex },
          { 'helper.employeeName': sRegex },
        ];
      }

      const trips = await Trip.find(query)
        .populate('assignedEmployee', 'name category mobileNumber photo employeeId isBlocked blockReason')
        .populate('driver1.employee', 'name category mobileNumber photo employeeId isBlocked blockReason')
        .populate('driver2.employee', 'name category mobileNumber photo employeeId isBlocked blockReason')
        .populate('helper.employee', 'name category mobileNumber photo employeeId isBlocked blockReason')
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
      filtered = filtered.filter(
        (t) =>
          String(t.assignedEmployee) === String(employeeId) ||
          String(t.driver1?.employee) === String(employeeId) ||
          String(t.driver2?.employee) === String(employeeId) ||
          String(t.helper?.employee) === String(employeeId)
      );
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
          (t.assignedEmployeeName && t.assignedEmployeeName.toLowerCase().includes(s)) ||
          (t.driver1?.employeeName && t.driver1.employeeName.toLowerCase().includes(s)) ||
          (t.driver2?.employeeName && t.driver2.employeeName.toLowerCase().includes(s)) ||
          (t.helper?.employeeName && t.helper.employeeName.toLowerCase().includes(s))
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
      const trip = await Trip.findById(id)
        .populate('assignedEmployee', 'name category mobileNumber employeeId isBlocked')
        .populate('driver1.employee', 'name category mobileNumber employeeId isBlocked')
        .populate('driver2.employee', 'name category mobileNumber employeeId isBlocked')
        .populate('helper.employee', 'name category mobileNumber employeeId isBlocked');
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
  if (employee.category === 'Helper') {
    return { valid: true };
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
      driver1,
      driver2,
      helper,
      tripAmount, 
      employeePayout, 
      salaryAmount,
      advanceAmount,
      advancePaymentMode,
      salaryPaymentMode,
      startDate, 
      endDate, 
      tripDate,
      remarks,
      paymentStatus,
      tripStatus
    } = req.body;

    const sDate = startDate ? new Date(startDate) : tripDate ? new Date(tripDate) : new Date();
    const eDate = endDate ? new Date(endDate) : sDate;
    const diffMs = eDate - sDate;
    const computedDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);
    const totalDays = Number(req.body.totalDays) || computedDays;

    // Resolve crew members data
    const crewData = {
      driver1: driver1 ? { ...driver1 } : undefined,
      driver2: driver2 ? { ...driver2 } : undefined,
      helper: helper ? { ...helper } : undefined,
    };

    let primaryEmpId = assignedEmployee;
    if (!primaryEmpId && crewData.driver1?.employee) {
      primaryEmpId = crewData.driver1.employee;
    }

    if (store.isMongo()) {
      let primaryEmp = null;
      if (primaryEmpId) {
        primaryEmp = await Employee.findById(primaryEmpId);
      }

      // Validate crew members
      if (crewData.driver1?.employee) {
        const emp1 = await Employee.findById(crewData.driver1.employee);
        if (!emp1) return res.status(404).json({ success: false, message: 'Driver 1 employee record not found' });
        const check = validateEmployeeLicenseForTrip(emp1, sDate);
        if (!check.valid) return res.status(400).json({ success: false, message: check.message });
        crewData.driver1.employeeName = emp1.name;
        crewData.driver1.category = emp1.category;
        crewData.driver1.salaryAmount = Number(crewData.driver1.salaryAmount || 0);
        crewData.driver1.advanceAmount = Number(crewData.driver1.advanceAmount || 0);
        crewData.driver1.dueAmount = crewData.driver1.paymentStatus === 'Paid' ? 0 : Math.max(0, crewData.driver1.salaryAmount - crewData.driver1.advanceAmount);
        if (!primaryEmp) primaryEmp = emp1;
      }

      if (crewData.driver2?.employee) {
        const emp2 = await Employee.findById(crewData.driver2.employee);
        if (!emp2) return res.status(404).json({ success: false, message: 'Driver 2 employee record not found' });
        const check = validateEmployeeLicenseForTrip(emp2, sDate);
        if (!check.valid) return res.status(400).json({ success: false, message: check.message });
        crewData.driver2.employeeName = emp2.name;
        crewData.driver2.category = emp2.category;
        crewData.driver2.salaryAmount = Number(crewData.driver2.salaryAmount || 0);
        crewData.driver2.advanceAmount = Number(crewData.driver2.advanceAmount || 0);
        crewData.driver2.dueAmount = crewData.driver2.paymentStatus === 'Paid' ? 0 : Math.max(0, crewData.driver2.salaryAmount - crewData.driver2.advanceAmount);
      }

      if (crewData.helper?.employee) {
        const empH = await Employee.findById(crewData.helper.employee);
        if (!empH) return res.status(404).json({ success: false, message: 'Helper employee record not found' });
        const check = validateEmployeeLicenseForTrip(empH, sDate);
        if (!check.valid) return res.status(400).json({ success: false, message: check.message });
        crewData.helper.employeeName = empH.name;
        crewData.helper.category = empH.category;
        crewData.helper.salaryAmount = Number(crewData.helper.salaryAmount || 0);
        crewData.helper.advanceAmount = Number(crewData.helper.advanceAmount || 0);
        crewData.helper.dueAmount = crewData.helper.paymentStatus === 'Paid' ? 0 : Math.max(0, crewData.helper.salaryAmount - crewData.helper.advanceAmount);
      }

      if (!primaryEmp && !crewData.driver1?.employee) {
        return res.status(400).json({ success: false, message: 'Please assign at least Driver 1 or an employee to the task.' });
      }

      const totalCrewSalary = (Number(crewData.driver1?.salaryAmount || 0) + Number(crewData.driver2?.salaryAmount || 0) + Number(crewData.helper?.salaryAmount || 0));
      const totalCrewAdvance = (Number(crewData.driver1?.advanceAmount || 0) + Number(crewData.driver2?.advanceAmount || 0) + Number(crewData.helper?.advanceAmount || 0));

      const finalSalary = totalCrewSalary > 0 ? totalCrewSalary : Number(salaryAmount !== undefined ? salaryAmount : employeePayout || 0);
      const finalAdvance = totalCrewSalary > 0 ? totalCrewAdvance : Number(advanceAmount || 0);
      const finalPaymentStatus = paymentStatus || 'Pending';
      const finalDue = finalPaymentStatus === 'Paid' ? 0 : Math.max(0, finalSalary - finalAdvance);
      const commissionAmount = Math.max(0, Number(tripAmount || 0) - finalSalary);

      const trip = new Trip({
        ...req.body,
        assignedEmployee: primaryEmp ? primaryEmp._id : crewData.driver1?.employee,
        assignedEmployeeName: primaryEmp ? primaryEmp.name : crewData.driver1?.employeeName || 'Staff',
        category: req.body.category || (primaryEmp ? primaryEmp.category : 'Driver'),
        driver1: crewData.driver1,
        driver2: crewData.driver2,
        helper: crewData.helper,
        salaryAmount: finalSalary,
        employeePayout: finalSalary,
        advanceAmount: finalAdvance,
        advancePaymentMode: advancePaymentMode || 'Cash',
        salaryPaymentMode: salaryPaymentMode || 'Online',
        dueAmount: finalDue,
        paymentStatus: finalPaymentStatus,
        tripStatus: tripStatus || 'Scheduled',
        commissionAmount,
        startDate: sDate,
        endDate: eDate,
        totalDays,
        tripDate: sDate,
      });

      const saved = await trip.save();
      return res.status(201).json({ success: true, data: saved });
    }

    // Fallback store
    let primaryEmp = null;
    if (primaryEmpId) {
      primaryEmp = store.data.employees.find((e) => String(e._id) === String(primaryEmpId));
    }

    if (crewData.driver1?.employee) {
      const emp1 = store.data.employees.find((e) => String(e._id) === String(crewData.driver1.employee));
      if (!emp1) return res.status(404).json({ success: false, message: 'Driver 1 employee record not found' });
      const check = validateEmployeeLicenseForTrip(emp1, sDate);
      if (!check.valid) return res.status(400).json({ success: false, message: check.message });
      crewData.driver1.employeeName = emp1.name;
      crewData.driver1.category = emp1.category;
      crewData.driver1.salaryAmount = Number(crewData.driver1.salaryAmount || 0);
      crewData.driver1.advanceAmount = Number(crewData.driver1.advanceAmount || 0);
      crewData.driver1.dueAmount = crewData.driver1.paymentStatus === 'Paid' ? 0 : Math.max(0, crewData.driver1.salaryAmount - crewData.driver1.advanceAmount);
      if (!primaryEmp) primaryEmp = emp1;
    }

    if (crewData.driver2?.employee) {
      const emp2 = store.data.employees.find((e) => String(e._id) === String(crewData.driver2.employee));
      if (!emp2) return res.status(404).json({ success: false, message: 'Driver 2 employee record not found' });
      const check = validateEmployeeLicenseForTrip(emp2, sDate);
      if (!check.valid) return res.status(400).json({ success: false, message: check.message });
      crewData.driver2.employeeName = emp2.name;
      crewData.driver2.category = emp2.category;
      crewData.driver2.salaryAmount = Number(crewData.driver2.salaryAmount || 0);
      crewData.driver2.advanceAmount = Number(crewData.driver2.advanceAmount || 0);
      crewData.driver2.dueAmount = crewData.driver2.paymentStatus === 'Paid' ? 0 : Math.max(0, crewData.driver2.salaryAmount - crewData.driver2.advanceAmount);
    }

    if (crewData.helper?.employee) {
      const empH = store.data.employees.find((e) => String(e._id) === String(crewData.helper.employee));
      if (!empH) return res.status(404).json({ success: false, message: 'Helper employee record not found' });
      const check = validateEmployeeLicenseForTrip(empH, sDate);
      if (!check.valid) return res.status(400).json({ success: false, message: check.message });
      crewData.helper.employeeName = empH.name;
      crewData.helper.category = empH.category;
      crewData.helper.salaryAmount = Number(crewData.helper.salaryAmount || 0);
      crewData.helper.advanceAmount = Number(crewData.helper.advanceAmount || 0);
      crewData.helper.dueAmount = crewData.helper.paymentStatus === 'Paid' ? 0 : Math.max(0, crewData.helper.salaryAmount - crewData.helper.advanceAmount);
    }

    if (!primaryEmp && !crewData.driver1?.employee) {
      return res.status(400).json({ success: false, message: 'Please assign at least Driver 1 or an employee to the task.' });
    }

    const totalCrewSalary = (Number(crewData.driver1?.salaryAmount || 0) + Number(crewData.driver2?.salaryAmount || 0) + Number(crewData.helper?.salaryAmount || 0));
    const totalCrewAdvance = (Number(crewData.driver1?.advanceAmount || 0) + Number(crewData.driver2?.advanceAmount || 0) + Number(crewData.helper?.advanceAmount || 0));

    const finalSalary = totalCrewSalary > 0 ? totalCrewSalary : Number(salaryAmount !== undefined ? salaryAmount : employeePayout || 0);
    const finalAdvance = totalCrewSalary > 0 ? totalCrewAdvance : Number(advanceAmount || 0);
    const finalPaymentStatus = paymentStatus || 'Pending';
    const finalDue = finalPaymentStatus === 'Paid' ? 0 : Math.max(0, finalSalary - finalAdvance);
    const commissionAmount = Math.max(0, Number(tripAmount || 0) - finalSalary);

    const count = store.data.trips.length + 1;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const newTrip = {
      _id: `trp-${Date.now()}`,
      tripNumber: `TRP-${dateStr}-${String(count).padStart(4, '0')}`,
      ...req.body,
      assignedEmployee: primaryEmp ? primaryEmp._id : crewData.driver1?.employee,
      assignedEmployeeName: primaryEmp ? primaryEmp.name : crewData.driver1?.employeeName || 'Staff',
      category: req.body.category || (primaryEmp ? primaryEmp.category : 'Driver'),
      driver1: crewData.driver1,
      driver2: crewData.driver2,
      helper: crewData.helper,
      salaryAmount: finalSalary,
      employeePayout: finalSalary,
      advanceAmount: finalAdvance,
      advancePaymentMode: advancePaymentMode || 'Cash',
      salaryPaymentMode: salaryPaymentMode || 'Online',
      dueAmount: finalDue,
      paymentStatus: finalPaymentStatus,
      tripStatus: tripStatus || 'Scheduled',
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

    // Process crew members
    if (payload.driver1) {
      payload.driver1.salaryAmount = Number(payload.driver1.salaryAmount || 0);
      payload.driver1.advanceAmount = Number(payload.driver1.advanceAmount || 0);
      payload.driver1.dueAmount = payload.driver1.paymentStatus === 'Paid' ? 0 : Math.max(0, payload.driver1.salaryAmount - payload.driver1.advanceAmount);
    }
    if (payload.driver2) {
      payload.driver2.salaryAmount = Number(payload.driver2.salaryAmount || 0);
      payload.driver2.advanceAmount = Number(payload.driver2.advanceAmount || 0);
      payload.driver2.dueAmount = payload.driver2.paymentStatus === 'Paid' ? 0 : Math.max(0, payload.driver2.salaryAmount - payload.driver2.advanceAmount);
    }
    if (payload.helper) {
      payload.helper.salaryAmount = Number(payload.helper.salaryAmount || 0);
      payload.helper.advanceAmount = Number(payload.helper.advanceAmount || 0);
      payload.helper.dueAmount = payload.helper.paymentStatus === 'Paid' ? 0 : Math.max(0, payload.helper.salaryAmount - payload.helper.advanceAmount);
    }

    const totalCrewSalary = (Number(payload.driver1?.salaryAmount || 0) + Number(payload.driver2?.salaryAmount || 0) + Number(payload.helper?.salaryAmount || 0));
    const totalCrewAdvance = (Number(payload.driver1?.advanceAmount || 0) + Number(payload.driver2?.advanceAmount || 0) + Number(payload.helper?.advanceAmount || 0));

    let finalSalary = totalCrewSalary > 0
      ? totalCrewSalary
      : Number(payload.salaryAmount !== undefined ? payload.salaryAmount : payload.employeePayout !== undefined ? payload.employeePayout : 0);
    let finalAdvance = totalCrewSalary > 0
      ? totalCrewAdvance
      : Number(payload.advanceAmount !== undefined ? payload.advanceAmount : 0);

    payload.salaryAmount = finalSalary;
    payload.employeePayout = finalSalary;
    payload.advanceAmount = finalAdvance;

    if (payload.paymentStatus === 'Paid') {
      payload.dueAmount = 0;
    } else {
      payload.dueAmount = Math.max(0, finalSalary - finalAdvance);
    }

    if (payload.tripAmount !== undefined && finalSalary !== undefined) {
      payload.commissionAmount = Math.max(0, Number(payload.tripAmount) - finalSalary);
    }

    if (store.isMongo()) {
      if (payload.driver1?.employee) {
        const emp1 = await Employee.findById(payload.driver1.employee);
        if (emp1) {
          payload.driver1.employeeName = emp1.name;
          payload.driver1.category = emp1.category;
          if (!payload.assignedEmployee) payload.assignedEmployee = emp1._id;
          if (!payload.assignedEmployeeName) payload.assignedEmployeeName = emp1.name;
        }
      }
      if (payload.driver2?.employee) {
        const emp2 = await Employee.findById(payload.driver2.employee);
        if (emp2) {
          payload.driver2.employeeName = emp2.name;
          payload.driver2.category = emp2.category;
        }
      }
      if (payload.helper?.employee) {
        const empH = await Employee.findById(payload.helper.employee);
        if (empH) {
          payload.helper.employeeName = empH.name;
          payload.helper.category = empH.category;
        }
      }

      if (payload.assignedEmployee) {
        const emp = await Employee.findById(payload.assignedEmployee);
        if (emp) {
          payload.assignedEmployeeName = emp.name;
          if (!payload.category) payload.category = emp.category;
        }
      }

      const trip = await Trip.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
        .populate('assignedEmployee', 'name category mobileNumber isBlocked')
        .populate('driver1.employee', 'name category mobileNumber isBlocked')
        .populate('driver2.employee', 'name category mobileNumber isBlocked')
        .populate('helper.employee', 'name category mobileNumber isBlocked');
      if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
      return res.json({ success: true, data: trip });
    }

    const index = store.data.trips.findIndex((t) => String(t._id) === String(id));
    if (index === -1) return res.status(404).json({ success: false, message: 'Trip not found' });

    let updatedObj = { ...store.data.trips[index], ...payload, updatedAt: new Date() };
    if (payload.driver1?.employee) {
      const emp1 = store.data.employees.find((e) => String(e._id) === String(payload.driver1.employee));
      if (emp1) {
        updatedObj.driver1 = { ...updatedObj.driver1, employeeName: emp1.name, category: emp1.category };
        if (!updatedObj.assignedEmployee) updatedObj.assignedEmployee = emp1._id;
        if (!updatedObj.assignedEmployeeName) updatedObj.assignedEmployeeName = emp1.name;
      }
    }
    if (payload.driver2?.employee) {
      const emp2 = store.data.employees.find((e) => String(e._id) === String(payload.driver2.employee));
      if (emp2) {
        updatedObj.driver2 = { ...updatedObj.driver2, employeeName: emp2.name, category: emp2.category };
      }
    }
    if (payload.helper?.employee) {
      const empH = store.data.employees.find((e) => String(e._id) === String(payload.helper.employee));
      if (empH) {
        updatedObj.helper = { ...updatedObj.helper, employeeName: empH.name, category: empH.category };
      }
    }

    if (payload.assignedEmployee) {
      const emp = store.data.employees.find((e) => String(e._id) === String(payload.assignedEmployee));
      if (emp) {
        updatedObj.assignedEmployeeName = emp.name;
        if (!payload.category) updatedObj.category = emp.category;
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

