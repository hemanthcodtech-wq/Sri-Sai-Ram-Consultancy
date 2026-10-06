import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, Phone, MapPin, FileText, Calendar, IndianRupee, Car, Truck, Compass, 
  ArrowLeft, CheckCircle2, Clock, Printer, ChevronLeft, ChevronRight,
  CreditCard, Eye, BadgeCheck, Building, UserCheck, AlertTriangle, Sparkles,
  ShieldAlert, Ban, Check, X, Edit3, Trash2
} from 'lucide-react';
import api from '../../utils/api';
import logoImg from '../../assets/logo.png';
import SEOHead from '../../components/public/SEOHead';

const EmployeeProfilePage = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('biodata'); // 'biodata' or 'profile'

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ amount: '', date: new Date().toISOString().slice(0, 10), paymentType: 'Bata', mode: 'Cash', notes: '' });
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [deletingPaymentId, setDeletingPaymentId] = useState(null);

  // Pagination State (For Biodata tasks)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/employees/${id}`);
      if (res.data.success) {
        setEmployee(res.data.data.employee);
        setTrips(res.data.data.trips);
        setStats(res.data.data.stats);
      }
    } catch (err) {
      console.error('Error fetching employee profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handlePrint = () => {
    window.print();
  };

  const handlePrintPaymentReceipt = (paymentDetails) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to print the receipt.");
      return;
    }

    const { amount, date, paymentType, mode, notes } = paymentDetails;
    const formattedDate = new Date(date).toLocaleDateString('en-IN');
    const timestamp = new Date().toLocaleString('en-IN');

    const receiptHtml = `
      <html>
        <head>
          <title>Payment Receipt - ${employee.name}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #111827; }
            .receipt-container { display: flex; flex-direction: column; gap: 40px; }
            .receipt-half { border: 1px dashed #9ca3af; padding: 20px; border-radius: 8px; position: relative; }
            .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 2px solid #111827; padding-bottom: 10px; }
            .header img { height: 40px; object-fit: contain; }
            .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; text-align: center; flex: 1; }
            .header-spacer { width: 40px; }
            .copy-label { position: absolute; top: 20px; right: 20px; font-weight: bold; background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px; border: 1px solid #d1d5db; }
            .details { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .details th, .details td { padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            .details th { width: 40%; color: #6b7280; font-size: 14px; }
            .details td { font-weight: bold; font-size: 14px; }
            .signatures { display: flex; justify-content: space-between; margin-top: 40px; }
            .signature-box { text-align: center; width: 40%; }
            .signature-line { border-bottom: 1px solid #111827; margin-bottom: 5px; height: 40px; }
            .signature-text { font-size: 12px; font-weight: bold; color: #4b5563; }
            @media print {
              @page { margin: 0; size: auto; }
              body { padding: 30px; }
              .receipt-half { break-inside: avoid; border-color: #000; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <!-- Original Copy -->
            <div class="receipt-half">
              <div class="copy-label">ORIGINAL COPY</div>
              <div class="header">
                <img src="/logo.png" alt="Logo" />
                <h1>Payment Receipt</h1>
                <div class="header-spacer"></div>
              </div>
              <table class="details">
                <tr><th>Employee Name:</th><td>${employee.name}</td></tr>
                <tr><th>Employee ID:</th><td>${employee.empId || 'N/A'}</td></tr>
                <tr><th>Payment Type:</th><td>${paymentType}</td></tr>
                <tr><th>Payment Mode:</th><td>${mode}</td></tr>
                <tr><th>Date of Payment:</th><td>${formattedDate}</td></tr>
                <tr><th>Amount Paid:</th><td>Rs. ${Number(amount).toLocaleString('en-IN')}</td></tr>
                <tr><th>Notes:</th><td>${notes || 'None'}</td></tr>
                <tr><th>Generated On:</th><td>${formattedDate}</td></tr>
              </table>
              <div class="signatures">
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <div class="signature-text">Employee Signature</div>
                </div>
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <div class="signature-text">Authorized Signatory</div>
                </div>
              </div>
            </div>

            <!-- Employee Copy -->
            <div class="receipt-half">
              <div class="copy-label">EMPLOYEE COPY</div>
              <div class="header">
                <img src="/logo.png" alt="Logo" />
                <h1>Payment Receipt</h1>
                <div class="header-spacer"></div>
              </div>
              <table class="details">
                <tr><th>Employee Name:</th><td>${employee.name}</td></tr>
                <tr><th>Employee ID:</th><td>${employee.empId || 'N/A'}</td></tr>
                <tr><th>Payment Type:</th><td>${paymentType}</td></tr>
                <tr><th>Payment Mode:</th><td>${mode}</td></tr>
                <tr><th>Date of Payment:</th><td>${formattedDate}</td></tr>
                <tr><th>Amount Paid:</th><td>Rs. ${Number(amount).toLocaleString('en-IN')}</td></tr>
                <tr><th>Notes:</th><td>${notes || 'None'}</td></tr>
                <tr><th>Generated On:</th><td>${formattedDate}</td></tr>
              </table>
              <div class="signatures">
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <div class="signature-text">Employee Signature</div>
                </div>
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <div class="signature-text">Authorized Signatory</div>
                </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  };

  const handlePaymentSubmit = async (e, printReceipt = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!paymentForm.amount || Number(paymentForm.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    setIsSubmittingPayment(true);
    try {
      const res = await api.post(`/employees/${id}/pay`, paymentForm);
      if (res.data.success) {
        if (printReceipt) {
          handlePrintPaymentReceipt(paymentForm);
        }
        alert('Payment recorded and tasks updated successfully!');
        setIsPaymentModalOpen(false);
        setPaymentForm({ amount: '', date: new Date().toISOString().slice(0, 10), paymentType: 'Bata', mode: 'Cash', notes: '' });
        fetchProfile(); // Refresh data
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error recording payment');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleDeletePayment = async (payment) => {
    if (!payment._id && !payment.tripId) return;
    if (!window.confirm(`Delete the payment record for ₹${payment.amount}?`)) return;

    const paymentKey = payment._id || payment.tripId;
    setDeletingPaymentId(paymentKey);
    try {
      const endpoint = payment._id
        ? `/employees/${id}/payments/${payment._id}`
        : `/employees/${id}/task-settlements/${payment.tripId}`;
      await api.delete(endpoint);
      await fetchProfile();
    } catch (err) {
      console.error('Error deleting payment record:', err);
      alert(err.response?.data?.message || 'Failed to delete payment record. Please try again.');
    } finally {
      setDeletingPaymentId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Employee Data...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900">Employee Profile Not Found</h3>
        <Link to="/admin/employees" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  // Calculate pagination slices
  const getEmployeeTripAmounts = (trip, employeeId) => {
    const employeeIdString = String(employeeId);
    const matchingCrew = ['driver1', 'driver2', 'helper']
      .map((role) => trip[role])
      .filter((member) => member?.employee
        && String(member.employee._id || member.employee) === employeeIdString);

    if (matchingCrew.length > 0) {
      const salary = matchingCrew.reduce((total, member) => total + Number(member.salaryAmount || 0), 0);
      const due = matchingCrew.reduce((total, member) => {
        if (trip.paymentStatus === 'Paid' || member.paymentStatus === 'Paid') return total;
        return total + Number(member.dueAmount !== undefined
          ? member.dueAmount
          : Math.max(0, Number(member.salaryAmount || 0) - Number(member.advanceAmount || 0)));
      }, 0);
      return { salary, due, paid: Math.max(0, salary - due) };
    }

    const salary = Number(trip.salaryAmount || trip.employeePayout || 0);
    const due = trip.paymentStatus === 'Paid'
      ? 0
      : Number(trip.dueAmount !== undefined
        ? trip.dueAmount
        : Math.max(0, salary - Number(trip.advanceAmount || 0)));
    return { salary, due, paid: salary - due };
  };
  const paymentRecords = (employee.paymentHistory || []).length > 0
    ? employee.paymentHistory
    : trips.flatMap((trip) => {
      const { due, paid } = getEmployeeTripAmounts(trip, employee._id);
      if (paid <= 0 || due > 0) return [];
        return [{
          amount: paid,
          date: trip.updatedAt || trip.tripDate,
          tripId: trip._id,
          paymentType: 'Task Salary',
          mode: trip.salaryPaymentMode || 'Online',
          notes: `Task ${trip.tripNumber || ''} settlement`.trim(),
        }];
      });
  const getTripTimestamp = (value) => {
    const timestamp = new Date(value || 0).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  };
  const sortedTrips = [...trips].sort((a, b) =>
    getTripTimestamp(b.tripDate) - getTripTimestamp(a.tripDate) ||
    getTripTimestamp(b.createdAt) - getTripTimestamp(a.createdAt)
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrips = sortedTrips.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(sortedTrips.length / itemsPerPage));

  const formatPrintDate = (value) => (value ? new Date(value).toLocaleDateString('en-IN') : 'Not Provided');
  const printValue = (value) => value || 'Not Provided';

  // Print Signatures Component
  const PrintSignatures = () => (
    <div className="hidden print:block mt-24 w-full">
      <div className="flex justify-between items-end border-t border-slate-300 pt-8 mt-12">
        <div className="text-left flex flex-col gap-2">
          <div className="flex items-end gap-2">
            <span className="font-bold text-slate-800 text-sm">Date:</span>
            <div className="w-32 border-b-2 border-slate-800"></div>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-bold text-slate-800 text-sm">Place:</span>
            <div className="w-32 border-b-2 border-slate-800"></div>
          </div>
        </div>
        <div className="text-center">
          <div className="w-48 border-b-2 border-slate-800 mb-2"></div>
          <span className="font-bold text-slate-800 text-sm">Signature & Stamp</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SEOHead title={`${employee.name} - SSRC Admin`} noindex={true} />

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
          }

          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible !important;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            min-height: 100vh;
            padding: 24px 48px !important;
            box-sizing: border-box;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-before: always;
          }

          .print-document-sheet {
            color: #111827;
            font-size: 11px;
          }
          .print-document-intro {
            border-bottom: 2px solid #111827;
            padding: 0 0 8px;
            margin-bottom: 10px;
          }
          .print-document-intro h2 {
            font-size: 18px;
            margin: 0;
            text-transform: uppercase;
          }
          .print-document-intro p {
            margin: 4px 0 0;
            font-weight: 700;
          }
          .print-document-table {
            width: 100%;
            border-collapse: collapse;
          }
          .print-document-table th,
          .print-document-table td {
            border: 0;
            padding: 6px 6px;
            text-align: left;
            vertical-align: middle;
          }
          .print-document-table th {
            width: 42%;
            font-weight: 700;
          }
          .print-document-table td {
            font-weight: 600;
          }
          .print-document-photo,
          .print-document-user-icon {
            width: 48px;
            height: 48px;
            object-fit: cover;
            border: 1px solid #374151;
          }
          .print-document-user-icon {
            padding: 10px;
            color: #6b7280;
          }
          .print-profile-sheet .print-profile-section {
            background: #fff !important;
            border: 0 !important;
            border-bottom: 1px solid #1f2937 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .print-profile-sheet .print-profile-photo,
          .print-profile-sheet .print-profile-call {
            display: none !important;
          }
          .print-profile-sheet .print-profile-identity {
            display: block !important;
            padding: 14px 16px !important;
          }
          .print-profile-sheet .print-profile-identity > div:first-child {
            display: block !important;
          }
          .print-profile-sheet .print-profile-identity h2 {
            font-size: 18px !important;
          }
          .print-profile-sheet .print-profile-identity .flex-wrap {
            margin-top: 6px !important;
          }
          .print-profile-sheet .print-profile-personal {
            border-bottom-color: #1f2937 !important;
            border-radius: 0 !important;
            background: #fff !important;
          }
          .print-profile-sheet .print-profile-personal > div {
            border-color: #d1d5db !important;
          }
          .print-profile-sheet .print-profile-section h3 {
            color: #111827 !important;
          }
          .print-profile-sheet .print-profile-section svg {
            display: none !important;
          }
          .print-profile-sheet .rounded-full {
            background: #fff !important;
            color: #111827 !important;
            border: 0 !important;
          }
        }
      `}</style>

      <div className="space-y-6 max-w-5xl mx-auto w-full min-w-0">
        {/* Header (No print) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4 no-print">
          <div className="flex items-center gap-3">
            <Link to="/admin/employees" className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{employee.name} - Employee Profile</h1>
              <p className="text-xs text-slate-500">Official employee record</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs hover:bg-emerald-100 transition-colors"
            >
              <IndianRupee className="w-4 h-4" />
              <span>Record Payment</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print {activeTab === 'biodata' ? 'Biodata' : 'Profile'}</span>
            </button>
          </div>
        </div>

        {/* Tabs (No print) */}
        <div className="flex items-center gap-2 no-print">
          <button
            onClick={() => setActiveTab('biodata')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
              activeTab === 'biodata' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Biodata Sheet
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
              activeTab === 'profile' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Profile Sheet (Documents)
          </button>
        </div>

        {/* Printable Area */}
        <div className="print-area bg-white p-0 sm:p-8 rounded-2xl shadow-sm border border-slate-200 sm:border-none sm:shadow-none min-h-screen">
          
          {/* Print Header */}
          <div className="hidden print:flex flex-col items-center justify-center mb-8 border-b-4 border-amber-500 pb-4">
            <img src={logoImg} alt="SSRC Logo" className="h-12 mb-2" />
            <h1 className="text-3xl font-black text-slate-900 uppercase">Sri Sai Ram Consultancy</h1>
            <h2 className="text-xl font-bold text-slate-700 uppercase mt-1">
              {activeTab === 'biodata' ? 'Employee Biodata Sheet' : 'Employee Profile & Documents'}
            </h2>
          </div>

          {activeTab === 'biodata' ? (
            <div className="space-y-6">
              {/* Biodata Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 text-sm">
                <div className="flex items-baseline gap-2"><span className="font-bold text-slate-500 text-xs uppercase shrink-0">Full Name:</span> <span className="font-semibold text-slate-900">{employee.name}</span></div>
                <div className="flex items-baseline gap-2"><span className="font-bold text-slate-500 text-xs uppercase shrink-0">Role:</span> <span className="font-semibold text-slate-900">{employee.category}</span></div>
                <div className="flex items-baseline gap-2"><span className="font-bold text-slate-500 text-xs uppercase shrink-0">Contact Number:</span> <span className="font-semibold text-slate-900">{employee.mobileNumber}</span></div>
                <div className="flex items-baseline gap-2"><span className="font-bold text-slate-500 text-xs uppercase shrink-0">Gender:</span> <span className="font-semibold text-slate-900">{employee.gender || '-'}</span></div>
                <div className="flex items-baseline gap-2"><span className="font-bold text-slate-500 text-xs uppercase shrink-0">Email:</span> <span className="font-semibold text-slate-900">{employee.email || '-'}</span></div>
                <div className="flex items-baseline gap-2"><span className="font-bold text-slate-500 text-xs uppercase shrink-0">Date of Birth:</span> <span className="font-semibold text-slate-900">{employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : '-'}</span></div>
                <div className="flex items-baseline gap-2"><span className="font-bold text-slate-500 text-xs uppercase shrink-0">Blood Group:</span> <span className="font-semibold text-slate-900">{employee.bloodGroup || '-'}</span></div>
                <div className="flex items-baseline gap-2"><span className="font-bold text-slate-500 text-xs uppercase shrink-0">Nationality:</span> <span className="font-semibold text-slate-900">{employee.nationality || '-'}</span></div>
                <div className="sm:col-span-2 flex items-baseline gap-2 min-w-0"><span className="font-bold text-slate-500 text-xs uppercase shrink-0">Residential Address:</span> <span className="font-semibold text-slate-900 break-words">{employee.address?.fullAddress || employee.address?.street || '-'}</span></div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="min-w-0 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Total Salary Earned</p>
                  <p className="text-2xl font-black text-amber-900">₹{stats?.totalSalary || 0}</p>
                  <p className="text-xs text-amber-600 mt-1">Billed Staff Fees</p>
                </div>
                <div className="min-w-0 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">Total Paid</p>
                  <p className="text-2xl font-black text-emerald-900">₹{Math.max(0, (stats?.totalSalary || 0) - (stats?.totalDue || 0))}</p>
                  <p className="text-xs text-emerald-600 mt-1">Salary − Remaining Due</p>
                </div>
                <div className="min-w-0 rounded-xl border border-rose-200 bg-rose-50 p-4">
                  <p className="text-xs font-bold text-rose-700 uppercase tracking-wide mb-1">Remaining Due</p>
                  <p className="text-2xl font-black text-rose-900">₹{stats?.totalDue || 0}</p>
                  <p className="text-xs text-rose-600 mt-1">Pending Payment</p>
                </div>
              </div>

              {/* Tasks Table */}
              <div className="mt-4">
                <h3 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">Records of Trips</h3>
                <div className="space-y-3 sm:hidden">
                  {currentTrips.map((trip) => {
                    const { salary, paid, due } = getEmployeeTripAmounts(trip, employee._id);
                    return (
                      <article key={trip._id} className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-700">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900">{new Date(trip.tripDate).toLocaleDateString()}</p>
                            <p className="mt-1 break-words">{trip.routeName || `${trip.pickupLocation} to ${trip.dropLocation}`}</p>
                          </div>
                          <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">Trip</span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                          <div><p className="text-[10px] font-bold uppercase text-slate-500">Salary</p><p className="mt-0.5 font-bold text-slate-900">₹{salary}</p></div>
                          <div><p className="text-[10px] font-bold uppercase text-slate-500">Paid</p><p className="mt-0.5 font-bold text-emerald-700">₹{paid > 0 ? paid : 0}</p></div>
                          <div><p className="text-[10px] font-bold uppercase text-slate-500">Remaining Due</p><p className="mt-0.5 font-bold text-rose-600">₹{due}</p></div>
                        </div>
                      </article>
                    );
                  })}
                </div>
                <div className="hidden overflow-x-auto sm:block">
                  <table className="w-full min-w-[720px] table-fixed text-left text-xs text-slate-700 border border-slate-200">
                    <colgroup>
                      <col className="w-[15%]" />
                      <col className="w-[35%]" />
                      <col className="w-[17%]" />
                      <col className="w-[16%]" />
                      <col className="w-[17%]" />
                    </colgroup>
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 border-r border-slate-200">Date</th>
                        <th className="py-2 px-3 border-r border-slate-200">Task Details</th>
                        <th className="py-2 px-3 border-r border-slate-200">Salary Amount</th>
                        <th className="py-2 px-3 border-r border-slate-200">Paid Amount</th>
                        <th className="py-2 px-3">Remaining Due</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTrips.map((trip) => {
                        const { salary, paid, due } = getEmployeeTripAmounts(trip, employee._id);
                        return (
                          <tr key={trip._id} className="border-b border-slate-100">
                            <td className="py-2 px-3 border-r border-slate-100">{new Date(trip.tripDate).toLocaleDateString()}</td>
                            <td className="py-2 px-3 border-r border-slate-100 break-words">{trip.routeName || `${trip.pickupLocation} to ${trip.dropLocation}`}</td>
                            <td className="py-2 px-3 border-r border-slate-100 font-bold">₹{salary}</td>
                            <td className="py-2 px-3 border-r border-slate-100 font-bold text-emerald-700">₹{paid > 0 ? paid : 0}</td>
                            <td className="py-2 px-3 font-bold text-rose-600">₹{due}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {sortedTrips.length > itemsPerPage && (
                  <div className="flex items-center justify-between mt-3 no-print">
                    <p className="text-xs text-slate-500">Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, sortedTrips.length)} of {sortedTrips.length}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-40">Prev</button>
                      <span className="text-xs font-bold text-slate-700">{currentPage} / {totalPages}</span>
                      <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-40">Next</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Records */}
              <div className="mt-6">
                <h3 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">Records of Payments</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-xs text-slate-700 border border-slate-200">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 border-r border-slate-200">#</th>
                        <th className="py-2 px-3 border-r border-slate-200">Date</th>
                        <th className="py-2 px-3 border-r border-slate-200">Amount Paid</th>
                        <th className="py-2 px-3 border-r border-slate-200">Type</th>
                        <th className="py-2 px-3 border-r border-slate-200">Mode</th>
                        <th className="py-2 px-3 border-r border-slate-200">Notes</th>
                        <th className="py-2 px-3 no-print">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentRecords.length > 0 ? paymentRecords.map((p, i) => (
                        <tr key={p._id || `${p.date}-${i}`} className="border-b border-slate-100">
                          <td className="py-2 px-3 border-r border-slate-100 text-slate-400">{i + 1}</td>
                          <td className="py-2 px-3 border-r border-slate-100">{new Date(p.date).toLocaleDateString()}</td>
                          <td className="py-2 px-3 border-r border-slate-100 font-bold text-emerald-700">₹{p.amount}</td>
                          <td className="py-2 px-3 border-r border-slate-100">{p.paymentType || p.mode || 'Bata'}</td>
                          <td className="py-2 px-3 border-r border-slate-100">{p.paymentType ? (p.mode || 'Cash') : '-'}</td>
                          <td className="py-2 px-3 border-r border-slate-100 text-slate-500">{p.notes || '-'}</td>
                          <td className="py-2 px-3 no-print">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handlePrintPaymentReceipt({
                                  amount: p.amount,
                                  date: p.date,
                                  paymentType: p.paymentType || p.mode || 'Bata',
                                  mode: p.paymentType ? (p.mode || 'Cash') : '-',
                                  notes: p.notes
                                })}
                                title="Print Receipt"
                                aria-label="Print payment receipt"
                                className="p-1 rounded bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              {(p._id || p.tripId) && (
                                <button
                                  onClick={() => handleDeletePayment(p)}
                                  disabled={deletingPaymentId === (p._id || p.tripId)}
                                  title="Delete Payment Record"
                                  aria-label="Delete payment record"
                                  className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="7" className="py-4 px-3 text-center text-slate-500">No payment records found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <PrintSignatures />
            </div>
          ) : (
            <>
            <div className="hidden print:block print-document-sheet">
              <div className="print-document-intro">
                <h2>{printValue(employee.name)}</h2>
                <p>{printValue(employee.employeeId)} | {printValue(employee.category)}</p>
              </div>

              <table className="print-document-table">
                <tbody>
                  <tr><th>Profile Photo</th><td>{employee.photo ? <img src={employee.photo} alt={employee.name} className="print-document-photo" /> : <User className="print-document-user-icon" />}</td></tr>
                  <tr><th>Gender</th><td>{printValue(employee.gender)}</td></tr>
                  <tr><th>Driver Name (As per Aadhaar)</th><td>{printValue(employee.name)}</td></tr>
                  <tr><th>DOB</th><td>{formatPrintDate(employee.dateOfBirth)}</td></tr>
                  <tr><th>Blood Group</th><td>{printValue(employee.bloodGroup)}</td></tr>
                  <tr><th>E MAIL</th><td>{printValue(employee.email)}</td></tr>
                  <tr><th>Phone Number</th><td>{printValue(employee.mobileNumber)}</td></tr>
                  <tr><th>Alternative Number</th><td>{printValue(employee.alternateNumber)}</td></tr>
                  <tr><th>Bank Name</th><td>{printValue(employee.bankDetails?.bankName)}</td></tr>
                  <tr><th>Account Holder Name</th><td>{printValue(employee.bankDetails?.accountHolderName || employee.name)}</td></tr>
                  <tr><th>Account Number</th><td>{printValue(employee.bankDetails?.accountNumber)}</td></tr>
                  <tr><th>IFSC Code</th><td>{printValue(employee.bankDetails?.ifscCode)}</td></tr>
                  <tr><th>Branch</th><td>{printValue(employee.bankDetails?.branchName)}</td></tr>
                  <tr><th>Reference Details</th><td>{printValue(employee.reference?.name)}</td></tr>
                  <tr><th>Name</th><td>{printValue(employee.reference?.name)}</td></tr>
                  <tr><th>Phone Number</th><td>{printValue(employee.reference?.phone)}</td></tr>
                  <tr><th>Alternative Number</th><td>{printValue(employee.reference?.alternateNumber)}</td></tr>
                </tbody>
              </table>

              <PrintSignatures />
            </div>

            <div className="space-y-6 print:hidden print-profile-sheet">
              <div className="print-profile-section print-profile-identity bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div className="flex items-center gap-4">
                  {employee.photo ? (
                    <img
                      src={employee.photo}
                      alt={employee.name}
                      className="print-profile-photo w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="print-profile-photo w-20 h-20 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                      <User className="w-9 h-9 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-black text-slate-900">{employee.name}</h2>
                      <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black">{employee.employeeId}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-bold">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800">{employee.category}</span>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">{employee.status || 'Available'}</span>
                      <span className="text-slate-500">Experience: <strong className="text-slate-900">{employee.experience || 0} {employee.experience === 1 ? 'Year' : 'Years'}</strong></span>
                    </div>
                  </div>
                </div>
                <a href={`tel:${employee.mobileNumber}`} className="print-profile-call inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
                  <Phone className="w-4 h-4" />
                  Call Primary
                </a>
              </div>

              <div className="print-profile-section print-profile-personal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Date of Birth</p>
                  <p className="text-sm font-bold text-slate-900 mt-2">{employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString('en-IN') : 'Not Provided'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Blood Group</p>
                  <p className="text-sm font-bold text-slate-900 mt-2">{employee.bloodGroup || 'Not Provided'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Mobile Number</p>
                  <p className="text-sm font-bold text-slate-900 mt-2">{employee.mobileNumber || 'Not Provided'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Alternative Number</p>
                  <p className="text-sm font-bold text-slate-900 mt-2">{employee.alternateNumber || 'Not Provided'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Employee Status</p>
                  <p className="text-sm font-bold text-slate-900 mt-2">{employee.status || 'Available'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="print-profile-section rounded-2xl border-2 border-amber-200 bg-amber-50/40 p-5">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                    <h3 className="font-black text-slate-900 flex items-center gap-2"><UserCheck className="w-4 h-4 text-amber-700" />Reference / Referral Details</h3>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">Guarantor</span>
                  </div>
                  <div className="mt-4 rounded-xl border border-dashed border-amber-300 bg-white p-4 text-sm">
                    {employee.reference?.name ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div><span className="block text-[10px] font-bold text-slate-400 uppercase">Name</span><strong>{employee.reference.name}</strong></div>
                        <div><span className="block text-[10px] font-bold text-slate-400 uppercase">Relationship</span><strong>{employee.reference.relationship || '-'}</strong></div>
                        <div><span className="block text-[10px] font-bold text-slate-400 uppercase">Phone</span><strong>{employee.reference.phone || '-'}</strong></div>
                        <div><span className="block text-[10px] font-bold text-slate-400 uppercase">Alternate</span><strong>{employee.reference.alternateNumber || '-'}</strong></div>
                      </div>
                    ) : <p className="text-center text-sm italic text-slate-500">No reference details recorded for this employee.</p>}
                  </div>
                </div>
                <div className="print-profile-section rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 p-5">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                    <h3 className="font-black text-slate-900 flex items-center gap-2"><Building className="w-4 h-4 text-emerald-700" />Bank Account Details</h3>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">Payouts Direct</span>
                  </div>
                  <div className="mt-4 rounded-xl border border-dashed border-emerald-300 bg-white p-4 text-sm">
                    {employee.bankDetails?.accountNumber ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div><span className="block text-[10px] font-bold text-slate-400 uppercase">Bank Name</span><strong>{employee.bankDetails.bankName || '-'}</strong></div>
                        <div><span className="block text-[10px] font-bold text-slate-400 uppercase">Account Holder</span><strong>{employee.bankDetails.accountHolderName || employee.name}</strong></div>
                        <div><span className="block text-[10px] font-bold text-slate-400 uppercase">Account Number</span><strong>{employee.bankDetails.accountNumber}</strong></div>
                        <div><span className="block text-[10px] font-bold text-slate-400 uppercase">IFSC</span><strong>{employee.bankDetails.ifscCode || '-'}</strong></div>
                      </div>
                    ) : <p className="text-center text-sm italic text-slate-500">No bank account linked. Payouts processed via manual receipts.</p>}
                  </div>
                </div>
              </div>

              <div className="print-profile-section rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
                  <h3 className="font-black text-slate-900 flex items-center gap-2"><Truck className="w-5 h-5 text-amber-600" />Driving License &amp; Heavy Vehicle Experience</h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">{employee.documents?.licenseExpiryDate ? `License valid until ${new Date(employee.documents.licenseExpiryDate).toLocaleDateString('en-IN')}` : 'License validity not recorded'}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">License Number</span>
                    <strong className="text-sm text-slate-900">{employee.documents?.licenseNumber || 'Not Provided'}</strong>
                    {employee.documents?.licenseDoc && (
                      <a href={employee.documents.licenseDoc} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100">
                        <Eye className="w-3.5 h-3.5" />
                        View Licence Front
                      </a>
                    )}
                    {employee.documents?.licenseDocBack && <a href={employee.documents.licenseDocBack} target="_blank" rel="noopener noreferrer" className="mt-3 ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100"><Eye className="w-3.5 h-3.5" />View Licence Back</a>}
                    <div className="border-t border-slate-100 my-3" />
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Expiry Date</span>
                    <strong className="text-sm text-slate-900">{employee.documents?.licenseExpiryDate ? new Date(employee.documents.licenseExpiryDate).toLocaleDateString('en-IN') : 'Not Provided'}</strong>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Heavy Truck / Fleet Experience</span>
                    <p className="text-sm font-semibold text-slate-900 mt-2">{employee.documents?.heavyVehicleExperience || 'No specific heavy truck commercial experience recorded.'}</p>
                  </div>
                </div>
              </div>

              <div className="print-profile-section rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-black text-slate-900 flex items-center gap-2"><BadgeCheck className="w-5 h-5 text-emerald-600" />Identity Verification Documents</h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">Police Clearance: {employee.documents?.policeVerificationStatus || 'Pending'}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Aadhaar Card Record</span>
                    <strong className="text-sm text-slate-900">{employee.documents?.aadhaarNumber || 'Not Provided'}</strong>
                    {employee.documents?.aadhaarDoc ? (
                      <a href={employee.documents.aadhaarDoc} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold hover:bg-blue-100">
                        <Eye className="w-3.5 h-3.5" />
                        View Front
                      </a>
                    ) : <p className="text-xs italic text-slate-400 mt-2">No file uploaded</p>}
                    {employee.documents?.aadhaarDocBack && <a href={employee.documents.aadhaarDocBack} target="_blank" rel="noopener noreferrer" className="mt-3 ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold hover:bg-blue-100"><Eye className="w-3.5 h-3.5" />View Back</a>}
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">PAN Card Record</span>
                    <strong className="text-sm text-slate-900">{employee.documents?.panNumber || 'Not Provided'}</strong>
                    {employee.documents?.panDoc ? (
                      <a href={employee.documents.panDoc} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold hover:bg-purple-100">
                        <Eye className="w-3.5 h-3.5" />
                        View Front
                      </a>
                    ) : <p className="text-xs italic text-slate-400 mt-2">No file uploaded</p>}
                    {employee.documents?.panDocBack && <a href={employee.documents.panDocBack} target="_blank" rel="noopener noreferrer" className="mt-3 ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold hover:bg-purple-100"><Eye className="w-3.5 h-3.5" />View Back</a>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="print-profile-section rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="font-black text-slate-900 text-sm mb-2">Residential Address</h3>
                  <p className="text-sm font-semibold text-slate-700">{employee.address?.fullAddress || employee.address?.street || 'No physical address recorded.'}</p>
                </div>
                <div className="print-profile-section rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="font-black text-slate-900 text-sm mb-2">Special Skills &amp; Highlights</h3>
                  <p className="text-sm font-semibold text-slate-700">{Array.isArray(employee.specialSkills) && employee.specialSkills.length ? employee.specialSkills.join(', ') : 'Standard verified staff profile.'}</p>
                </div>
                <div className="print-profile-section rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
                  <h3 className="font-black text-slate-900 text-sm mb-2">Administrative Remarks</h3>
                  <p className="text-sm font-semibold text-slate-700">{employee.notes || 'No administrative notes recorded.'}</p>
                </div>
              </div>
              <PrintSignatures />
            </div>
            </>
          )}
        </div>

        {/* Record Payment Modal (No print) */}
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50 text-emerald-900">
                <h3 className="font-black text-lg">Record Payment for {employee.name}</h3>
                <button onClick={() => setIsPaymentModalOpen(false)} className="p-1 hover:bg-emerald-200 rounded-lg"><X className="w-5 h-5"/></button>
              </div>
              
              <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
                <p className="text-xs text-slate-500 mb-4">
                  Recording a payment will automatically deduct from the employee's oldest pending tasks until the amount is exhausted.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    placeholder="e.g. 5000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={paymentForm.date}
                      onChange={(e) => setPaymentForm({...paymentForm, date: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Payment Type</label>
                    <select
                      value={paymentForm.paymentType}
                      onChange={(e) => setPaymentForm({...paymentForm, paymentType: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    >
                      <option value="Bata">Bata</option>
                      <option value="Salary">Salary</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={paymentForm.mode}
                    onChange={(e) => setPaymentForm({...paymentForm, mode: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Notes (Optional)</label>
                  <input
                    type="text"
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    placeholder="Any reference number or notes"
                  />
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-bold text-sm">Cancel</button>
                  <button type="button" onClick={(e) => handlePaymentSubmit(e, false)} disabled={isSubmittingPayment} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl shadow-sm disabled:opacity-50">
                    {isSubmittingPayment ? 'Processing...' : 'Confirm Payment'}
                  </button>
                  <button type="button" onClick={(e) => handlePaymentSubmit(e, true)} disabled={isSubmittingPayment} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm disabled:opacity-50 flex items-center gap-2">
                    <Printer className="w-4 h-4" />
                    <span>{isSubmittingPayment ? 'Processing...' : 'Confirm & Print Receipt'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default EmployeeProfilePage;
