import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  X, 
  ChevronsLeft, 
  ChevronsRight, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Compass,
  Navigation,
  Sparkles,
  RefreshCw,
  Power,
  Download
} from 'lucide-react';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';
import { exportToExcel } from '../../utils/excelExport';

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fromCity: '',
    toCity: '',
    routeName: '',
    distanceKm: '',
    estimatedHours: '',
    status: 'Active',
    notes: '',
  });

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/routes', {
        params: {
          search,
          status: statusFilter,
        },
      });
      if (res.data.success) {
        setRoutes(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching routes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [search, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, itemsPerPage]);

  const handleOpenModal = (route = null) => {
    if (route) {
      setEditingRoute(route);
      setFormData({
        fromCity: route.fromCity || '',
        toCity: route.toCity || '',
        routeName: route.routeName || '',
        distanceKm: route.distanceKm !== undefined && route.distanceKm !== null ? route.distanceKm : '',
        estimatedHours: route.estimatedHours || '',
        status: route.status || 'Active',
        notes: route.notes || '',
      });
    } else {
      setEditingRoute(null);
      setFormData({
        fromCity: '',
        toCity: '',
        routeName: '',
        distanceKm: '',
        estimatedHours: '',
        status: 'Active',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveRoute = async (e) => {
    e.preventDefault();
    if (!formData.fromCity.trim()) {
      alert('Starting City (From) is required.');
      return;
    }
    if (!formData.toCity.trim()) {
      alert('Ending City (To) is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        distanceKm: formData.distanceKm === '' ? 0 : Number(formData.distanceKm),
      };

      if (editingRoute) {
        await api.put(`/routes/${editingRoute._id}`, payload);
      } else {
        await api.post('/routes', payload);
      }
      setIsModalOpen(false);
      fetchRoutes();
    } catch (err) {
      console.error('Error saving route:', err);
      alert(err.response?.data?.message || 'Failed to save route.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (route) => {
    const newStatus = route.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.put(`/routes/${route._id}`, { status: newStatus });
      fetchRoutes();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to toggle route status.');
    }
  };

  const handleDeleteRoute = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete route "${name}"?`)) {
      try {
        await api.delete(`/routes/${id}`);
        fetchRoutes();
      } catch (err) {
        console.error('Error deleting route:', err);
      }
    }
  };

  const handleExportExcel = () => {
    if (routes.length === 0) {
      alert('No route records to export.');
      return;
    }

    const exportData = routes.map((r, idx) => ({
      'S.No': idx + 1,
      'Route Name': r.routeName || `${r.fromCity} → ${r.toCity}`,
      'From City / Hub': r.fromCity || '',
      'To City / Destination': r.toCity || '',
      'Distance (KM)': r.distanceKm !== undefined && r.distanceKm !== null ? r.distanceKm : 'N/A',
      'Estimated Duration': r.estimatedHours || 'N/A',
      'Operational Status': r.status || 'Active',
      'Notes / Special Instructions': r.notes || '',
      'Created Date': r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : 'N/A',
    }));

    exportToExcel(exportData, `SSRC_Routes_${statusFilter}`, 'Routes_Corridors');
  };

  // Calculate pagination slices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoutes = routes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(routes.length / itemsPerPage));

  const totalActive = routes.filter((r) => r.status === 'Active').length;

  return (
    <>
      <SEOHead title="Route Management - SSRC Admin" />

      <div className="space-y-6">
        
        {/* Top Header & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Route Management</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#B27500] border border-amber-300 text-xs font-bold">
                {routes.length} Corridors
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Define starting cities (From), ending cities (To), operational status, distances, and corridor details.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
              title="Download Route Corridors as Excel"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export Excel ({routes.length})</span>
            </button>

            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>Add New Route</span>
            </button>
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Configured Routes</span>
              <span className="text-xl font-black text-slate-900">{routes.length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C8960C]">
              <Navigation className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Corridors</span>
              <span className="text-xl font-black text-emerald-600">{totalActive}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Inactive / Closed</span>
              <span className="text-xl font-black text-slate-500">{routes.length - totalActive}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by starting city (From), ending city (To), or route name..."
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
              <option value="All">All Route Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Route Records Table */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Loading Route Records...</p>
          </div>
        ) : routes.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
            <Navigation className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Route Records Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Add your first transport corridor or adjust your search keywords.
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Route</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Starting City (From)</th>
                    <th className="py-3.5 px-4">Ending City (To)</th>
                    <th className="py-3.5 px-4">Route Name / Corridor</th>
                    <th className="py-3.5 px-4">Distance &amp; Time</th>
                    <th className="py-3.5 px-4">Status &amp; Toggle</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentRoutes.map((route) => {
                    const isActive = route.status === 'Active';
                    return (
                      <tr key={route._id} className="hover:bg-amber-50/20 transition-colors group">
                        
                        {/* Starting City */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="font-extrabold text-slate-900 text-sm">
                              {route.fromCity}
                            </span>
                          </div>
                        </td>

                        {/* Ending City */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-extrabold text-slate-900 text-sm">
                              {route.toCity}
                            </span>
                          </div>
                        </td>

                        {/* Route Name / Corridor */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">
                            {route.routeName || `${route.fromCity} → ${route.toCity}`}
                          </div>
                          {route.notes && (
                            <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">
                              {route.notes}
                            </div>
                          )}
                        </td>

                        {/* Distance & Time */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {route.distanceKm > 0 && (
                              <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                                {route.distanceKm} km
                              </span>
                            )}
                            {route.estimatedHours && (
                              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {route.estimatedHours}
                              </span>
                            )}
                            {!route.distanceKm && !route.estimatedHours && (
                              <span className="text-slate-400 italic text-[11px]">Standard corridor</span>
                            )}
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(route)}
                            title={`Click to set ${isActive ? 'Inactive' : 'Active'}`}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                              }`}
                            />
                            <span>{route.status}</span>
                            <Power className={`w-3 h-3 ml-0.5 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenModal(route)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-700 transition-colors cursor-pointer"
                              title="Edit Route"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRoute(route._id, route.routeName || `${route.fromCity} to ${route.toCity}`)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                              title="Delete Route"
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

            {/* Pagination Controls */}
            <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>
                  Showing <strong className="text-slate-900 font-bold">{routes.length > 0 ? indexOfFirstItem + 1 : 0}</strong> to{' '}
                  <strong className="text-slate-900 font-bold">{Math.min(indexOfLastItem, routes.length)}</strong> of{' '}
                  <strong className="text-slate-900 font-bold">{routes.length}</strong> routes
                </span>

                <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
                  <span className="text-slate-400">Per page:</span>
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

      {/* Add / Edit Route Modal */}
      {isModalOpen && (
        <div className="fixed inset-x-0 top-0 bottom-[60px] sm:bottom-0 z-40 sm:z-50 bg-slate-950/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative bg-white rounded-t-[28px] sm:rounded-3xl w-full max-w-2xl max-h-full sm:max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#C8960C] flex items-center justify-center">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {editingRoute ? `Edit Route Corridor` : 'Add New Route Corridor'}
                  </h3>
                  <p className="text-xs text-slate-500">Configure starting city (From) and destination (To).</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveRoute} className="p-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Starting City (From) *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hyderabad"
                      value={formData.fromCity}
                      onChange={(e) => {
                        const from = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          fromCity: from,
                          routeName: prev.toCity ? `${from} → ${prev.toCity}` : from,
                        }));
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ending City (To) *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-rose-600 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vijayawada"
                      value={formData.toCity}
                      onChange={(e) => {
                        const to = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          toCity: to,
                          routeName: prev.fromCity ? `${prev.fromCity} → ${to}` : to,
                        }));
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Route Name / Highway Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad → Vijayawada (NH65)"
                  value={formData.routeName}
                  onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Distance (KM)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 275"
                    value={formData.distanceKm}
                    onChange={(e) => setFormData({ ...formData, distanceKm: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Est. Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5.5 Hours"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Route Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                  >
                    <option value="Active">🟢 Active</option>
                    <option value="Inactive">⚪ Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Corridor Notes &amp; Toll / Road Info
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. High traffic near Suryapet, 4 toll gates, bypass available..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : editingRoute ? 'Update Route' : 'Save Route'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </>
  );
};

export default RoutesPage;
