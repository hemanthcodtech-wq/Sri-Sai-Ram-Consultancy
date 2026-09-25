import { useEffect, useState } from 'react';
import { Building2, Calendar, Check, CheckCircle2, ClipboardList, Download, Edit3, IndianRupee, MapPin, Plus, Search, Trash2, Truck, X } from 'lucide-react';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';
import { exportToExcel } from '../../utils/excelExport';

const getWhatsAppNumber = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.length === 10 ? `91${digits}` : digits;
};

const formatRouteOptionLabel = (route) => {
  const corridor = `${route.fromCity || ''} → ${route.toCity || ''}`.trim();
  const serviceId = route.serviceId ? `${route.serviceId} - ` : '';
  return `${serviceId}${corridor}${route.status === 'Inactive' ? ' [Inactive]' : ''}`;
};

const openCaptainDutyWhatsApp = (task, captain) => {
  const number = getWhatsAppNumber(captain?.mobileNumber);
  if (!number) return;

  const message = [
    'Duty Assignment - Captain',
    `Hello ${captain.name || 'Captain'},`,
    `You have been assigned as Captain for task ${task.tripNumber || 'new task'}.`,
    `Date: ${task.tripDate || 'Not specified'}`,
    `Vehicle: ${task.vehicleNumber || 'Not specified'}`,
    `Route: ${task.routeName || 'Not specified'}`,
    `Operator: ${task.operatorName || 'Not specified'}`,
    'Please report on time and confirm your duty.',
  ].join('\n');

  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
};

const emptyForm = {
  tripDate: new Date().toISOString().slice(0, 10),
  vehicleNumber: '',
  vehicleStatus: 'RUN',
  routeName: '',
  routeId: '',
  operatorName: '',
  operatorId: '',
  assignedEmployee: '',
  salaryAmount: '',
  paymentStatus: 'Pending',
  tripStatus: 'Scheduled',
  remarks: '',
};

