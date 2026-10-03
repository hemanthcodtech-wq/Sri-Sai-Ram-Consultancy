const Employee = require('../models/Employee');
const Trip = require('../models/Trip');
const store = require('../config/store');

const getEmpTripStats = (trip, empId) => {
  const strId = String(empId);
  if (trip.driver1?.employee && String(trip.driver1.employee._id || trip.driver1.employee) === strId) {
    const sal = Number(trip.driver1.salaryAmount || 0);
    const adv = Number(trip.driver1.advanceAmount || 0);
    const isPaid = trip.driver1.paymentStatus === 'Paid' || trip.paymentStatus === 'Paid';
    const due = isPaid ? 0 : (trip.driver1.dueAmount !== undefined ? trip.driver1.dueAmount : Math.max(0, sal - adv));
    const paid = Math.max(0, sal - due);
    return { salary: sal, advance: adv, due, paid };
  }
  if (trip.driver2?.employee && String(trip.driver2.employee._id || trip.driver2.employee) === strId) {
    const sal = Number(trip.driver2.salaryAmount || 0);
    const adv = Number(trip.driver2.advanceAmount || 0);
    const isPaid = trip.driver2.paymentStatus === 'Paid' || trip.paymentStatus === 'Paid';
    const due = isPaid ? 0 : (trip.driver2.dueAmount !== undefined ? trip.driver2.dueAmount : Math.max(0, sal - adv));
    const paid = Math.max(0, sal - due);
    return { salary: sal, advance: adv, due, paid };
  }
  if (trip.helper?.employee && String(trip.helper.employee._id || trip.helper.employee) === strId) {
    const sal = Number(trip.helper.salaryAmount || 0);
    const adv = Number(trip.helper.advanceAmount || 0);
    const isPaid = trip.helper.paymentStatus === 'Paid' || trip.paymentStatus === 'Paid';
    const due = isPaid ? 0 : (trip.helper.dueAmount !== undefined ? trip.helper.dueAmount : Math.max(0, sal - adv));
    const paid = Math.max(0, sal - due);
    return { salary: sal, advance: adv, due, paid };
  }
  const sal = Number(trip.salaryAmount !== undefined ? trip.salaryAmount : trip.employeePayout || 0);
  const adv = Number(trip.advanceAmount || 0);
  const isPaid = trip.paymentStatus === 'Paid';
  const due = isPaid ? 0 : (trip.dueAmount !== undefined ? trip.dueAmount : Math.max(0, sal - adv));
  const paid = Math.max(0, sal - due);
  return { salary: sal, advance: adv, due, paid };
};

const normalizeEmployeeName = (value) => String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
const normalizePhoneNumber = (value) => {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits;
};

