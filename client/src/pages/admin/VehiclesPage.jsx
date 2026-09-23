import { useState, useEffect } from 'react';
import {
  Truck,
  Plus,
  Edit3,
  Trash2,
  Search,
  X,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  Car,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';

const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
};

const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getDateStatus = (dateStr) => {
  if (!dateStr) return 'none';
  const vDate = new Date(dateStr);
  if (isNaN(vDate.getTime())) return 'none';
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const twoDaysFromNow = new Date(now);
  twoDaysFromNow.setDate(now.getDate() + 2);
  
  if (vDate < now) return 'expired';
  if (vDate <= twoDaysFromNow) return 'warning';
  return 'ok';
};

const getExpirationStatus = (vehicle) => {
  const dates = [
    { label: 'Fitness', value: vehicle.fitnessValidUpto },
    { label: 'Tax', value: vehicle.taxValidUpto },
    { label: 'Insurance', value: vehicle.insuranceValidUpto },
    { label: 'PUCC', value: vehicle.puccValidUpto },
    { label: 'Permit', value: vehicle.permitValidUpto },
    { label: 'AITP', value: vehicle.aitpValidUpto },
  ];
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const twoDaysFromNow = new Date(now);
  twoDaysFromNow.setDate(now.getDate() + 2);
  
  let isExpired = false;
  let isExpiringSoon = false;
  let expiringDetails = [];
  
  dates.forEach(d => {
    if (d.value) {
      const vDate = new Date(d.value);
      if (vDate < now) {
        isExpired = true;
        expiringDetails.push(`${d.label} Expired`);
      } else if (vDate <= twoDaysFromNow) {
        isExpiringSoon = true;
        expiringDetails.push(`${d.label} Expiring Soon`);
      }
    }
  });
  
  if (isExpired) return { status: 'expired', details: expiringDetails };
  if (isExpiringSoon) return { status: 'warning', details: expiringDetails };
  return { status: 'ok', details: [] };
};

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    vehicleNumber: '',
    status: 'Active',
    notes: '',
    registrationDate: '',
    fitnessValidUpto: '',
    taxValidUpto: '',
    insuranceValidUpto: '',
    puccValidUpto: '',
    permitValidUpto: '',
    aitpValidUpto: ''
  });

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vehicles');
      if (res.data.success) {
        setVehicles(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleOpenModal = (vehicle = null) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        vehicleNumber: vehicle.vehicleNumber || '',
        status: vehicle.status || 'Active',
        notes: vehicle.notes || '',
        registrationDate: formatDateForInput(vehicle.registrationDate),
        fitnessValidUpto: formatDateForInput(vehicle.fitnessValidUpto),
        taxValidUpto: formatDateForInput(vehicle.taxValidUpto),
        insuranceValidUpto: formatDateForInput(vehicle.insuranceValidUpto),
        puccValidUpto: formatDateForInput(vehicle.puccValidUpto),
        permitValidUpto: formatDateForInput(vehicle.permitValidUpto),
        aitpValidUpto: formatDateForInput(vehicle.aitpValidUpto)
      });
    } else {
      setEditingVehicle(null);
      setFormData({ 
        vehicleNumber: '', status: 'Active', notes: '',
        registrationDate: '', fitnessValidUpto: '', taxValidUpto: '',
        insuranceValidUpto: '', puccValidUpto: '', permitValidUpto: '', aitpValidUpto: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.vehicleNumber.trim()) {
      alert('Vehicle number is required.');
      return;
    }
    setSaving(true);
    try {
      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle._id}`, formData);
      } else {
        await api.post('/vehicles', formData);
      }
      setIsModalOpen(false);
      fetchVehicles();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save vehicle.';
      alert(`Error: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, vehicleNumber) => {
    if (!window.confirm(`Delete vehicle ${vehicleNumber}? This cannot be undone.`)) return;
    try {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      alert('Failed to delete vehicle.');
    }
  };

  const handleToggleStatus = async (vehicle) => {
    const newStatus = vehicle.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.put(`/vehicles/${vehicle._id}`, { status: newStatus });
      fetchVehicles();
    } catch (err) {
      alert('Failed to update vehicle status.');
    }
  };

  // Filter
  const filtered = vehicles.filter((v) => {
    const matchSearch = v.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.notes?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const activeCount = vehicles.filter((v) => v.status === 'Active').length;
  const inactiveCount = vehicles.filter((v) => v.status === 'Inactive').length;

  return (
    <>
      <SEOHead title="Vehicle Management - SSRC Admin" noindex={true} />

      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Vehicle Management</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#B27500] border border-amber-300 text-xs font-bold">
                {vehicles.length} Total
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage vehicle numbers for task assignment dropdown. Active vehicles appear in task management.
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 hover:scale-[1.02] transition-transform cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Vehicle</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Vehicles', value: vehicles.length, color: 'bg-slate-100 text-slate-800', border: 'border-slate-200' },
            { label: 'Active', value: activeCount, color: 'bg-emerald-50 text-emerald-800', border: 'border-emerald-200' },
            { label: 'Inactive', value: inactiveCount, color: 'bg-rose-50 text-rose-800', border: 'border-rose-200' },
          ].map((s) => (
            <div key={s.label} className={`${s.color} border ${s.border} rounded-2xl p-4 text-center`}>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-xs font-bold mt-0.5 opacity-70">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Expiration Alert */}
        {vehicles.some(v => getExpirationStatus(v).status !== 'ok') && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-black text-red-900">Action Required: Documents Expiring Soon</h4>
              <p className="text-xs font-medium text-red-700 mt-0.5">
                Some vehicles have documents that are expired or expiring within 2 days. Please review the highlighted vehicles below.
              </p>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search vehicle number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Vehicle List */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Loading Vehicles...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
            <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Vehicles Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {vehicles.length === 0 ? 'Add your first vehicle number to get started.' : 'Try adjusting your search or filters.'}
            </p>
            {vehicles.length === 0 && (
              <button
                onClick={() => handleOpenModal()}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add First Vehicle
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {current.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className={`bg-white rounded-2xl p-4 border shadow-sm hover:shadow-md transition-all flex flex-col gap-3 ${
                    vehicle.status === 'Active' ? 'border-emerald-200' : 'border-slate-200 opacity-70'
                  }`}
                >
                  {/* Vehicle Number & Info */}
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      vehicle.status === 'Active' ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <Truck className={`w-5 h-5 ${vehicle.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-black text-slate-900 text-[15px] font-mono tracking-widest break-words leading-tight">
                          {vehicle.vehicleNumber}
                        </div>
                        <div className="shrink-0 flex items-center gap-1 mt-0.5">
                          {getExpirationStatus(vehicle).status === 'expired' && <AlertOctagon className="w-4 h-4 text-red-600" title="Documents Expired" />}
                          {getExpirationStatus(vehicle).status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" title="Documents Expiring Soon" />}
                        </div>
                      </div>
                      
                      {vehicle.notes && (
                        <div className="text-[11px] font-medium text-slate-500 mt-1 truncate" title={vehicle.notes}>
                          {vehicle.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Document Validities Grid */}
                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    {[
                      { label: 'Registration', val: vehicle.registrationDate, skipWarning: true },
                      { label: 'Fitness', val: vehicle.fitnessValidUpto },
                      { label: 'Tax', val: vehicle.taxValidUpto },
                      { label: 'Insurance', val: vehicle.insuranceValidUpto },
                      { label: 'PUCC', val: vehicle.puccValidUpto },
                      { label: 'Permit', val: vehicle.permitValidUpto },
                      { label: 'AITP', val: vehicle.aitpValidUpto },
                    ].map((doc, idx) => {
                      const status = doc.skipWarning ? 'ok' : getDateStatus(doc.val);
                      let colorClass = 'text-slate-700 bg-slate-50 border-slate-100';
                      if (status === 'expired') colorClass = 'text-red-700 bg-red-50 border-red-200';
                      if (status === 'warning') colorClass = 'text-amber-700 bg-amber-50 border-amber-200';
                      
                      return (
                        <div key={idx} className={`flex flex-col p-1.5 rounded-lg border ${colorClass} ${idx === 6 ? 'col-span-2' : ''}`}>
                          <span className="text-[9px] opacity-70 font-bold uppercase tracking-wider">{doc.label}</span>
                          <span className="text-[10px] font-black">{formatDateForDisplay(doc.val)}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Spacer to push actions to bottom if card grows */}
                  <div className="flex-1" />

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    {/* Toggle Active/Inactive */}
                    <button
                      onClick={() => handleToggleStatus(vehicle)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        vehicle.status === 'Active'
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                      title={vehicle.status === 'Active' ? 'Set Inactive' : 'Set Active'}
                    >
                      {vehicle.status === 'Active' ? (
                        <><ToggleRight className="w-3.5 h-3.5 text-emerald-600" /><span>Active</span></>
                      ) : (
                        <><ToggleLeft className="w-3.5 h-3.5 text-slate-400" /><span>Inactive</span></>
                      )}
                    </button>

                    <button
                      onClick={() => handleOpenModal(vehicle)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      title="Edit Vehicle"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(vehicle._id, vehicle.vehicleNumber)}
                      className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                      title="Delete Vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Showing <strong>{indexOfFirst + 1}</strong>–<strong>{Math.min(indexOfLast, filtered.length)}</strong> of <strong>{filtered.length}</strong>
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg">{currentPage}/{totalPages}</span>
                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-x-0 top-0 bottom-[60px] sm:bottom-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-t-[28px] sm:rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="bg-white px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {editingVehicle ? `Edit Vehicle: ${editingVehicle.vehicleNumber}` : 'Add New Vehicle'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Vehicle number will appear in Task Management dropdown.
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

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5">

              {/* Vehicle Number */}
              <div>
                <label className="block text-sm font-black text-slate-800 mb-2">
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TS09AB1234"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-lg font-black font-mono text-slate-900 uppercase tracking-widest focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                  autoFocus
                />
                <p className="text-[11px] text-slate-400 mt-1.5">Enter the vehicle registration number. It will be auto-uppercased.</p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-2">Status</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'Active' })}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-black transition-all cursor-pointer ${
                      formData.status === 'Active'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    🟢 Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'Inactive' })}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-black transition-all cursor-pointer ${
                      formData.status === 'Inactive'
                        ? 'border-slate-500 bg-slate-100 text-slate-900'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    ⚫ Inactive
                  </button>
                </div>
                {formData.status === 'Inactive' && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Inactive vehicles will <strong>not</strong> appear in task management dropdown.</span>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 10-Wheeler Truck, Leased from XYZ..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Document Validity Dates */}
              <div>
                <h4 className="text-xs font-black text-slate-800 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Calendar className="w-3.5 h-3.5" /> Document Validity Dates (Optional)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Registration Date', key: 'registrationDate' },
                    { label: 'Fitness Valid Upto', key: 'fitnessValidUpto' },
                    { label: 'Tax Valid Upto', key: 'taxValidUpto' },
                    { label: 'Insurance Valid Upto', key: 'insuranceValidUpto' },
                    { label: 'PUCC Valid Upto', key: 'puccValidUpto' },
                    { label: 'Permit Valid Upto', key: 'permitValidUpto' },
                    { label: 'AITP Valid Upto', key: 'aitpValidUpto' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">
                        {field.label}
                      </label>
                      <input
                        type="date"
                        value={formData[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving...</span></>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /><span>{editingVehicle ? 'Save Changes' : 'Add Vehicle'}</span></>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
};

export default VehiclesPage;
