const Employee = require('../models/Employee');
const Trip = require('../models/Trip');
const store = require('../config/store');

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
          const trips = await Trip.find({ assignedEmployee: emp._id });
          const totalTrips = trips.length;
          const totalSalary = trips.reduce((sum, t) => sum + (t.salaryAmount || t.employeePayout || 0), 0);
          const totalAdvance = trips.reduce((sum, t) => sum + (t.advanceAmount || 0), 0);
          const totalDue = trips.reduce((sum, t) => {
            if (t.paymentStatus === 'Paid') return sum;
            return sum + (t.dueAmount !== undefined ? t.dueAmount : Math.max(0, (t.salaryAmount || t.employeePayout || 0) - (t.advanceAmount || 0)));
          }, 0);
          const totalPaid = trips.reduce((sum, t) => {
            if (t.paymentStatus === 'Paid') return sum + (t.salaryAmount || t.employeePayout || 0);
            return sum + (t.advanceAmount || 0);
          }, 0);
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
      const trips = store.data.trips.filter((t) => String(t.assignedEmployee) === String(emp._id));
      const totalTrips = trips.length;
      const totalSalary = trips.reduce((sum, t) => sum + (t.salaryAmount || t.employeePayout || 0), 0);
      const totalAdvance = trips.reduce((sum, t) => sum + (t.advanceAmount || 0), 0);
      const totalDue = trips.reduce((sum, t) => {
        if (t.paymentStatus === 'Paid') return sum;
        return sum + (t.dueAmount !== undefined ? t.dueAmount : Math.max(0, (t.salaryAmount || t.employeePayout || 0) - (t.advanceAmount || 0)));
      }, 0);
      const totalPaid = trips.reduce((sum, t) => {
        if (t.paymentStatus === 'Paid') return sum + (t.salaryAmount || t.employeePayout || 0);
        return sum + (t.advanceAmount || 0);
      }, 0);
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
      const trips = await Trip.find({ assignedEmployee: employee._id })
        .populate('operator', 'name phone company')
        .populate('route', 'fromCity toCity routeName')
        .sort({ tripDate: -1, createdAt: -1 });

      const totalTrips = trips.length;
      const completedTrips = trips.filter((t) => t.tripStatus === 'Completed').length;
      const totalSalary = trips.reduce((sum, t) => sum + (t.salaryAmount || t.employeePayout || 0), 0);
      const totalAdvance = trips.reduce((sum, t) => sum + (t.advanceAmount || 0), 0);
      const totalDue = trips.reduce((sum, t) => {
        if (t.paymentStatus === 'Paid') return sum;
        return sum + (t.dueAmount !== undefined ? t.dueAmount : Math.max(0, (t.salaryAmount || t.employeePayout || 0) - (t.advanceAmount || 0)));
      }, 0);
      const totalPaid = trips.reduce((sum, t) => {
        if (t.paymentStatus === 'Paid') return sum + (t.salaryAmount || t.employeePayout || 0);
        return sum + (t.advanceAmount || 0);
      }, 0);

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

    const trips = store.data.trips.filter((t) => String(t.assignedEmployee) === String(employee._id));
    const totalTrips = trips.length;
    const completedTrips = trips.filter((t) => t.tripStatus === 'Completed').length;
    const totalSalary = trips.reduce((sum, t) => sum + (t.salaryAmount || t.employeePayout || 0), 0);
    const totalAdvance = trips.reduce((sum, t) => sum + (t.advanceAmount || 0), 0);
    const totalDue = trips.reduce((sum, t) => {
      if (t.paymentStatus === 'Paid') return sum;
      return sum + (t.dueAmount !== undefined ? t.dueAmount : Math.max(0, (t.salaryAmount || t.employeePayout || 0) - (t.advanceAmount || 0)));
    }, 0);
    const totalPaid = trips.reduce((sum, t) => {
      if (t.paymentStatus === 'Paid') return sum + (t.salaryAmount || t.employeePayout || 0);
      return sum + (t.advanceAmount || 0);
    }, 0);

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

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
