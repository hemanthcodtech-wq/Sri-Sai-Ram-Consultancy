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
  ChevronsRight,
  CreditCard,
  Building,
  MapPin,
  Truck,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Check,
  FileText
} from 'lucide-react';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';

const TripsPage = () => {
  const [searchParams] = useSearchParams();
  const [trips, setTrips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [organizers, setOrganizers] = useState([]);
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
    tripDate: new Date().toISOString().slice(0, 10),
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    totalDays: 1,
    vehicleNumber: '',
    route: '',
    routeName: '',
    assignedEmployee: '',
    category: 'Driver',
    operator: '',
    operatorName: '',
    clientName: '',
    clientPhone: '',
    pickupLocation: '',
    dropLocation: '',
    advanceAmount: '',
    advancePaymentMode: 'Cash',
    salaryAmount: '',
    salaryPaymentMode: 'Online',
    dueAmount: 0,
    tripAmount: '',
    paymentStatus: 'Pending',
    tripStatus: 'Scheduled',
    tripType: 'Full-Day',
    remarks: '',
    blockEmployee: false,
    blockReason: '',
  });

  const checkEmployeeLicenseForTask = (emp, taskDate) => {
    if (!emp) return { valid: true };
    if (emp.isBlocked || emp.status === 'Blocked') {
      return {
        valid: false,
        blocked: true,
        isPermanentlyBlocked: true,
        reason: `Employee is Blocked (${emp.blockReason || 'Disciplinary / Policy restriction'})`,
      };
    }
    if (emp.category === 'Helper') return { valid: true };
    if (!emp.documents?.licenseExpiryDate) {
      return { valid: true, warning: 'License expiry date not set' };
    }
    const expiry = new Date(emp.documents.licenseExpiryDate);
    if (isNaN(expiry.getTime())) return { valid: true };

    const targetDate = taskDate ? new Date(taskDate) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const diffMs = expiry.getTime() - targetDate.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const formatted = expiry.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    if (diffDays < 0) {
      return {
        valid: false,
        blocked: true,
        reason: `License Expired on ${formatted}`,
        formatted,
      };
    }
    if (diffDays <= 2) {
      return {
        valid: false,
        blocked: true,
        reason: `License Expires on ${formatted} (${diffDays === 0 ? 'Today' : `${diffDays} day(s) left`} - 2-day buffer)`,
        formatted,
      };
    }
    return { valid: true, blocked: false, formatted };
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 1;
    const utc1 = Date.UTC(s.getFullYear(), s.getMonth(), s.getDate());
    const utc2 = Date.UTC(e.getFullYear(), e.getMonth(), e.getDate());
    const diffDays = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  };

  const handleStartDateChange = (val) => {
    const sDate = val;
    let eDate = formData.endDate || sDate;
    if (new Date(eDate) < new Date(sDate)) {
      eDate = sDate;
    }
    const days = calculateDays(sDate, eDate);
    setFormData((prev) => ({
      ...prev,
      startDate: sDate,
      endDate: eDate,
      tripDate: sDate,
      totalDays: days,
    }));
  };

  const handleEndDateChange = (val) => {
    const eDate = val;
    let sDate = formData.startDate || eDate;
    if (new Date(eDate) < new Date(sDate)) {
      sDate = eDate;
    }
    const days = calculateDays(sDate, eDate);
    setFormData((prev) => ({
      ...prev,
      startDate: sDate,
      endDate: eDate,
      tripDate: sDate,
      totalDays: days,
    }));
  };

  const calculateComputedDue = (salary, advance, status) => {
    if (status === 'Paid') return 0;
    const sal = Number(salary) || 0;
    const adv = Number(advance) || 0;
    return Math.max(0, sal - adv);
  };

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

  const fetchDependencies = async () => {
    try {
      const [empRes, routeRes, orgRes] = await Promise.all([
        api.get('/employees'),
        api.get('/routes'),
        api.get('/organizers'),
      ]);
      if (empRes.data.success) setEmployees(empRes.data.data);
      if (routeRes.data.success) setRoutes(routeRes.data.data);
      if (orgRes.data.success) setOrganizers(orgRes.data.data);
    } catch (err) {
      console.error('Error loading form dependencies:', err);
    }
  };

  useEffect(() => {
    fetchDependencies();
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
      const sDate = trip.startDate
        ? new Date(trip.startDate).toISOString().slice(0, 10)
        : trip.tripDate
        ? new Date(trip.tripDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);
      const eDate = trip.endDate
        ? new Date(trip.endDate).toISOString().slice(0, 10)
        : sDate;
      const days = trip.totalDays || Math.max(1, Math.round((new Date(eDate) - new Date(sDate)) / (1000 * 60 * 60 * 24)) + 1);

      const sal = trip.salaryAmount !== undefined ? trip.salaryAmount : trip.employeePayout || '';
      const adv = trip.advanceAmount !== undefined ? trip.advanceAmount : '';
      const pStatus = trip.paymentStatus || 'Pending';

      setFormData({
        tripDate: sDate,
        startDate: sDate,
        endDate: eDate,
        totalDays: days,
        vehicleNumber: trip.vehicleNumber || '',
        route: trip.route?._id || trip.route || '',
        routeName: trip.routeName || '',
        assignedEmployee: trip.assignedEmployee?._id || trip.assignedEmployee || '',
        category: trip.category || 'Driver',
        operator: trip.operator?._id || trip.operator || '',
        operatorName: trip.operatorName || (trip.operator?.name || ''),
        clientName: trip.clientName || '',
        clientPhone: trip.clientPhone || '',
        pickupLocation: trip.pickupLocation || '',
        dropLocation: trip.dropLocation || '',
        advanceAmount: adv,
        advancePaymentMode: trip.advancePaymentMode || 'Cash',
        salaryAmount: sal,
        salaryPaymentMode: trip.salaryPaymentMode || 'Online',
        dueAmount: trip.dueAmount !== undefined ? trip.dueAmount : calculateComputedDue(sal, adv, pStatus),
        tripAmount: trip.tripAmount !== undefined && trip.tripAmount !== null ? trip.tripAmount : '',
        paymentStatus: pStatus,
        tripStatus: trip.tripStatus || 'Scheduled',
        tripType: trip.tripType || 'Full-Day',
        remarks: trip.remarks || '',
        blockEmployee: false,
        blockReason: '',
      });
    } else {
      setEditingTrip(null);
      const today = new Date().toISOString().slice(0, 10);
      setFormData({
        tripDate: today,
        startDate: today,
        endDate: today,
        totalDays: 1,
        vehicleNumber: '',
        route: '',
        routeName: '',
        assignedEmployee: '',
        category: 'Driver',
        operator: '',
        operatorName: '',
        clientName: '',
        clientPhone: '',
        pickupLocation: '',
        dropLocation: '',
        advanceAmount: '',
        advancePaymentMode: 'Cash',
        salaryAmount: '',
        salaryPaymentMode: 'Online',
        dueAmount: 0,
        tripAmount: '',
        paymentStatus: 'Pending',
        tripStatus: 'Scheduled',
        tripType: 'Full-Day',
        remarks: '',
        blockEmployee: false,
        blockReason: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleRouteChange = (routeId) => {
    const selected = routes.find((r) => String(r._id) === String(routeId));
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        route: routeId,
        routeName: selected.routeName || `${selected.fromCity} → ${selected.toCity}`,
        pickupLocation: selected.fromCity,
        dropLocation: selected.toCity,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        route: '',
        routeName: '',
      }));
    }
  };

  const handleOperatorChange = (operatorId) => {
    const selected = organizers.find((o) => String(o._id) === String(operatorId));
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        operator: operatorId,
        operatorName: selected.name,
        clientName: prev.clientName || selected.company || selected.name,
        clientPhone: prev.clientPhone || selected.phone,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        operator: '',
        operatorName: '',
      }));
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

  const handleSaveTrip = async (e) => {
    e.preventDefault();
    if (!formData.assignedEmployee) {
      alert('Please select an employee to assign this task to.');
      return;
    }

    const selectedEmp = employees.find((e) => String(e._id) === String(formData.assignedEmployee));
    if (selectedEmp) {
      const licenseCheck = checkEmployeeLicenseForTask(selectedEmp, formData.startDate);
      if (licenseCheck.blocked) {
        alert(
          `❌ Cannot allot ${selectedEmp.name} to this task!\n\nReason: ${licenseCheck.reason}.\n\nAccording to company policy, blocked employees or staff with driving licenses expiring within 2 days cannot be allotted tasks.`
        );
        return;
      }
    }

    const finalSalary = formData.salaryAmount === '' ? 0 : Number(formData.salaryAmount);
    const finalAdvance = formData.advanceAmount === '' ? 0 : Number(formData.advanceAmount);
    const computedDue = formData.paymentStatus === 'Paid' ? 0 : Math.max(0, finalSalary - finalAdvance);

    const payload = {
      ...formData,
      salaryAmount: finalSalary,
      employeePayout: finalSalary,
      advanceAmount: finalAdvance,
      dueAmount: computedDue,
      tripAmount: formData.tripAmount === '' ? finalSalary : Number(formData.tripAmount),
      paymentStatus: formData.paymentStatus || 'Pending',
      tripStatus: formData.tripStatus || 'Scheduled',
      tripType: formData.tripType || 'Full-Day',
    };

    try {
      if (editingTrip) {
        await api.put(`/trips/${editingTrip._id}`, payload);
      } else {
        await api.post('/trips', payload);
      }
      setIsModalOpen(false);
      fetchTrips();
      fetchDependencies();
    } catch (err) {
      console.error('Error saving task:', err);
      alert(err.response?.data?.message || 'Failed to save task. Please check data.');
    }
  };

  const handleQuickMarkPaid = async (task) => {
    const selectedMode = window.confirm(`Settle payment for Task ${task.tripNumber}?\n\nPress OK for "Online / UPI" mode, or Cancel to choose "Cash" mode.`)
      ? 'Online'
      : 'Cash';

    try {
      await api.put(`/trips/${task._id}`, {
        paymentStatus: 'Paid',
        salaryPaymentMode: selectedMode,
        dueAmount: 0,
      });
      fetchTrips();
    } catch (err) {
      console.error('Error updating payment status:', err);
      alert('Failed to update status to Paid');
    }
  };

  const handleDeleteTrip = async (id, tripNumber) => {
    if (window.confirm(`Are you sure you want to delete task ${tripNumber}?`)) {
      try {
        await api.delete(`/trips/${id}`);
        fetchTrips();
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

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
    const isBlocked = emp?.isBlocked || emp?.status === 'Blocked';

    return { name, category, photo, employeeId, isBlocked, blockReason: emp?.blockReason };
  };

  const getFallbackAvatar = (name = '') => {
    const avatars = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return avatars[hash % avatars.length];
  };

  // Calculate pagination slices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrips = trips.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(trips.length / itemsPerPage));

  return (
    <>
      <SEOHead title="Task Management & Dispatch - SSRC Admin" />

      <div className="space-y-6">
        
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Task Management &amp; Dispatch</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                {trips.length} Tasks
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Log trip details, vehicle numbers, route &amp; operator dropdowns, advance &amp; salary splits with cash/online modes, and task remarks.
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-sm shadow-md shadow-amber-500/20 hover:scale-[1.02] transition-transform self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>Log New Task</span>
          </button>
        </div>

        {/* Financial Summary Strip */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Staff Salary</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">₹{summary.totalSalary || summary.totalPayout || 0}</div>
              <span className="text-[10px] text-slate-500 font-medium">Billed to Staff</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-amber-700 font-bold uppercase block">Advance Paid</span>
              <div className="text-xl font-black text-amber-700 mt-0.5">₹{summary.totalAdvance || 0}</div>
              <span className="text-[10px] text-amber-600 font-medium">Initial Given Amount</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-rose-600 font-bold uppercase block">Pending Due</span>
              <div className="text-xl font-black text-rose-600 mt-0.5">₹{summary.totalDue || summary.totalPending || 0}</div>
              <span className="text-[10px] text-rose-500 font-medium">Salary Remaining</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">Total Settled</span>
              <div className="text-xl font-black text-emerald-700 mt-0.5">₹{summary.totalPaid || 0}</div>
              <span className="text-[10px] text-emerald-600 font-medium">Paid + Advance</span>
            </div>
          </div>
        )}

        {/* Multi-Filter Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search task #, vehicle, route, staff, operator..."
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
              <option value="All">All Staff Categories</option>
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
              <option value="Paid">Paid (Due = 0)</option>
              <option value="Pending">Pending Due</option>
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
            <p className="text-xs font-semibold text-slate-500">Loading Task Records...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Tasks Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No tasks match your filter criteria. Log a new task entry above.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Task # &amp; Date</th>
                    <th className="py-3.5 px-4">Vehicle &amp; Route</th>
                    <th className="py-3.5 px-4">Operator / Client</th>
                    <th className="py-3.5 px-4">Assigned Staff</th>
                    <th className="py-3.5 px-4">Advance (Given)</th>
                    <th className="py-3.5 px-4">Salary &amp; Due</th>
                    <th className="py-3.5 px-4">Payment &amp; Duty</th>
                    <th className="py-3.5 px-4">Remarks</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentTrips.map((task) => {
                    const empInfo = getEmployeeInfo(task);
                    const sDateObj = task.startDate ? new Date(task.startDate) : new Date(task.tripDate);
                    const eDateObj = task.endDate ? new Date(task.endDate) : sDateObj;
                    const isMultiDay = sDateObj.toDateString() !== eDateObj.toDateString();

                    const isPaid = task.paymentStatus === 'Paid';
                    const due = isPaid ? 0 : (task.dueAmount !== undefined ? task.dueAmount : Math.max(0, (task.salaryAmount || task.employeePayout || 0) - (task.advanceAmount || 0)));

                    return (
                      <tr key={task._id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Task # & Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-slate-900 block">{task.tripNumber}</span>
                          <div className="font-semibold text-slate-600 flex items-center gap-1 mt-0.5 text-[11px]">
                            <Calendar className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>
                              {sDateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                              {isMultiDay && <> – {eDateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</>}
                            </span>
                          </div>
                          <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                            {task.totalDays || 1} Day Duty
                          </span>
                        </td>

                        {/* Vehicle & Route */}
                        <td className="py-3.5 px-4">
                          {task.vehicleNumber ? (
                            <span className="font-mono font-extrabold text-slate-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs inline-block mb-1">
                              {task.vehicleNumber}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px] block italic mb-1">Vehicle Not Set</span>
                          )}
                          <div className="font-bold text-slate-800 text-xs">
                            {task.routeName || (task.pickupLocation ? `${task.pickupLocation} → ${task.dropLocation || 'City'}` : 'Corridor Not Selected')}
                          </div>
                        </td>

                        {/* Operator / Client */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">
                            {task.operatorName || task.operator?.name || task.clientName || 'General Operator'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {task.clientPhone || task.operator?.phone || '—'}
                          </div>
                        </td>

                        {/* Assigned Employee */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={empInfo.photo}
                              alt={empInfo.name}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80';
                              }}
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate leading-tight flex items-center gap-1.5">
                                <span>{empInfo.name}</span>
                                {empInfo.isBlocked && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                                    BLOCKED
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold ${
                                  empInfo.category === 'Captain' 
                                    ? 'bg-amber-100 text-amber-900' 
                                    : empInfo.category === 'Driver' 
                                    ? 'bg-blue-100 text-blue-900' 
                                    : 'bg-emerald-100 text-emerald-900'
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

                        {/* Advance Amount & Mode */}
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-amber-800 text-sm">
                            ₹{task.advanceAmount || 0}
                          </div>
                          <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            task.advancePaymentMode === 'Cash' 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}>
                            {task.advancePaymentMode || 'Cash'}
                          </span>
                        </td>

                        {/* Salary Amount & Due */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-baseline gap-1">
                            <span className="font-black text-slate-900 text-sm">₹{task.salaryAmount || task.employeePayout || 0}</span>
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              task.salaryPaymentMode === 'Cash' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'
                            }`}>
                              {task.salaryPaymentMode || 'Online'}
                            </span>
                          </div>
                          <div className="mt-1">
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Due: ₹0 (Settled)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                Due: ₹{due}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Payment & Task Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : task.paymentStatus === 'Partial'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {task.paymentStatus || 'Pending'}
                          </span>
                          <div className="text-[11px] font-semibold text-slate-500 mt-1">
                            {task.tripStatus || 'Scheduled'}
                          </div>
                        </td>

                        {/* Trip Remarks */}
                        <td className="py-3.5 px-4 max-w-xs">
                          {task.remarks ? (
                            <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-200 line-clamp-2" title={task.remarks}>
                              {task.remarks}
                            </p>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isPaid && (
                              <button
                                onClick={() => handleQuickMarkPaid(task)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
                                title="Mark Salary as Paid (Due = 0)"
                              >
                                <Check className="w-3 h-3" />
                                <span>Mark Paid</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenModal(task)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              title="Edit Task"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteTrip(task._id, task.tripNumber)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
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
            <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-3 py-1 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
          <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            
            <div className="bg-white px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 z-10">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {editingTrip ? `Edit Task: ${editingTrip.tripNumber}` : 'Log New Task & Duty Record'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Enter date, vehicle, route, employee, operator, and advance/salary payment details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all shrink-0 active:scale-95 cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTrip} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4">
              
              {/* 1. Date & Vehicle Number Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    <Calendar className="w-3.5 h-3.5 inline text-amber-600 mr-1" />
                    Task Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    <Truck className="w-3.5 h-3.5 inline text-amber-600 mr-1" />
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AP 28 TE 4567 / TS 09 EA 1234"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono font-bold focus:outline-none focus:border-amber-500 uppercase placeholder:normal-case"
                  />
                </div>
              </div>

              {/* 2. Route Dropdown & Operator Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    <MapPin className="w-3.5 h-3.5 inline text-amber-600 mr-1" />
                    Route (Select from Corridor) *
                  </label>
                  <select
                    required
                    value={formData.route}
                    onChange={(e) => handleRouteChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500 bg-white"
                  >
                    <option value="">-- Choose Route Corridor --</option>
                    {routes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.routeName ? `${r.routeName} (${r.fromCity} → ${r.toCity})` : `${r.fromCity} → ${r.toCity}`}
                        {r.status === 'Inactive' ? ' [Inactive]' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    <Building className="w-3.5 h-3.5 inline text-amber-600 mr-1" />
                    Operator / Organizer (Select) *
                  </label>
                  <select
                    required
                    value={formData.operator}
                    onChange={(e) => handleOperatorChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500 bg-white"
                  >
                    <option value="">-- Choose Operator / Organizer --</option>
                    {organizers.map((org) => (
                      <option key={org._id} value={org._id}>
                        {org.name} {org.company ? `(${org.company})` : ''} - {org.phone}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Employee Dropdown (with Driving License Validation & Block Enforcement) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    <UserCheck className="w-3.5 h-3.5 inline text-amber-600 mr-1" />
                    Assign Employee *
                  </label>
                  <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md font-bold border border-amber-200">
                    License 2-Day Buffer Checked
                  </span>
                </div>

                <select
                  required
                  value={formData.assignedEmployee}
                  onChange={(e) => handleEmployeeSelect(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold focus:outline-none bg-white ${
                    formData.assignedEmployee && checkEmployeeLicenseForTask(
                      employees.find((e) => String(e._id) === String(formData.assignedEmployee)),
                      formData.startDate
                    ).blocked
                      ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30 text-rose-900'
                      : 'border-slate-300 focus:border-amber-500'
                  }`}
                >
                  <option value="">-- Choose Employee / Driver --</option>
                  {employees.map((emp) => {
                    const lic = checkEmployeeLicenseForTask(emp, formData.startDate);
                    return (
                      <option 
                        key={emp._id} 
                        value={emp._id}
                        disabled={lic.blocked}
                        className={lic.blocked ? 'text-rose-600 bg-rose-50 font-bold' : ''}
                      >
                        {lic.blocked ? '🚫 ' : ''}{emp.name} ({emp.employeeId} - {emp.category})
                        {lic.blocked ? ` [BLOCKED: ${lic.reason}]` : lic.formatted ? ` [Valid till ${lic.formatted}]` : ''}
                      </option>
                    );
                  })}
                </select>

                {/* Selected Employee Alert */}
                {(() => {
                  const selectedEmp = employees.find((e) => String(e._id) === String(formData.assignedEmployee));
                  if (!selectedEmp) return null;
                  const lic = checkEmployeeLicenseForTask(selectedEmp, formData.startDate);
                  if (lic.blocked) {
                    return (
                      <div className="mt-2 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2 animate-in fade-in">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-black text-rose-950">
                            Task Allocation Restricted for {selectedEmp.name}
                          </strong>
                          <p className="text-[11px] text-rose-800 mt-0.5 font-medium">
                            {lic.reason}. Staff with expired driving licenses (or expiring within 2 days buffer) or blocked status cannot be allotted tasks.
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* 4. Financial Breakdown: Advance vs Salary vs Due with Mode Selection */}
              <div className="bg-amber-50/40 rounded-2xl p-4 sm:p-5 border border-amber-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    Duty Financials &amp; Split Payments
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                    Advance + Salary
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Advance Amount (Given) */}
                  <div className="bg-white p-3.5 rounded-xl border border-amber-200/60 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      1. Advance Amount (Given) ₹
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 500"
                      value={formData.advanceAmount}
                      onChange={(e) => setFormData({ ...formData, advanceAmount: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-extrabold text-amber-800 text-sm focus:outline-none focus:border-amber-500"
                    />

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Advance Payment Mode
                      </label>
                      <select
                        value={formData.advancePaymentMode}
                        onChange={(e) => setFormData({ ...formData, advancePaymentMode: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Online">Online / UPI</option>
                        <option value="UPI">UPI (GPay / PhonePe)</option>
                        <option value="Bank Transfer">Bank Transfer / NEFT</option>
                      </select>
                    </div>
                  </div>

                  {/* Salary Amount (Need to pay) */}
                  <div className="bg-white p-3.5 rounded-xl border border-amber-200/60 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      2. Salary Amount (Total to Pay) ₹ *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 1500"
                      value={formData.salaryAmount}
                      onChange={(e) => setFormData({ ...formData, salaryAmount: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-black text-slate-900 text-sm focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      Total duty payment allocated for the employee.
                    </span>
                  </div>
                </div>

                {/* Status, Settlement Mode (when Paid), and Live Computed Due Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-amber-200/50 items-center">
                  
                  {/* Payment Status Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Payment Status *
                    </label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Pending">Pending (Due Active)</option>
                      <option value="Paid">Paid (Fully Settled - Due = 0)</option>
                    </select>
                  </div>

                  {/* Payment Mode (shown / selectable when Paid or for Salary) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {formData.paymentStatus === 'Paid' ? 'Paid Settlement Mode *' : 'Settlement Mode (When Paid)'}
                    </label>
                    <select
                      value={formData.salaryPaymentMode}
                      onChange={(e) => setFormData({ ...formData, salaryPaymentMode: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold focus:outline-none ${
                        formData.paymentStatus === 'Paid'
                          ? 'border-emerald-400 bg-emerald-50/40 text-emerald-950 focus:border-emerald-600'
                          : 'border-slate-300 bg-white text-slate-800 focus:border-amber-500'
                      }`}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Online">Online / UPI</option>
                      <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                      <option value="Bank Transfer">Bank Transfer / NEFT</option>
                    </select>
                  </div>

                  {/* Due Amount Box */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Remaining Due Amount
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xl font-black ${
                        formData.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        ₹{calculateComputedDue(formData.salaryAmount, formData.advanceAmount, formData.paymentStatus)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        formData.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {formData.paymentStatus === 'Paid' ? '₹0 (Paid)' : 'Pending Due'}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Trip Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  <FileText className="w-3.5 h-3.5 inline text-amber-600 mr-1" />
                  Trip Remarks (Admin Notes / Experience / Performance)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Completed route on time, disciplined behavior, good vehicle maintenance..."
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500 resize-none"
                />
                <span className="text-[10px] text-slate-400">
                  These remarks will be permanently preserved in the staff's biodata dossier and task history.
                </span>
              </div>

              {/* Employee Block Option */}
              <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-200 space-y-2.5">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="blockEmployeeCheck"
                    checked={formData.blockEmployee}
                    onChange={(e) => setFormData({ ...formData, blockEmployee: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded border-rose-300 focus:ring-rose-500 cursor-pointer"
                  />
                  <label htmlFor="blockEmployeeCheck" className="text-xs font-bold text-rose-900 cursor-pointer">
                    🚫 Block this employee from next task allocations
                  </label>
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed pl-6">
                  Check this if the employee violated policy, showed poor conduct, or should be restricted from being assigned to any future tasks.
                </p>
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-xs shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
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
