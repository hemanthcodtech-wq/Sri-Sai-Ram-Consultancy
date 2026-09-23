import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  IndianRupee,
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
  const [organizers, setOrganizers] = useState([]);
  const [isOrganizerAmountOpen, setIsOrganizerAmountOpen] = useState(false);
  const [organizerAmountForm, setOrganizerAmountForm] = useState({
    organizerId: '',
    amount: '',
    dateReceived: new Date().toISOString().slice(0, 10),
    notes: '',
  });

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

  const fetchOrganizers = async () => {
    try {
      const res = await api.get('/organizers');
      if (res.data.success) setOrganizers(res.data.data);
    } catch (err) {
      console.error('Error fetching organizer amounts:', err);
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, []);

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

  const isInSelectedRange = (dateValue) => {
    if (timeRange === 'all') return true;
    const date = new Date(dateValue);
    const now = new Date();
    if (timeRange === 'today') return date.toDateString() === now.toDateString();
    const start = new Date(now);
    if (timeRange === 'week') start.setDate(now.getDate() - 7);
    if (timeRange === 'month') start.setMonth(now.getMonth(), 1);
    if (timeRange === 'year') start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
    return date >= start;
  };

  const organizerRevenue = organizers.reduce((total, organizer) => (
    total + (organizer.monthlyIncome || [])
      .filter((income) => isInSelectedRange(income.dateReceived))
      .reduce((sum, income) => sum + Number(income.amount || 0), 0)
  ), 0);

  const resetOrganizerAmountForm = () => {
    setOrganizerAmountForm({
      organizerId: '',
      amount: '',
      dateReceived: new Date().toISOString().slice(0, 10),
      notes: '',
    });
  };

  const handleSaveOrganizerAmount = async (event) => {
    event.preventDefault();
    const organizer = organizers.find((item) => item._id === organizerAmountForm.organizerId);
    if (!organizer || !organizerAmountForm.amount || Number(organizerAmountForm.amount) <= 0) {
      alert('Select an organizer and enter a valid amount.');
      return;
    }

    try {
      const currentIncomes = [...(organizer.monthlyIncome || [])];
      const receivedDate = new Date(organizerAmountForm.dateReceived);
      currentIncomes.push({
        month: receivedDate.toLocaleString('default', { month: 'short', year: 'numeric' }),
        amount: Number(organizerAmountForm.amount),
        dateReceived: receivedDate,
        notes: organizerAmountForm.notes.trim(),
      });
      await api.put(`/organizers/${organizer._id}`, {
        ...organizer,
        monthlyIncome: currentIncomes,
      });
      setIsOrganizerAmountOpen(false);
      resetOrganizerAmountForm();
      fetchOrganizers();
    } catch (err) {
      console.error('Error saving organizer amount:', err);
      alert(err.response?.data?.message || 'Failed to save organizer amount.');
    }
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
      <SEOHead title="Earnings & Financial Analytics - SSRC Admin" noindex={true} />

      <div className="space-y-8">
        
        {/* Top Title & Filter Bar */}
        <div className="grid gap-5 border-b border-slate-200/80 pb-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-4xl">
              Financial &amp; Earnings Analytics
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Detailed financial breakdown of company commissions, staff payouts, and category margins.
            </p>
          </div>

          <div className="flex min-w-0 flex-col items-stretch gap-3 lg:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-100 px-3 py-2 text-xs font-black text-amber-900">
                Revenue &amp; Margins
              </span>
              <button
                onClick={() => setIsOrganizerAmountOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-sm hover:bg-amber-300"
              >
                <IndianRupee className="h-4 w-4" />
                <span>Record Organizer Amount</span>
              </button>
              <button
                onClick={handleExportExcel}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50"
                title="Download Financial Ledger as Excel"
              >
                <Download className="h-4 w-4 text-emerald-600" />
                <span>Export Excel ({filteredEmployees.length})</span>
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <Printer className="h-4 w-4 text-slate-500" />
                <span>Print Report</span>
              </button>
            </div>

            <div className="flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
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
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    timeRange === t.id
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* 1. Amount Received from Organizers */}
              <div className="bg-gradient-to-br from-[#FFFDF8] via-[#FFF9EE] to-[#FFF5DC] rounded-3xl p-5 sm:p-6 text-slate-900 shadow-sm border-2 border-[#E6CD98]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-black text-[#A66E00] uppercase tracking-wider">Organizer Amount Received</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#C8960C] flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#081C36] mt-3">
                  {formatCurrency(organizerRevenue)}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium">Collections from organizers</p>
              </div>

              {/* 2. Task Spend */}
              <div className="bg-gradient-to-br from-amber-50 via-amber-100/40 to-yellow-50 rounded-3xl p-5 sm:p-6 text-slate-900 shadow-sm border-2 border-amber-300">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-black text-amber-900 uppercase tracking-wider">Task Spend</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-950 mt-3">
                  {formatCurrency(stats?.summary?.totalSalary || stats?.summary?.totalPayout)}
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-amber-800">
                  <span>Salary allocated to tasks</span>
                </div>
              </div>

              {/* 3. Pending Payment Dues */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border-2 border-rose-300">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-rose-700 uppercase tracking-wider">Pending Task Payments</span>
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-3">
                  {formatCurrency(stats?.summary?.totalDue || stats?.summary?.pendingRevenue)}
                </div>
                <p className="text-[11px] sm:text-xs text-rose-500 mt-1 font-medium">Salary balance to pay</p>
              </div>

              {/* 4. Total Paid for Tasks */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border-2 border-emerald-300">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">Paid for Tasks</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-3">
                  {formatCurrency(stats?.summary?.totalPaid || stats?.summary?.paidRevenue)}
                </div>
                <p className="text-[11px] sm:text-xs text-emerald-800 font-semibold mt-1">Employee task payments</p>
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

      {isOrganizerAmountOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50">
              <h2 className="font-black text-lg text-slate-900">Record Organizer Amount</h2>
              <button
                onClick={() => { setIsOrganizerAmountOpen(false); resetOrganizerAmountForm(); }}
                className="p-1 hover:bg-amber-100 rounded-lg"
                title="Close"
              >
                <span className="text-xl leading-none">&times;</span>
              </button>
            </div>
            <form onSubmit={handleSaveOrganizerAmount} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Organizer</label>
                <select
                  required
                  value={organizerAmountForm.organizerId}
                  onChange={(event) => setOrganizerAmountForm({ ...organizerAmountForm, organizerId: event.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Select organizer</option>
                  {organizers.map((organizer) => (
                    <option key={organizer._id} value={organizer._id}>
                      {organizer.name}{organizer.company ? ` - ${organizer.company}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amount Received (Rs.)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={organizerAmountForm.amount}
                    onChange={(event) => setOrganizerAmountForm({ ...organizerAmountForm, amount: event.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="e.g. 50000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Received Date</label>
                  <input
                    type="date"
                    required
                    value={organizerAmountForm.dateReceived}
                    onChange={(event) => setOrganizerAmountForm({ ...organizerAmountForm, dateReceived: event.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={organizerAmountForm.notes}
                  onChange={(event) => setOrganizerAmountForm({ ...organizerAmountForm, notes: event.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Optional reference"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsOrganizerAmountOpen(false); resetOrganizerAmountForm(); }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-sm font-black">
                  Save Amount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const PrinterIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

export default EarningsPage;
