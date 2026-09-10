import { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Search, 
  Phone, 
  MessageCircle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Filter,
  Car,
  Truck,
  Compass,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw
} from 'lucide-react';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/inquiries', {
        params: {
          status: statusFilter,
          serviceType: serviceFilter,
          search,
        },
      });
      if (res.data.success) {
        setInquiries(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, serviceFilter, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, serviceFilter, search, itemsPerPage]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/inquiries/${id}`, { status: newStatus });
      fetchInquiries();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry record?')) {
      try {
        await api.delete(`/inquiries/${id}`);
        fetchInquiries();
      } catch (err) {
        console.error('Error deleting inquiry:', err);
      }
    }
  };

  const getWhatsAppLink = (inquiry) => {
    const phone = inquiry.phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${inquiry.name}, this is Sri Sai Ram Consultancy regarding your ${inquiry.serviceType} booking request for ${inquiry.pickupLocation || 'Hyderabad'}. We are ready to assist you!`
    );
    return `https://wa.me/${phone.startsWith('91') ? phone : `91${phone}`}?text=${text}`;
  };

  // Calculate pagination slices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInquiries = inquiries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(inquiries.length / itemsPerPage));

  return (
    <>
      <SEOHead title="Website Booking Inquiries - SSRC Admin" noindex={true} />

      <div className="space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Website Bookings & Inquiries
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                {inquiries.length} Total
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review incoming public staffing inquiries, follow up on WhatsApp, and assign candidates.
            </p>
          </div>

          <button
            onClick={fetchInquiries}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by client, phone, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Statuses</option>
              <option value="New">New Leads</option>
              <option value="Contacted">Contacted</option>
              <option value="Assigned">Assigned</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Services</option>
              <option value="Driver">Driver</option>
              <option value="Helper">Helper</option>
              <option value="Captain">Captain</option>
              <option value="General Inquiry">General</option>
            </select>
          </div>

        </div>

        {/* Inquiry Cards / List */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Loading Inquiries...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Inquiries Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              New website booking requests and callback requests will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentInquiries.map((inq) => {
                const isNew = inq.status === 'New';
                return (
                  <div
                    key={inq._id}
                    className={`bg-white rounded-3xl p-5 shadow-sm border transition-all flex flex-col justify-between ${
                      isNew ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-amber-500/10' : 'border-slate-200'
                    }`}
                  >
                    <div className="space-y-3.5">
                      
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-slate-900 text-base">{inq.name}</h3>
                            {isNew && (
                              <span className="px-2 py-0.2 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                                New
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {new Date(inq.createdAt || inq.serviceDate).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                          {inq.serviceType}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Phone:</span>
                          <a href={`tel:${inq.phone}`} className="font-bold text-blue-600 hover:underline">
                            {inq.phone}
                          </a>
                        </div>

                        {inq.email && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Email:</span>
                            <span className="font-medium text-slate-700">{inq.email}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Booking Type:</span>
                          <span className="font-bold text-slate-800">{inq.bookingType || 'Full-Day'}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Duration:</span>
                          <span className="font-bold text-slate-800">{inq.duration || '1 Day'}</span>
                        </div>

                        {inq.pickupLocation && (
                          <div className="pt-1 text-[11px] text-slate-600 border-t border-slate-200/60">
                            📍 {inq.pickupLocation}
                          </div>
                        )}
                      </div>

                      {inq.message && (
                        <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/50 text-xs text-slate-700 italic">
                          "{inq.message}"
                        </div>
                      )}

                      {/* Status Changer */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-400 font-semibold">Lead Status:</span>
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateStatus(inq._id, e.target.value)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold border focus:outline-none ${
                            inq.status === 'New'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : inq.status === 'Assigned'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : inq.status === 'Contacted'
                              ? 'bg-blue-100 text-blue-900 border-blue-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Assigned">Assigned</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>

                    </div>

                    {/* Actions */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      
                      <a
                        href={getWhatsAppLink(inq)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-sm transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Client</span>
                      </a>

                      <a
                        href={`tel:${inq.phone}`}
                        className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                        title="Call Client"
                      >
                        <Phone className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleDelete(inq._id)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        title="Delete Inquiry"
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
                  Showing <strong className="text-slate-900 font-bold">{inquiries.length > 0 ? indexOfFirstItem + 1 : 0}</strong> to{' '}
                  <strong className="text-slate-900 font-bold">{Math.min(indexOfLastItem, inquiries.length)}</strong> of{' '}
                  <strong className="text-slate-900 font-bold">{inquiries.length}</strong> inquiries
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
    </>
  );
};

export default InquiriesPage;
