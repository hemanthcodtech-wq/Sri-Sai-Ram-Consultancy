import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Car, 
  Truck, 
  Compass, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  Plus,
  UserPlus,
  ClipboardList,
  ShieldCheck,
  X
} from 'lucide-react';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';
import logoImg from '../../assets/logo.png';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // 'today', 'week', 'month', 'year', 'all'
  const navigate = useNavigate();

  // Quick Add Employee Modal State directly in Dashboard
  const [isAddEmpModalOpen, setIsAddEmpModalOpen] = useState(false);
  const [empFormData, setEmpFormData] = useState({
    name: '',
    mobileNumber: '',
    category: 'Driver',
    experience: '2 Years',
    dailyRate: 800,
    monthlyRate: 22000,
    status: 'Available',
  });
  const [savingEmp, setSavingEmp] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/dashboard/stats?timeRange=${timeRange}`);
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const handleQuickAddEmployee = async (e) => {
    e.preventDefault();
    setSavingEmp(true);
    try {
      await api.post('/employees', empFormData);
      setIsAddEmpModalOpen(false);
      setEmpFormData({
        name: '',
        mobileNumber: '',
        category: 'Driver',
        experience: '2 Years',
        dailyRate: 800,
        monthlyRate: 22000,
        status: 'Available',
      });
      fetchStats();
    } catch (err) {
      console.error('Error adding employee:', err);
      alert('Error creating employee. Please check details.');
    } finally {
      setSavingEmp(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <>
      <SEOHead title="Earnings & Operations Dashboard - SSRC Admin" />

      <div className="space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Central Operations Dashboard</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                Live System
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Overview of SSRC staff deployments, company earnings, and client inquiries.
            </p>
          </div>

          {/* Time Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-sm self-start md:self-auto">
            {[
              { id: 'today', label: 'Today' },
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' },
              { id: 'year', label: 'This Year' },
              { id: 'all', label: 'All Time' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeRange === t.id
                    ? 'bg-gradient-to-r from-[#C8960C] to-[#E8A900] text-white shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-[#F5EFE6]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* QUICK MANAGEMENT ACTION HUB (LIGHT LUXURY MATCHING HOME) */}
        <div className="bg-gradient-to-br from-[#FFFDF8] via-[#FFF8EB] to-[#FFFDF8] rounded-3xl p-5 sm:p-6 text-slate-800 border-2 border-[#EAD5AE] shadow-md space-y-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EEDCC0] pb-4">
            <div className="flex items-center gap-3">
              <div className="h-11 px-2.5 py-1 rounded-xl bg-white border border-[#E0D0B8] shadow-xs flex items-center justify-center shrink-0">
                <img src={logoImg} alt="Sri Sai Ram Consultancy" className="h-8 w-auto max-w-[150px] object-contain" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#081C36] text-base">Quick Operations Hub</h3>
                <p className="text-xs text-slate-500">Fast shortcuts for staff onboarding, task logging, and inquiry responses.</p>
              </div>
            </div>

            <span className="text-[11px] text-[#A66E00] font-black bg-amber-50 px-3 py-1 rounded-full border border-amber-300 shadow-xs">
              ⚡ Instant Actions Available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Quick Action 1: Add Employee */}
            <button
              onClick={() => setIsAddEmpModalOpen(true)}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-[#C8960C] via-[#E5AB00] to-[#C8960C] hover:from-[#B88500] hover:to-[#D49E00] text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>+ Onboard Employee</span>
            </button>

            {/* Quick Action 2: Log Task */}
            <Link
              to="/admin/tasks"
              className="p-3.5 rounded-2xl bg-white hover:bg-[#FDF9EE] text-[#081C36] font-bold text-xs border border-[#E0D0B8] hover:border-[#C8960C] shadow-xs transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-center"
            >
              <ClipboardList className="w-4 h-4 text-[#C8960C]" />
              <span>+ Log New Task</span>
            </Link>

            {/* Quick Action 3: Website Inquiries */}
            <Link
              to="/admin/inquiries"
              className="p-3.5 rounded-2xl bg-white hover:bg-[#FDF9EE] text-[#081C36] font-bold text-xs border border-[#E0D0B8] hover:border-[#C8960C] shadow-xs transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-center"
            >
              <Users className="w-4 h-4 text-[#C8960C]" />
              <span>📥 View Inquiries</span>
            </Link>

            {/* Quick Action 4: Employee Biodata List */}
            <Link
              to="/admin/employees"
              className="p-3.5 rounded-2xl bg-white hover:bg-[#FDF9EE] text-[#081C36] font-bold text-xs border border-[#E0D0B8] hover:border-[#C8960C] shadow-xs transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-center"
            >
              <Users className="w-4 h-4 text-[#C8960C]" />
              <span>📋 Employee Biodata</span>
            </Link>

          </div>

        </div>

        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-[#C8960C] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-600">Calculating Live Operations Data...</p>
          </div>
        ) : (
          <>
            {/* 4 Main Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Total Revenue */}
              <div className="bg-gradient-to-br from-[#FFFDF8] via-[#FFF9EE] to-[#FFF5DC] rounded-3xl p-6 text-slate-900 shadow-sm border-2 border-[#E6CD98] relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#A66E00] uppercase tracking-wider">Total Revenue</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#C8960C] flex items-center justify-center font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#081C36] mt-3">
                  {formatCurrency(stats?.summary?.totalRevenue)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                  <span>From {stats?.summary?.totalTripsCount || 0} logged tasks</span>
                </div>
              </div>

              {/* Total Employee Payouts */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Employee Payouts</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                  {formatCurrency(stats?.summary?.totalPayout)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Disbursed to staff candidates
                </div>
              </div>

              {/* Company Net Commission */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Commission</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-3">
                  {formatCurrency(stats?.summary?.totalCommission)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Company earnings margin
                </div>
              </div>

              {/* Pending Due Payments */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Dues</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-3">
                  {formatCurrency(stats?.summary?.pendingRevenue)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Uncollected client invoices
                </div>
              </div>

            </div>

            {/* Category Breakdown View (Driver, Helper, Captain) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {stats?.categoryBreakdown?.map((cat) => {
                const isCaptain = cat.category === 'Captain';
                const isDriver = cat.category === 'Driver';
                const Icon = isCaptain ? Compass : isDriver ? Car : Truck;
                const borderClass = isCaptain ? 'border-amber-400' : isDriver ? 'border-blue-400' : 'border-emerald-400';
                const colorClass = isCaptain ? 'text-amber-600' : isDriver ? 'text-blue-600' : 'text-emerald-600';
                const count = stats?.countsByCategory?.[cat.category] || 0;

                return (
                  <div
                    key={cat.category}
                    className={`bg-white rounded-3xl p-6 shadow-md border-2 ${borderClass} flex flex-col justify-between space-y-4`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${colorClass}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-lg">{cat.category} Fleet</h3>
                          <span className="text-xs text-slate-500 font-medium">{count} Active Staff</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        {cat.tripsCount} Tasks
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-slate-50 text-center">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Revenue</span>
                        <div className="text-sm font-bold text-slate-900">{formatCurrency(cat.revenue)}</div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Payout</span>
                        <div className="text-sm font-bold text-slate-900">{formatCurrency(cat.payout)}</div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Profit</span>
                        <div className="text-sm font-bold text-emerald-600">{formatCurrency(cat.commission)}</div>
                      </div>
                    </div>

                    <Link
                      to={`/admin/tasks?category=${cat.category}`}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>View {cat.category} Tasks</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* 2-Column: Top Performing Employees & Recent Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Top Employees with Auto-Calculated Earnings */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Top Staff by Earnings</h3>
                    <p className="text-xs text-slate-500">Auto-calculated from logged task assignments</p>
                  </div>
                  <Link
                    to="/admin/employees"
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>All Employees</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {stats?.topEmployees?.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No employee earnings data yet.</p>
                  ) : (
                    stats?.topEmployees?.map((emp) => (
                      <Link
                        key={emp._id}
                        to={`/admin/employees/${emp._id}`}
                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-slate-100 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={emp.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                              {emp.name}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="font-mono font-semibold text-[11px] text-slate-400">{emp.employeeId}</span>
                              <span>•</span>
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                                {emp.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-black text-sm text-slate-900">{formatCurrency(emp.earnings)}</div>
                          <div className="text-[11px] text-slate-400">{emp.tripsCount} tasks</div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Tasks Dispatch Log */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Recent Task Dispatches</h3>
                    <p className="text-xs text-slate-500">Latest active and completed client routes</p>
                  </div>
                  <Link
                    to="/admin/tasks"
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Manage Tasks</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {stats?.recentTrips?.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No task entries yet.</p>
                  ) : (
                    stats?.recentTrips?.map((task) => (
                      <div
                        key={task._id}
                        className="p-3 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{task.clientName}</span>
                            <span className="font-mono text-[10px] text-slate-400">({task.tripNumber})</span>
                          </div>
                          <div className="text-slate-500">
                            Assigned to: <strong className="text-slate-700">{task.assignedEmployeeName}</strong> ({task.category})
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            Route: {task.pickupLocation} → {task.dropLocation || 'City'}
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="font-black text-sm text-slate-900">{formatCurrency(task.tripAmount)}</div>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            task.paymentStatus === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {task.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </>
        )}

      </div>

      {/* QUICK ADD EMPLOYEE MODAL IN DASHBOARD */}
      {isAddEmpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-amber-500" />
                  <span>Onboard New Employee</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Quickly add candidate biodata to the SSRC employee database.
                </p>
              </div>

              <button
                onClick={() => setIsAddEmpModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickAddEmployee} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={empFormData.name}
                  onChange={(e) => setEmpFormData({ ...empFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98480 12345"
                    value={empFormData.mobileNumber}
                    onChange={(e) => setEmpFormData({ ...empFormData, mobileNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={empFormData.category}
                    onChange={(e) => setEmpFormData({ ...empFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <option value="Driver">Driver (Steers Responsibly)</option>
                    <option value="Helper">Helper (Supports Dedicatedly)</option>
                    <option value="Captain">Captain (Leads with Confidence)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Experience</label>
                  <input
                    type="text"
                    placeholder="e.g. 4 Years"
                    value={empFormData.experience}
                    onChange={(e) => setEmpFormData({ ...empFormData, experience: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Daily Payout Rate (₹)</label>
                  <input
                    type="number"
                    value={empFormData.dailyRate}
                    onChange={(e) => setEmpFormData({ ...empFormData, dailyRate: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEmpModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEmp}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-md hover:scale-[1.01]"
                >
                  {savingEmp ? 'Saving...' : 'Save Employee Record'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </>
  );
};

export default DashboardPage;
