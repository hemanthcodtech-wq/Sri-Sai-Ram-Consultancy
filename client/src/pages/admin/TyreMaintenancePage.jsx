import { useEffect, useState } from 'react';
import { Calendar, CircleDot, Download, Edit3, Plus, Search, Trash2, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';

const emptyForm = {
  purchaseDate: new Date().toISOString().slice(0, 10),
  vehicleNumber: '',
  kilometre: '',
  tyreNumber: '',
};

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('en-IN') : '-');

const TyreMaintenancePage = () => {
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tyre-maintenance', {
        params: { search, vehicleNumber: vehicleFilter },
      });
      setRecords(response.data.success ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching tyre maintenance records:', error);
      alert('Failed to load tyre maintenance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [search, vehicleFilter]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/vehicles');
        const data = response.data.success ? response.data.data : response.data;
        setVehicles(data.filter((vehicle) => vehicle.status === 'Active'));
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
    fetchVehicles();
  }, []);

  const openModal = (record = null) => {
    if (record) {
      setEditingId(record._id);
      setFormData({
        purchaseDate: new Date(record.purchaseDate).toISOString().slice(0, 10),
        vehicleNumber: record.vehicleNumber,
        kilometre: record.kilometre,
        tyreNumber: record.tyreNumber,
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/tyre-maintenance/${editingId}`, formData);
      } else {
        await api.post('/tyre-maintenance', formData);
      }
      setIsModalOpen(false);
      fetchRecords();
    } catch (error) {
      console.error('Error saving tyre maintenance record:', error);
      alert(error.response?.data?.message || 'Failed to save tyre maintenance record.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tyre maintenance record?')) return;
    try {
      await api.delete(`/tyre-maintenance/${id}`);
      fetchRecords();
    } catch (error) {
      console.error('Error deleting tyre maintenance record:', error);
      alert('Failed to delete tyre maintenance record.');
    }
  };

  const exportToExcel = () => {
    if (!records.length) {
      alert('No tyre maintenance records to export.');
      return;
    }
    const exportData = records.map((record) => ({
      'Purchase Date': formatDate(record.purchaseDate),
      'Vehicle Number': record.vehicleNumber,
      'Kilometre': record.kilometre,
      'Tyre Number': record.tyreNumber,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tyre Maintenance');
    XLSX.writeFile(workbook, `Tyre_Maintenance_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <>
      <SEOHead title="Tyre Maintenance - SSRC Admin" noindex={true} />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <CircleDot className="w-7 h-7 text-amber-600" />
              <span>Tyre Maintenance</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#B27500] border border-amber-300 text-xs font-bold">
                {records.length} Records
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Track tyre purchases against each vehicle and kilometre reading.</p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <button onClick={exportToExcel} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-sm">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export Excel</span>
            </button>
            <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20">
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Tyre Record</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Records</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{records.length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Vehicles Covered</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{new Set(records.map((record) => record.vehicleNumber)).size}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Latest Purchase</span>
            <div className="text-lg font-black text-slate-900 mt-1">{records[0] ? formatDate(records[0].purchaseDate) : '-'}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search vehicle or tyre number" className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <select value={vehicleFilter} onChange={(event) => setVehicleFilter(event.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option value="All">All Vehicles</option>
              {vehicles.map((vehicle) => <option key={vehicle._id} value={vehicle.vehicleNumber}>{vehicle.vehicleNumber}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Purchase Date</th>
                  <th className="py-3 px-4">Vehicle Number</th>
                  <th className="py-3 px-4">Kilometre</th>
                  <th className="py-3 px-4">Tyre Number</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="5" className="py-12 text-center text-slate-500">Loading records...</td></tr>
                ) : records.length === 0 ? (
                  <tr><td colSpan="5" className="py-12 text-center text-slate-500">No tyre maintenance records found.</td></tr>
                ) : records.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold"><span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-600" />{formatDate(record.purchaseDate)}</span></td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{record.vehicleNumber}</td>
                    <td className="py-3 px-4 font-semibold">{Number(record.kilometre).toLocaleString('en-IN')} km</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{record.tyreNumber}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button onClick={() => openModal(record)} title="Edit record" className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 mr-1"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(record._id)} title="Delete record" className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50">
              <h2 className="font-black text-lg text-slate-900">{editingId ? 'Edit Tyre Record' : 'Add Tyre Record'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-amber-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Purchase Date</label>
                <input type="date" required value={formData.purchaseDate} onChange={(event) => setFormData({ ...formData, purchaseDate: event.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Number</label>
                <select required value={formData.vehicleNumber} onChange={(event) => setFormData({ ...formData, vehicleNumber: event.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                  <option value="">Select vehicle</option>
                  {vehicles.map((vehicle) => <option key={vehicle._id} value={vehicle.vehicleNumber}>{vehicle.vehicleNumber}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kilometre</label>
                  <input type="number" min="0" step="1" required value={formData.kilometre} onChange={(event) => setFormData({ ...formData, kilometre: event.target.value })} placeholder="e.g. 45000" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tyre Number</label>
                  <input type="text" required value={formData.tyreNumber} onChange={(event) => setFormData({ ...formData, tyreNumber: event.target.value })} placeholder="e.g. TYRE-001" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-sm font-black">{editingId ? 'Update Record' : 'Save Record'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TyreMaintenancePage;