const getEmployees = async (req, res) => {
  try {
    const { search, category, status } = req.query;

    if (store.isMongo()) {
      let query = {};
      if (category && category !== 'All') query.category = category;
      if (status && status !== 'All') query.status = status;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { mobileNumber: { $regex: search, $options: 'i' } },
          { employeeId: { $regex: search, $options: 'i' } },
          { 'address.city': { $regex: search, $options: 'i' } },
        ];
      }

      const employees = await Employee.find(query).sort({ createdAt: -1 });
      const employeesWithStats = await Promise.all(
        employees.map(async (emp) => {
          const trips = await Trip.find({
            $or: [
              { assignedEmployee: emp._id },
              { 'driver1.employee': emp._id },
              { 'driver2.employee': emp._id },
              { 'helper.employee': emp._id },
            ],
          });
          const totalTrips = trips.length;
          const totalSalary = trips.reduce((sum, t) => sum + getEmpTripStats(t, emp._id).salary, 0);
          const totalAdvance = trips.reduce((sum, t) => sum + getEmpTripStats(t, emp._id).advance, 0);
          const totalDue = trips.reduce((sum, t) => sum + getEmpTripStats(t, emp._id).due, 0);
          const totalPaid = trips.reduce((sum, t) => sum + getEmpTripStats(t, emp._id).paid, 0);
          const completedTrips = trips.filter((t) => t.tripStatus === 'Completed').length;
          return { ...emp.toObject(), totalTrips, totalSalary, totalAdvance, totalDue, totalPaid, totalEarnings: totalSalary, completedTrips };
        })
      );
      return res.json({ success: true, count: employeesWithStats.length, data: employeesWithStats });
    }

    // Fallback store
    let filtered = [...store.data.employees];
    if (category && category !== 'All') {
      filtered = filtered.filter((e) => e.category === category);
    }
    if (status && status !== 'All') {
      filtered = filtered.filter((e) => e.status === status);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          (e.name && e.name.toLowerCase().includes(s)) ||
          (e.mobileNumber && e.mobileNumber.toLowerCase().includes(s)) ||
          (e.employeeId && e.employeeId.toLowerCase().includes(s)) ||
          (e.address?.city && e.address.city.toLowerCase().includes(s))
      );
    }

    const employeesWithStats = filtered.map((emp) => {
      const trips = store.data.trips.filter(
        (t) =>
          String(t.assignedEmployee) === String(emp._id) ||
          String(t.driver1?.employee) === String(emp._id) ||
          String(t.driver2?.employee) === String(emp._id) ||
          String(t.helper?.employee) === String(emp._id)
      );
      const totalTrips = trips.length;
      const totalSalary = trips.reduce((sum, t) => sum + getEmpTripStats(t, emp._id).salary, 0);
      const totalAdvance = trips.reduce((sum, t) => sum + getEmpTripStats(t, emp._id).advance, 0);
      const totalDue = trips.reduce((sum, t) => sum + getEmpTripStats(t, emp._id).due, 0);
      const totalPaid = trips.reduce((sum, t) => sum + getEmpTripStats(t, emp._id).paid, 0);
      const completedTrips = trips.filter((t) => t.tripStatus === 'Completed').length;
      return { ...emp, totalTrips, totalSalary, totalAdvance, totalDue, totalPaid, totalEarnings: totalSalary, completedTrips };
    });

    res.json({ success: true, count: employeesWithStats.length, data: employeesWithStats });
  } catch (error) {
    console.error('getEmployees error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (store.isMongo()) {
      const employee = await Employee.findById(id);
      if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
      const trips = await Trip.find({
        $or: [
          { assignedEmployee: employee._id },
          { 'driver1.employee': employee._id },
          { 'driver2.employee': employee._id },
          { 'helper.employee': employee._id },
        ],
      })
        .populate('operator', 'name phone company')
        .populate('route', 'fromCity toCity routeName')
        .sort({ tripDate: -1, createdAt: -1 });

      const totalTrips = trips.length;
      const completedTrips = trips.filter((t) => t.tripStatus === 'Completed').length;
      const totalSalary = trips.reduce((sum, t) => sum + getEmpTripStats(t, employee._id).salary, 0);
      const totalAdvance = trips.reduce((sum, t) => sum + getEmpTripStats(t, employee._id).advance, 0);
      const totalDue = trips.reduce((sum, t) => sum + getEmpTripStats(t, employee._id).due, 0);
      const totalPaid = trips.reduce((sum, t) => sum + getEmpTripStats(t, employee._id).paid, 0);

      return res.json({
        success: true,
        data: {
          employee,
          trips,
          stats: {
            totalTrips,
            completedTrips,
            totalSalary,
            totalAdvance,
            totalDue,
            totalPaid,
            totalEarnings: totalSalary,
            paidEarnings: totalPaid,
            pendingEarnings: totalDue,
          },
        },
      });
    }

    const employee = store.data.employees.find((e) => String(e._id) === String(id) || e.employeeId === id);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

    const trips = store.data.trips.filter(
      (t) =>
        String(t.assignedEmployee) === String(employee._id) ||
        String(t.driver1?.employee) === String(employee._id) ||
        String(t.driver2?.employee) === String(employee._id) ||
        String(t.helper?.employee) === String(employee._id)
    );
    const totalTrips = trips.length;
    const completedTrips = trips.filter((t) => t.tripStatus === 'Completed').length;
    const totalSalary = trips.reduce((sum, t) => sum + getEmpTripStats(t, employee._id).salary, 0);
    const totalAdvance = trips.reduce((sum, t) => sum + getEmpTripStats(t, employee._id).advance, 0);
    const totalDue = trips.reduce((sum, t) => sum + getEmpTripStats(t, employee._id).due, 0);
    const totalPaid = trips.reduce((sum, t) => sum + getEmpTripStats(t, employee._id).paid, 0);

    res.json({
      success: true,
      data: {
        employee,
        trips,
        stats: {
          totalTrips,
          completedTrips,
          totalSalary,
          totalAdvance,
          totalDue,
          totalPaid,
          totalEarnings: totalSalary,
          paidEarnings: totalPaid,
          pendingEarnings: totalDue,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { name, mobileNumber, category } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Employee full name is required' });
    }
    if (!mobileNumber || !mobileNumber.trim()) {
      return res.status(400).json({ success: false, message: 'Primary mobile number is required' });
    }

    const candidateName = normalizeEmployeeName(name);
    const candidatePhoneNumbers = [mobileNumber, req.body.alternateNumber]
      .map(normalizePhoneNumber)
      .filter(Boolean);
    if (new Set(candidatePhoneNumbers).size !== candidatePhoneNumbers.length) {
      return res.status(409).json({ success: false, message: 'Primary and alternate phone numbers must be different' });
    }

    const existingEmployees = store.isMongo()
      ? await Employee.find({}, 'name mobileNumber alternateNumber').lean()
      : store.data.employees;
    if (existingEmployees.some((employee) => normalizeEmployeeName(employee.name) === candidateName)) {
      return res.status(409).json({ success: false, message: 'An employee with this name already exists' });
    }

    const duplicatePhone = existingEmployees.some((employee) => {
      const existingPhoneNumbers = [employee.mobileNumber, employee.alternateNumber]
        .map(normalizePhoneNumber)
        .filter(Boolean);
      return candidatePhoneNumbers.some((number) => existingPhoneNumbers.includes(number));
    });
    if (duplicatePhone) {
      return res.status(409).json({ success: false, message: 'A phone number is already assigned to another employee' });
    }

    const payload = {
      ...req.body,
      reference: req.body.reference || { name: '', phone: '', relationship: '' },
      bankDetails: req.body.bankDetails || {
        accountNumber: '',
        accountHolderName: '',
        bankName: '',
        branchName: '',
        ifscCode: '',
      },
      documents: {
        ...(req.body.documents || {}),
        licenseExpiryDate: req.body.documents?.licenseExpiryDate ? new Date(req.body.documents.licenseExpiryDate) : undefined,
      },
    };

    if (store.isMongo()) {
      try {
        const employee = new Employee(payload);
        const saved = await employee.save();
        return res.status(201).json({ success: true, data: saved });
      } catch (mongoErr) {
        // Handle potential duplicate employeeId index collision
        if (mongoErr.code === 11000) {
          const prefix = category === 'Driver' ? 'DRV' : category === 'Helper' ? 'HLP' : 'CPT';
          payload.employeeId = `${prefix}-${Date.now().toString().slice(-4)}`;
          const fallbackEmployee = new Employee(payload);
          const savedFallback = await fallbackEmployee.save();
          return res.status(201).json({ success: true, data: savedFallback });
        }
        throw mongoErr;
      }
    }

    const prefix = payload.category === 'Driver' ? 'DRV' : payload.category === 'Helper' ? 'HLP' : 'CPT';
    const count = store.data.employees.length + 1;
    const newEmployee = {
      _id: `emp-${Date.now()}`,
      employeeId: `${prefix}-${String(count).padStart(4, '0')}`,
      ...payload,
      createdAt: new Date(),
    };
    store.data.employees.unshift(newEmployee);
    res.status(201).json({ success: true, data: newEmployee });
  } catch (error) {
    console.error('createEmployee error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to save employee profile' });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const payload = {
      ...req.body,
    };
    if (req.body.documents && req.body.documents.licenseExpiryDate) {
      payload.documents = {
        ...req.body.documents,
        licenseExpiryDate: new Date(req.body.documents.licenseExpiryDate),
      };
    }

    if (store.isMongo()) {
      const employee = await Employee.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
      if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
      return res.json({ success: true, data: employee });
    }

    const index = store.data.employees.findIndex((e) => String(e._id) === String(id));
    if (index === -1) return res.status(404).json({ success: false, message: 'Employee not found' });

    store.data.employees[index] = { ...store.data.employees[index], ...payload, updatedAt: new Date() };
    res.json({ success: true, data: store.data.employees[index] });
  } catch (error) {
    console.error('updateEmployee error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to update employee profile' });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (store.isMongo()) {
      const employee = await Employee.findById(id);
      if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
      await Trip.deleteMany({ assignedEmployee: employee._id });
      await employee.deleteOne();
      return res.json({ success: true, message: 'Employee removed successfully' });
    }

    store.data.employees = store.data.employees.filter((e) => String(e._id) !== String(id));
    store.data.trips = store.data.trips.filter((t) => String(t.assignedEmployee) !== String(id));
    res.json({ success: true, message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const payEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, date, paymentType, mode, notes } = req.body;
    const paymentAmount = Number(amount);

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payment amount is required' });
    }

    if (!store.isMongo()) {
      return res.status(400).json({ success: false, message: 'Not supported in fallback store mode' });
    }

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

    // Add to history
    employee.paymentHistory.push({
      amount: paymentAmount,
      date: date || new Date(),
      paymentType: paymentType || 'Bata',
      mode: mode || 'Cash',
      notes: notes || '',
    });
    await employee.save();

    // Find pending trips for this employee
    const trips = await Trip.find({
      $or: [
        { assignedEmployee: employee._id },
        { 'driver1.employee': employee._id },
        { 'driver2.employee': employee._id },
        { 'helper.employee': employee._id },
      ],
    }).sort({ tripDate: 1 });

    let remainingAmount = paymentAmount;

    for (let trip of trips) {
      if (remainingAmount <= 0) break;

      const strId = String(employee._id);
      let roleDue = getEmpTripStats(trip, strId).due;
      let rolePrefix = '';

      if (trip.driver1?.employee && String(trip.driver1.employee) === strId) {
        rolePrefix = 'driver1';
      } else if (trip.driver2?.employee && String(trip.driver2.employee) === strId) {
        rolePrefix = 'driver2';
      } else if (trip.helper?.employee && String(trip.helper.employee) === strId) {
        rolePrefix = 'helper';
      } else if (String(trip.assignedEmployee) === strId) {
        rolePrefix = 'main';
      }

      if (roleDue > 0) {
        let deduction = Math.min(roleDue, remainingAmount);
        remainingAmount -= deduction;
        
        let newDue = roleDue - deduction;
        let newStatus = newDue <= 0 ? 'Paid' : 'Partial';

        if (rolePrefix === 'main') {
          trip.paidAmount = Math.max(0, Number(trip.salaryAmount || trip.employeePayout || 0) - newDue);
          trip.dueAmount = newDue;
          trip.paymentStatus = newStatus;
        } else {
          trip[rolePrefix].paidAmount = Math.max(0, Number(trip[rolePrefix].salaryAmount || 0) - newDue);
          trip[rolePrefix].dueAmount = newDue;
          trip[rolePrefix].paymentStatus = newStatus;

          // Recalculate the top-level dueAmount as sum of all crew member dues
          const d1Due = trip.driver1?.employee ? (trip.driver1.dueAmount || 0) : 0;
          const d2Due = trip.driver2?.employee ? (trip.driver2.dueAmount || 0) : 0;
          const helperDue = trip.helper?.employee ? (trip.helper.dueAmount || 0) : 0;
          const totalCrewDue = d1Due + d2Due + helperDue;
          trip.dueAmount = totalCrewDue;
          trip.paidAmount = Math.max(0, Number(trip.salaryAmount || trip.employeePayout || 0) - totalCrewDue);
          trip.paymentStatus = totalCrewDue <= 0 ? 'Paid' : 'Partial';
        }
        await trip.save();
      }
    }

    res.json({ success: true, message: 'Payment recorded successfully', remainingAmount });
  } catch (error) {
    console.error('payEmployee error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEmployeePayment = async (req, res) => {
  try {
    const { id, paymentId } = req.params;
    const employee = store.isMongo()
      ? await Employee.findById(id)
      : store.data.employees.find((item) => String(item._id) === String(id));
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

    if (store.isMongo()) {
      const payment = employee.paymentHistory.id(paymentId);
      if (!payment) return res.status(404).json({ success: false, message: 'Payment record not found' });
      payment.deleteOne();
      await employee.save();
    } else {
      const paymentIndex = (employee.paymentHistory || []).findIndex((payment) => String(payment._id) === String(paymentId));
      if (paymentIndex === -1) return res.status(404).json({ success: false, message: 'Payment record not found' });
      employee.paymentHistory.splice(paymentIndex, 1);
    }

    return res.json({ success: true, message: 'Payment record deleted successfully' });
  } catch (error) {
    console.error('deleteEmployeePayment error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEmployeeTaskSettlement = async (req, res) => {
  try {
    const { id, tripId } = req.params;
    const employee = store.isMongo()
      ? await Employee.findById(id)
      : store.data.employees.find((item) => String(item._id) === String(id));
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

    const trip = store.isMongo()
      ? await Trip.findById(tripId)
      : store.data.trips.find((item) => String(item._id) === String(tripId));
    if (!trip) return res.status(404).json({ success: false, message: 'Task not found' });

    const employeeId = String(employee._id);
    const crewRole = ['driver1', 'driver2', 'helper'].find(
      (role) => trip[role]?.employee && String(trip[role].employee._id || trip[role].employee) === employeeId
    );

    if (crewRole) {
      const member = trip[crewRole];
      const salary = Number(member.salaryAmount || 0);
      const advance = Number(member.advanceAmount || 0);
      member.dueAmount = Math.max(0, salary - advance);
      member.paidAmount = advance;
      member.paymentStatus = member.dueAmount === 0 ? 'Paid' : 'Pending';

      const crew = ['driver1', 'driver2', 'helper'].filter((role) => trip[role]?.employee);
      const totalSalary = crew.reduce((sum, role) => sum + Number(trip[role].salaryAmount || 0), 0);
      const totalAdvance = crew.reduce((sum, role) => sum + Number(trip[role].advanceAmount || 0), 0);
      const totalDue = crew.reduce((sum, role) => sum + Number(trip[role].dueAmount || 0), 0);
      trip.dueAmount = totalDue;
      trip.paidAmount = Math.max(0, totalSalary - totalDue);
      trip.paymentStatus = totalDue === 0
        ? 'Paid'
        : totalDue >= totalSalary - totalAdvance
          ? 'Pending'
          : 'Partial';
    } else if (String(trip.assignedEmployee?._id || trip.assignedEmployee) === employeeId) {
      const salary = Number(trip.salaryAmount || trip.employeePayout || 0);
      const advance = Number(trip.advanceAmount || 0);
      trip.dueAmount = Math.max(0, salary - advance);
      trip.paidAmount = advance;
      trip.paymentStatus = trip.dueAmount === 0 ? 'Paid' : 'Pending';
    } else {
      return res.status(404).json({ success: false, message: 'Task is not assigned to this employee' });
    }

    if (store.isMongo()) await trip.save();
    return res.json({ success: true, message: 'Task settlement deleted successfully' });
  } catch (error) {
    console.error('deleteEmployeeTaskSettlement error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  payEmployee,
  deleteEmployeePayment,
  deleteEmployeeTaskSettlement,
};
