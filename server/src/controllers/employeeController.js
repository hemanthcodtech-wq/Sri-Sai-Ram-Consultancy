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
          const totalEarnings = trips.reduce((sum, t) => sum + (t.employeePayout || 0), 0);
          const completedTrips = trips.filter((t) => t.tripStatus === 'Completed').length;
          return { ...emp.toObject(), totalTrips, totalEarnings, completedTrips };
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
      const totalEarnings = trips.reduce((sum, t) => sum + (t.employeePayout || 0), 0);
      const completedTrips = trips.filter((t) => t.tripStatus === 'Completed').length;
      return { ...emp, totalTrips, totalEarnings, completedTrips };
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
      const trips = await Trip.find({ assignedEmployee: employee._id }).sort({ tripDate: -1 });

      const totalTrips = trips.length;
      const completedTrips = trips.filter((t) => t.tripStatus === 'Completed').length;
      const totalEarnings = trips.reduce((sum, t) => sum + (t.employeePayout || 0), 0);
      const paidEarnings = trips.filter((t) => t.paymentStatus === 'Paid').reduce((sum, t) => sum + (t.employeePayout || 0), 0);
      const pendingEarnings = totalEarnings - paidEarnings;

      return res.json({
        success: true,
        data: {
          employee,
          trips,
          stats: { totalTrips, completedTrips, totalEarnings, paidEarnings, pendingEarnings },
        },
      });
    }

    const employee = store.data.employees.find((e) => String(e._id) === String(id) || e.employeeId === id);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

    const trips = store.data.trips.filter((t) => String(t.assignedEmployee) === String(employee._id));
    const totalTrips = trips.length;
    const completedTrips = trips.filter((t) => t.tripStatus === 'Completed').length;
    const totalEarnings = trips.reduce((sum, t) => sum + (t.employeePayout || 0), 0);
    const paidEarnings = trips.filter((t) => t.paymentStatus === 'Paid').reduce((sum, t) => sum + (t.employeePayout || 0), 0);
    const pendingEarnings = totalEarnings - paidEarnings;

    res.json({
      success: true,
      data: {
        employee,
        trips,
        stats: { totalTrips, completedTrips, totalEarnings, paidEarnings, pendingEarnings },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    if (store.isMongo()) {
      const employee = new Employee(req.body);
      const saved = await employee.save();
      return res.status(201).json({ success: true, data: saved });
    }

    const prefix = req.body.category === 'Driver' ? 'DRV' : req.body.category === 'Helper' ? 'HLP' : 'CPT';
    const count = store.data.employees.length + 1;
    const newEmployee = {
      _id: `emp-${Date.now()}`,
      employeeId: `${prefix}-${String(count).padStart(4, '0')}`,
      ...req.body,
      createdAt: new Date(),
    };
    store.data.employees.unshift(newEmployee);
    res.status(201).json({ success: true, data: newEmployee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (store.isMongo()) {
      const employee = await Employee.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
      return res.json({ success: true, data: employee });
    }

    const index = store.data.employees.findIndex((e) => String(e._id) === String(id));
    if (index === -1) return res.status(404).json({ success: false, message: 'Employee not found' });

    store.data.employees[index] = { ...store.data.employees[index], ...req.body, updatedAt: new Date() };
    res.json({ success: true, data: store.data.employees[index] });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
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
