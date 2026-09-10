import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  Filter, 
  Phone, 
  Car, 
  Truck, 
  Compass,
  X,
  Check,
  Award,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  User,
  UserPlus,
  FileText,
  BadgeCheck,
  ShieldAlert,
  Image as ImageIcon,
  Briefcase,
  Sparkles,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileCheck,
  Eye,
  Loader2,
  File,
  RefreshCw,
  Building,
  UserCheck,
  AlertTriangle,
  Calendar,
  Download
} from 'lucide-react';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';
import { exportToExcel } from '../../utils/excelExport';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [uploadingField, setUploadingField] = useState(null); // 'photo' | 'aadhaarDoc' | 'panDoc' | 'licenseDoc' | 'experienceDoc' | null

  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    alternateNumber: '',
    category: 'Driver',
    experience: '',
    photo: '',
    status: 'Available',
    isBlocked: false,
    blockReason: '',
    address: {
      street: '',
      city: '',
      state: '',
      fullAddress: '',
    },
    reference: {
      name: '',
      phone: '',
      relationship: '',
    },
    bankDetails: {
      accountNumber: '',
      accountHolderName: '',
      bankName: '',
      branchName: '',
      ifscCode: '',
    },
    documents: {
      aadhaarNumber: '',
      aadhaarDoc: '',
      panNumber: '',
      panDoc: '',
      licenseNumber: '',
      licenseExpiryDate: '',
      heavyVehicleExperience: '',
      licenseDoc: '',
      experienceDoc: '',
      policeVerificationStatus: 'Verified',
    },
    specialSkills: '',
    notes: '',
  });

  // Direct file uploader to Cloudinary (or fallback)
  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('File size exceeds 15MB limit. Please select a smaller file.');
      return;
    }

    setUploadingField(field);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folder', `ssrc_employee_docs/${field}`);

      const res = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        if (field === 'photo') {
          setFormData((prev) => ({ ...prev, photo: res.data.url }));
        } else {
          setFormData((prev) => ({
            ...prev,
            documents: {
              ...prev.documents,
              [field]: res.data.url,
            },
          }));
        }
      }
    } catch (err) {
      console.error(`Upload error for ${field}:`, err);
      alert(err.response?.data?.message || 'Failed to upload document. Please check Cloudinary / network.');
    } finally {
      setUploadingField(null);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employees', {
        params: {
          search,
          category: categoryFilter,
          status: statusFilter,
        },
      });
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, categoryFilter, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, itemsPerPage]);

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      
      let expiryStr = '';
      if (employee.documents?.licenseExpiryDate) {
        try {
          expiryStr = new Date(employee.documents.licenseExpiryDate).toISOString().slice(0, 10);
        } catch {
          expiryStr = '';
        }
      }

      setFormData({
        name: employee.name || '',
        mobileNumber: employee.mobileNumber || '',
        alternateNumber: employee.alternateNumber || '',
        category: employee.category || 'Driver',
        experience: employee.experience || '',
        photo: employee.photo || '',
        status: employee.status || 'Available',
        isBlocked: employee.isBlocked || employee.status === 'Blocked',
        blockReason: employee.blockReason || '',
        address: {
          street: employee.address?.street || '',
          city: employee.address?.city || '',
          state: employee.address?.state || '',
          fullAddress: employee.address?.fullAddress || '',
        },
        reference: {
          name: employee.reference?.name || '',
          phone: employee.reference?.phone || '',
          relationship: employee.reference?.relationship || '',
        },
        bankDetails: {
          accountNumber: employee.bankDetails?.accountNumber || '',
          accountHolderName: employee.bankDetails?.accountHolderName || '',
          bankName: employee.bankDetails?.bankName || '',
          branchName: employee.bankDetails?.branchName || '',
          ifscCode: employee.bankDetails?.ifscCode || '',
        },
        documents: {
          aadhaarNumber: employee.documents?.aadhaarNumber || '',
          aadhaarDoc: employee.documents?.aadhaarDoc || '',
          panNumber: employee.documents?.panNumber || '',
          panDoc: employee.documents?.panDoc || '',
          licenseNumber: employee.documents?.licenseNumber || '',
          licenseExpiryDate: expiryStr,
          heavyVehicleExperience: employee.documents?.heavyVehicleExperience || '',
          licenseDoc: employee.documents?.licenseDoc || '',
          experienceDoc: employee.documents?.experienceDoc || '',
          policeVerificationStatus: employee.documents?.policeVerificationStatus || 'Verified',
        },
        specialSkills: Array.isArray(employee.specialSkills) ? employee.specialSkills.join(', ') : employee.specialSkills || '',
        notes: employee.notes || '',
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '',
        mobileNumber: '',
        alternateNumber: '',
        category: 'Driver',
        experience: '',
        photo: '',
        status: 'Available',
        isBlocked: false,
        blockReason: '',
        address: {
          street: '',
          city: '',
          state: '',
          fullAddress: '',
        },
        reference: {
          name: '',
          phone: '',
          relationship: '',
        },
        bankDetails: {
          accountNumber: '',
          accountHolderName: '',
          bankName: '',
          branchName: '',
          ifscCode: '',
        },
        documents: {
          aadhaarNumber: '',
          aadhaarDoc: '',
          panNumber: '',
          panDoc: '',
          licenseNumber: '',
          licenseExpiryDate: '',
          heavyVehicleExperience: '',
          licenseDoc: '',
          experienceDoc: '',
          policeVerificationStatus: 'Verified',
        },
        specialSkills: '',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        specialSkills: typeof formData.specialSkills === 'string'
          ? formData.specialSkills.split(',').map((s) => s.trim()).filter(Boolean)
          : formData.specialSkills,
      };

      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee._id}`, payload);
      } else {
        await api.post('/employees', payload);
      }

      setIsModalOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error('Error saving employee:', err);
      const errorMsg = err.response?.data?.message || 'Failed to save employee profile. Please check required fields.';
      alert(`Error: ${errorMsg}`);
    }
  };

  const handleDeleteEmployee = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete employee record for ${name}?`)) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        console.error('Error deleting employee:', err);
      }
    }
  };

  // Helper to compute license validity and whether task allocation is blocked
  const getLicenseStatus = (emp) => {
    if (emp.isBlocked || emp.status === 'Blocked') {
      return {
        status: 'blocked',
        blocked: true,
        isPermanentlyBlocked: true,
        label: `Staff Blocked: ${emp.blockReason || 'Administrative restraint'}`,
        warning: 'Task Allocation Blocked',
        badgeBg: 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
      };
    }

    if (!emp.documents?.licenseExpiryDate) {
      if (emp.category === 'Helper') {
        return { status: 'none', label: 'Not Applicable', isHelper: true };
      }
      return { 
        status: 'missing', 
        blocked: false, 
        label: 'Expiry Date Not Set', 
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-200' 
      };
    }
    
    const expiry = new Date(emp.documents.licenseExpiryDate);
    if (isNaN(expiry.getTime())) {
      return { status: 'invalid', blocked: false, label: 'Date Invalid', badgeBg: 'bg-slate-100 text-slate-700' };
    }

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
        label: `License Expired (${formatted})`,
        warning: 'Task Allocation Blocked',
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
      };
    }

    if (diffDays <= 2) {
      return {
        status: 'expiring_soon',
        blocked: true,
        diffDays,
        formatted,
        label: `Expires in ${diffDays === 0 ? 'Today' : diffDays === 1 ? '1 Day' : '2 Days'} (${formatted})`,
        warning: 'Task Allocation Blocked (<= 2 Days)',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
      };
    }

    return {
      status: 'valid',
      blocked: false,
      diffDays,
      formatted,
      label: `License Valid till ${formatted}`,
      warning: null,
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    };
  };

  const handleToggleBlockStaff = async (emp, shouldBlock) => {
    let reason = '';
    if (shouldBlock) {
      reason = window.prompt(`Enter reason for blocking ${emp.name} from upcoming tasks:`, 'Disciplinary review');
      if (reason === null) return;
    }
    try {
      await api.put(`/employees/${emp._id}`, {
        isBlocked: shouldBlock,
        status: shouldBlock ? 'Blocked' : 'Available',
        blockReason: shouldBlock ? (reason || 'Blocked by admin') : '',
      });
      fetchEmployees();
    } catch (err) {
      console.error('Error updating block status:', err);
      alert('Failed to update employee status.');
    }
  };

  const handleExportExcel = () => {
    if (employees.length === 0) {
      alert('No employee records to export.');
      return;
    }

    const exportData = employees.map((emp, idx) => {
      const expDate = emp.documents?.licenseExpiryDate 
        ? new Date(emp.documents.licenseExpiryDate).toLocaleDateString('en-IN')
        : 'N/A';
      const joinDate = emp.joiningDate 
        ? new Date(emp.joiningDate).toLocaleDateString('en-IN')
        : 'N/A';

      return {
        'S.No': idx + 1,
        'Staff ID': emp.employeeId || '',
        'Full Name': emp.name || '',
        'Category': emp.category || 'Driver',
        'Mobile Number': emp.mobileNumber || '',
        'Alternate Number': emp.alternateNumber || 'N/A',
        'Experience': emp.experience ? `${emp.experience} Years` : 'N/A',
        'Duty Status': emp.status || 'Available',
        'Is Blocked': emp.isBlocked || emp.status === 'Blocked' ? 'YES (Blocked)' : 'NO (Active)',
        'Block Reason': emp.blockReason || 'N/A',
        'License Number': emp.documents?.licenseNumber || 'N/A',
        'License Expiry Date': expDate,
        'Aadhaar Number': emp.documents?.aadhaarNumber || 'N/A',
        'PAN Number': emp.documents?.panNumber || 'N/A',
        'City': emp.address?.city || '',
        'State': emp.address?.state || '',
        'Full Address': emp.address?.fullAddress || `${emp.address?.street || ''} ${emp.address?.city || ''} ${emp.address?.state || ''}`.trim(),
        'Reference Person': emp.reference?.name ? `${emp.reference.name} (${emp.reference.relationship || 'Ref'}) - ${emp.reference.phone || ''}` : 'N/A',
        'Bank Name': emp.bankDetails?.bankName || 'N/A',
        'Account Number': emp.bankDetails?.accountNumber || 'N/A',
        'IFSC Code': emp.bankDetails?.ifscCode || 'N/A',
        'Account Holder': emp.bankDetails?.accountHolderName || 'N/A',
        'Remarks / Notes': emp.remarks || '',
        'Joining Date': joinDate,
      };
    });

    const activeFilterTag = [
      categoryFilter !== 'All' ? categoryFilter : '',
      statusFilter !== 'All' ? statusFilter : '',
    ].filter(Boolean).join('_') || 'All';

    exportToExcel(exportData, `SSRC_Staff_${activeFilterTag}`, 'Staff_Directory');
  };

  // Calculate pagination slices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(employees.length / itemsPerPage));

  return (
    <>
      <SEOHead title="Employee Biodata & Management - SSRC Admin" noindex={true} />

      <div className="space-y-6">
        
        {/* Top Header & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Employee Biodata Directory</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#B27500] border border-amber-300 text-xs font-bold">
                {employees.length} Staff
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage complete staff files, reference contacts, bank accounts, and driving license validation records.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
              title="Download Staff Directory as Excel"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export Excel ({employees.length})</span>
            </button>

            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>Add New Employee</span>
            </button>
          </div>
        </div>

        {/* Search & Multi-Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by name, phone, employee ID, reference, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Staff Categories</option>
              <option value="Driver">Drivers Only</option>
              <option value="Helper">Helpers Only</option>
              <option value="Captain">Captains Only</option>
            </select>

            {/* Availability Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Duty Statuses</option>
              <option value="Available">Available</option>
              <option value="On Duty">On Duty</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Employee Cards Grid / Table */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Loading Employee Records...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Employee Records Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords or category filters, or add a new candidate.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentEmployees.map((emp) => {
                const isCaptain = emp.category === 'Captain';
                const isDriver = emp.category === 'Driver';
                const Icon = isCaptain ? Compass : isDriver ? Car : Truck;
                const badgeBg = isCaptain ? 'bg-amber-100 text-amber-900' : isDriver ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900';
                const licenseInfo = getLicenseStatus(emp);

                return (
                  <div
                    key={emp._id}
                    className={`bg-white rounded-3xl p-5 shadow-sm hover:shadow-md border transition-all flex flex-col justify-between relative ${
                      licenseInfo.blocked ? 'border-amber-300 bg-amber-50/10' : 'border-slate-200'
                    }`}
                  >
                    <div className="space-y-3.5">
                      
                      {/* Header with Photo, ID, Category */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                            alt={emp.name}
                            className="w-13 h-13 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                          />
                          <div>
                            <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                              {emp.name}
                            </h3>
                            <span className="font-mono text-xs font-semibold text-slate-400 block mt-0.5">
                              {emp.employeeId}
                            </span>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${badgeBg} flex items-center gap-1`}>
                          <Icon className="w-3.5 h-3.5" />
                          <span>{emp.category}</span>
                        </span>
                      </div>

                      {/* License Validity & Task Allocation Status Indicator */}
                      {!licenseInfo.isHelper && (
                        <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${licenseInfo.badgeBg}`}>
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            {licenseInfo.blocked ? (
                              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 animate-bounce" />
                            ) : (
                              <BadgeCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                            )}
                            <span className="truncate font-bold">{licenseInfo.label}</span>
                          </div>
                          {licenseInfo.blocked && (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white shrink-0">
                              Task Blocked
                            </span>
                          )}
                        </div>
                      )}

                      {/* Heavy Vehicle Experience Badge if any */}
                      {emp.documents?.heavyVehicleExperience && (
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate font-semibold">
                            <strong>Heavy Truck:</strong> {emp.documents.heavyVehicleExperience}
                          </span>
                        </div>
                      )}

                      {/* Stats & Details */}
                      <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Experience</span>
                          <span className="font-bold text-slate-800">{emp.experience || '1 Year'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Duty Status</span>
                          <span className={`font-bold ${
                            emp.status === 'Available' ? 'text-emerald-600' : emp.status === 'On Duty' ? 'text-blue-600' : 'text-slate-500'
                          }`}>
                            {emp.status}
                          </span>
                        </div>
                      </div>

                      {/* Reference & Contact Info */}
                      <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-800">{emp.mobileNumber}</span>
                        </div>
                        
                        {emp.reference?.name && (
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-amber-50/50 p-1.5 rounded-lg border border-amber-200/50">
                            <UserCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span className="truncate">
                              Ref: <strong className="text-slate-800">{emp.reference.name}</strong> ({emp.reference.phone || 'No phone'})
                            </span>
                          </div>
                        )}

                        {emp.bankDetails?.accountNumber ? (
                          <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold">
                            <Building className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Bank: {emp.bankDetails.bankName || 'A/C Added'} (****{emp.bankDetails.accountNumber.slice(-4)})</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 italic">
                            <Building className="w-3.5 h-3.5 shrink-0" />
                            <span>No Bank A/C Linked</span>
                          </div>
                        )}
                      </div>

                      {/* Tasks Summary */}
                      <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Tasks Assigned</span>
                          <strong className="text-slate-900 font-extrabold text-sm">
                            {emp.totalTrips || 0}
                          </strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-semibold block">Total Payouts</span>
                          <strong className="text-emerald-700 font-extrabold text-sm">
                            ₹{emp.totalEarnings || 0}
                          </strong>
                        </div>
                      </div>

                    </div>

                    {/* Actions */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Link
                        to={`/admin/employees/${emp._id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#C8960C] to-[#E8A900] hover:from-[#B88500] hover:to-[#D49E00] text-slate-950 text-xs font-black shadow-xs transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Biodata Sheet</span>
                      </Link>

                      <button
                        onClick={() => handleOpenModal(emp)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Edit Biodata"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteEmployee(emp._id, emp.name)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                        title="Delete Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>
                  Showing <strong className="text-slate-900 font-bold">{employees.length > 0 ? indexOfFirstItem + 1 : 0}</strong> to{' '}
                  <strong className="text-slate-900 font-bold">{Math.min(indexOfLastItem, employees.length)}</strong> of{' '}
                  <strong className="text-slate-900 font-bold">{employees.length}</strong> staff files
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
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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

      {/* Add / Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-x-0 top-0 bottom-[60px] sm:bottom-0 z-40 sm:z-50 bg-slate-950/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative bg-white rounded-t-[28px] sm:rounded-3xl w-full max-w-3xl max-h-full sm:max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-white px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 z-10">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {editingEmployee ? `Edit Biodata: ${editingEmployee.name}` : 'Add New Employee Record'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Complete candidate personal details, reference contact, bank account, and driving license validation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form */}
            <form onSubmit={handleSaveEmployee} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              
              {/* Section 1: Staff Category Selection */}
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>1. Staff Category &amp; Designation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, category: 'Driver' })}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                      formData.category === 'Driver'
                        ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Car className="w-5 h-5" />
                      </div>
                      {formData.category === 'Driver' && (
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">Driver</div>
                      <div className="text-[11px] text-slate-500 font-medium">Commercial &amp; Chauffeur</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, category: 'Helper' })}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                      formData.category === 'Helper'
                        ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Truck className="w-5 h-5" />
                      </div>
                      {formData.category === 'Helper' && (
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">Helper</div>
                      <div className="text-[11px] text-slate-500 font-medium">Loading &amp; Relocation</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, category: 'Captain' })}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                      formData.category === 'Captain'
                        ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Compass className="w-5 h-5" />
                      </div>
                      {formData.category === 'Captain' && (
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">Captain</div>
                      <div className="text-[11px] text-slate-500 font-medium">VIP Fleet &amp; Lead Supervisor</div>
                    </div>
                  </button>

                </div>
              </div>

              {/* Section 2: Personal & Contact Information */}
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
                  <User className="w-4 h-4 text-amber-500" />
                  <span>2. Profile &amp; Contact Credentials</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Primary Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98480 12345"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Experience *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3 Years, 5+ Years"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Duty Availability Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                    >
                      <option value="Available">🟢 Available (Ready for assignment)</option>
                      <option value="On Duty">🟡 On Duty (Assigned)</option>
                      <option value="Inactive">⚪ Inactive (On Leave)</option>
                    </select>
                  </div>
                </div>

                {/* Profile Photo Uploader */}
                <div className="pt-2 border-t border-slate-200/60">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Profile Photo (Direct Upload or Image URL)
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="relative w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                      {formData.photo ? (
                        <img
                          src={formData.photo}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <User className="w-7 h-7 text-slate-400" />
                      )}
                      {uploadingField === 'photo' && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold cursor-pointer transition-all shadow-xs">
                          {uploadingField === 'photo' ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-3.5 h-3.5 text-amber-700" />
                              <span>Upload Photo File</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'photo')}
                            className="hidden"
                            disabled={uploadingField === 'photo'}
                          />
                        </label>

                        {formData.photo && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, photo: '' })}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>

                      <input
                        type="url"
                        placeholder="Or paste image URL (https://...)"
                        value={formData.photo}
                        onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Reference Box (Refer Name & Phone Number) */}
              <div className="bg-amber-50/40 rounded-2xl p-4 sm:p-5 border border-amber-200/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  <span>3. Reference Box (Referral / Guarantor Details)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Reference Person Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. S. Narayana Rao"
                      value={formData.reference.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reference: { ...formData.reference, name: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Reference Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98480 55443"
                      value={formData.reference.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reference: { ...formData.reference, phone: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Relationship / Designation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Former Supervisor / Contractor"
                      value={formData.reference.relationship}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reference: { ...formData.reference, relationship: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Employee Account Details (Bank Name, Acc No, IFSC, etc.) */}
              <div className="bg-emerald-50/40 rounded-2xl p-4 sm:p-5 border border-emerald-200/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-900">
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span>4. Employee Bank Account Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 38920194821"
                      value={formData.bankDetails.accountNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, accountNumber: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.bankDetails.accountHolderName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, accountHolderName: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. State Bank of India / HDFC"
                      value={formData.bankDetails.bankName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, bankName: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Branch Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kukatpally Main Branch"
                      value={formData.bankDetails.branchName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, branchName: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SBIN0004128"
                      value={formData.bankDetails.ifscCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, ifscCode: e.target.value.toUpperCase() },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-mono font-bold text-slate-900 uppercase focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Driving License, Validation Date & Heavy Truck Experience */}
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
                    <Car className="w-4 h-4 text-amber-600" />
                    <span>5. Driving License, Validation Date &amp; Heavy Truck Experience</span>
                  </div>
                  <span className="text-[10px] text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full font-bold border border-amber-300">
                    Task Allocation Gatekeeper
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Driving License ID / Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TS092018009988"
                      value={formData.documents.licenseNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          documents: { ...formData.documents, licenseNumber: e.target.value.toUpperCase() },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-mono font-bold text-slate-900 uppercase focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>License Validation / Expiry Date *</span>
                      <span className="text-[10px] font-normal text-rose-600 font-bold">2-Day Allocation Buffer</span>
                    </label>
                    <input
                      type="date"
                      value={formData.documents.licenseExpiryDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          documents: { ...formData.documents, licenseExpiryDate: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Heavy Truck Experience Details */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Experience in Heavy Trucks &amp; Multi-Axle Commercial Vehicles</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Years Experience on 10-Wheeler / 12-Wheeler Heavy Trucks, Trailers, Containers"
                    value={formData.documents.heavyVehicleExperience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        documents: { ...formData.documents, heavyVehicleExperience: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* License Document Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Driving License Document File (PDF / Image)
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors border border-slate-300">
                      {uploadingField === 'licenseDoc' ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                          <span>Uploading to Cloudinary...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
                          <span>{formData.documents.licenseDoc ? 'Replace License Document' : 'Upload Driving License (PDF/Img)'}</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileUpload(e, 'licenseDoc')}
                        className="hidden"
                        disabled={uploadingField === 'licenseDoc'}
                      />
                    </label>

                    {formData.documents.licenseDoc && (
                      <a
                        href={formData.documents.licenseDoc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors border border-amber-200 flex items-center gap-1"
                        title="View License Document"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 6: Other KYC Documents & Police Verification */}
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>6. Identity Verification (Aadhaar, PAN &amp; Police Clearance)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Aadhaar Number & Document */}
                  <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700">Aadhaar Card Details</label>
                    <input
                      type="text"
                      placeholder="Aadhaar No: XXXX-XXXX-1234"
                      value={formData.documents.aadhaarNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          documents: { ...formData.documents, aadhaarNumber: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                    />

                    <div className="flex items-center gap-2 pt-1">
                      <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors border border-slate-300">
                        {uploadingField === 'aadhaarDoc' ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
                            <span>{formData.documents.aadhaarDoc ? 'Replace Aadhaar Doc' : 'Upload Aadhaar (PDF/Img)'}</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileUpload(e, 'aadhaarDoc')}
                          className="hidden"
                          disabled={uploadingField === 'aadhaarDoc'}
                        />
                      </label>

                      {formData.documents.aadhaarDoc && (
                        <a
                          href={formData.documents.aadhaarDoc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors border border-emerald-200 flex items-center gap-1 shrink-0"
                          title="View Aadhaar Document"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* PAN Card Number & Document */}
                  <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700">PAN Card Details</label>
                    <input
                      type="text"
                      placeholder="PAN No: ABCDE1234F"
                      value={formData.documents.panNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          documents: { ...formData.documents, panNumber: e.target.value.toUpperCase() },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 uppercase focus:outline-none focus:border-amber-500"
                    />

                    <div className="flex items-center gap-2 pt-1">
                      <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors border border-slate-300">
                        {uploadingField === 'panDoc' ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
                            <span>{formData.documents.panDoc ? 'Replace PAN Doc' : 'Upload PAN (PDF/Img)'}</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileUpload(e, 'panDoc')}
                          className="hidden"
                          disabled={uploadingField === 'panDoc'}
                        />
                      </label>

                      {formData.documents.panDoc && (
                        <a
                          href={formData.documents.panDoc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors border border-emerald-200 flex items-center gap-1 shrink-0"
                          title="View PAN Document"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Police Verification Status Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Police Verification &amp; Background Clearance Status
                  </label>
                  <select
                    value={formData.documents.policeVerificationStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        documents: { ...formData.documents, policeVerificationStatus: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="Verified">✅ Verified (100% Police &amp; Background Cleared)</option>
                    <option value="In Progress">⏳ In Verification (Submitted to Dept)</option>
                    <option value="Pending">⚠️ Pending Review (Documents Incomplete)</option>
                  </select>
                </div>
              </div>

              {/* Section 7: Residential Address & Special Skills */}
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>7. Residential Address &amp; Special Skills</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Residential Address
                  </label>
                  <textarea
                    rows="2"
                    placeholder="H.No, Street, Landmark, Area (e.g. LB Nagar, Hyderabad), Pincode..."
                    value={formData.address.fullAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, fullAddress: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-medium focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Special Skills &amp; Capabilities (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="VIP Escort, Heavy Multi-axle, Automatic Transmission, Night Duty"
                    value={formData.specialSkills}
                    onChange={(e) => setFormData({ ...formData, specialSkills: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Section 8: Remarks & Performance / Duty Restriction Controls */}
              <div className="bg-amber-50/30 rounded-2xl p-4 sm:p-5 border border-amber-200/80 space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-950">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>8. Staff Remarks &amp; Performance Review</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Administrative Remarks &amp; Performance Notes
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Add staff remarks, past performance feedback, vehicle handling record, customer comments..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-medium focus:outline-none focus:border-amber-500 resize-none"
                  />
                  <span className="text-[10px] text-slate-400">
                    Remarks are saved directly to this employee's file and referenced during task allocations.
                  </span>
                </div>

                {/* Performance Block Checkbox */}
                <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="blockEmployeeModalCheck"
                      checked={formData.isBlocked}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isBlocked: e.target.checked,
                          status: e.target.checked ? 'Blocked' : formData.status === 'Blocked' ? 'Available' : formData.status,
                          blockReason: e.target.checked ? (formData.blockReason || formData.notes || 'Performance / conduct restriction') : '',
                        })
                      }
                      className="w-4 h-4 mt-0.5 text-rose-600 rounded border-rose-300 focus:ring-rose-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <label htmlFor="blockEmployeeModalCheck" className="text-xs font-bold text-rose-950 cursor-pointer block">
                        🚫 Block this employee for further trips because of performance / conduct
                      </label>
                      <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
                        When enabled, task management will automatically restrict this employee from being allotted to any new trips.
                      </p>
                    </div>
                  </div>

                  {formData.isBlocked && (
                    <div className="pt-2 border-t border-rose-200 animate-in fade-in">
                      <label className="block text-[11px] font-bold text-rose-900 mb-1">
                        Reason for Blocking (Performance / Policy Issue) *
                      </label>
                      <input
                        type="text"
                        required={formData.isBlocked}
                        placeholder="e.g. Repeated late arrival, rash driving feedback from client..."
                        value={formData.blockReason}
                        onChange={(e) => setFormData({ ...formData, blockReason: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-rose-300 text-xs font-semibold text-rose-950 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified &amp; Police Cleared Staff Database</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingEmployee ? 'Save Changes' : 'Save Biodata Record'}</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </>
  );
};

export default EmployeesPage;
