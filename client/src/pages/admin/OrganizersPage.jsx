import { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  X, 
  CheckCircle2, 
  ChevronsLeft, 
  ChevronsRight, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Briefcase,
  Users,
  Download,
  IndianRupee,
  Calendar,
  Printer
} from 'lucide-react';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';
import { exportToExcel } from '../../utils/excelExport';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const OrganizersPage = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrganizer, setEditingOrganizer] = useState(null);
  const [saving, setSaving] = useState(false);

  // Income Modal State
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [selectedOrganizerForIncome, setSelectedOrganizerForIncome] = useState(null);
  const [editingIncomeIndex, setEditingIncomeIndex] = useState(-1);
  const [incomeFormData, setIncomeFormData] = useState({
    month: '',
    year: '',
    amount: '',
    dateReceived: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    address: '',
    notes: '',
    status: 'Active',
  });

  const fetchOrganizers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/organizers', {
        params: {
          search,
          status: statusFilter,
        },
      });
      if (res.data.success) {
        setOrganizers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching organizers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, [search, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, itemsPerPage]);

  const handleOpenModal = (organizer = null) => {
    if (organizer) {
      setEditingOrganizer(organizer);
      setFormData({
        name: organizer.name || '',
        phone: organizer.phone || '',
        email: organizer.email || '',
        company: organizer.company || '',
        address: organizer.address || '',
        notes: organizer.notes || '',
        status: organizer.status || 'Active',
      });
    } else {
      setEditingOrganizer(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        company: '',
        address: '',
        notes: '',
        status: 'Active',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveOrganizer = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Organizer Name is required.');
      return;
    }
    if (!formData.phone.trim()) {
      alert('Phone Number is required.');
      return;
    }

    setSaving(true);
    try {
      if (editingOrganizer) {
        await api.put(`/organizers/${editingOrganizer._id}`, formData);
      } else {
        await api.post('/organizers', formData);
      }
      setIsModalOpen(false);
      fetchOrganizers();
    } catch (err) {
      console.error('Error saving organizer:', err);
      alert(err.response?.data?.message || 'Failed to save organizer.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOrganizer = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete organizer record for "${name}"?`)) {
      try {
        await api.delete(`/organizers/${id}`);
        fetchOrganizers();
      } catch (err) {
        console.error('Error deleting organizer:', err);
      }
    }
  };

  const handleOpenIncomeModal = (organizer) => {
    setSelectedOrganizerForIncome(organizer);
    setEditingIncomeIndex(-1);
    setIncomeFormData({
      month: new Date().toLocaleString('default', { month: 'short' }),
      year: new Date().getFullYear().toString(),
      amount: '',
      dateReceived: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsIncomeModalOpen(true);
  };

  const handleSaveIncome = async (e) => {
    e.preventDefault();
    if (!incomeFormData.month.trim() || !incomeFormData.year.trim() || !incomeFormData.amount) {
      alert('Month, Year, and Amount are required.');
      return;
    }

    setSaving(true);
    try {
      const newIncome = {
        month: `${incomeFormData.month.trim()} ${incomeFormData.year.trim()}`,
        amount: Number(incomeFormData.amount),
        dateReceived: new Date(incomeFormData.dateReceived),
        notes: incomeFormData.notes.trim()
      };
      
      const currentIncomes = [...(selectedOrganizerForIncome.monthlyIncome || [])];
      
      if (editingIncomeIndex >= 0) {
        currentIncomes[editingIncomeIndex] = newIncome;
      } else {
        currentIncomes.push(newIncome);
      }

      const updatedOrganizer = {
        ...selectedOrganizerForIncome,
        monthlyIncome: currentIncomes
      };

      await api.put(`/organizers/${selectedOrganizerForIncome._id}`, updatedOrganizer);
      
      // Update local state temporarily so the modal shows the new data instantly
      setSelectedOrganizerForIncome(updatedOrganizer);
      setEditingIncomeIndex(-1);
      setIncomeFormData({
        month: new Date().toLocaleString('default', { month: 'short' }),
        year: new Date().getFullYear().toString(),
        amount: '',
        dateReceived: new Date().toISOString().split('T')[0],
        notes: ''
      });
      fetchOrganizers();
    } catch (err) {
      console.error('Error saving income:', err);
      alert('Failed to save income record.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteIncome = async (incomeIdx) => {
    if (!window.confirm('Are you sure you want to delete this income record?')) return;
    
    try {
      const currentIncomes = [...(selectedOrganizerForIncome.monthlyIncome || [])];
      currentIncomes.splice(incomeIdx, 1);
      
      const updatedOrganizer = {
        ...selectedOrganizerForIncome,
        monthlyIncome: currentIncomes
      };

      await api.put(`/organizers/${selectedOrganizerForIncome._id}`, updatedOrganizer);
      setSelectedOrganizerForIncome(updatedOrganizer);
      fetchOrganizers();
    } catch (err) {
      console.error('Error deleting income:', err);
      alert('Failed to delete income record.');
    }
  };

  const handleEditIncome = (idx, inc) => {
    setEditingIncomeIndex(idx);
    
    let m = '';
    let y = '';
    if (inc.month) {
      const parts = inc.month.split(' ');
      m = parts[0] || '';
      y = parts[1] || '';
    }

    setIncomeFormData({
      month: m,
      year: y,
      amount: inc.amount || '',
      dateReceived: inc.dateReceived ? new Date(inc.dateReceived).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      notes: inc.notes || ''
    });
  };

  const handlePrintOrganizer = (org) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to print.");
      return;
    }
    
    const incomes = org.monthlyIncome || [];
    const totalIncome = incomes.reduce((sum, inc) => sum + Number(inc.amount || 0), 0);
    
    const incomeRows = incomes.map(inc => `
      <tr>
        <td>${inc.month}</td>
        <td>${new Date(inc.dateReceived).toLocaleDateString('en-IN')}</td>
        <td style="text-align: right; font-weight: bold;">₹${Number(inc.amount).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <html>
        <head>
          <title>Organizer Record - ${org.name}</title>
          <style>
            @page { margin: 0; size: auto; }
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; padding: 25mm 20mm; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            
            /* Header */
            .print-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 30px; }
            .header-logo img { max-height: 70px; }
            .header-info { text-align: right; }
            .header-info h1 { font-size: 22px; color: #1e3a8a; margin: 0; font-weight: 800; letter-spacing: 0.5px; }
            .header-info p { font-size: 12px; color: #64748b; margin: 5px 0 0 0; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; }
            
            /* Section Titles */
            .section-title { background-color: #f1f5f9; color: #1e3a8a; font-size: 13px; font-weight: bold; text-transform: uppercase; padding: 8px 12px; margin-bottom: 15px; border-left: 4px solid #1e3a8a; }
            
            /* Organizer Details */
            .details-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; font-size: 13px; }
            .details-table td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
            .details-table .label { width: 15%; font-weight: bold; color: #475569; text-transform: uppercase; font-size: 11px; }
            .details-table .val { width: 35%; font-weight: 600; color: #0f172a; }
            
            /* Payments Table */
            .payments-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; border: 1px solid #e2e8f0; }
            .payments-table th { background-color: #1e3a8a; color: #ffffff; padding: 12px; font-weight: bold; text-transform: uppercase; font-size: 11px; text-align: left; }
            .payments-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #333; }
            .payments-table tr:nth-child(even) { background-color: #f8fafc; }
            .amount-col { text-align: right; font-weight: bold; }
            
            /* Totals and Footer */
            .totals-container { display: flex; justify-content: flex-end; margin-bottom: 60px; margin-top: 20px; }
            .totals-box { border: 2px solid #1e3a8a; padding: 15px 25px; border-radius: 4px; background-color: #f8fafc; display: inline-block; }
            .totals-box span.title { font-size: 14px; color: #475569; font-weight: bold; text-transform: uppercase; margin-right: 15px; }
            .totals-box span.value { font-size: 20px; color: #1e3a8a; font-weight: 900; }
            
            .footer-signature { text-align: center; width: 250px; float: right; font-size: 12px; font-weight: bold; color: #475569; margin-top: 50px; }
            .footer-line { border-top: 1px dashed #475569; margin-bottom: 8px; padding-top: 8px; }
            
            .clearfix::after { content: ""; clear: both; display: table; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <div class="header-logo">
              <img src="/logo.png" alt="SSRC Logo" onerror="this.style.display='none'" />
            </div>
            <div class="header-info">
              <h1>SRI SAI RAM CONSULTANCY</h1>
              <p>Official Organizer Statement</p>
            </div>
          </div>
          
          <div class="section-title">Organizer Details</div>
          <table class="details-table">
            <tr>
              <td class="label">Name</td><td class="val">${org.name}</td>
              <td class="label">Company</td><td class="val">${org.company || 'Direct Individual'}</td>
            </tr>
            <tr>
              <td class="label">Phone</td><td class="val">${org.phone}</td>
              <td class="label">Email</td><td class="val">${org.email || 'N/A'}</td>
            </tr>
            <tr>
              <td class="label">Address</td><td class="val">${org.address || 'N/A'}</td>
              <td class="label">Status</td><td class="val">${org.status}</td>
            </tr>
          </table>
          
          <div class="section-title">Payment History</div>
          ${incomes.length > 0 ? `
            <table class="payments-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Date</th>
                  <th class="amount-col" style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${incomeRows}
              </tbody>
            </table>
            
            <div class="totals-container">
              <div class="totals-box">
                <span class="title">Total Amount Received:</span>
                <span class="value">₹${totalIncome.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ` : `
            <p style="font-size: 14px; color: #64748b; margin-bottom: 40px; padding: 20px; background: #f8fafc; border-radius: 4px; text-align: center;">No payment history recorded.</p>
          `}
          
          <div class="clearfix">
            <div class="footer-signature">
              <div class="footer-line">Authorized Stamp & Signature</div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleExportExcel = () => {
    if (organizers.length === 0) {
      alert('No organizer records to export.');
      return;
    }

    const exportData = organizers.map((org, idx) => {
      const totalIncome = (org.monthlyIncome || []).reduce((sum, inc) => sum + Number(inc.amount || 0), 0);
      return {
        'S.No': idx + 1,
        'Organizer / Partner Name': org.name || '',
        'Phone Number': org.phone || '',
        'Email Address': org.email || 'N/A',
        'Company / Agency': org.company || 'N/A',
        'Address / Location': org.address || 'N/A',
        'Total Income Received': `₹${totalIncome.toLocaleString('en-IN')}`,
        'Status': org.status || 'Active',
        'Notes': org.notes || '',
        'Created Date': org.createdAt ? new Date(org.createdAt).toLocaleDateString('en-IN') : 'N/A',
      };
    });

    exportToExcel(exportData, `SSRC_Organizers_${statusFilter}`, 'Organizers_Directory');
  };

  // Calculate pagination slices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrganizers = organizers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(organizers.length / itemsPerPage));

  const totalActive = organizers.filter((o) => o.status === 'Active').length;

  return (
    <>
      <SEOHead title="Organizer Management - SSRC Admin" noindex={true} />

      <div className="space-y-6">
        
        {/* Top Header & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Organizer Management</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#B27500] border border-amber-300 text-xs font-bold">
                {organizers.length} Records
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Record and manage fleet organizers, contractors, booking partners, and contact directories.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
              title="Download Organizer Directory as Excel"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export Excel ({organizers.length})</span>
            </button>

            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>Add New Organizer</span>
            </button>
          </div>
        </div>

        {/* Quick Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Organizers</span>
              <span className="text-xl font-black text-slate-900">{organizers.length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C8960C]">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Partners</span>
              <span className="text-xl font-black text-emerald-600">{totalActive}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Inactive / On Hold</span>
              <span className="text-xl font-black text-slate-500">{organizers.length - totalActive}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
              <Briefcase className="w-5 h-5" />
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
                placeholder="Search organizer by name, phone number, company, or address..."
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

        {/* Organizer Records Table */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Loading Organizer Records...</p>
          </div>
        ) : organizers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Organizer Records Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Add your first organizer or adjust your search keywords to view records.
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Organizer</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Organizer Details</th>
                    <th className="py-3.5 px-4">Phone Number</th>
                    <th className="py-3.5 px-4">Company / Location</th>
                    <th className="py-3.5 px-4">Amount Received</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentOrganizers.map((org) => (
                    <tr key={org._id} className="hover:bg-amber-50/20 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                            {org.name ? org.name[0].toUpperCase() : 'O'}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm leading-tight group-hover:text-amber-700 transition-colors">
                              {org.name}
                            </div>
                            {org.email && (
                              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3" />
                                <span>{org.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <a
                          href={`tel:${org.phone}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors border border-emerald-200"
                          title="Click to call"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{org.phone}</span>
                        </a>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{org.company || 'Direct Individual'}</div>
                        {org.address && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate max-w-[200px]">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{org.address}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex flex-col items-start gap-1.5">
                          {org.monthlyIncome && org.monthlyIncome.length > 0 ? (
                            <>
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                                <IndianRupee className="w-3 h-3" />
                                Total: ₹{org.monthlyIncome.reduce((sum, inc) => sum + Number(inc.amount || 0), 0).toLocaleString('en-IN')}
                              </div>
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-[10px] font-bold text-blue-700 border border-blue-100">
                                <IndianRupee className="w-3 h-3" />
                                Latest: ₹{Number(org.monthlyIncome[org.monthlyIncome.length - 1].amount).toLocaleString('en-IN')} ({org.monthlyIncome[org.monthlyIncome.length - 1].month})
                              </div>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-semibold italic px-1">No payments yet</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1 ${
                            org.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              org.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                            }`}
                          />
                          {org.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handlePrintOrganizer(org)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 hover:text-blue-800 text-blue-600 transition-colors cursor-pointer"
                            title="Print Organizer Record"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenIncomeModal(org)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 text-emerald-600 transition-colors cursor-pointer"
                            title="Manage Income"
                          >
                            <IndianRupee className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenModal(org)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-700 transition-colors cursor-pointer"
                            title="Edit Organizer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrganizer(org._id, org.name)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                            title="Delete Organizer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>
                  Showing <strong className="text-slate-900 font-bold">{organizers.length > 0 ? indexOfFirstItem + 1 : 0}</strong> to{' '}
                  <strong className="text-slate-900 font-bold">{Math.min(indexOfLastItem, organizers.length)}</strong> of{' '}
                  <strong className="text-slate-900 font-bold">{organizers.length}</strong> organizers
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

      {/* Add / Edit Organizer Modal */}
      {isModalOpen && (
        <div className="fixed inset-x-0 top-0 bottom-[60px] sm:bottom-0 z-40 sm:z-50 bg-slate-950/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative bg-white rounded-t-[28px] sm:rounded-3xl w-full max-w-2xl max-h-full sm:max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#C8960C] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {editingOrganizer ? `Edit Organizer Record` : 'Add New Organizer'}
                  </h3>
                  <p className="text-xs text-slate-500">Record organizer contact, company name, and details.</p>
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
            <form onSubmit={handleSaveOrganizer} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Organizer Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Venkateswara Tours & Travels / Srikanth Reddy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98480 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="organizer@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. South Fleet Logistics"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status
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
                  Location / Office Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. RTC Cross Roads, Hyderabad"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes &amp; Operational Remarks
                </label>
                <textarea
                  rows="2"
                  placeholder="Special instructions, contract terms, or coordinator details..."
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
                  <span>{saving ? 'Saving...' : editingOrganizer ? 'Update Record' : 'Save Organizer'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Income Modal */}
      {isIncomeModalOpen && selectedOrganizerForIncome && (
        <div className="fixed inset-x-0 top-0 bottom-[60px] sm:bottom-0 z-40 sm:z-50 bg-slate-950/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative bg-white rounded-t-[28px] sm:rounded-3xl w-full max-w-2xl max-h-full sm:max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Monthly Income: {selectedOrganizerForIncome.name}
                  </h3>
                  <p className="text-xs text-slate-500">Track monthly payments received from this organizer.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsIncomeModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Add New Income Form */}
              <form onSubmit={handleSaveIncome} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  {editingIncomeIndex >= 0 ? 'Update Payment' : 'Log New Payment'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Period (Month & Year) *</label>
                    <div className="flex gap-2">
                      <select
                        required
                        value={incomeFormData.month}
                        onChange={(e) => setIncomeFormData({ ...incomeFormData, month: e.target.value })}
                        className="w-1/2 px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="">Month</option>
                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <input
                        type="number"
                        required
                        placeholder="Year"
                        min="1900"
                        max="2100"
                        value={incomeFormData.year}
                        onChange={(e) => setIncomeFormData({ ...incomeFormData, year: e.target.value })}
                        className="w-1/2 px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="0.00"
                      value={incomeFormData.amount}
                      onChange={(e) => setIncomeFormData({ ...incomeFormData, amount: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Date Received *</label>
                    <input
                      type="date"
                      required
                      value={incomeFormData.dateReceived}
                      onChange={(e) => setIncomeFormData({ ...incomeFormData, dateReceived: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Notes</label>
                  <input
                    type="text"
                    placeholder="Transaction ID, remarks..."
                    value={incomeFormData.notes}
                    onChange={(e) => setIncomeFormData({ ...incomeFormData, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : (editingIncomeIndex >= 0 ? 'Update Record' : 'Add Record')}</span>
                  </button>
                </div>
              </form>

              {/* Income History */}
              <div>
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">Payment History</h4>
                {(!selectedOrganizerForIncome.monthlyIncome || selectedOrganizerForIncome.monthlyIncome.length === 0) ? (
                  <div className="text-center py-8 bg-white border border-slate-200 border-dashed rounded-2xl">
                    <IndianRupee className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No income records found for this organizer.</p>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                        <tr>
                          <th className="py-2.5 px-3">Month</th>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Amount</th>
                          <th className="py-2.5 px-3">Notes</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {selectedOrganizerForIncome.monthlyIncome.map((inc, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-slate-800">{inc.month}</td>
                            <td className="py-2.5 px-3 text-slate-500">{new Date(inc.dateReceived).toLocaleDateString('en-IN')}</td>
                            <td className="py-2.5 px-3 font-black text-emerald-600">₹{Number(inc.amount).toLocaleString('en-IN')}</td>
                            <td className="py-2.5 px-3 text-slate-500 truncate max-w-[150px]" title={inc.notes}>{inc.notes || '—'}</td>
                            <td className="py-2.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleEditIncome(idx, inc)}
                                  className="p-1 rounded bg-slate-100 text-slate-500 hover:bg-amber-100 hover:text-amber-700 cursor-pointer"
                                  title="Edit Record"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteIncome(idx)}
                                  className="p-1 rounded bg-red-50 text-red-500 hover:bg-red-100 cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default OrganizersPage;
