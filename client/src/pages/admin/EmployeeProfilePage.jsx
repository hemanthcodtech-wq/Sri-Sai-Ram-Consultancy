import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  Phone, 
  ShieldCheck, 
  Award, 
  MapPin, 
  FileText, 
  Calendar, 
  DollarSign, 
  Car, 
  Truck, 
  Compass, 
  ArrowLeft, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Printer,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  FileCheck,
  Eye,
  ExternalLink,
  BadgeCheck,
  Briefcase,
  Building,
  UserCheck,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Ban,
  Check,
  X
} from 'lucide-react';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';

const EmployeeProfilePage = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockReasonInput, setBlockReasonInput] = useState('');

  // Pagination State
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

  const handleToggleBlock = async (shouldBlock, reason = '') => {
    try {
      const payload = {
        isBlocked: shouldBlock,
        status: shouldBlock ? 'Blocked' : 'Available',
        blockReason: shouldBlock ? (reason || 'Blocked by administration') : '',
      };
      const res = await api.put(`/employees/${employee._id}`, payload);
      if (res.data.success) {
        setEmployee(res.data.data);
        setIsBlockModalOpen(false);
        setBlockReasonInput('');
        alert(shouldBlock ? `Employee ${employee.name} has been BLOCKED.` : `Employee ${employee.name} is now UNBLOCKED.`);
      }
    } catch (err) {
      console.error('Error toggling block state:', err);
      alert('Failed to update employee block status.');
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Employee Biodata Sheet...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900">Employee Profile Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">The requested staff record does not exist or was deleted.</p>
        <Link
          to="/admin/employees"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  const isCaptain = employee.category === 'Captain';
  const isDriver = employee.category === 'Driver';
  const CategoryIcon = isCaptain ? Compass : isDriver ? Car : Truck;
  const isBlocked = employee.isBlocked || employee.status === 'Blocked';

  // License Validity calculation
  const getLicenseValidationInfo = () => {
    if (!employee.documents?.licenseExpiryDate) {
      return { status: 'none', label: 'Not Set / None' };
    }
    const expiry = new Date(employee.documents.licenseExpiryDate);
    if (isNaN(expiry.getTime())) return { status: 'none', label: 'Invalid Date' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expiry);
    expDate.setHours(0, 0, 0, 0);

    const diffMs = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const formatted = expDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    if (diffDays < 0) {
      return {
        status: 'expired',
        blocked: true,
        diffDays,
        formatted,
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
        message: `License expired on ${formatted}. Task assignment is currently blocked.`,
      };
    }

    if (diffDays <= 2) {
      return {
        status: 'expiring_soon',
        blocked: true,
        diffDays,
        formatted,
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        message: `License expires on ${formatted} (${diffDays === 0 ? 'Today' : `${diffDays} day(s) left`}). Task assignment restricted (2-day buffer).`,
      };
    }

    return {
      status: 'valid',
      blocked: false,
      diffDays,
      formatted,
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      message: `License is valid until ${formatted}. Ready for task assignment.`,
    };
  };

  const licenseValidation = getLicenseValidationInfo();

  // Calculate pagination slices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrips = trips.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(trips.length / itemsPerPage));

  return (
    <>
      <SEOHead title={`${employee.name} - Biodata & Duty Profile - SSRC Admin`} />

      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/employees"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Staff Biodata Sheet &amp; Dossier
              </h1>
              <p className="text-xs text-slate-500">Official verified personnel dossier for Sri Sai Ram Consultancy.</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {isBlocked ? (
              <button
                onClick={() => handleToggleBlock(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Unblock Staff</span>
              </button>
            ) : (
              <button
                onClick={() => setIsBlockModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                <Ban className="w-4 h-4" />
                <span>Block from Next Tasks</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

        {/* Blocked Alert Banner if employee is blocked */}
        {isBlocked && (
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-rose-950">
                  🚫 This Employee is Currently BLOCKED from Task Assignments
                </h3>
                <p className="text-xs text-rose-800 mt-0.5 font-medium">
                  Reason: {employee.blockReason || 'Disciplinary violation or restricted by administration.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggleBlock(false)}
              className="px-4 py-1.5 rounded-xl bg-white hover:bg-rose-100 text-rose-900 border border-rose-300 text-xs font-extrabold shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              Lift Restriction / Unblock
            </button>
          </div>
        )}

        {/* Profile Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          
          {/* Header Row: Avatar, Name, ID, Category, Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-5">
              <img
                src={employee.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
                alt={employee.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-100 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-extrabold text-slate-900">{employee.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 font-mono text-xs font-bold text-slate-700">
                    {employee.employeeId}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                  <span className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                    isCaptain ? 'bg-amber-100 text-amber-900' : isDriver ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    <CategoryIcon className="w-3.5 h-3.5" />
                    <span>{employee.category}</span>
                  </span>

                  <span className={`px-2.5 py-1 rounded-full font-bold ${
                    isBlocked 
                      ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                      : employee.status === 'Available' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    ● {isBlocked ? 'Blocked' : employee.status}
                  </span>

                  <span className="text-slate-400 font-medium pl-1">
                    Experience: <strong className="text-slate-700">{employee.experience || '1 Year'}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Contact buttons */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <a
                href={`tel:${employee.mobileNumber}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call Primary</span>
              </a>
              {employee.alternateNumber && (
                <a
                  href={`tel:${employee.alternateNumber}`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Alt Phone</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Metrics Strip: Advance, Salary, Dues, and Tasks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
              <span className="text-[10px] text-amber-900 font-bold uppercase block">Total Salary Earned</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                ₹{stats?.totalSalary || stats?.totalEarnings || 0}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Billed Staff Fees</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
              <span className="text-[10px] text-blue-900 font-bold uppercase block">Advance Received</span>
              <div className="text-xl font-black text-blue-900 mt-0.5">
                ₹{stats?.totalAdvance || 0}
              </div>
              <span className="text-[10px] text-blue-600 font-medium">Given Upfront</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-center">
              <span className="text-[10px] text-rose-900 font-bold uppercase block">Pending Payment Due</span>
              <div className="text-xl font-black text-rose-600 mt-0.5">
                ₹{stats?.totalDue || stats?.pendingEarnings || 0}
              </div>
              <span className="text-[10px] text-rose-500 font-medium">Remaining to Pay</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
              <span className="text-[10px] text-emerald-900 font-bold uppercase block">Total Settled</span>
              <div className="text-xl font-black text-emerald-900 mt-0.5">
                ₹{stats?.totalPaid || stats?.paidEarnings || 0}
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Paid + Advance</span>
            </div>
          </div>

          {/* Section: Reference & Bank Account Details Dossier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Reference Box Card */}
            <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-700" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-950">
                    Reference / Referral Details
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Guarantor
                </span>
              </div>

              {employee.reference?.name ? (
                <div className="bg-white rounded-xl p-3.5 border border-amber-200/60 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Reference Person</span>
                    <strong className="text-sm text-slate-900 font-extrabold block">
                      {employee.reference.name}
                    </strong>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Phone</span>
                      {employee.reference.phone ? (
                        <a href={`tel:${employee.reference.phone}`} className="font-semibold text-emerald-700 hover:underline">
                          {employee.reference.phone}
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">Not Provided</span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Relationship</span>
                      <span className="font-medium text-slate-700">{employee.reference.relationship || 'General Reference'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white/80 rounded-xl border border-dashed border-amber-300 text-center text-xs text-amber-800 italic">
                  No reference details recorded for this employee.
                </div>
              )}
            </div>

            {/* Bank Account Details Card */}
            <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                    Bank Account Details
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Payouts Direct
                </span>
              </div>

              {employee.bankDetails?.accountNumber ? (
                <div className="bg-white rounded-xl p-3.5 border border-emerald-200/60 space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Bank Name</span>
                      <strong className="text-sm text-slate-900 font-extrabold block">
                        {employee.bankDetails.bankName || 'Direct Bank'}
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">IFSC Code</span>
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {employee.bankDetails.ifscCode || '—'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Account Number</span>
                      <span className="font-mono font-bold text-slate-900">
                        {employee.bankDetails.accountNumber}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Account Holder</span>
                      <span className="font-medium text-slate-700 truncate block">
                        {employee.bankDetails.accountHolderName || employee.name}
                      </span>
                    </div>
                  </div>

                  {employee.bankDetails.branchName && (
                    <div className="text-[11px] text-slate-500 pt-0.5">
                      Branch: <strong className="text-slate-700">{employee.bankDetails.branchName}</strong>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-white/80 rounded-xl border border-dashed border-emerald-300 text-center text-xs text-emerald-800 italic">
                  No bank account linked. Payouts processed via manual receipts.
                </div>
              )}
            </div>

          </div>

          {/* Section: Driving License & Heavy Vehicle Dossier */}
          <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Driving License &amp; Heavy Vehicle Experience
                </h3>
              </div>
              
              {licenseValidation.status !== 'none' && (
                <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full border shadow-2xs ${licenseValidation.badgeBg}`}>
                  {licenseValidation.blocked ? (
                    <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                  ) : (
                    <BadgeCheck className="w-3.5 h-3.5" />
                  )}
                  <span>{licenseValidation.message}</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              
              {/* License Number & Expiry */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">License Number</span>
                    <strong className="text-xs font-mono text-slate-900 mt-0.5 block uppercase">
                      {employee.documents?.licenseNumber || 'Not Provided'}
                    </strong>
                  </div>
                  <Car className="w-4 h-4 text-amber-600 shrink-0" />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Expiry Date</span>
                    <strong className="text-slate-800 font-bold">
                      {licenseValidation.formatted || 'Not Set'}
                    </strong>
                  </div>
                  {employee.documents?.licenseDoc && (
                    <a
                      href={employee.documents.licenseDoc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] transition-colors border border-amber-200"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View File</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Heavy Vehicle Experience */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between gap-3 sm:col-span-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Heavy Truck / Fleet Experience</span>
                    <p className="text-xs text-slate-900 font-semibold mt-1">
                      {employee.documents?.heavyVehicleExperience || 'No specific heavy truck commercial experience recorded.'}
                    </p>
                  </div>
                  <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                </div>

                {employee.documents?.experienceDoc && (
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <a
                      href={employee.documents.experienceDoc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] transition-colors border border-teal-200"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Experience Proof</span>
                    </a>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* KYC & Identity Dossier */}
          <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Identity Verification Documents
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                <BadgeCheck className="w-3.5 h-3.5" /> Police Clearance: {employee.documents?.policeVerificationStatus || 'Verified'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Aadhaar Card */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Aadhaar Card Record</span>
                    <strong className="text-xs font-mono text-slate-900 mt-0.5 block">
                      {employee.documents?.aadhaarNumber || 'Not Provided'}
                    </strong>
                  </div>
                  <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
                </div>
                {employee.documents?.aadhaarDoc ? (
                  <a
                    href={employee.documents.aadhaarDoc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors border border-blue-200"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Aadhaar PDF/Img</span>
                  </a>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400 italic">No File Uploaded</span>
                )}
              </div>

              {/* PAN Card */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">PAN Card Record</span>
                    <strong className="text-xs font-mono text-slate-900 mt-0.5 block uppercase">
                      {employee.documents?.panNumber || 'Not Provided'}
                    </strong>
                  </div>
                  <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                </div>
                {employee.documents?.panDoc ? (
                  <a
                    href={employee.documents.panDoc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors border border-purple-200"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View PAN PDF/Img</span>
                  </a>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400 italic">No File Uploaded</span>
                )}
              </div>

            </div>
          </div>

          {/* Address, Special Skills & Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase mb-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Residential Address</span>
              </div>
              <p className="text-slate-800 font-medium">
                {employee.address?.fullAddress || employee.address?.street || 'No physical address recorded.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Special Skills &amp; Highlights</span>
              </div>
              <p className="text-slate-800 font-medium">
                {Array.isArray(employee.specialSkills) && employee.specialSkills.length > 0
                  ? employee.specialSkills.join(', ')
                  : 'Standard verified staff profile.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold uppercase mb-1">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Administrative Remarks</span>
              </div>
              <p className="text-slate-800 font-medium">
                {employee.notes || 'No administrative notes recorded.'}
              </p>
            </div>
          </div>

          {/* Assigned Tasks History Table */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Assigned Tasks &amp; Duty History</h3>
                <p className="text-xs text-slate-500">Log of all routes completed by {employee.name} with earnings, advance received, dues, and remarks.</p>
              </div>
            </div>

            {trips.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                No trips logged for this employee yet.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-y border-slate-200">
                      <tr>
                        <th className="py-3 px-3">Task # &amp; Date</th>
                        <th className="py-3 px-3">Vehicle &amp; Route</th>
                        <th className="py-3 px-3">Operator / Client</th>
                        <th className="py-3 px-3">Advance (Given)</th>
                        <th className="py-3 px-3">Salary Payout</th>
                        <th className="py-3 px-3">Remaining Due</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Trip Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentTrips.map((trip) => {
                        const isPaid = trip.paymentStatus === 'Paid';
                        const due = isPaid ? 0 : (trip.dueAmount !== undefined ? trip.dueAmount : Math.max(0, (trip.salaryAmount || trip.employeePayout || 0) - (trip.advanceAmount || 0)));

                        return (
                          <tr key={trip._id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span className="font-mono font-bold text-slate-900 block">{trip.tripNumber}</span>
                              <span className="text-[11px] text-slate-500">{new Date(trip.tripDate).toLocaleDateString('en-IN')}</span>
                            </td>

                            <td className="py-3 px-3">
                              {trip.vehicleNumber && (
                                <span className="font-mono font-bold text-[11px] text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 block mb-0.5">
                                  {trip.vehicleNumber}
                                </span>
                              )}
                              <span className="font-medium text-slate-800">
                                {trip.routeName || `${trip.pickupLocation} → ${trip.dropLocation || 'City'}`}
                              </span>
                            </td>

                            <td className="py-3 px-3 font-medium text-slate-900">
                              {trip.operatorName || trip.operator?.name || trip.clientName || '—'}
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-bold text-amber-800">₹{trip.advanceAmount || 0}</div>
                              <span className="text-[10px] text-slate-400">({trip.advancePaymentMode || 'Cash'})</span>
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-bold text-slate-900">₹{trip.salaryAmount || trip.employeePayout || 0}</div>
                              <span className="text-[10px] text-slate-400">({trip.salaryPaymentMode || 'Online'})</span>
                            </td>

                            <td className="py-3 px-3">
                              {isPaid ? (
                                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  ₹0 (Paid)
                                </span>
                              ) : (
                                <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] border border-rose-200">
                                  ₹{due}
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                              }`}>
                                {trip.paymentStatus || 'Pending'}
                              </span>
                            </td>

                            <td className="py-3 px-3 max-w-xs">
                              {trip.remarks ? (
                                <p className="text-xs text-slate-700 bg-slate-50 p-1.5 rounded-lg border border-slate-200 line-clamp-2" title={trip.remarks}>
                                  {trip.remarks}
                                </p>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <span>
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, trips.length)} of {trips.length} tasks
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-2 font-bold">{currentPage} / {totalPages}</span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>

      {/* Block Confirmation Modal */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-700">
                <Ban className="w-5 h-5" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Block {employee.name}
                </h3>
              </div>
              <button
                onClick={() => setIsBlockModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Blocking this employee will immediately prevent them from being alloted or selected for any upcoming tasks across the entire system.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Blocking *
              </label>
              <textarea
                rows="3"
                required
                placeholder="e.g. Disciplinary breach, late arrival, vehicle damage, uncontactable..."
                value={blockReasonInput}
                onChange={(e) => setBlockReasonInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsBlockModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggleBlock(true, blockReasonInput)}
                disabled={!blockReasonInput.trim()}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-colors"
              >
                Confirm Block
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default EmployeeProfilePage;
