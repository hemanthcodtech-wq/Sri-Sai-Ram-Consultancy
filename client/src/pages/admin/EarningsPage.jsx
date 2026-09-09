import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Users, 
  Car, 
  Truck, 
  Compass, 
  ArrowUpRight, 
  Download, 
  Filter, 
  CheckCircle2, 
  Clock, 
  PieChart, 
  BarChart3,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Printer
} from 'lucide-react';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';
import { exportToExcel } from '../../utils/excelExport';

const EarningsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // 'today', 'week', 'month', 'year', 'all'
  const [categoryFilter, setCategoryFilter] = useState('All'); // 'All', 'Driver', 'Helper', 'Captain'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchEarningsData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/dashboard/stats?timeRange=${timeRange}`);
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching earnings analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, [timeRange]);

  useEffect(() => {
    setCurrentPage(1);
  }, [timeRange, categoryFilter, itemsPerPage]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    if (filteredEmployees.length === 0) {
      alert('No financial ledger records to export.');
      return;
    }

    const exportData = filteredEmployees.map((emp, idx) => ({
      'S.No': idx + 1,
      'Staff ID': emp.employeeId || '',
      'Employee Name': emp.name || '',
      'Category': emp.category || 'Driver',
      'Tasks Handled': emp.tripsCount || 0,
      'Salary Earned (₹)': emp.salaryTotal || emp.earnings || 0,
      'Advance Paid (₹)': emp.advanceTotal || 0,
      'Pending Due (₹)': emp.dueTotal || 0,
      'Settled Total (₹)': emp.paidTotal || emp.amountCollected || 0,
      'Status': emp.isBlocked ? 'Blocked' : 'Active',
    }));

    exportToExcel(exportData, `SSRC_Financial_Ledger_${timeRange}_${categoryFilter}`, 'Staff_Financial_Ledger');
  };

  const filteredEmployees = stats?.topEmployees?.filter(emp => {
    if (categoryFilter === 'All') return true;
    return emp.category === categoryFilter;
  }) || [];

  // Calculate pagination slices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLedgerEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / itemsPerPage));

  return (
    <>
      <SEOHead title="Earnings & Financial Analytics - SSRC Admin" />

      <div className="space-y-8">
        
        {/* Top Title & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Financial & Earnings Analytics</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                Revenue & Margins
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Detailed financial breakdown of company commissions, staff payouts, and category margins.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Export Excel Ledger Button */}
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-2xs hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
              title="Download Financial Ledger as Excel"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export Excel ({filteredEmployees.length})</span>
            </button>

            {/* Print / Export Report Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Report</span>
            </button>

            {/* Time Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
              {[
                { id: 'today', label: 'Today' },
                { id: 'week', label: 'Week' },
                { id: 'month', label: 'Month' },
                { id: 'year', label: 'Year' },
                { id: 'all', label: 'All' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeRange(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    timeRange === t.id
                      ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-600">Loading Financial Statements...</p>
          </div>
        ) : (
          <>
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
              
              {/* 1. Total Staff Salary Obligations */}
              <div className="bg-gradient-to-br from-[#FFFDF8] via-[#FFF9EE] to-[#FFF5DC] rounded-3xl p-5 sm:p-6 text-slate-900 shadow-sm border-2 border-[#E6CD98]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-black text-[#A66E00] uppercase tracking-wider">Total Staff Salary</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#C8960C] flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#081C36] mt-3">
                  {formatCurrency(stats?.summary?.totalSalary || stats?.summary?.totalPayout)}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium">Total staff earnings billed</p>
              </div>

              {/* 2. Total Advance Paid */}
              <div className="bg-gradient-to-br from-amber-50 via-amber-100/40 to-yellow-50 rounded-3xl p-5 sm:p-6 text-slate-900 shadow-sm border-2 border-amber-300">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-black text-amber-900 uppercase tracking-wider">Advance Paid</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-950 mt-3">
                  {formatCurrency(stats?.summary?.totalAdvance)}
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-amber-800">
                  <span>Cash: {formatCurrency(stats?.summary?.advanceCash)}</span>
                  <span>•</span>
                  <span>Online: {formatCurrency(stats?.summary?.advanceOnline)}</span>
                </div>
              </div>

              {/* 3. Pending Payment Dues */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border-2 border-rose-300">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-rose-700 uppercase tracking-wider">Pending Dues</span>
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-3">
                  {formatCurrency(stats?.summary?.totalDue || stats?.summary?.pendingRevenue)}
                </div>
                <p className="text-[11px] sm:text-xs text-rose-500 mt-1 font-medium">Salary balance to pay</p>
              </div>

              {/* 4. Total Settled Amount */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border-2 border-emerald-300">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">Settled Payouts</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-3">
                  {formatCurrency(stats?.summary?.totalPaid || stats?.summary?.paidRevenue)}
                </div>
                <p className="text-[11px] sm:text-xs text-emerald-800 font-semibold mt-1">Paid in full + Advance</p>
              </div>

              {/* 5. Agency Margin */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Agency Margin</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                  {formatCurrency(stats?.summary?.totalCommission)}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium">SSRC consultancy fee</p>
              </div>

            </div>

            {/* Category Financial Breakdown Matrix */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Fleet Financial Matrix</h3>
                  <p className="text-xs text-slate-500">Revenue, amount received, advance, and pending dues across categories.</p>
                </div>
                
                {/* Filter Pills */}
                <div className="flex items-center gap-2">
                  {['All', 'Driver', 'Helper', 'Captain'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-gradient-to-r from-[#C8960C] to-[#E8A900] text-white shadow-sm font-black'
                          : 'bg-[#F5EFE6] text-slate-600 hover:bg-[#EDE3D3]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats?.categoryBreakdown?.map((cat) => {
                  const isCaptain = cat.category === 'Captain';
                  const isDriver = cat.category === 'Driver';
                  const Icon = isCaptain ? Compass : isDriver ? Car : Truck;
                  const borderClass = isCaptain ? 'border-amber-400' : isDriver ? 'border-blue-400' : 'border-emerald-400';
                  const iconColor = isCaptain ? 'text-amber-600' : isDriver ? 'text-blue-600' : 'text-emerald-600';
                  const profitMargin = cat.revenue > 0 ? ((cat.commission / cat.revenue) * 100).toFixed(1) : 0;

                  return (
                    <div
                      key={cat.category}
                      className={`bg-slate-50 rounded-2xl p-5 border-2 ${borderClass} space-y-4`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center ${iconColor} shadow-sm`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-base">{cat.category} Category</h4>
                            <span className="text-[11px] text-slate-500 font-medium">{cat.tripsCount} Completed Tasks</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                          {profitMargin}% Margin
                        </span>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Gross Billed:</span>
                          <span className="font-bold text-slate-900">{formatCurrency(cat.revenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Staff Salary:</span>
                          <span className="font-bold text-slate-900">{formatCurrency(cat.salary || cat.payout)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Advance Given:</span>
                          <span className="font-bold text-amber-800">{formatCurrency(cat.advance || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Pending Due:</span>
                          <span className="font-bold text-rose-600">{formatCurrency(cat.due || cat.pendingRevenue || 0)}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-200 font-extrabold text-sm">
                          <span className="text-slate-900">Agency Profit:</span>
                          <span className="text-emerald-600">{formatCurrency(cat.commission)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Staff Financial Earnings Ledger Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Staff Financial Earnings &amp; Dues Ledger</h3>
                  <p className="text-xs text-slate-500">Complete breakdown of salary obligations, advance paid, pending dues, and settled payments.</p>
                </div>
                <div className="text-xs text-slate-500 font-semibold">
                  Showing {filteredEmployees.length} staff records
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 uppercase font-bold border-y border-slate-200">
                      <th className="py-3 px-4">Employee ID &amp; Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Tasks Handled</th>
                      <th className="py-3 px-4">Salary Earned</th>
                      <th className="py-3 px-4">Advance Paid</th>
                      <th className="py-3 px-4">Pending Due</th>
                      <th className="py-3 px-4">Settled Total</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="py-8 text-center text-slate-400">
                          No financial ledger entries match this criteria.
                        </td>
                      </tr>
                    ) : (
                      currentLedgerEmployees.map((emp) => (
                        <tr key={emp._id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={emp.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                                alt={emp.name}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{emp.name}</span>
                                  {emp.isBlocked && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-100 text-rose-800">
                                      BLOCKED
                                    </span>
                                  )}
                                </div>
                                <div className="font-mono text-[10px] text-slate-400">{emp.employeeId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                              emp.category === 'Captain' ? 'bg-amber-100 text-amber-800' :
                              emp.category === 'Driver' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {emp.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {emp.tripsCount} tasks
                          </td>
                          <td className="py-3 px-4 font-extrabold text-slate-900">
                            {formatCurrency(emp.salaryTotal || emp.earnings)}
                          </td>
                          <td className="py-3 px-4 font-extrabold text-amber-800">
                            {formatCurrency(emp.advanceTotal || 0)}
                          </td>
                          <td className="py-3 px-4 font-extrabold text-rose-600">
                            {formatCurrency(emp.dueTotal || 0)}
                          </td>
                          <td className="py-3 px-4 font-extrabold text-emerald-700">
                            {formatCurrency(emp.paidTotal || emp.amountCollected || 0)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <a
                              href={`/admin/employees/${emp._id}`}
                              className="text-amber-800 hover:text-amber-950 font-bold inline-flex items-center gap-1"
                            >
                              <span>View</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Footer */}
              {filteredEmployees.length > 0 && (
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>
                      Showing <strong className="text-slate-900 font-bold">{indexOfFirstItem + 1}</strong> to{' '}
                      <strong className="text-slate-900 font-bold">{Math.min(indexOfLastItem, filteredEmployees.length)}</strong> of{' '}
                      <strong className="text-slate-900 font-bold">{filteredEmployees.length}</strong> records
                    </span>

                    <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
                      <span className="text-slate-400">Rows per page:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      title="First Page"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="px-3 py-1 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg">
                      Page {currentPage} of {totalPages}
                    </div>

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      title="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      title="Last Page"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </>
        )}

      </div>
    </>
  );
};

const PrinterIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

export default EarningsPage;
