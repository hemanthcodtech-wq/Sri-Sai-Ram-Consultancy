const Trip = require('../models/Trip');
const Employee = require('../models/Employee');
const Inquiry = require('../models/Inquiry');
const store = require('../config/store');

const getDashboardStats = async (req, res) => {
  try {
    const { timeRange } = req.query; // 'today', 'week', 'month', 'year', 'all'

    if (store.isMongo()) {
      let dateFilter = {};
      const now = new Date();
      if (timeRange === 'today') {
        dateFilter.tripDate = { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) };
      } else if (timeRange === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);
        dateFilter.tripDate = { $gte: startOfWeek };
      } else if (timeRange === 'month') {
        dateFilter.tripDate = { $gte: new Date(now.getFullYear(), now.getMonth(), 1) };
      } else if (timeRange === 'year') {
        dateFilter.tripDate = { $gte: new Date(now.getFullYear(), 0, 1) };
      }

      const allTrips = await Trip.find(dateFilter);
      const totalRevenue = allTrips.reduce((sum, t) => sum + (t.tripAmount || 0), 0);
      const totalPayout = allTrips.reduce((sum, t) => sum + (t.employeePayout || 0), 0);
      const totalCommission = allTrips.reduce((sum, t) => sum + (t.commissionAmount || 0), 0);
      const paidRevenue = allTrips
        .filter((t) => t.paymentStatus === 'Paid')
        .reduce((sum, t) => sum + (t.tripAmount || 0), 0);
      const pendingRevenue = totalRevenue - paidRevenue;
      const totalTripsCount = allTrips.length;

      const totalEmployees = await Employee.countDocuments();
      const activeEmployees = await Employee.countDocuments({ status: { $in: ['Available', 'On Duty'] } });
      const driversCount = await Employee.countDocuments({ category: 'Driver' });
      const helpersCount = await Employee.countDocuments({ category: 'Helper' });
      const captainsCount = await Employee.countDocuments({ category: 'Captain' });

      const categories = ['Driver', 'Helper', 'Captain'];
      const categoryBreakdown = categories.map((cat) => {
        const catTrips = allTrips.filter((t) => t.category === cat);
        const catRevenue = catTrips.reduce((sum, t) => sum + (t.tripAmount || 0), 0);
        const catPayout = catTrips.reduce((sum, t) => sum + (t.employeePayout || 0), 0);
        const catCommission = catTrips.reduce((sum, t) => sum + (t.commissionAmount || 0), 0);
        return {
          category: cat,
          tripsCount: catTrips.length,
          revenue: catRevenue,
          payout: catPayout,
          commission: catCommission,
        };
      });

      const employees = await Employee.find();
      const topEmployees = await Promise.all(
        employees.map(async (emp) => {
          const empTrips = await Trip.find({ assignedEmployee: emp._id, ...dateFilter });
          const earnings = empTrips.reduce((sum, t) => sum + (t.employeePayout || 0), 0);
          const revenueGenerated = empTrips.reduce((sum, t) => sum + (t.tripAmount || 0), 0);
          return {
            _id: emp._id,
            name: emp.name,
            employeeId: emp.employeeId,
            category: emp.category,
            photo: emp.photo,
            mobileNumber: emp.mobileNumber,
            tripsCount: empTrips.length,
            earnings,
            revenueGenerated,
          };
        })
      );
      topEmployees.sort((a, b) => b.earnings - a.earnings);

      const recentTrips = await Trip.find()
        .populate('assignedEmployee', 'name category mobileNumber photo')
        .sort({ createdAt: -1 })
        .limit(6);

      const newInquiriesCount = await Inquiry.countDocuments({ status: 'New' });
      const totalInquiriesCount = await Inquiry.countDocuments();

      return res.json({
        success: true,
        data: {
          summary: {
            totalRevenue,
            totalPayout,
            totalCommission,
            paidRevenue,
            pendingRevenue,
            totalTripsCount,
            totalEmployees,
            activeEmployees,
            newInquiriesCount,
            totalInquiriesCount,
          },
          countsByCategory: { Driver: driversCount, Helper: helpersCount, Captain: captainsCount },
          categoryBreakdown,
          topEmployees: topEmployees.slice(0, 5),
          recentTrips,
        },
      });
    }

    // Fallback store
    let trips = [...store.data.trips];
    const now = new Date();
    if (timeRange === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      trips = trips.filter((t) => new Date(t.tripDate) >= startOfDay);
    } else if (timeRange === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);
      trips = trips.filter((t) => new Date(t.tripDate) >= startOfWeek);
    } else if (timeRange === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      trips = trips.filter((t) => new Date(t.tripDate) >= startOfMonth);
    } else if (timeRange === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      trips = trips.filter((t) => new Date(t.tripDate) >= startOfYear);
    }

    const totalRevenue = trips.reduce((sum, t) => sum + (t.tripAmount || 0), 0);
    const totalPayout = trips.reduce((sum, t) => sum + (t.employeePayout || 0), 0);
    const totalCommission = trips.reduce((sum, t) => sum + (t.commissionAmount || 0), 0);
    const paidRevenue = trips
      .filter((t) => t.paymentStatus === 'Paid')
      .reduce((sum, t) => sum + (t.tripAmount || 0), 0);
    const pendingRevenue = totalRevenue - paidRevenue;
    const totalTripsCount = trips.length;

    const totalEmployees = store.data.employees.length;
    const activeEmployees = store.data.employees.filter((e) => ['Available', 'On Duty'].includes(e.status)).length;
    const driversCount = store.data.employees.filter((e) => e.category === 'Driver').length;
    const helpersCount = store.data.employees.filter((e) => e.category === 'Helper').length;
    const captainsCount = store.data.employees.filter((e) => e.category === 'Captain').length;

    const categories = ['Driver', 'Helper', 'Captain'];
    const categoryBreakdown = categories.map((cat) => {
      const catTrips = trips.filter((t) => t.category === cat);
      const catRevenue = catTrips.reduce((sum, t) => sum + (t.tripAmount || 0), 0);
      const catPayout = catTrips.reduce((sum, t) => sum + (t.employeePayout || 0), 0);
      const catCommission = catTrips.reduce((sum, t) => sum + (t.commissionAmount || 0), 0);
      return {
        category: cat,
        tripsCount: catTrips.length,
        revenue: catRevenue,
        payout: catPayout,
        commission: catCommission,
      };
    });

    const topEmployees = store.data.employees.map((emp) => {
      const empTrips = trips.filter((t) => String(t.assignedEmployee) === String(emp._id));
      const earnings = empTrips.reduce((sum, t) => sum + (t.employeePayout || 0), 0);
      const revenueGenerated = empTrips.reduce((sum, t) => sum + (t.tripAmount || 0), 0);
      return {
        _id: emp._id,
        name: emp.name,
        employeeId: emp.employeeId,
        category: emp.category,
        photo: emp.photo,
        mobileNumber: emp.mobileNumber,
        tripsCount: empTrips.length,
        earnings,
        revenueGenerated,
      };
    });
    topEmployees.sort((a, b) => b.earnings - a.earnings);

    const recentTrips = store.data.trips.slice(0, 6);
    const newInquiriesCount = store.data.inquiries.filter((i) => i.status === 'New').length;
    const totalInquiriesCount = store.data.inquiries.length;

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalPayout,
          totalCommission,
          paidRevenue,
          pendingRevenue,
          totalTripsCount,
          totalEmployees,
          activeEmployees,
          newInquiriesCount,
          totalInquiriesCount,
        },
        countsByCategory: { Driver: driversCount, Helper: helpersCount, Captain: captainsCount },
        categoryBreakdown,
        topEmployees: topEmployees.slice(0, 5),
        recentTrips,
      },
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats };
