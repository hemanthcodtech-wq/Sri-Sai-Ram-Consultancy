import { useCallback, useEffect, useMemo, useState } from 'react';
import { Building2, CalendarDays, Download, Edit3, IndianRupee, Plus, Printer, Search, Trash2, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';

const currentMonth = new Date().toISOString().slice(0, 7);
const emptyForm = {
  stationName: '',
  city: '',
  helperName: '',
  month: currentMonth,
  amount: '',
  paidDate: new Date().toISOString().slice(0, 10),
  paymentMode: 'Cash',
  remarks: '',
};

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-');
const formatMonth = (value) => {
  if (!value) return '-';
  const date = new Date(`${value}-01T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};

const CleaningManagementPage = () => {
  const [records, setRecords] = useState([]);
  const [helpers, setHelpers] = useState([]);
  const [search, setSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/cleaning-payments', { params: { search, month: monthFilter } });
      setRecords(response.data.success ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching cleaning payment records:', error);
      alert('Failed to load cleaning payment records.');
    } finally {
      setLoading(false);
    }
  }, [search, monthFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchRecords, 0);
    return () => clearTimeout(timer);
  }, [fetchRecords]);

  useEffect(() => {
    const fetchHelpers = async () => {
      try {
        const response = await api.get('/employees', { params: { category: 'Helper', status: 'All' } });
        const employees = response.data.success ? response.data.data : response.data;
        setHelpers(Array.isArray(employees) ? employees : []);
      } catch (error) {
        console.error('Error fetching helpers:', error);
      }
    };
    fetchHelpers();
  }, []);

  const monthOptions = useMemo(() => ['All', ...new Set(records.map((record) => record.month).filter(Boolean))], [records]);
  const totalAmount = records.reduce((sum, record) => sum + Number(record.amount || 0), 0);
  const stationCount = new Set(records.map((record) => record.stationName)).size;
  const averageAmount = records.length ? totalAmount / records.length : 0;

  const openModal = (record = null) => {
    setEditingRecord(record);
    setFormData(record ? {
      stationName: record.stationName || '',
      city: record.city || '',
      helperName: record.helperName || '',
      month: record.month || currentMonth,
      amount: record.amount ?? '',
      paidDate: new Date(record.paidDate).toISOString().slice(0, 10),
      paymentMode: record.paymentMode || 'Cash',
      remarks: record.remarks || '',
    } : emptyForm);
    setIsModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      if (editingRecord) await api.put(`/cleaning-payments/${editingRecord._id}`, formData);
      else await api.post('/cleaning-payments', formData);
      setIsModalOpen(false);
      fetchRecords();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save cleaning payment record.');
    }
  };

  const handleDelete = async (record) => {
    if (!window.confirm(`Delete cleaning payment for ${record.stationName} - ${formatMonth(record.month)}?`)) return;
    try {
      await api.delete(`/cleaning-payments/${record._id}`);
      fetchRecords();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete cleaning payment record.');
    }
  };

  const exportExcel = () => {
    if (!records.length) {
      alert('No cleaning payment records to export.');
      return;
    }
    const exportData = records.map((record) => ({
      Station: record.stationName,
      City: record.city || '-',
      'Helper Name': record.helperName || '-',
      Month: formatMonth(record.month),
      Amount: record.amount,
      'Paid Date': formatDate(record.paidDate),
      'Payment Mode': record.paymentMode,
      Remarks: record.remarks || '-',
    }));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet['!cols'] = [{ wch: 24 }, { wch: 18 }, { wch: 22 }, { wch: 18 }, { wch: 14 }, { wch: 16 }, { wch: 18 }, { wch: 36 }];
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cleaning Payments');
    XLSX.writeFile(workbook, `SSRC_Cleaning_Payments_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <>
      <SEOHead title="Cleaning Management - SSRC Admin" noindex={true} />
      <style>{`@media print { body { background: white !important; } body * { visibility: hidden; } .no-print { display: none !important; } .print-area, .print-area * { visibility: visible; } .print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0 !important; } .print-area table { font-size: 10px; } }`}</style>
      <div className="print-area space-y-5">
        <div className="no-print flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"><Building2 className="h-7 w-7 text-amber-600" /> Cleaning Management</h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">Record monthly cleaning payments made to each vehicle cleaning station.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportExcel} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 shadow-sm"><Download className="h-4 w-4 text-emerald-600" /> Export Excel</button>
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 shadow-sm"><Printer className="h-4 w-4 text-slate-500" /> Print Report</button>
            <button onClick={() => openModal()} className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-sm"><Plus className="h-4 w-4" /> Add Cleaning Payment</button>
          </div>
        </div>

        <div className="hidden border-b-2 border-amber-500 pb-3 print:block"><h1 className="text-2xl font-black">SSRC Vehicle Cleaning Payment Report</h1><p className="text-xs text-slate-500">Generated {formatDate(new Date())}{monthFilter !== 'All' ? ` | ${formatMonth(monthFilter)}` : ''}</p></div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="text-[10px] font-bold uppercase text-slate-400">Payment Records</span><p className="mt-1 text-2xl font-black text-slate-900">{records.length}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="text-[10px] font-bold uppercase text-slate-400">Stations</span><p className="mt-1 text-2xl font-black text-slate-900">{stationCount}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="text-[10px] font-bold uppercase text-slate-400">Total Paid</span><p className="mt-1 text-xl font-black text-emerald-700">₹{totalAmount.toLocaleString('en-IN')}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="text-[10px] font-bold uppercase text-slate-400">Average Payment</span><p className="mt-1 text-xl font-black text-amber-700">₹{Math.round(averageAmount).toLocaleString('en-IN')}</p></div>
        </div>

        <div className="no-print rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_220px]"><div className="relative"><Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search cleaning station or remarks" className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" /></div><select value={monthFilter} onChange={(event) => setMonthFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"><option value="All">All Months</option>{monthOptions.filter((month) => month !== 'All').map((month) => <option key={month} value={month}>{formatMonth(month)}</option>)}</select></div></div>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 p-4"><div><h2 className="flex items-center gap-2 text-base font-black text-slate-900"><IndianRupee className="h-5 w-5 text-amber-600" /> Monthly Station Payments</h2><p className="mt-0.5 text-xs text-slate-500">Payments made for cleaning vehicles at service locations.</p></div></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-xs text-slate-700"><thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500"><tr><th className="px-4 py-3">Station</th><th className="px-4 py-3">City</th><th className="px-4 py-3">Helper Name</th><th className="px-4 py-3">Month</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Paid Date</th><th className="px-4 py-3">Payment Mode</th><th className="px-4 py-3">Remarks</th><th className="no-print px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{loading ? <tr><td colSpan="9" className="py-12 text-center text-slate-500">Loading cleaning payment records...</td></tr> : records.length === 0 ? <tr><td colSpan="9" className="py-12 text-center text-slate-500">No cleaning payment records found.</td></tr> : records.map((record) => <tr key={record._id} className="hover:bg-slate-50"><td className="px-4 py-3"><span className="font-bold text-slate-900">{record.stationName}</span></td><td className="px-4 py-3">{record.city || '-'}</td><td className="px-4 py-3">{record.helperName || '-'}</td><td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 font-semibold"><CalendarDays className="h-3.5 w-3.5 text-amber-600" />{formatMonth(record.month)}</span></td><td className="px-4 py-3 font-black text-emerald-700">₹{Number(record.amount || 0).toLocaleString('en-IN')}</td><td className="px-4 py-3 font-semibold">{formatDate(record.paidDate)}</td><td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">{record.paymentMode}</span></td><td className="max-w-[240px] px-4 py-3">{record.remarks || '-'}</td><td className="no-print whitespace-nowrap px-4 py-3 text-right"><button onClick={() => openModal(record)} title="Edit payment" className="mr-1 rounded-lg bg-slate-100 p-2 text-slate-700"><Edit3 className="h-4 w-4" /></button><button onClick={() => handleDelete(record)} title="Delete payment" className="rounded-lg bg-red-50 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button></td></tr>)}</tbody></table></div></section>
      </div>

      {isModalOpen && <div className="no-print fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-sm"><div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-100 bg-amber-50 px-5 py-4 sm:px-6"><div><h2 className="text-lg font-black text-slate-900">{editingRecord ? 'Edit Cleaning Payment' : 'Add Cleaning Payment'}</h2><p className="mt-0.5 text-xs text-slate-500">Save the station amount for one month.</p></div><button onClick={() => setIsModalOpen(false)} className="rounded-xl p-2 hover:bg-amber-100" title="Close"><X className="h-5 w-5" /></button></div><form onSubmit={handleSave} className="space-y-4 p-5 sm:p-6"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-slate-700">Cleaning Station / Location *<input required value={formData.stationName} onChange={(event) => setFormData({ ...formData, stationName: event.target.value })} placeholder="e.g. LB Nagar Service Station" className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold" /></label><label className="text-xs font-bold text-slate-700">City<input value={formData.city} onChange={(event) => setFormData({ ...formData, city: event.target.value })} placeholder="e.g. Hyderabad" className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold" /></label><label className="text-xs font-bold text-slate-700">Helper Name<select value={formData.helperName} onChange={(event) => setFormData({ ...formData, helperName: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold"><option value="">Select helper</option>{formData.helperName && !helpers.some((helper) => helper.name === formData.helperName) && <option value={formData.helperName}>{formData.helperName}</option>}{helpers.map((helper) => <option key={helper._id} value={helper.name}>{helper.name}</option>)}</select></label><label className="text-xs font-bold text-slate-700">For Month *<input type="month" required value={formData.month} onChange={(event) => setFormData({ ...formData, month: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" /></label><label className="text-xs font-bold text-slate-700">Amount (Rs.) *<input type="number" min="0" step="0.01" required value={formData.amount} onChange={(event) => setFormData({ ...formData, amount: event.target.value })} placeholder="e.g. 5000" className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold" /></label><label className="text-xs font-bold text-slate-700">Payment Date *<input type="date" required value={formData.paidDate} onChange={(event) => setFormData({ ...formData, paidDate: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" /></label><label className="text-xs font-bold text-slate-700 sm:col-span-2">Payment Mode<select value={formData.paymentMode} onChange={(event) => setFormData({ ...formData, paymentMode: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"><option>Cash</option><option>Online</option><option>UPI</option><option>Bank Transfer</option></select></label></div><label className="block text-xs font-bold text-slate-700">Remarks<textarea value={formData.remarks} onChange={(event) => setFormData({ ...formData, remarks: event.target.value })} rows="3" placeholder="Optional notes about the cleaning arrangement" className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" /></label><div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600">Cancel</button><button type="submit" className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-black text-slate-950">{editingRecord ? 'Update Payment' : 'Save Payment'}</button></div></form></div></div>}
    </>
  );
};

export default CleaningManagementPage;
