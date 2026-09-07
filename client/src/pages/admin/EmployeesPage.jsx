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
  DollarSign,
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
  RefreshCw
} from 'lucide-react';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';

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
    dailyRate: '',
    monthlyRate: '',
    status: 'Available',
    address: {
      street: '',
      city: '',
      state: '',
      fullAddress: '',
    },
    documents: {
      aadhaarNumber: '',
      aadhaarDoc: '',
      panNumber: '',
      panDoc: '',
      licenseNumber: '',
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
      setFormData({
        name: employee.name || '',
        mobileNumber: employee.mobileNumber || '',
        alternateNumber: employee.alternateNumber || '',
        category: employee.category || 'Driver',
        experience: employee.experience || '',
        photo: employee.photo || '',
        dailyRate: employee.dailyRate !== undefined && employee.dailyRate !== null ? employee.dailyRate : '',
        monthlyRate: employee.monthlyRate !== undefined && employee.monthlyRate !== null ? employee.monthlyRate : '',
        status: employee.status || 'Available',
        address: {
          street: employee.address?.street || '',
          city: employee.address?.city || '',
          state: employee.address?.state || '',
          fullAddress: employee.address?.fullAddress || '',
        },
        documents: {
          aadhaarNumber: employee.documents?.aadhaarNumber || '',
          aadhaarDoc: employee.documents?.aadhaarDoc || '',
          panNumber: employee.documents?.panNumber || '',
          panDoc: employee.documents?.panDoc || '',
          licenseNumber: employee.documents?.licenseNumber || '',
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
        dailyRate: '',
        monthlyRate: '',
        status: 'Available',
        address: {
          street: '',
          city: '',
          state: '',
          fullAddress: '',
        },
        documents: {
          aadhaarNumber: '',
          aadhaarDoc: '',
          panNumber: '',
          panDoc: '',
          licenseNumber: '',
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
        dailyRate: Number(formData.dailyRate) || 0,
        monthlyRate: Number(formData.monthlyRate) || 0,
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

  // Calculate pagination slices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(employees.length / itemsPerPage));

  return (
    <>
      <SEOHead title="Employee Biodata & Management - SSRC Admin" />

      <div className="space-y-6">
        
        {/* Top Header & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Employee Biodata Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage complete staff files, police verification records, experience, and contact info.
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 hover:scale-[1.02] transition-transform self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Add New Employee</span>
          </button>
        </div>

        {/* Search & Multi-Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by name, phone, employee ID..."
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
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
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

                return (
                  <div
                    key={emp._id}
                    className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md border border-slate-200 transition-all flex flex-col justify-between"
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

                      {/* Stats & Details */}
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Experience</span>
                          <span className="font-bold text-slate-800">{emp.experience}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Status</span>
                          <span className={`font-bold ${
                            emp.status === 'Available' ? 'text-emerald-600' : emp.status === 'On Duty' ? 'text-blue-600' : 'text-slate-500'
                          }`}>
                            {emp.status}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{emp.mobileNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-emerald-700 font-semibold">Police Verification: {emp.documents?.policeVerificationStatus || 'Verified'}</span>
                        </div>
                      </div>

                      {/* Rates Summary */}
                      <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-amber-900 font-semibold block">Total Earnings</span>
                          <strong className="text-slate-900 font-extrabold text-sm">
                            ₹{emp.totalEarnings || 0}
                          </strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-amber-900 font-semibold block">Tasks Logged</span>
                          <strong className="text-slate-900 font-extrabold text-sm">
                            {emp.totalTrips || 0}
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
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Edit Employee"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteEmployee(emp._id, emp.name)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>
                  Showing <strong className="text-slate-900 font-bold">{employees.length > 0 ? indexOfFirstItem + 1 : 0}</strong> to{' '}
                  <strong className="text-slate-900 font-bold">{Math.min(indexOfLastItem, employees.length)}</strong> of{' '}
                  <strong className="text-slate-900 font-bold">{employees.length}</strong> employees
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

          </div>
        )}

      </div>

      {/* Add / Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
          <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Header — Clean White, Perfectly Positioned Title, Subtitle & Close Button */}
            <div className="bg-white px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 mb-0.5">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  SSRC HR Staff Directory
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {editingEmployee ? `Edit Employee: ${editingEmployee.name}` : 'Add New Employee Biodata'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Fill in credentials, category, contact, and rates.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all shrink-0 active:scale-95 mt-1 cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveEmployee} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              
              {/* Category Selector: 3 Visual Interactive Cards */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  1. Staff Designation Category *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Driver */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, category: 'Driver' })}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                      formData.category === 'Driver'
                        ? 'border-blue-500 bg-blue-50/70 shadow-md ring-2 ring-blue-400/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${formData.category === 'Driver' ? 'bg-blue-600 text-white shadow' : 'bg-slate-200 text-slate-700'}`}>
                        <Car className="w-4 h-4" />
                      </div>
                      {formData.category === 'Driver' && (
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">Driver</div>
                      <div className="text-[11px] text-slate-500 font-medium">Steers Responsibly</div>
                    </div>
                  </button>

                  {/* Helper */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, category: 'Helper' })}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                      formData.category === 'Helper'
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-md ring-2 ring-emerald-400/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${formData.category === 'Helper' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-200 text-slate-700'}`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      {formData.category === 'Helper' && (
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">Helper</div>
                      <div className="text-[11px] text-slate-500 font-medium">Supports Dedicatedly</div>
                    </div>
                  </button>

                  {/* Captain */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, category: 'Captain' })}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                      formData.category === 'Captain'
                        ? 'border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-400/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${formData.category === 'Captain' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-200 text-slate-700'}`}>
                        <Award className="w-4 h-4" />
                      </div>
                      {formData.category === 'Captain' && (
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">Captain</div>
                      <div className="text-[11px] text-slate-500 font-medium">Leads with Confidence</div>
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
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Primary Mobile Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="+91 98480 12345"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Experience *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. 3 Years, 5+ Years"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Alternate / WhatsApp Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 95051 51527"
                      value={formData.alternateNumber}
                      onChange={(e) => setFormData({ ...formData, alternateNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                    />
                  </div>
                </div>

                {/* Profile Photo Uploader & Preview */}
                <div className="pt-2 border-t border-slate-200/60">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Profile Photo (Direct Upload or Image URL)
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    
                    {/* Live Avatar Preview */}
                    <div className="relative w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                      {formData.photo ? (
                        <img
                          src={formData.photo}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
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

                    {/* File Upload Button & URL input */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold cursor-pointer transition-all shadow-xs">
                          {uploadingField === 'photo' ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
                              <span>Uploading to Cloudinary...</span>
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

              {/* Section 3: Engagement Rates & Availability Status */}
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>3. Rates &amp; Availability</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Daily Rate (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-bold">₹</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 800"
                        value={formData.dailyRate}
                        onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value === '' ? '' : Number(e.target.value) })}
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-bold focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Monthly Rate (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-bold">₹</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 22000"
                        value={formData.monthlyRate}
                        onChange={(e) => setFormData({ ...formData, monthlyRate: e.target.value === '' ? '' : Number(e.target.value) })}
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-bold focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Current Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-bold focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                    >
                      <option value="Available">🟢 Available (Ready)</option>
                      <option value="On Duty">🟡 On Duty (Assigned)</option>
                      <option value="Inactive">⚪ Inactive (On Leave)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: KYC & Cloudinary Document Uploaders */}
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>4. KYC Verification &amp; Documents (Cloudinary PDF / Images)</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    <BadgeCheck className="w-3.5 h-3.5" /> 100% Police Clearance Verified
                  </span>
                </div>

                {/* 1. Aadhaar Card Card */}
                <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-800">Aadhaar Card Record</span>
                    </div>
                    {formData.documents.aadhaarDoc ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Uploaded to Cloudinary
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400">PDF / Image Required</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Aadhaar Card Number</label>
                      <input
                        type="text"
                        placeholder="XXXX-XXXX-1234"
                        value={formData.documents.aadhaarNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            documents: { ...formData.documents, aadhaarNumber: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Aadhaar Document File</label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors border border-slate-300">
                          {uploadingField === 'aadhaarDoc' ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                              <span>{formData.documents.aadhaarDoc ? 'Replace Document' : 'Upload Aadhaar (PDF/Img)'}</span>
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
                            className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors border border-blue-200 flex items-center gap-1"
                            title="View Aadhaar Document"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. PAN Card Card */}
                <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-bold text-slate-800">PAN Card Record</span>
                    </div>
                    {formData.documents.panDoc ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Uploaded to Cloudinary
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400">PDF / Image Required</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">PAN Card Number</label>
                      <input
                        type="text"
                        placeholder="ABCDE1234F"
                        value={formData.documents.panNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            documents: { ...formData.documents, panNumber: e.target.value.toUpperCase() },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 uppercase focus:outline-none focus:border-amber-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">PAN Document File</label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors border border-slate-300">
                          {uploadingField === 'panDoc' ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-3.5 h-3.5 text-purple-600" />
                              <span>{formData.documents.panDoc ? 'Replace Document' : 'Upload PAN (PDF/Img)'}</span>
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
                            className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors border border-purple-200 flex items-center gap-1"
                            title="View PAN Document"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Driving License Card */}
                <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-slate-800">Driving License / Commercial Badge</span>
                    </div>
                    {formData.documents.licenseDoc ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Uploaded to Cloudinary
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400">PDF / Image Optional</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Driving License Number</label>
                      <input
                        type="text"
                        placeholder="TS0920201234567"
                        value={formData.documents.licenseNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            documents: { ...formData.documents, licenseNumber: e.target.value.toUpperCase() },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 uppercase focus:outline-none focus:border-amber-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">License Document File</label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors border border-slate-300">
                          {uploadingField === 'licenseDoc' ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
                              <span>{formData.documents.licenseDoc ? 'Replace Document' : 'Upload License (PDF/Img)'}</span>
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
                            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors border border-amber-200 flex items-center gap-1"
                            title="View License Document"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Experience & Relieving Certificate */}
                <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-teal-600" />
                      <span className="text-xs font-bold text-slate-800">Experience / Relieving Certificate</span>
                    </div>
                    {formData.documents.experienceDoc ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Uploaded to Cloudinary
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400">PDF / Image Optional</span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors border border-slate-300">
                        {uploadingField === 'experienceDoc' ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                            <span>Uploading to Cloudinary...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-3.5 h-3.5 text-teal-600" />
                            <span>{formData.documents.experienceDoc ? 'Replace Experience Certificate' : 'Upload Experience Certificate (PDF/Image)'}</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileUpload(e, 'experienceDoc')}
                          className="hidden"
                          disabled={uploadingField === 'experienceDoc'}
                        />
                      </label>

                      {formData.documents.experienceDoc && (
                        <a
                          href={formData.documents.experienceDoc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-colors border border-teal-200 flex items-center gap-1"
                          title="View Experience Certificate"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Certificate</span>
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-bold focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                  >
                    <option value="Verified">✅ Verified (100% Police &amp; Background Cleared)</option>
                    <option value="In Progress">⏳ In Verification (Submitted to Dept)</option>
                    <option value="Pending">⚠️ Pending Review (Documents Incomplete)</option>
                  </select>
                </div>
              </div>

              {/* Section 5: Address & Special Skills */}
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>5. Location &amp; Skills Tag</span>
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Special Skills &amp; Capabilities (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="VIP Escort, Automatic Transmission, Outstation Expert, Night Duty"
                    value={formData.specialSkills}
                    onChange={(e) => setFormData({ ...formData, specialSkills: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified &amp; Police Cleared Staff Database</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/25 hover:shadow-amber-400/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
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
