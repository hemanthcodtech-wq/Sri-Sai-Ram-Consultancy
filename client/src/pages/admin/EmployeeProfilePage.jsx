import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, Phone, MapPin, FileText, Calendar, IndianRupee, Car, Truck, Compass, 
  ArrowLeft, CheckCircle2, Clock, Printer, ChevronLeft, ChevronRight,
  CreditCard, Eye, BadgeCheck, Building, UserCheck, AlertTriangle, Sparkles,
  ShieldAlert, Ban, Check, X, Edit3
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
  const [paymentForm, setPaymentForm] = useState({ amount: '', date: new Date().toISOString().slice(0, 10), mode: 'Cash', notes: '' });
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

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

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.amount || Number(paymentForm.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    setIsSubmittingPayment(true);
    try {
      const res = await api.post(`/employees/${id}/pay`, paymentForm);
      if (res.data.success) {
        alert('Payment recorded and tasks updated successfully!');
        setIsPaymentModalOpen(false);
        setPaymentForm({ amount: '', date: new Date().toISOString().slice(0, 10), mode: 'Cash', notes: '' });
        fetchProfile(); // Refresh data
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error recording payment');
    } finally {
      setIsSubmittingPayment(false);
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
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrips = trips.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(trips.length / itemsPerPage));

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
        }
      `}</style>

      <div className="space-y-6 max-w-5xl mx-auto">
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 text-sm">
                <div className="flex items-baseline gap-2"><span className="font-bold text-slate-500 text-xs uppercase shrink-0">Full Name:</span> <span className="font-semibold text-slate-900">{employee.name}</span></div>
                <div className="flex items-baseline gap-2"><span className="font-bold text-slate-500 text-xs uppercase shrink-0">Role:</span> <span className="font-semibold text-slate-900">{employee.category}</span></div>
                <div className="flex items-baseline gap-2"><span className="font-bold text-slate-500 text-xs uppercase shrink-0">Contact Number:</span> <span className="font-semibold text-slate-900">{employee.mobileNumber}</span></div>
                <div className="flex items-baseline gap-2"><span className="font-bold text-slate-500 text-xs uppercase shrink-0">Gender:</span> <span className="font-semibold text-slate-900">{employee.gender || '-'}</span></div>
                <div className="flex items-baseline gap-2"><span className="font-bold text-slate-500 text-xs uppercase shrink-0">Email:</span> <span className="font-semibold text-slate-900">{employee.email || '-'}</span></div>
                <div className="flex items-baseline gap-2"><span className="font-bold text-slate-500 text-xs uppercase shrink-0">Date of Birth:</span> <span className="font-semibold text-slate-900">{employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : '-'}</span></div>
                <div className="flex items-baseline gap-2"><span className="font-bold text-slate-500 text-xs uppercase shrink-0">Nationality:</span> <span className="font-semibold text-slate-900">{employee.nationality || '-'}</span></div>
                <div className="col-span-2 flex items-baseline gap-2"><span className="font-bold text-slate-500 text-xs uppercase shrink-0">Residential Address:</span> <span className="font-semibold text-slate-900">{employee.address?.fullAddress || employee.address?.street || '-'}</span></div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Total Salary Earned</p>
                  <p className="text-2xl font-black text-amber-900">₹{stats?.totalSalary || 0}</p>
                  <p className="text-xs text-amber-600 mt-1">Billed Staff Fees</p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">Total Paid</p>
                  <p className="text-2xl font-black text-emerald-900">₹{Math.max(0, (stats?.totalSalary || 0) - (stats?.totalDue || 0))}</p>
                  <p className="text-xs text-emerald-600 mt-1">Salary − Remaining Due</p>
                </div>
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                  <p className="text-xs font-bold text-rose-700 uppercase tracking-wide mb-1">Remaining Due</p>
                  <p className="text-2xl font-black text-rose-900">₹{stats?.totalDue || 0}</p>
                  <p className="text-xs text-rose-600 mt-1">Pending Payment</p>
                </div>
              </div>

              {/* Tasks Table */}
              <div className="mt-4">
                <h3 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">Records of Trips</h3>
                <table className="w-full text-left text-xs text-slate-700 border border-slate-200">
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
                    {currentTrips.map(trip => {
                      let roleDue = trip.dueAmount || 0;
                      let roleSal = trip.salaryAmount || trip.employeePayout || 0;
                      const strId = String(employee._id);
                      if (trip.driver1?.employee && String(trip.driver1.employee) === strId) {
                        roleDue = trip.driver1.dueAmount || 0; roleSal = trip.driver1.salaryAmount || 0;
                      } else if (trip.driver2?.employee && String(trip.driver2.employee) === strId) {
                        roleDue = trip.driver2.dueAmount || 0; roleSal = trip.driver2.salaryAmount || 0;
                      } else if (trip.helper?.employee && String(trip.helper.employee) === strId) {
                        roleDue = trip.helper.dueAmount || 0; roleSal = trip.helper.salaryAmount || 0;
                      }
                      const rolePaid = roleSal - roleDue;

                      return (
                        <tr key={trip._id} className="border-b border-slate-100">
                          <td className="py-2 px-3 border-r border-slate-100">{new Date(trip.tripDate).toLocaleDateString()}</td>
                          <td className="py-2 px-3 border-r border-slate-100">{trip.routeName || `${trip.pickupLocation} to ${trip.dropLocation}`}</td>
                          <td className="py-2 px-3 border-r border-slate-100 font-bold">₹{roleSal}</td>
                          <td className="py-2 px-3 border-r border-slate-100 font-bold text-emerald-700">₹{rolePaid > 0 ? rolePaid : 0}</td>
                          <td className="py-2 px-3 font-bold text-rose-600">₹{roleDue}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
                {trips.length > itemsPerPage && (
                  <div className="flex items-center justify-between mt-3 no-print">
                    <p className="text-xs text-slate-500">Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, trips.length)} of {trips.length}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-40">Prev</button>
                      <span className="text-xs font-bold text-slate-700">{currentPage} / {totalPages}</span>
                      <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-40">Next</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Records */}
              {(employee.paymentHistory || []).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">Records of Payments</h3>
                  <table className="w-full text-left text-xs text-slate-700 border border-slate-200">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 border-r border-slate-200">#</th>
                        <th className="py-2 px-3 border-r border-slate-200">Date</th>
                        <th className="py-2 px-3 border-r border-slate-200">Amount Paid</th>
                        <th className="py-2 px-3 border-r border-slate-200">Mode</th>
                        <th className="py-2 px-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(employee.paymentHistory || []).map((p, i) => (
                        <tr key={i} className="border-b border-slate-100">
                          <td className="py-2 px-3 border-r border-slate-100 text-slate-400">{i + 1}</td>
                          <td className="py-2 px-3 border-r border-slate-100">{new Date(p.date).toLocaleDateString()}</td>
                          <td className="py-2 px-3 border-r border-slate-100 font-bold text-emerald-700">₹{p.amount}</td>
                          <td className="py-2 px-3 border-r border-slate-100">{p.mode || 'Cash'}</td>
                          <td className="py-2 px-3 text-slate-500">{p.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <PrintSignatures />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div className="flex items-center gap-4">
                  <img
                    src={employee.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
                    alt={employee.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                  />
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
                <a href={`tel:${employee.mobileNumber}`} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
                  <Phone className="w-4 h-4" />
                  Call Primary
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
                  <p className="text-[10px] font-black text-amber-800 uppercase">Total Salary Earned</p>
                  <p className="text-2xl font-black text-slate-900 mt-2">₹{stats?.totalSalary || 0}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Billed staff fees</p>
                </div>
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <p className="text-[10px] font-black text-blue-800 uppercase">Advance Received</p>
                  <p className="text-2xl font-black text-blue-900 mt-2">₹{stats?.totalAdvance || 0}</p>
                  <p className="text-[11px] text-blue-700 mt-1">Given upfront</p>
                </div>
                <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-5">
                  <p className="text-[10px] font-black text-rose-800 uppercase">Pending Payment Due</p>
                  <p className="text-2xl font-black text-rose-600 mt-2">₹{stats?.totalDue || 0}</p>
                  <p className="text-[11px] text-rose-600 mt-1">Remaining to pay</p>
                </div>
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <p className="text-[10px] font-black text-emerald-800 uppercase">Total Settled</p>
                  <p className="text-2xl font-black text-emerald-700 mt-2">₹{stats?.totalPaid || 0}</p>
                  <p className="text-[11px] text-emerald-700 mt-1">Paid + advance</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/40 p-5">
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
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 p-5">
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

              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
                  <h3 className="font-black text-slate-900 flex items-center gap-2"><Truck className="w-5 h-5 text-amber-600" />Driving License &amp; Heavy Vehicle Experience</h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">{employee.documents?.licenseExpiryDate ? `License valid until ${new Date(employee.documents.licenseExpiryDate).toLocaleDateString('en-IN')}` : 'License validity not recorded'}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">License Number</span>
                    <strong className="text-sm text-slate-900">{employee.documents?.licenseNumber || 'Not Provided'}</strong>
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

              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-black text-slate-900 flex items-center gap-2"><BadgeCheck className="w-5 h-5 text-emerald-600" />Identity Verification Documents</h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">Police Clearance: {employee.documents?.policeVerificationStatus || 'Pending'}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Aadhaar Card Record</span>
                    <strong className="text-sm text-slate-900">{employee.documents?.aadhaarNumber || 'Not Provided'}</strong>
                    <p className="text-xs italic text-slate-400 mt-2">{employee.documents?.aadhaarDoc ? 'File uploaded' : 'No file uploaded'}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">PAN Card Record</span>
                    <strong className="text-sm text-slate-900">{employee.documents?.panNumber || 'Not Provided'}</strong>
                    <p className="text-xs italic text-slate-400 mt-2">{employee.documents?.panDoc ? 'File uploaded' : 'No file uploaded'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="font-black text-slate-900 text-sm mb-2">Residential Address</h3>
                  <p className="text-sm font-semibold text-slate-700">{employee.address?.fullAddress || employee.address?.street || 'No physical address recorded.'}</p>
                </div>
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="font-black text-slate-900 text-sm mb-2">Special Skills &amp; Highlights</h3>
                  <p className="text-sm font-semibold text-slate-700">{Array.isArray(employee.specialSkills) && employee.specialSkills.length ? employee.specialSkills.join(', ') : 'Standard verified staff profile.'}</p>
                </div>
                <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
                  <h3 className="font-black text-slate-900 text-sm mb-2">Administrative Remarks</h3>
                  <p className="text-sm font-semibold text-slate-700">{employee.notes || 'No administrative notes recorded.'}</p>
                </div>
              </div>
              <PrintSignatures />
            </div>
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

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-bold text-sm">Cancel</button>
                  <button type="submit" disabled={isSubmittingPayment} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm disabled:opacity-50">
                    {isSubmittingPayment ? 'Processing...' : 'Confirm Payment'}
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
