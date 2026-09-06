import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Car, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Filter, 
  Calendar, 
  DollarSign, 
  UserCheck, 
  X,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';

const TripsPage = () => {
  const [searchParams] = useSearchParams();
  const [trips, setTrips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [paymentStatus, setPaymentStatus] = useState('All');
  const [tripStatus, setTripStatus] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [formData, setFormData] = useState({
    assignedEmployee: '',
    clientName: '',
    clientPhone: '',
    pickupLocation: '',
    dropLocation: '',
    category: 'Driver',
    tripDate: new Date().toISOString().slice(0, 10),
    tripAmount: 1200,
    employeePayout: 800,
    paymentStatus: 'Paid',
    tripStatus: 'Completed',
    tripType: 'Full-Day',
    remarks: '',
  });

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await api.get('/trips', {
        params: {
          search,
          category,
          paymentStatus,
          tripStatus,
          startDate,
          endDate,
        },
      });
      if (res.data.success) {
        setTrips(res.data.data);
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeesList = async () => {
    try {
      const res = await api.get('/employees');
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching employees list:', err);
    }
  };

  useEffect(() => {
    fetchEmployeesList();
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [search, category, paymentStatus, tripStatus, startDate, endDate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, paymentStatus, tripStatus, startDate, endDate, itemsPerPage]);

  const handleOpenModal = (trip = null) => {
    if (trip) {
      setEditingTrip(trip);
      setFormData({
        assignedEmployee: trip.assignedEmployee?._id || trip.assignedEmployee || '',
        clientName: trip.clientName || '',
        clientPhone: trip.clientPhone || '',
        pickupLocation: trip.pickupLocation || '',
        dropLocation: trip.dropLocation || '',
        category: trip.category || 'Driver',
        tripDate: trip.tripDate ? new Date(trip.tripDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        tripAmount: trip.tripAmount || 1200,
        employeePayout: trip.employeePayout || 800,
        paymentStatus: trip.paymentStatus || 'Paid',
        tripStatus: trip.tripStatus || 'Completed',
        tripType: trip.tripType || 'Full-Day',
        remarks: trip.remarks || '',
      });
    } else {
      setEditingTrip(null);
      setFormData({
        assignedEmployee: employees[0]?._id || '',
        clientName: '',
        clientPhone: '',
        pickupLocation: '',
        dropLocation: '',
        category: employees[0]?.category || 'Driver',
        tripDate: new Date().toISOString().slice(0, 10),
        tripAmount: 1200,
        employeePayout: 800,
        paymentStatus: 'Paid',
        tripStatus: 'Completed',
        tripType: 'Full-Day',
        remarks: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveTrip = async (e) => {
    e.preventDefault();
    if (!formData.assignedEmployee) {
      alert('Please select an employee to assign this task to.');
      return;
    }

    try {
      if (editingTrip) {
        await api.put(`/trips/${editingTrip._id}`, formData);
      } else {
        await api.post('/trips', formData);
      }
      setIsModalOpen(false);
      fetchTrips();
    } catch (err) {
      console.error('Error saving task:', err);
      alert('Failed to save task. Please check data.');
    }
  };

  const handleDeleteTrip = async (id, tripNumber) => {
    if (window.confirm(`Are you sure you want to remove task ${tripNumber}?`)) {
      try {
        await api.delete(`/trips/${id}`);
        fetchTrips();
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleEmployeeSelect = (empId) => {
    const selected = employees.find((e) => String(e._id) === String(empId));
    setFormData((prev) => ({
      ...prev,
      assignedEmployee: empId,
      category: selected ? selected.category : prev.category,
    }));
  };

  // Helper to get employee info with avatar photo fallback
  const getEmployeeInfo = (task) => {
    let emp = null;
    if (task.assignedEmployee && typeof task.assignedEmployee === 'object') {
      emp = task.assignedEmployee;
    } else if (task.assignedEmployee) {
      emp = employees.find((e) => String(e._id) === String(task.assignedEmployee));
    }

    const name = emp?.name || task.assignedEmployeeName || 'Unassigned Staff';
    const category = emp?.category || task.category || 'Driver';
    const photo = emp?.photo || getFallbackAvatar(name);
    const employeeId = emp?.employeeId || '';

    return { name, category, photo, employeeId };
  };

  const getFallbackAvatar = (name = '') => {
    const avatars = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash += name.charCodeAt(i);
    }
    return avatars[hash % avatars.length];
  };

  // Calculate pagination slices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrips = trips.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(trips.length / itemsPerPage));

  return (
    <>
      <SEOHead title="Task Management & Billing - SSRC Admin" />

      <div className="space-y-6">
        
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Task Management & Assignments
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Log individual duty routes linked to employees, calculate commissions, and track payment status.
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 hover:scale-[1.02] transition-transform self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Log New Task</span>
          </button>
        </div>

        {/* Filter Summary Strip */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Task Value</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">₹{summary.totalAmount}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Staff Payouts</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">₹{summary.totalPayout}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Net Margin</span>
              <div className="text-xl font-black text-emerald-600 mt-0.5">₹{summary.totalCommission}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Pending Due</span>
              <div className="text-xl font-black text-amber-600 mt-0.5">₹{summary.totalPending}</div>
            </div>
          </div>
        )}

        {/* Advanced Search & Multi-Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search task #, client, route, employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Categories</option>
              <option value="Driver">Driver Tasks</option>
              <option value="Helper">Helper Tasks</option>
              <option value="Captain">Captain Tasks</option>
            </select>

            {/* Payment Status Filter */}
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
            </select>

            {/* Start Date */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-800 focus:outline-none"
              />
            </div>

            {/* End Date */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-800 focus:outline-none"
              />
            </div>

          </div>

        </div>

        {/* Tasks Table */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Loading Tasks Data...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Tasks Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No task entries match your selected date or category criteria. Log a new task entry above.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Task #</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Client & Contact</th>
                    <th className="py-3.5 px-4">Assigned Employee</th>
                    <th className="py-3.5 px-4">Route</th>
                    <th className="py-3.5 px-4">Task Fee</th>
                    <th className="py-3.5 px-4">Staff Payout</th>
                    <th className="py-3.5 px-4">Margin</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentTrips.map((task) => {
                    const empInfo = getEmployeeInfo(task);
                    return (
                      <tr key={task._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">{task.tripNumber}</td>
                        <td className="py-3.5 px-4 whitespace-nowrap">{new Date(task.tripDate).toLocaleDateString('en-IN')}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{task.clientName}</div>
                          <div className="text-[11px] text-slate-400">{task.clientPhone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={empInfo.photo}
                              alt={empInfo.name}
                              className="w-10 h-10 rounded-xl object-cover border-2 border-amber-100 shadow-sm shrink-0"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80';
                              }}
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate leading-tight">{empInfo.name}</div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                                  empInfo.category === 'Captain' 
                                    ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                                    : empInfo.category === 'Driver' 
                                    ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                }`}>
                                  {empInfo.category}
                                </span>
                                {empInfo.employeeId && (
                                  <span className="text-[10px] font-mono text-slate-400">#{empInfo.employeeId}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate">
                          <div>{task.pickupLocation} → {task.dropLocation || 'City'}</div>
                        </td>
                        <td className="py-3.5 px-4 font-black text-slate-900">₹{task.tripAmount}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-700">₹{task.employeePayout}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-600">₹{task.commissionAmount}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                            task.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {task.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenModal(task)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                              title="Edit Task"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTrip(task._id, task.tripNumber)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                              title="Delete Task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Pagination Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>
                  Showing <strong className="text-slate-900 font-bold">{trips.length > 0 ? indexOfFirstItem + 1 : 0}</strong> to{' '}
                  <strong className="text-slate-900 font-bold">{Math.min(indexOfLastItem, trips.length)}</strong> of{' '}
                  <strong className="text-slate-900 font-bold">{trips.length}</strong> tasks
                </span>

                <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
                  <span className="text-slate-400">Rows per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
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

                <div className="px-3 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg">
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

          </div>
        )}

      </div>

      {/* Log / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {editingTrip ? `Edit Task Record: ${editingTrip.tripNumber}` : 'Log New Task Dispatch'}
                </h3>
                <p className="text-xs text-slate-500">
                  Assign staff member, configure billing amount, and route details.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTrip} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign Employee *</label>
                <select
                  required
                  value={formData.assignedEmployee}
                  onChange={(e) => handleEmployeeSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.employeeId} - {emp.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Client / Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Srinivas Reddy / Tech Corp"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Client Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98480 12345"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Location / Hub *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jubilee Hills Checkpost"
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Drop Location / Destination</label>
                  <input
                    type="text"
                    placeholder="e.g. RGIA Airport / Outstation"
                    value={formData.dropLocation}
                    onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Task Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.tripDate}
                    onChange={(e) => setFormData({ ...formData, tripDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Task Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.tripAmount}
                    onChange={(e) => setFormData({ ...formData, tripAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Employee Payout (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.employeePayout}
                    onChange={(e) => setFormData({ ...formData, employeePayout: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Status</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Task Status</label>
                  <select
                    value={formData.tripStatus}
                    onChange={(e) => setFormData({ ...formData, tripStatus: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Task Type</label>
                  <select
                    value={formData.tripType}
                    onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Full-Day">Full-Day</option>
                    <option value="One-Way">One-Way</option>
                    <option value="Round-Trip">Round-Trip</option>
                    <option value="Outstation">Outstation</option>
                    <option value="Monthly Contract">Monthly Contract</option>
                  </select>
                </div>
              </div>

              {/* Calculated Commission Preview */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <span className="text-emerald-900 font-bold">Auto-Calculated Commission:</span>
                <span className="text-base font-black text-emerald-700">
                  ₹{Math.max(0, formData.tripAmount - formData.employeePayout)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Remarks / Route Notes</label>
                <textarea
                  rows="2"
                  placeholder="e.g. VIP escort duty, customer paid cash on arrival..."
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-md hover:scale-[1.01]"
                >
                  Save Task Record
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </>
  );
};

export default TripsPage;
