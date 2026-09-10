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
  FileText,
  Users,
  Compass,
  Download
} from 'lucide-react';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';
import { exportToExcel } from '../../utils/excelExport';

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

  const initialCrewState = {
    tripDate: new Date().toISOString().slice(0, 10),
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    totalDays: 1,
    vehicleNumber: '',
    vehicleStatus: 'RUN',
    route: '',
    routeName: '',
    operator: '',
    operatorName: '',
    clientName: '',
    clientPhone: '',
    pickupLocation: '',
    dropLocation: '',
    // Driver 1 (Primary)
    driver1: {
      employee: '',
      employeeName: '',
      category: 'Driver',
      salaryAmount: '',
      advanceAmount: '',
      advancePaymentMode: 'Cash',
      salaryPaymentMode: 'Online',
      dueAmount: 0,
      paymentStatus: 'Pending',
    },
    // Driver 2 (Secondary - Optional)
    driver2: {
      employee: '',
      employeeName: '',
      category: 'Driver',
      salaryAmount: '',
      advanceAmount: '',
      advancePaymentMode: 'Cash',
      salaryPaymentMode: 'Online',
      dueAmount: 0,
      paymentStatus: 'Pending',
    },
    // Helper (Optional)
    helper: {
      employee: '',
      employeeName: '',
      category: 'Helper',
      salaryAmount: '',
      advanceAmount: '',
      advancePaymentMode: 'Cash',
      salaryPaymentMode: 'Online',
      dueAmount: 0,
      paymentStatus: 'Pending',
    },
    tripAmount: '',
    paymentStatus: 'Pending',
    tripStatus: 'Scheduled',
    tripType: 'Full-Day',
    remarks: '',
  };

  const [formData, setFormData] = useState(initialCrewState);

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

      // Extract Driver 1 (or legacy assignedEmployee)
      const d1Emp = trip.driver1?.employee?._id || trip.driver1?.employee || trip.assignedEmployee?._id || trip.assignedEmployee || '';
      const d1Sal = trip.driver1?.salaryAmount !== undefined && trip.driver1?.salaryAmount !== null
        ? trip.driver1.salaryAmount
        : (trip.salaryAmount !== undefined ? trip.salaryAmount : trip.employeePayout || '');
      const d1Adv = trip.driver1?.advanceAmount !== undefined && trip.driver1?.advanceAmount !== null
        ? trip.driver1.advanceAmount
        : (trip.advanceAmount || '');

      setFormData({
        tripDate: sDate,
        startDate: sDate,
        endDate: eDate,
        totalDays: days,
        vehicleNumber: trip.vehicleNumber || '',
        vehicleStatus: trip.vehicleStatus || 'RUN',
        route: trip.route?._id || trip.route || '',
        routeName: trip.routeName || '',
        operator: trip.operator?._id || trip.operator || '',
        operatorName: trip.operatorName || (trip.operator?.name || ''),
        clientName: trip.clientName || '',
        clientPhone: trip.clientPhone || '',
        pickupLocation: trip.pickupLocation || '',
        dropLocation: trip.dropLocation || '',
        // Driver 1
        driver1: {
          employee: d1Emp,
          employeeName: trip.driver1?.employeeName || trip.assignedEmployeeName || '',
          category: trip.driver1?.category || trip.category || 'Driver',
          salaryAmount: d1Sal,
          advanceAmount: d1Adv,
          advancePaymentMode: trip.driver1?.advancePaymentMode || trip.advancePaymentMode || 'Cash',
          salaryPaymentMode: trip.driver1?.salaryPaymentMode || trip.salaryPaymentMode || 'Online',
          dueAmount: trip.driver1?.dueAmount !== undefined ? trip.driver1.dueAmount : calculateComputedDue(d1Sal, d1Adv, trip.paymentStatus),
          paymentStatus: trip.driver1?.paymentStatus || trip.paymentStatus || 'Pending',
        },
        // Driver 2
        driver2: {
          employee: trip.driver2?.employee?._id || trip.driver2?.employee || '',
          employeeName: trip.driver2?.employeeName || '',
          category: trip.driver2?.category || 'Driver',
          salaryAmount: trip.driver2?.salaryAmount !== undefined ? trip.driver2.salaryAmount : '',
          advanceAmount: trip.driver2?.advanceAmount !== undefined ? trip.driver2.advanceAmount : '',
          advancePaymentMode: trip.driver2?.advancePaymentMode || 'Cash',
          salaryPaymentMode: trip.driver2?.salaryPaymentMode || 'Online',
          dueAmount: trip.driver2?.dueAmount !== undefined ? trip.driver2.dueAmount : 0,
          paymentStatus: trip.driver2?.paymentStatus || 'Pending',
        },
        // Helper
        helper: {
          employee: trip.helper?.employee?._id || trip.helper?.employee || '',
          employeeName: trip.helper?.employeeName || '',
          category: trip.helper?.category || 'Helper',
          salaryAmount: trip.helper?.salaryAmount !== undefined ? trip.helper.salaryAmount : '',
          advanceAmount: trip.helper?.advanceAmount !== undefined ? trip.helper.advanceAmount : '',
          advancePaymentMode: trip.helper?.advancePaymentMode || 'Cash',
          salaryPaymentMode: trip.helper?.salaryPaymentMode || 'Online',
          dueAmount: trip.helper?.dueAmount !== undefined ? trip.helper.dueAmount : 0,
          paymentStatus: trip.helper?.paymentStatus || 'Pending',
        },
        tripAmount: trip.tripAmount !== undefined && trip.tripAmount !== null ? trip.tripAmount : '',
        paymentStatus: trip.paymentStatus || 'Pending',
        tripStatus: trip.tripStatus || 'Scheduled',
        tripType: trip.tripType || 'Full-Day',
        remarks: trip.remarks || '',
      });
    } else {
      setEditingTrip(null);
      const today = new Date().toISOString().slice(0, 10);
      setFormData({
        ...initialCrewState,
        tripDate: today,
        startDate: today,
        endDate: today,
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

  const handleDriver1Select = (empId) => {
    const selected = employees.find((e) => String(e._id) === String(empId));
    setFormData((prev) => ({
      ...prev,
      driver1: {
        ...prev.driver1,
        employee: empId,
        employeeName: selected ? selected.name : '',
        category: selected ? selected.category : 'Driver',
      },
    }));
  };

  const handleDriver2Select = (empId) => {
    const selected = employees.find((e) => String(e._id) === String(empId));
    setFormData((prev) => ({
      ...prev,
      driver2: {
        ...prev.driver2,
        employee: empId,
        employeeName: selected ? selected.name : '',
        category: selected ? selected.category : 'Driver',
      },
    }));
  };

  const handleHelperSelect = (empId) => {
    const selected = employees.find((e) => String(e._id) === String(empId));
    setFormData((prev) => ({
      ...prev,
      helper: {
        ...prev.helper,
        employee: empId,
        employeeName: selected ? selected.name : '',
        category: selected ? selected.category : 'Helper',
      },
    }));
  };

  // Calculate live total crew amounts
  const totalCrewSalary = 
    (formData.driver1.salaryAmount !== '' ? Number(formData.driver1.salaryAmount) : 0) +
    (formData.driver2.employee && formData.driver2.salaryAmount !== '' ? Number(formData.driver2.salaryAmount) : 0) +
    (formData.helper.employee && formData.helper.salaryAmount !== '' ? Number(formData.helper.salaryAmount) : 0);

  const totalCrewAdvance = 
    (formData.driver1.advanceAmount !== '' ? Number(formData.driver1.advanceAmount) : 0) +
    (formData.driver2.employee && formData.driver2.advanceAmount !== '' ? Number(formData.driver2.advanceAmount) : 0) +
    (formData.helper.employee && formData.helper.advanceAmount !== '' ? Number(formData.helper.advanceAmount) : 0);

  const totalCrewDue = formData.paymentStatus === 'Paid' ? 0 : Math.max(0, totalCrewSalary - totalCrewAdvance);

  const handleSaveTrip = async (e) => {
    e.preventDefault();
    if (!formData.driver1.employee) {
      alert('Please assign Driver 1 for this task.');
      return;
    }

    // License and block verification for assigned crew
    const d1Emp = employees.find((e) => String(e._id) === String(formData.driver1.employee));
    if (d1Emp) {
      const check1 = checkEmployeeLicenseForTask(d1Emp, formData.startDate);
      if (check1.blocked) {
        alert(`❌ Cannot allot ${d1Emp.name} (Driver 1)!\n\nReason: ${check1.reason}`);
        return;
      }
    }

    if (formData.driver2.employee) {
      const d2Emp = employees.find((e) => String(e._id) === String(formData.driver2.employee));
      if (d2Emp) {
        const check2 = checkEmployeeLicenseForTask(d2Emp, formData.startDate);
        if (check2.blocked) {
          alert(`❌ Cannot allot ${d2Emp.name} (Driver 2)!\n\nReason: ${check2.reason}`);
          return;
        }
      }
    }

    if (formData.helper.employee) {
      const hEmp = employees.find((e) => String(e._id) === String(formData.helper.employee));
      if (hEmp) {
        const checkH = checkEmployeeLicenseForTask(hEmp, formData.startDate);
        if (checkH.blocked) {
          alert(`❌ Cannot allot ${hEmp.name} (Helper)!\n\nReason: ${checkH.reason}`);
          return;
        }
      }
    }

    const d1Sal = Number(formData.driver1.salaryAmount || 0);
    const d1Adv = Number(formData.driver1.advanceAmount || 0);
    const d1Status = formData.driver1.paymentStatus || 'Pending';
    const d1Due = d1Status === 'Paid' ? 0 : Math.max(0, d1Sal - d1Adv);

    const d2Sal = Number(formData.driver2.salaryAmount || 0);
    const d2Adv = Number(formData.driver2.advanceAmount || 0);
    const d2Status = formData.driver2.paymentStatus || 'Pending';
    const d2Due = d2Status === 'Paid' ? 0 : Math.max(0, d2Sal - d2Adv);

    const helperSal = Number(formData.helper.salaryAmount || 0);
    const helperAdv = Number(formData.helper.advanceAmount || 0);
    const helperStatus = formData.helper.paymentStatus || 'Pending';
    const helperDue = helperStatus === 'Paid' ? 0 : Math.max(0, helperSal - helperAdv);

    const totalSalaryCalc = d1Sal + (formData.driver2.employee ? d2Sal : 0) + (formData.helper.employee ? helperSal : 0);
    const totalAdvanceCalc = d1Adv + (formData.driver2.employee ? d2Adv : 0) + (formData.helper.employee ? helperAdv : 0);
    const totalDueCalc = d1Due + (formData.driver2.employee ? d2Due : 0) + (formData.helper.employee ? helperDue : 0);

    const allMembersPaid = (d1Status === 'Paid') &&
      (!formData.driver2.employee || d2Status === 'Paid') &&
      (!formData.helper.employee || helperStatus === 'Paid');

    const overallPaymentStatus = allMembersPaid ? 'Paid' : 'Pending';

    const payload = {
      ...formData,
      assignedEmployee: formData.driver1.employee,
      assignedEmployeeName: formData.driver1.employeeName,
      category: formData.driver1.category || 'Driver',
      paymentStatus: overallPaymentStatus,
      driver1: {
        ...formData.driver1,
        salaryAmount: d1Sal,
        advanceAmount: d1Adv,
        dueAmount: d1Due,
        paymentStatus: d1Status,
      },
      driver2: formData.driver2.employee ? {
        ...formData.driver2,
        salaryAmount: d2Sal,
        advanceAmount: d2Adv,
        dueAmount: d2Due,
        paymentStatus: d2Status,
      } : undefined,
      helper: formData.helper.employee ? {
        ...formData.helper,
        salaryAmount: helperSal,
        advanceAmount: helperAdv,
        dueAmount: helperDue,
        paymentStatus: helperStatus,
      } : undefined,
      salaryAmount: totalSalaryCalc,
      employeePayout: totalSalaryCalc,
      advanceAmount: totalAdvanceCalc,
      dueAmount: totalDueCalc,
      tripAmount: totalSalaryCalc,
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
        ...(task.driver1 ? { 'driver1.paymentStatus': 'Paid', 'driver1.dueAmount': 0 } : {}),
        ...(task.driver2 ? { 'driver2.paymentStatus': 'Paid', 'driver2.dueAmount': 0 } : {}),
        ...(task.helper ? { 'helper.paymentStatus': 'Paid', 'helper.dueAmount': 0 } : {}),
      });
      fetchTrips();
    } catch (err) {
      console.error('Error updating payment status:', err);
      alert('Failed to update status to Paid');
    }
  };

  const handleMarkCompleted = async (task) => {
    try {
      await api.put(`/trips/${task._id}`, {
        tripStatus: 'Completed',
      });
      fetchTrips();
    } catch (err) {
      console.error('Error marking task as completed:', err);
      alert('Failed to update task to Completed status.');
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

  // Helper to extract assigned crew list from a task record
  const getTaskCrewList = (task) => {
    const crew = [];

    // Driver 1
    if (task.driver1?.employee || task.assignedEmployee) {
      const emp = task.driver1?.employee && typeof task.driver1.employee === 'object' 
        ? task.driver1.employee 
        : (task.assignedEmployee && typeof task.assignedEmployee === 'object' ? task.assignedEmployee : null);
      
      const name = emp?.name || task.driver1?.employeeName || task.assignedEmployeeName || 'Driver 1';
      const category = emp?.category || task.driver1?.category || task.category || 'Driver';
      const salary = task.driver1?.salaryAmount !== undefined ? task.driver1.salaryAmount : (task.salaryAmount || task.employeePayout || 0);
      const advance = task.driver1?.advanceAmount !== undefined ? task.driver1.advanceAmount : (task.advanceAmount || 0);

      crew.push({
        role: 'Driver 1',
        name,
        category,
        salary,
        advance,
        advanceMode: task.driver1?.advancePaymentMode || task.advancePaymentMode || 'Cash',
        salaryMode: task.driver1?.salaryPaymentMode || task.salaryPaymentMode || 'Online',
        photo: emp?.photo,
        isBlocked: emp?.isBlocked || emp?.status === 'Blocked',
      });
    }

    // Driver 2
    if (task.driver2?.employee) {
      const emp = typeof task.driver2.employee === 'object' ? task.driver2.employee : null;
      const name = emp?.name || task.driver2.employeeName || 'Driver 2';
      const category = emp?.category || task.driver2.category || 'Driver';
      const salary = task.driver2.salaryAmount || 0;
      const advance = task.driver2.advanceAmount || 0;

      crew.push({
        role: 'Driver 2',
        name,
        category,
        salary,
        advance,
        advanceMode: task.driver2.advancePaymentMode || 'Cash',
        salaryMode: task.driver2.salaryPaymentMode || 'Online',
        photo: emp?.photo,
        isBlocked: emp?.isBlocked || emp?.status === 'Blocked',
      });
    }

    // Helper
    if (task.helper?.employee) {
      const emp = typeof task.helper.employee === 'object' ? task.helper.employee : null;
      const name = emp?.name || task.helper.employeeName || 'Helper';
      const category = emp?.category || task.helper.category || 'Helper';
      const salary = task.helper.salaryAmount || 0;
      const advance = task.helper.advanceAmount || 0;

      crew.push({
        role: 'Helper',
        name,
        category,
        salary,
        advance,
        advanceMode: task.helper.advancePaymentMode || 'Cash',
        salaryMode: task.helper.salaryPaymentMode || 'Online',
        photo: emp?.photo,
        isBlocked: emp?.isBlocked || emp?.status === 'Blocked',
      });
    }

    return crew;
  };

  const handleExportExcel = () => {
    if (trips.length === 0) {
      alert('No task records to export.');
      return;
    }

    const exportData = trips.map((task, idx) => {
      const crewList = getTaskCrewList(task);
      const d1 = crewList.find((c) => c.role === 'Driver 1');
      const d2 = crewList.find((c) => c.role === 'Driver 2');
      const helper = crewList.find((c) => c.role === 'Helper');

      const sDateObj = task.startDate ? new Date(task.startDate) : (task.tripDate ? new Date(task.tripDate) : null);
      const eDateObj = task.endDate ? new Date(task.endDate) : sDateObj;
      const sDateStr = sDateObj ? sDateObj.toLocaleDateString('en-IN') : '';
      const eDateStr = eDateObj ? eDateObj.toLocaleDateString('en-IN') : '';

      const isPaid = task.paymentStatus === 'Paid';
      const due = isPaid ? 0 : (task.dueAmount !== undefined ? task.dueAmount : Math.max(0, (task.salaryAmount || 0) - (task.advanceAmount || 0)));

      return {
        'S.No': idx + 1,
        'Task #': task.tripNumber || '',
        'Start Date': sDateStr,
        'End Date': eDateStr,
        'Duty Days': task.totalDays || 1,
        'Vehicle Number': task.vehicleNumber || 'N/A',
        'Vehicle Status': task.vehicleStatus || 'RUN',
        'Route Corridor': task.routeName || (task.pickupLocation ? `${task.pickupLocation} → ${task.dropLocation || ''}` : 'N/A'),
        'Operator / Organizer': task.operatorName || task.operator?.name || task.clientName || 'N/A',
        'Driver 1 Name': d1 ? d1.name : 'N/A',
        'Driver 1 Category': d1 ? d1.category : '',
        'Driver 1 Salary (₹)': d1 ? d1.salary : 0,
        'Driver 1 Advance (₹)': d1 ? d1.advance : 0,
        'Driver 1 Advance Mode': d1 ? d1.advanceMode : '',
        'Driver 2 Name': d2 ? d2.name : 'N/A',
        'Driver 2 Salary (₹)': d2 ? d2.salary : 0,
        'Driver 2 Advance (₹)': d2 ? d2.advance : 0,
        'Driver 2 Advance Mode': d2 ? d2.advanceMode : '',
        'Helper Name': helper ? helper.name : 'N/A',
        'Helper Salary (₹)': helper ? helper.salary : 0,
        'Helper Advance (₹)': helper ? helper.advance : 0,
        'Helper Advance Mode': helper ? helper.advanceMode : '',
        'Total Crew Salary (₹)': task.salaryAmount || task.employeePayout || 0,
        'Total Advance Paid (₹)': task.advanceAmount || 0,
        'Remaining Due (₹)': due,
        'Payment Status': task.paymentStatus || 'Pending',
        'Task Status': task.tripStatus || 'Scheduled',
        'Remarks': task.remarks || '',
      };
    });

    const activeFilterTag = [
      category !== 'All' ? category : '',
      tripStatus !== 'All' ? tripStatus : '',
      paymentStatus !== 'All' ? paymentStatus : '',
    ].filter(Boolean).join('_') || 'All';

    exportToExcel(exportData, `SSRC_Tasks_${activeFilterTag}`, 'Tasks_Report');
  };

  // Calculate pagination slices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrips = trips.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(trips.length / itemsPerPage));

  return (
    <>
      <SEOHead title="Task Management & Multi-Staff Dispatch - SSRC Admin" noindex={true} />

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
              Multi-crew assignment (Driver 1, Driver 2, Helper) with individual advance &amp; salary ledger tracking.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
              title="Download Filtered Task Records as Excel"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export Excel ({trips.length})</span>
            </button>

            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-sm shadow-md shadow-amber-500/20 hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>Log New Task</span>
            </button>
          </div>
        </div>

        {/* Financial Summary Strip */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Staff Salary</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">₹{summary.totalSalary || summary.totalPayout || 0}</div>
              <span className="text-[10px] text-slate-500 font-medium">Billed to Crew Members</span>
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
                placeholder="Search task #, vehicle, route, crew, operator..."
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
                    <th className="py-3.5 px-4">Assigned Crew (3 Members)</th>
                    <th className="py-3.5 px-4">Advance Records</th>
                    <th className="py-3.5 px-4">Salary &amp; Due</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Remarks</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentTrips.map((task) => {
                    const crewList = getTaskCrewList(task);
                    const sDateObj = task.startDate ? new Date(task.startDate) : new Date(task.tripDate);
                    const eDateObj = task.endDate ? new Date(task.endDate) : sDateObj;
                    const isMultiDay = sDateObj.toDateString() !== eDateObj.toDateString();

                    const isPaid = task.paymentStatus === 'Paid';
                    const isCompleted = task.tripStatus === 'Completed';
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
                            <div className="flex items-center gap-1.5 flex-wrap mb-1">
                              <span className="font-mono font-extrabold text-slate-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs inline-block">
                                {task.vehicleNumber}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                                task.vehicleStatus === 'HOLD'
                                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              }`}>
                                {task.vehicleStatus || 'RUN'}
                              </span>
                            </div>
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

                        {/* Assigned Crew (Driver 1, Driver 2, Helper) */}
                        <td className="py-3.5 px-4 min-w-[200px]">
                          <div className="space-y-1.5">
                            {crewList.map((member, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/80">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                                    member.role === 'Driver 1' ? 'bg-amber-100 text-amber-900' :
                                    member.role === 'Driver 2' ? 'bg-blue-100 text-blue-900' :
                                    'bg-emerald-100 text-emerald-900'
                                  }`}>
                                    {member.role}
                                  </span>
                                  <span className="font-bold text-slate-900 truncate">{member.name}</span>
                                </div>
                                <span className="text-[10px] font-mono font-bold text-slate-600 shrink-0 ml-1">
                                  ₹{member.salary}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Advance Amount Records per member */}
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-amber-800 text-sm">
                            ₹{task.advanceAmount || 0}
                          </div>
                          <div className="space-y-0.5 mt-1">
                            {crewList.map((member, idx) => (
                              <div key={idx} className="text-[10px] text-slate-500 font-medium flex items-center justify-between gap-1">
                                <span>{member.role}:</span>
                                <span className="font-bold text-amber-900">₹{member.advance} ({member.advanceMode})</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Salary Amount & Due */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-baseline gap-1">
                            <span className="font-black text-slate-900 text-sm">₹{task.salaryAmount || task.employeePayout || 0}</span>
                            <span className="text-[10px] text-slate-400 font-medium">(Total Crew)</span>
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

                        {/* Status (Trip Status & Payment Status) */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] text-center ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : task.tripStatus === 'In Progress'
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}>
                              {task.tripStatus || 'Scheduled'}
                            </span>
                            <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] text-center ${
                              isPaid
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}>
                              {isPaid ? 'Paid' : 'Pending Due'}
                            </span>
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
                            
                            {/* Mark as Completed Button */}
                            {!isCompleted && (
                              <button
                                onClick={() => handleMarkCompleted(task)}
                                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[10px] border border-blue-200 flex items-center gap-1 transition-colors cursor-pointer"
                                title="Mark Task as Completed"
                              >
                                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                <span>Mark Completed</span>
                              </button>
                            )}

                            {/* Mark Paid Button */}
                            {!isPaid && (
                              <button
                                onClick={() => handleQuickMarkPaid(task)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
                                title="Mark Salary as Paid (Due = 0)"
                              >
                                <Check className="w-3 h-3 text-emerald-600" />
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
        <div className="fixed inset-x-0 top-0 bottom-[60px] sm:bottom-0 z-40 sm:z-50 bg-slate-950/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative bg-white rounded-t-[28px] sm:rounded-3xl w-full max-w-5xl xl:max-w-6xl max-h-full sm:max-h-[94vh] shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
            
            {/* Top Accent Gradient Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shrink-0" />

            {/* Modal Header */}
            <div className="bg-white px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0 z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                    Task Dispatch &amp; Crew Allocation
                  </span>
                  {editingTrip && (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                      {editingTrip.tripNumber}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {editingTrip ? `Edit Task Record: ${editingTrip.tripNumber}` : 'Log New Task & Multi-Staff Duty'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Assign up to 3 crew members (Driver 1, Driver 2, Helper) with independent advance &amp; salary records.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-all shrink-0 active:scale-95 cursor-pointer shadow-2xs"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form id="task-dispatch-form" onSubmit={handleSaveTrip} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              
              {/* 1. Task Core Parameters (4-Column Grid) */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    1. Task Details &amp; Operational Route
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Task Start Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <Calendar className="w-3.5 h-3.5 inline text-amber-600 mr-1" />
                      Task Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500 bg-white shadow-2xs"
                    />
                  </div>

                  {/* Vehicle Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <Truck className="w-3.5 h-3.5 inline text-amber-600 mr-1" />
                      Vehicle Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AP 28 TE 4567"
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono font-bold focus:outline-none focus:border-amber-500 uppercase placeholder:normal-case bg-white shadow-2xs"
                    />
                  </div>

                  {/* Vehicle Status (RUN / HOLD) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <Car className="w-3.5 h-3.5 inline text-amber-600 mr-1" />
                      Vehicle Status *
                    </label>
                    <select
                      value={formData.vehicleStatus || 'RUN'}
                      onChange={(e) => setFormData({ ...formData, vehicleStatus: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500 bg-white shadow-2xs"
                    >
                      <option value="RUN">🟢 RUN</option>
                      <option value="HOLD">🔴 HOLD</option>
                    </select>
                  </div>

                  {/* Route Corridor */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <MapPin className="w-3.5 h-3.5 inline text-amber-600 mr-1" />
                      Route Corridor *
                    </label>
                    <select
                      required
                      value={formData.route}
                      onChange={(e) => handleRouteChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500 bg-white shadow-2xs"
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

                  {/* Operator / Organizer */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <Building className="w-3.5 h-3.5 inline text-amber-600 mr-1" />
                      Operator / Organizer *
                    </label>
                    <select
                      required
                      value={formData.operator}
                      onChange={(e) => handleOperatorChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500 bg-white shadow-2xs"
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
              </div>

              {/* 2. Multi-Member Crew Allocation (3 Members: Driver 1, Driver 2, Helper) */}
              <div className="space-y-5 pt-1">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                      2. Crew Assignment &amp; Separate Financial Split (Up to 3 Members)
                    </h4>
                  </div>
                  <span className="text-[10px] sm:text-xs text-amber-900 bg-amber-50 px-3 py-1 rounded-full font-bold border border-amber-200">
                    Individual Advance &amp; Salary Records
                  </span>
                </div>

                {/* MEMBER 1: DRIVER 1 (Primary) */}
                <div className="bg-amber-50/40 rounded-2xl p-5 sm:p-6 border border-amber-200/90 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-black text-amber-950 flex items-center gap-2 uppercase tracking-wide">
                      <Car className="w-4 h-4 text-amber-700" />
                      1. Driver 1 (Lead Driver / Captain) *
                    </span>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded">
                      Required
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Select Driver 1 Employee *
                    </label>
                    <select
                      required
                      value={formData.driver1.employee}
                      onChange={(e) => handleDriver1Select(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500 bg-white shadow-2xs"
                    >
                      <option value="">-- Select Driver 1 --</option>
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
                  </div>

                  {/* DUTY FINANCIALS & SPLIT PAYMENTS Card - Driver 1 (Salary First, Advance Second) */}
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                      <span className="text-xs sm:text-sm font-black text-amber-950 flex items-center gap-1.5 uppercase tracking-wide">
                        <span className="text-amber-600 font-black text-base">$</span>
                        DUTY FINANCIALS &amp; SPLIT PAYMENTS
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300 px-3 py-0.5 rounded-full shadow-2xs">
                        Salary + Advance
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 1. Salary Amount (Total to Pay) */}
                      <div className="bg-amber-50/20 p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1.5">
                            1. Salary Amount (Total to Pay) ₹ *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            placeholder="e.g. 1500"
                            value={formData.driver1.salaryAmount}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                driver1: { ...formData.driver1, salaryAmount: e.target.value },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500 bg-white"
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 font-medium">
                          Total duty payment allocated for the employee.
                        </p>
                      </div>

                      {/* 2. Advance Amount (Given) */}
                      <div className="bg-amber-50/20 p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1.5">
                            2. Advance Amount (Given) ₹
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder="e.g. 500"
                            value={formData.driver1.advanceAmount}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                driver1: { ...formData.driver1, advanceAmount: e.target.value },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                            ADVANCE PAYMENT MODE
                          </label>
                          <select
                            value={formData.driver1.advancePaymentMode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                driver1: { ...formData.driver1, advancePaymentMode: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-amber-500"
                          >
                            <option value="Cash">Cash</option>
                            <option value="Online">Online / UPI</option>
                            <option value="UPI">UPI</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cheque">Cheque</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status & Remaining Due */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 items-center">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Payment Status *
                        </label>
                        <select
                          value={formData.driver1.paymentStatus || 'Pending'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              driver1: { ...formData.driver1, paymentStatus: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 bg-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="Pending">Pending (Due Active)</option>
                          <option value="Paid">Paid (Settled)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Settlement Mode (When Paid)
                        </label>
                        <select
                          value={formData.driver1.salaryPaymentMode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              driver1: { ...formData.driver1, salaryPaymentMode: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 bg-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="Online">Online / UPI</option>
                          <option value="Cash">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </div>

                      <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
                        <div>
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                            REMAINING DUE AMOUNT
                          </span>
                          <span className={`text-lg font-black block mt-0.5 ${formData.driver1.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            ₹{formData.driver1.paymentStatus === 'Paid' ? 0 : Math.max(0, (Number(formData.driver1.salaryAmount) || 0) - (Number(formData.driver1.advanceAmount) || 0))}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${formData.driver1.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>
                          {formData.driver1.paymentStatus === 'Paid' ? 'Settled' : 'Pending Due'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MEMBER 2: DRIVER 2 (Secondary Driver - Optional) */}
                <div className="bg-blue-50/40 rounded-2xl p-5 sm:p-6 border border-blue-200/90 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-black text-blue-950 flex items-center gap-2 uppercase tracking-wide">
                      <Car className="w-4 h-4 text-blue-700" />
                      2. Driver 2 (Secondary / Reliever Driver)
                    </span>
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100 border border-blue-300 px-2.5 py-0.5 rounded">
                      Optional
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Select Driver 2 Employee
                    </label>
                    <select
                      value={formData.driver2.employee}
                      onChange={(e) => handleDriver2Select(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 bg-white shadow-2xs"
                    >
                      <option value="">-- None (Single Driver Duty) --</option>
                      {employees
                        .filter((emp) => String(emp._id) !== String(formData.driver1.employee))
                        .map((emp) => {
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
                  </div>

                  {formData.driver2.employee && (
                    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-blue-200 space-y-4 shadow-sm animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                        <span className="text-xs sm:text-sm font-black text-blue-950 flex items-center gap-1.5 uppercase tracking-wide">
                          <span className="text-blue-600 font-black text-base">$</span>
                          DUTY FINANCIALS &amp; SPLIT PAYMENTS (DRIVER 2)
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-bold text-blue-900 bg-blue-100/90 border border-blue-300 px-3 py-0.5 rounded-full shadow-2xs">
                          Salary + Advance
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 1. Salary Amount (Total to Pay) */}
                        <div className="bg-blue-50/20 p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                              1. Salary Amount (Total to Pay) ₹ *
                            </label>
                            <input
                              type="number"
                              min="0"
                              placeholder="e.g. 1500"
                              value={formData.driver2.salaryAmount}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  driver2: { ...formData.driver2, salaryAmount: e.target.value },
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 bg-white"
                            />
                          </div>
                          <p className="text-[11px] text-slate-400 mt-2 font-medium">
                            Total duty payment allocated for the employee.
                          </p>
                        </div>

                        {/* 2. Advance Amount (Given) */}
                        <div className="bg-blue-50/20 p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                              2. Advance Amount (Given) ₹
                            </label>
                            <input
                              type="number"
                              min="0"
                              placeholder="e.g. 500"
                              value={formData.driver2.advanceAmount}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  driver2: { ...formData.driver2, advanceAmount: e.target.value },
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                              ADVANCE PAYMENT MODE
                            </label>
                            <select
                              value={formData.driver2.advancePaymentMode}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  driver2: { ...formData.driver2, advancePaymentMode: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-blue-500"
                            >
                              <option value="Cash">Cash</option>
                              <option value="Online">Online / UPI</option>
                              <option value="UPI">UPI</option>
                              <option value="Bank Transfer">Bank Transfer</option>
                              <option value="Cheque">Cheque</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Status & Remaining Due */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 items-center">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            Payment Status *
                          </label>
                          <select
                            value={formData.driver2.paymentStatus || 'Pending'}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                driver2: { ...formData.driver2, paymentStatus: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 bg-white focus:outline-none focus:border-blue-500"
                          >
                            <option value="Pending">Pending (Due Active)</option>
                            <option value="Paid">Paid (Settled)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            Settlement Mode (When Paid)
                          </label>
                          <select
                            value={formData.driver2.salaryPaymentMode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                driver2: { ...formData.driver2, salaryPaymentMode: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 bg-white focus:outline-none focus:border-blue-500"
                          >
                            <option value="Online">Online / UPI</option>
                            <option value="Cash">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cheque">Cheque</option>
                          </select>
                        </div>

                        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                              REMAINING DUE AMOUNT
                            </span>
                            <span className={`text-lg font-black block mt-0.5 ${formData.driver2.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              ₹{formData.driver2.paymentStatus === 'Paid' ? 0 : Math.max(0, (Number(formData.driver2.salaryAmount) || 0) - (Number(formData.driver2.advanceAmount) || 0))}
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${formData.driver2.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>
                            {formData.driver2.paymentStatus === 'Paid' ? 'Settled' : 'Pending Due'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* MEMBER 3: HELPER (Cleaner / Loading Assistant - Optional) */}
                <div className="bg-emerald-50/40 rounded-2xl p-5 sm:p-6 border border-emerald-200/90 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-2 uppercase tracking-wide">
                      <Truck className="w-4 h-4 text-emerald-700" />
                      3. Helper (Loading Assistant / Cleaner)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded">
                      Optional
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Select Helper Employee
                    </label>
                    <select
                      value={formData.helper.employee}
                      onChange={(e) => handleHelperSelect(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 bg-white shadow-2xs"
                    >
                      <option value="">-- None (No Helper Required) --</option>
                      {employees
                        .filter(
                          (emp) =>
                            String(emp._id) !== String(formData.driver1.employee) &&
                            String(emp._id) !== String(formData.driver2.employee)
                        )
                        .map((emp) => {
                          const lic = checkEmployeeLicenseForTask(emp, formData.startDate);
                          return (
                            <option 
                              key={emp._id} 
                              value={emp._id}
                              disabled={lic.blocked}
                              className={lic.blocked ? 'text-rose-600 bg-rose-50 font-bold' : ''}
                            >
                              {lic.blocked ? '🚫 ' : ''}{emp.name} ({emp.employeeId} - {emp.category})
                              {lic.blocked ? ` [BLOCKED: ${lic.reason}]` : ''}
                            </option>
                          );
                        })}
                    </select>
                  </div>

                  {formData.helper.employee && (
                    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-200 space-y-4 shadow-sm animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                        <span className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-1.5 uppercase tracking-wide">
                          <span className="text-emerald-600 font-black text-base">$</span>
                          DUTY FINANCIALS &amp; SPLIT PAYMENTS (HELPER)
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-bold text-emerald-900 bg-emerald-100/90 border border-emerald-300 px-3 py-0.5 rounded-full shadow-2xs">
                          Salary + Advance
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 1. Salary Amount (Total to Pay) */}
                        <div className="bg-emerald-50/20 p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                              1. Salary Amount (Total to Pay) ₹ *
                            </label>
                            <input
                              type="number"
                              min="0"
                              placeholder="e.g. 1500"
                              value={formData.helper.salaryAmount}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  helper: { ...formData.helper, salaryAmount: e.target.value },
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                            />
                          </div>
                          <p className="text-[11px] text-slate-400 mt-2 font-medium">
                            Total duty payment allocated for the employee.
                          </p>
                        </div>

                        {/* 2. Advance Amount (Given) */}
                        <div className="bg-emerald-50/20 p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                              2. Advance Amount (Given) ₹
                            </label>
                            <input
                              type="number"
                              min="0"
                              placeholder="e.g. 500"
                              value={formData.helper.advanceAmount}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  helper: { ...formData.helper, advanceAmount: e.target.value },
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                              ADVANCE PAYMENT MODE
                            </label>
                            <select
                              value={formData.helper.advancePaymentMode}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  helper: { ...formData.helper, advancePaymentMode: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-emerald-500"
                            >
                              <option value="Cash">Cash</option>
                              <option value="Online">Online / UPI</option>
                              <option value="UPI">UPI</option>
                              <option value="Bank Transfer">Bank Transfer</option>
                              <option value="Cheque">Cheque</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Status & Remaining Due */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 items-center">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            Payment Status *
                          </label>
                          <select
                            value={formData.helper.paymentStatus || 'Pending'}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                helper: { ...formData.helper, paymentStatus: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 bg-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value="Pending">Pending (Due Active)</option>
                            <option value="Paid">Paid (Settled)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            Settlement Mode (When Paid)
                          </label>
                          <select
                            value={formData.helper.salaryPaymentMode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                helper: { ...formData.helper, salaryPaymentMode: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 bg-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value="Online">Online / UPI</option>
                            <option value="Cash">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cheque">Cheque</option>
                          </select>
                        </div>

                        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                              REMAINING DUE AMOUNT
                            </span>
                            <span className={`text-lg font-black block mt-0.5 ${formData.helper.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              ₹{formData.helper.paymentStatus === 'Paid' ? 0 : Math.max(0, (Number(formData.helper.salaryAmount) || 0) - (Number(formData.helper.advanceAmount) || 0))}
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${formData.helper.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>
                            {formData.helper.paymentStatus === 'Paid' ? 'Settled' : 'Pending Due'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* 3. Total Financial Summary & Status Controls */}
              <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 text-white space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    3. Duty Financials Summary &amp; Status
                  </span>
                  <span className="text-xs font-extrabold text-slate-200 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 shadow-2xs">
                    Total Crew Members: {(formData.driver1.employee ? 1 : 0) + (formData.driver2.employee ? 1 : 0) + (formData.helper.employee ? 1 : 0)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Crew Salary</span>
                    <span className="text-xl sm:text-2xl font-black text-white block mt-1">₹{totalCrewSalary}</span>
                  </div>

                  <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700/80">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Total Advance Paid</span>
                    <span className="text-xl sm:text-2xl font-black text-amber-400 block mt-1">₹{totalCrewAdvance}</span>
                  </div>

                  <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700/80">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Remaining Due</span>
                    <span className={`text-xl sm:text-2xl font-black block mt-1 ${totalCrewDue === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ₹{totalCrewDue}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2 border-t border-slate-800">
                  {/* Task Status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Task Progress Status *
                    </label>
                    <select
                      value={formData.tripStatus}
                      onChange={(e) => setFormData({ ...formData, tripStatus: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs sm:text-sm font-bold text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. Trip Remarks */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  <FileText className="w-3.5 h-3.5 inline text-amber-600 mr-1" />
                  Trip Remarks (Admin Notes / Experience / Performance)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Completed route on time, disciplined behavior, good vehicle maintenance..."
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500 resize-none bg-white shadow-2xs"
                />
                <span className="text-[10px] text-slate-400 block">
                  These remarks will be permanently preserved in all assigned crew members' dossiers.
                </span>
              </div>

            </form>

            {/* Sticky Modal Action Footer */}
            <div className="bg-white border-t border-slate-200 px-4 sm:px-8 py-3.5 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 z-20 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between sm:justify-start gap-2 text-xs font-bold text-slate-600 bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-xl border border-slate-100 sm:border-0">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Tally:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-900 font-black">₹{totalCrewSalary} Total</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-amber-700 font-black">₹{totalCrewAdvance} Adv</span>
                  <span className="text-slate-300">•</span>
                  <span className={totalCrewDue === 0 ? 'text-emerald-700 font-black' : 'text-rose-600 font-black'}>
                    ₹{totalCrewDue} Due
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-center shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="task-dispatch-form"
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-xs shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer text-center"
                >
                  Save Task Record
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </>
  );
};

export default TripsPage;
