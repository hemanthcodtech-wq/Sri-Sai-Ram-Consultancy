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
  ChevronsRight
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
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    alternateNumber: '',
    category: 'Driver',
    experience: '3 Years',
    photo: '',
    dailyRate: 800,
    monthlyRate: 22000,
    status: 'Available',
    address: {
      street: '',
      city: 'Hyderabad',
      state: 'Telangana',
      fullAddress: '',
    },
    documents: {
      aadhaarNumber: '',
      licenseNumber: '',
      policeVerificationStatus: 'Verified',
    },
    specialSkills: '',
    notes: '',
  });

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
        experience: employee.experience || '1 Year',
        photo: employee.photo || '',
        dailyRate: employee.dailyRate || 800,
        monthlyRate: employee.monthlyRate || 20000,
        status: employee.status || 'Available',
        address: {
          street: employee.address?.street || '',
          city: employee.address?.city || 'Hyderabad',
          state: employee.address?.state || 'Telangana',
          fullAddress: employee.address?.fullAddress || '',
        },
        documents: {
          aadhaarNumber: employee.documents?.aadhaarNumber || '',
          licenseNumber: employee.documents?.licenseNumber || '',
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
        experience: '3 Years',
        photo: '',
        dailyRate: 800,
        monthlyRate: 22000,
        status: 'Available',
        address: {
          street: '',
          city: 'Hyderabad',
          state: 'Telangana',
          fullAddress: '',
        },
        documents: {
          aadhaarNumber: '',
          licenseNumber: '',
          policeVerificationStatus: 'Verified',
        },
        specialSkills: 'VIP Escort, Outstation Route Expert',
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
      alert('Failed to save employee profile.');
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
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0B2545] hover:bg-[#081C36] text-amber-400 text-xs font-bold transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {editingEmployee ? `Edit Employee: ${editingEmployee.name}` : 'Add New Employee Biodata'}
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in credentials, category, contact, and rates.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Driver">Driver (Steers Responsibly)</option>
                    <option value="Helper">Helper (Supports Dedicatedly)</option>
                    <option value="Captain">Captain (Leads with Confidence)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98480 12345"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Experience *</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Years"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Daily Rate (₹)</label>
                  <input
                    type="number"
                    value={formData.dailyRate}
                    onChange={(e) => setFormData({ ...formData, dailyRate: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Rate (₹)</label>
                  <input
                    type="number"
                    value={formData.monthlyRate}
                    onChange={(e) => setFormData({ ...formData, monthlyRate: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Available">Available</option>
                    <option value="On Duty">On Duty</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Photo Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Aadhaar Card Number</label>
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
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Driving License Number</label>
                  <input
                    type="text"
                    placeholder="TS092020..."
                    value={formData.documents.licenseNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        documents: { ...formData.documents, licenseNumber: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Residential Address</label>
                <textarea
                  rows="2"
                  placeholder="H.No, Street, Area, City, Pincode..."
                  value={formData.address.fullAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, fullAddress: e.target.value },
                    })
                  }
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
                  Save Biodata Record
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </>
  );
};

export default EmployeesPage;