const SearchableField = ({ value, options, placeholder, onChange, onSelect, icon: Icon, allowCustom = true }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const selected = options.find((option) => option.value === value);
    setQuery(selected?.label || value || '');
  }, [value, options]);

  const filteredOptions = options.filter((option) => option.searchText.toLowerCase().includes(query.toLowerCase())).slice(0, 8);

  const handleChange = (event) => {
    const nextQuery = event.target.value;
    setQuery(nextQuery);
    setIsOpen(true);
    if (allowCustom) onChange(nextQuery);
    else if (!nextQuery) onChange('');
  };

  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-3 w-4 h-4 text-amber-600 z-10" />}
      <input
        value={query}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold`}
      />
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
          {filteredOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              onMouseDown={() => {
                setQuery(option.label);
                onSelect(option);
                setIsOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-amber-50"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CaptainManagementPage = () => {
  const [tasks, setTasks] = useState([]);
  const [captains, setCaptains] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/trips', { params: { category: 'Captain', search } });
      if (response.data.success) setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching captain tasks:', error);
      alert('Failed to load captain tasks.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [captainResponse, vehicleResponse, routeResponse, organizerResponse] = await Promise.all([
        api.get('/employees', { params: { category: 'Captain', status: 'All' } }),
        api.get('/vehicles?status=Active'),
        api.get('/routes?status=Active'),
        api.get('/organizers?status=Active'),
      ]);
      if (captainResponse.data.success) setCaptains(captainResponse.data.data);
      const vehicleData = vehicleResponse.data.success ? vehicleResponse.data.data : vehicleResponse.data;
      setVehicles(vehicleData);
      if (routeResponse.data.success) setRoutes(routeResponse.data.data);
      if (organizerResponse.data.success) setOrganizers(organizerResponse.data.data);
    } catch (error) {
      console.error('Error loading captain management options:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search]);

  useEffect(() => {
    fetchDependencies();
  }, []);

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        tripDate: new Date(task.tripDate || task.startDate).toISOString().slice(0, 10),
        vehicleNumber: task.vehicleNumber || '',
        vehicleStatus: task.vehicleStatus || 'RUN',
        routeName: task.routeName || '',
        routeId: task.route?._id || task.route || '',
        operatorName: task.operatorName || task.operator?.name || '',
        operatorId: task.operator?._id || task.operator || '',
        assignedEmployee: task.assignedEmployee?._id || task.assignedEmployee || '',
        salaryAmount: task.salaryAmount || task.employeePayout || '',
        paymentStatus: task.paymentStatus || 'Pending',
        tripStatus: task.tripStatus || 'Scheduled',
        remarks: task.remarks || '',
      });
    } else {
      setEditingTask(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const selectedCaptain = captains.find((captain) => captain._id === formData.assignedEmployee);
    const captainId = formData.assignedEmployee || editingTask?.assignedEmployee?._id || editingTask?.assignedEmployee;
    const captain = selectedCaptain || captains.find((item) => item._id === captainId);
    if (!captainId || !captain) {
      alert('Please select a captain.');
      return;
    }

    const salary = Number(formData.salaryAmount || 0);
    const { routeId, operatorId, ...tripFormData } = formData;
    const payload = {
      ...tripFormData,
      route: routeId || undefined,
      operator: operatorId || undefined,
      assignedEmployee: captainId,
      assignedEmployeeName: captain.name,
      category: 'Captain',
      salaryAmount: salary,
      employeePayout: salary,
      tripAmount: salary,
      advanceAmount: 0,
      dueAmount: formData.paymentStatus === 'Paid' ? 0 : salary,
      startDate: formData.tripDate,
      endDate: formData.tripDate,
    };

    try {
      if (editingTask) await api.put(`/trips/${editingTask._id}`, payload);
      else {
        await api.post('/trips', payload);
        openCaptainDutyWhatsApp(payload, captain);
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error('Error saving captain task:', error);
      alert(error.response?.data?.message || 'Failed to save captain task.');
    }
  };

  const handleMarkPaid = async (task) => {
    try {
      await api.put(`/trips/${task._id}`, { paymentStatus: 'Paid', dueAmount: 0, salaryPaymentMode: 'Cash' });
      fetchTasks();
    } catch (error) {
      console.error('Error marking captain task paid:', error);
      alert('Failed to mark captain task as paid.');
    }
  };

  const handleMarkCompleted = async (task) => {
    try {
      await api.put(`/trips/${task._id}`, { tripStatus: 'Completed' });
      fetchTasks();
    } catch (error) {
      console.error('Error completing captain task:', error);
      alert('Failed to complete captain task.');
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete captain task ${task.tripNumber || ''}?`)) return;
    try {
      await api.delete(`/trips/${task._id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting captain task:', error);
      alert('Failed to delete captain task.');
    }
  };

  const handleExport = () => {
    if (!tasks.length) {
      alert('No captain tasks to export.');
      return;
    }
    exportToExcel(tasks.map((task, index) => ({
      'S.No': index + 1,
      Date: new Date(task.tripDate || task.startDate).toLocaleDateString('en-IN'),
      'Captain Name': task.assignedEmployeeName || task.assignedEmployee?.name || 'N/A',
      'Vehicle Number': task.vehicleNumber || 'N/A',
      'Vehicle Status': task.vehicleStatus || 'RUN',
      Route: task.routeName || 'N/A',
      Operator: task.operatorName || task.operator?.name || 'N/A',
      'Task Amount (Rs.)': task.salaryAmount || task.employeePayout || 0,
      'Payment Status': task.paymentStatus || 'Pending',
      'Task Status': task.tripStatus || 'Scheduled',
    })), 'SSRC_Captain_Tasks', 'Captain_Tasks');
  };

  const totalAmount = tasks.reduce((sum, task) => sum + Number(task.salaryAmount || task.employeePayout || 0), 0);
  const paidAmount = tasks.reduce((sum, task) => sum + (task.paymentStatus === 'Paid' ? Number(task.salaryAmount || task.employeePayout || 0) : 0), 0);

  const vehicleOptions = vehicles.map((vehicle) => ({ value: vehicle.vehicleNumber, label: vehicle.vehicleNumber, searchText: `${vehicle.vehicleNumber} ${vehicle.notes || ''}` }));
  const routeOptions = routes.map((route) => ({ value: formatRouteOptionLabel(route), label: formatRouteOptionLabel(route), id: route._id, searchText: `${route.routeName || ''} ${route.fromCity || ''} ${route.toCity || ''} ${route.serviceId || ''}` }));
  const organizerOptions = organizers.map((organizer) => ({ value: organizer.name, label: organizer.company ? `${organizer.name} (${organizer.company})` : organizer.name, id: organizer._id, searchText: `${organizer.name} ${organizer.company || ''} ${organizer.phone || ''}` }));
  const captainOptions = captains.map((captain) => ({ value: captain._id, label: `${captain.name} (${captain.employeeId})`, searchText: `${captain.name} ${captain.employeeId || ''} ${captain.mobileNumber || ''}` }));

  return (
    <>
      <SEOHead title="Captain Management - SSRC Admin" noindex={true} />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <ClipboardList className="w-7 h-7 text-amber-600" />
              <span>Captain Management</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">{tasks.length} Tasks</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Assign and manage tasks exclusively for captains.</p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <button onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs">
              <Download className="w-4 h-4 text-emerald-600" /> Export Excel
            </button>
            <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-sm">
              <Plus className="w-4 h-4" /> Assign Captain Task
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"><span className="text-[10px] font-black uppercase text-slate-400">Captain Tasks</span><p className="text-2xl font-black text-slate-900 mt-1">{tasks.length}</p></div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"><span className="text-[10px] font-black uppercase text-slate-400">Total Task Spend</span><p className="text-2xl font-black text-slate-900 mt-1">₹{totalAmount.toLocaleString('en-IN')}</p></div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"><span className="text-[10px] font-black uppercase text-slate-400">Paid for Tasks</span><p className="text-2xl font-black text-emerald-700 mt-1">₹{paidAmount.toLocaleString('en-IN')}</p></div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search captain tasks" className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Date</th><th className="py-3.5 px-4">Captain</th><th className="py-3.5 px-4">Vehicle</th><th className="py-3.5 px-4">Route</th><th className="py-3.5 px-4">Operator</th><th className="py-3.5 px-4">Task Amount</th><th className="py-3.5 px-4">Status</th><th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? <tr><td colSpan="8" className="py-12 text-center text-slate-500">Loading captain tasks...</td></tr> : tasks.length === 0 ? <tr><td colSpan="8" className="py-12 text-center text-slate-500">No captain tasks found.</td></tr> : tasks.map((task) => {
                  const amount = Number(task.salaryAmount || task.employeePayout || 0);
                  const isPaid = task.paymentStatus === 'Paid';
                  const isCompleted = task.tripStatus === 'Completed';
                  return (
                    <tr key={task._id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 whitespace-nowrap"><span className="inline-flex items-center gap-1.5 font-semibold"><Calendar className="w-3.5 h-3.5 text-amber-600" />{new Date(task.tripDate || task.startDate).toLocaleDateString('en-IN')}</span></td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{task.assignedEmployeeName || task.assignedEmployee?.name || 'Captain'}</td>
                      <td className="py-3.5 px-4"><span className="font-mono font-bold">{task.vehicleNumber || 'N/A'}</span><span className={`block w-fit mt-1 px-2 py-0.5 rounded text-[9px] font-black ${task.vehicleStatus === 'HOLD' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>{task.vehicleStatus || 'RUN'}</span></td>
                      <td className="py-3.5 px-4 font-semibold max-w-[190px]">{task.routeName || 'N/A'}</td>
                      <td className="py-3.5 px-4 font-semibold">{task.operatorName || task.operator?.name || 'N/A'}</td>
                      <td className="py-3.5 px-4"><strong className="text-slate-900">₹{amount.toLocaleString('en-IN')}</strong></td>
                      <td className="py-3.5 px-4"><span className="block w-fit px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">{task.tripStatus || 'Scheduled'}</span><span className={`block w-fit mt-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{task.paymentStatus || 'Pending'}</span></td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap"><div className="flex items-center justify-end gap-1.5"><button onClick={() => handleMarkCompleted(task)} disabled={isCompleted} title="Mark completed" className="p-2 rounded-lg bg-blue-50 text-blue-700 disabled:opacity-40"><CheckCircle2 className="w-4 h-4" /></button><button onClick={() => handleMarkPaid(task)} disabled={isPaid} title="Mark paid" className="p-2 rounded-lg bg-emerald-50 text-emerald-700 disabled:opacity-40"><Check className="w-4 h-4" /></button><button onClick={() => openModal(task)} title="Edit task" className="p-2 rounded-lg bg-slate-100 text-slate-700"><Edit3 className="w-4 h-4" /></button><button onClick={() => handleDelete(task)} title="Delete task" className="p-2 rounded-lg bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-5xl max-h-[96vh] overflow-hidden shadow-2xl border-t-4 border-amber-400 flex flex-col">
            <div className="px-5 sm:px-7 py-4 border-b border-slate-200 bg-white flex items-start justify-between gap-4 shrink-0">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wide">
                  <ClipboardList className="w-3 h-3" /> Captain Task Dispatch
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{editingTask ? 'Edit Captain Task' : 'Assign New Captain Task'}</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Assign one captain with vehicle, route, operator, and payment details.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 shrink-0" title="Close"><X className="w-5 h-5" /></button>
            </div>

            <form id="captain-task-form" onSubmit={handleSave} className="overflow-y-auto p-4 sm:p-6 space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                <h3 className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide mb-4"><ClipboardList className="w-4 h-4 text-amber-600" />1. Task Details &amp; Operational Route</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">Task Start Date *</label><div className="relative"><Calendar className="absolute left-3 top-3 w-4 h-4 text-amber-600" /><input type="date" required value={formData.tripDate} onChange={(event) => setFormData({ ...formData, tripDate: event.target.value })} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold" /></div></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">Vehicle Number</label><SearchableField value={formData.vehicleNumber} options={vehicleOptions} placeholder="Select or type vehicle" icon={Truck} onChange={(value) => setFormData({ ...formData, vehicleNumber: value })} onSelect={(option) => setFormData({ ...formData, vehicleNumber: option.value })} /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">Vehicle Status *</label><select value={formData.vehicleStatus} onChange={(event) => setFormData({ ...formData, vehicleStatus: event.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold"><option value="RUN">RUN</option><option value="HOLD">HOLD</option></select></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">Route Corridor</label><SearchableField value={formData.routeName} options={routeOptions} placeholder="Select or type route" icon={MapPin} onChange={(value) => setFormData({ ...formData, routeName: value, routeId: '' })} onSelect={(option) => setFormData({ ...formData, routeName: option.value, routeId: option.id })} /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">Operator / Organizer</label><SearchableField value={formData.operatorName} options={organizerOptions} placeholder="Select or type organizer" icon={Building2} onChange={(value) => setFormData({ ...formData, operatorName: value, operatorId: '' })} onSelect={(option) => setFormData({ ...formData, operatorName: option.value, operatorId: option.id })} /></div>
                </div>
              </section>

              <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-amber-200 pb-3 mb-4"><h3 className="flex items-center gap-2 text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wide"><Truck className="w-4 h-4 text-amber-600" />2. Captain Assignment</h3><span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black">Captain Only</span></div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Captain *</label>
                <SearchableField value={formData.assignedEmployee || editingTask?.assignedEmployee?._id || editingTask?.assignedEmployee || ''} options={captainOptions} placeholder="Select captain" allowCustom={false} onChange={(value) => setFormData({ ...formData, assignedEmployee: value })} onSelect={(option) => setFormData({ ...formData, assignedEmployee: option.value })} />
              </section>

              <section className="rounded-2xl border border-amber-200 bg-white p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-amber-100 pb-3 mb-4"><h3 className="flex items-center gap-2 text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wide"><IndianRupee className="w-4 h-4 text-amber-600" />3. Captain Financials</h3><span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black">Salary Record</span></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">Task Amount (Rs.) *</label><input type="number" min="0" required value={formData.salaryAmount} onChange={(event) => setFormData({ ...formData, salaryAmount: event.target.value })} placeholder="e.g. 1500" className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm font-bold" /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">Task Status *</label><select value={formData.tripStatus} onChange={(event) => setFormData({ ...formData, tripStatus: event.target.value })} className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm font-bold"><option value="Scheduled">Scheduled</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select></div>
                </div>
                <div className="mt-4"><label className="block text-[11px] font-bold text-slate-700 mb-1">Remarks</label><input value={formData.remarks} onChange={(event) => setFormData({ ...formData, remarks: event.target.value })} placeholder="Optional task remarks" className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm" /></div>
              </section>
            </form>

            <div className="px-4 sm:px-6 py-3 border-t border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
              <div className="text-[11px] font-black text-slate-500 uppercase">Total: <span className="text-slate-900">₹{Number(formData.salaryAmount || 0).toLocaleString('en-IN')}</span></div>
              <div className="flex items-center justify-end gap-2"><button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600">Cancel</button><button type="submit" form="captain-task-form" className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-sm font-black shadow-sm">{editingTask ? 'Update Task' : 'Save Captain Task'}</button></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CaptainManagementPage;
