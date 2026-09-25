import { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, Fuel, Droplet, IndianRupee, List, Download, X, Calendar, MapPin, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';
import * as XLSX from 'xlsx';

const getMileageMetrics = (record) => {
  const lastFuelKm = Number(record.lastFuelKm ?? record.odometerReading ?? 0);
  const endTripKm = Number(record.endTripKm ?? (lastFuelKm + Number(record.kmsCovered || 0)));
  const totalKm = Number(record.totalKm ?? Math.max(0, endTripKm - lastFuelKm));
  const fuelQuantity = Number(record.fuelQuantity || 0);
  const mileage = Number(record.mileage ?? (fuelQuantity > 0 ? totalKm / fuelQuantity : 0));
  return { lastFuelKm, endTripKm, totalKm, fuelQuantity, mileage };
};

const getTaskRoute = (task) => ({
  from: task.route?.fromCity || task.pickupLocation || '',
  to: task.route?.toCity || task.dropLocation || '',
});

const MileagePage = () => {
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    date: new Date().toISOString().split('T')[0],
    roundTripFrom: '',
    roundTripTo: '',
    lastFuelKm: '',
    endTripKm: '',
    fuelQuantity: '',
    fuelCost: 0,
  });

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch both mileage records and active vehicles
      const [mileageRes, vehiclesRes, tasksRes] = await Promise.all([
        api.get('/mileage', { params: { startDate, endDate } }),
        api.get('/vehicles'),
        api.get('/trips')
      ]);
      setRecords(mileageRes.data);
      setTasks(tasksRes.data.success ? tasksRes.data.data : tasksRes.data);
      // Only show active vehicles in the dropdown
      const vehiclesList = vehiclesRes.data.success ? vehiclesRes.data.data : vehiclesRes.data;
      setVehicles(vehiclesList.filter(v => v.status === 'Active'));
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load mileage records.');
    } finally {
      setLoading(false);
    }
  };

  const getAssignedTaskRoute = (vehicleNumber, date) => {
    const vehicleTasks = tasks
      .filter((task) => task.vehicleNumber === vehicleNumber)
      .sort((first, second) => new Date(second.tripDate || second.startDate) - new Date(first.tripDate || first.startDate));
    const matchingTask = vehicleTasks.find((task) => {
      const taskDate = new Date(task.tripDate || task.startDate).toISOString().slice(0, 10);
      return taskDate === date;
    }) || vehicleTasks[0];

    return matchingTask ? getTaskRoute(matchingTask) : { from: '', to: '' };
  };

  const handleVehicleChange = (vehicleNumber) => {
    const route = getAssignedTaskRoute(vehicleNumber, formData.date);
    setFormData((previous) => ({
      ...previous,
      vehicleNumber,
      roundTripFrom: route.from,
      roundTripTo: route.to,
    }));
  };

  const handleDateChange = (date) => {
    const route = getAssignedTaskRoute(formData.vehicleNumber, date);
    setFormData((previous) => ({
      ...previous,
      date,
      ...(route.from || route.to ? { roundTripFrom: route.from, roundTripTo: route.to } : {}),
    }));
  };

  const handleOpenModal = (record = null) => {
    if (record) {
      setEditingId(record._id);
      setFormData({
        vehicleNumber: record.vehicleNumber,
        date: new Date(record.date).toISOString().split('T')[0],
        roundTripFrom: record.roundTripFrom || '',
        roundTripTo: record.roundTripTo || '',
        lastFuelKm: getMileageMetrics(record).lastFuelKm,
        endTripKm: getMileageMetrics(record).endTripKm,
        fuelQuantity: record.fuelQuantity,
        fuelCost: record.fuelCost || 0,
      });
    } else {
      setEditingId(null);
      setFormData({
        vehicleNumber: '',
        date: new Date().toISOString().split('T')[0],
        roundTripFrom: '',
        roundTripTo: '',
        lastFuelKm: '',
        endTripKm: '',
        fuelQuantity: '',
        fuelCost: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/mileage/${editingId}`, formData);
      } else {
        await api.post('/mileage', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving record:', error);
      alert(error.response?.data?.message || 'Failed to save record.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fueling record?')) return;
    try {
      await api.delete(`/mileage/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Failed to delete record.');
    }
  };

  const exportToExcel = () => {
    if (records.length === 0) {
      alert('No records to export');
      return;
    }

    const exportData = filteredRecords.map(r => ({
      'Date': new Date(r.date).toLocaleDateString('en-IN'),
      'Vehicle No': r.vehicleNumber,
      'Round Trip From': r.roundTripFrom || '',
      'Round Trip To': r.roundTripTo || '',
      'Last Fuel KM': getMileageMetrics(r).lastFuelKm,
      'End Trip KM': getMileageMetrics(r).endTripKm,
      'Total KM': getMileageMetrics(r).totalKm,
      'Total Fuel (L)': getMileageMetrics(r).fuelQuantity,
      'Mileage (KM/L)': getMileageMetrics(r).mileage
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mileage_Records');
    XLSX.writeFile(wb, `Mileage_Records_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Filter & Pagination
  const filteredRecords = records.filter(record => 
    record.vehicleNumber.toLowerCase().includes(search.toLowerCase())
  );

  const totalFuelCost = filteredRecords.reduce((sum, r) => sum + (r.fuelCost || 0), 0);
  const totalLiters = filteredRecords.reduce((sum, r) => sum + (r.fuelQuantity || 0), 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / itemsPerPage));

  return (
    <>
      <SEOHead title="Mileage & Fueling - SSRC Admin" noindex={true} />
      
      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Mileage &amp; Fueling</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#B27500] border border-amber-300 text-xs font-bold">
                {records.length} Records
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Track vehicle fueling, odometer readings, and fuel costs.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={exportToExcel}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Log Fueling</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5 text-[#C8960C]" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Fuel Cost</span>
              <div className="text-lg font-black text-slate-900">₹{totalFuelCost.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <Droplet className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Liters Pumped</span>
              <div className="text-lg font-black text-slate-900">{totalLiters.toFixed(2)} L</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hidden sm:flex">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <Fuel className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Fueling Entries</span>
              <div className="text-lg font-black text-slate-900">{filteredRecords.length} Entries</div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search vehicle or station..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-800 focus:outline-none"
              />
            </div>

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

        {/* Records Table */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-[#C8960C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Fuel className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Fuel Records Found</h3>
            <p className="text-xs text-slate-500 mt-1">Adjust filters or log a new fueling entry.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Vehicle No.</th>
                    <th className="py-3.5 px-4">Round Trip</th>
                    <th className="py-3.5 px-4">Last Fuel KM</th>
                    <th className="py-3.5 px-4">End Trip KM</th>
                    <th className="py-3.5 px-4">Total KM</th>
                    <th className="py-3.5 px-4">Total Fuel</th>
                    <th className="py-3.5 px-4">Mileage</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentRecords.map((record) => {
                    const metrics = getMileageMetrics(record);
                    return (
                    <tr key={record._id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-[#C8960C]" />
                          {new Date(record.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-extrabold text-slate-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                          {record.vehicleNumber}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{record.roundTripFrom || 'N/A'}</div>
                        <div className="text-[10px] text-slate-500">to {record.roundTripTo || 'N/A'}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                        {metrics.lastFuelKm}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {metrics.endTripKm}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {metrics.totalKm}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {metrics.fuelQuantity} L
                      </td>
                      <td className="py-3.5 px-4 font-black text-emerald-700 text-sm">
                        {metrics.mileage.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenModal(record)}
                          className="p-1.5 rounded-lg text-[#C8960C] hover:bg-amber-50 cursor-pointer mr-1"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 rounded-b-3xl">
                <div className="text-xs font-bold text-slate-500">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredRecords.length)} of {filteredRecords.length} records
                </div>

                <div className="flex items-center gap-1.5">
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

                  <span className="px-3 py-1 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg border border-slate-200">
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
            )}
          </div>
        )}
      </div>

      {/* Mileage Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-full">
            
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {editingId ? 'Edit Fuel Record' : 'Log New Fueling'}
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">Record mileage and fuel cost details.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="mileage-form" onSubmit={handleSave} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Vehicle *</label>
                    <select
                      required
                      value={formData.vehicleNumber}
                      onChange={(e) => handleVehicleChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 bg-slate-50"
                    >
                      <option value="">Select Vehicle</option>
                      {vehicles.map(v => (
                        <option key={v._id} value={v.vehicleNumber}>{v.vehicleNumber}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Round Trip From * <span className="text-[10px] text-amber-700">(From assigned task)</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Select a vehicle with an assigned task"
                      value={formData.roundTripFrom}
                      onChange={(e) => setFormData({ ...formData, roundTripFrom: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Round Trip To * <span className="text-[10px] text-amber-700">(From assigned task)</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Select a vehicle with an assigned task"
                      value={formData.roundTripTo}
                      onChange={(e) => setFormData({ ...formData, roundTripTo: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Fuel KM *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="e.g. 304363"
                      value={formData.lastFuelKm}
                      onChange={(e) => setFormData({ ...formData, lastFuelKm: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">End Trip KM *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="e.g. 305567"
                      value={formData.endTripKm}
                      onChange={(e) => setFormData({ ...formData, endTripKm: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Fuel Quantity (Liters) *</label>
                    <div className="relative">
                      <Droplet className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        placeholder="e.g. 45.5"
                        value={formData.fuelQuantity}
                        onChange={(e) => setFormData({ ...formData, fuelQuantity: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Calculated Mileage</span>
                    <strong className="text-lg text-emerald-700">
                      {Number(formData.fuelQuantity) > 0 && Number(formData.endTripKm) >= Number(formData.lastFuelKm)
                        ? ((Number(formData.endTripKm) - Number(formData.lastFuelKm)) / Number(formData.fuelQuantity)).toFixed(2)
                        : '0.00'} KM/L
                    </strong>
                  </div>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm font-bold text-amber-900">
                  Total KM: {Number(formData.endTripKm) >= Number(formData.lastFuelKm) ? Number(formData.endTripKm || 0) - Number(formData.lastFuelKm || 0) : 0} KM
                </div>
              </form>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="mileage-form"
                className="px-6 py-2.5 rounded-xl bg-[#C8960C] hover:bg-[#B27500] text-white font-black text-xs shadow-md transition-colors cursor-pointer"
              >
                {editingId ? 'Update Record' : 'Save Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MileagePage;
