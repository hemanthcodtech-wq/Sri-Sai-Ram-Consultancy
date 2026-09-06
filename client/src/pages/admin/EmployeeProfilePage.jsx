import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  Phone, 
  ShieldCheck, 
  Award, 
  MapPin, 
  FileText, 
  Calendar, 
  DollarSign, 
  Car, 
  Truck, 
  Compass, 
  ArrowLeft, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Printer,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';

const EmployeeProfilePage = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/employees/${id}`);
      if (res.data.success) {
        setEmployee(res.data.data.employee);
        setTrips(res.data.data.trips);
        setStats(res.data.data.stats);
      }
    } catch (err) {
      console.error('Error fetching employee profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Employee Biodata Sheet...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900">Employee Profile Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">The requested staff record does not exist or was deleted.</p>
        <Link
          to="/admin/employees"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  const isCaptain = employee.category === 'Captain';
  const isDriver = employee.category === 'Driver';
  const CategoryIcon = isCaptain ? Compass : isDriver ? Car : Truck;

  // Calculate pagination slices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrips = trips.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(trips.length / itemsPerPage));

  return (
    <>
      <SEOHead title={`${employee.name} - Biodata & Duty Profile - SSRC Admin`} />

      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/employees"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Staff Biodata Sheet
              </h1>
              <p className="text-xs text-slate-500">Official verified personnel dossier for Sri Sai Ram Consultancy.</p>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-sm hover:bg-slate-50 transition-colors self-start sm:self-auto"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Dossier</span>
          </button>
        </div>

        {/* Profile Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          
          {/* Header Row: Avatar, Name, ID, Category, Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-5">
              <img
                src={employee.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
                alt={employee.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-100 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-extrabold text-slate-900">{employee.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 font-mono text-xs font-bold text-slate-700">
                    {employee.employeeId}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                  <span className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                    isCaptain ? 'bg-amber-100 text-amber-900' : isDriver ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    <CategoryIcon className="w-3.5 h-3.5" />
                    <span>{employee.category}</span>
                  </span>

                  <span className={`px-2.5 py-1 rounded-full font-bold ${
                    employee.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    ● {employee.status}
                  </span>

                  <span className="text-slate-400 font-medium pl-1">
                    Experience: <strong className="text-slate-700">{employee.experience}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
              <span className="text-[10px] text-amber-900 font-bold uppercase block">Total Generated Commission</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                ₹{stats?.totalEarnings || 0}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
              <span className="text-[10px] text-emerald-900 font-bold uppercase block">Total Staff Payouts</span>
              <div className="text-xl font-black text-emerald-900 mt-0.5">
                ₹{stats?.totalPayouts || 0}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
              <span className="text-[10px] text-blue-900 font-bold uppercase block">Total Tasks Assigned</span>
              <div className="text-xl font-black text-blue-900 mt-0.5">
                {stats?.totalTrips || 0}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Standard Daily Rate</span>
              <div className="text-xl font-black text-slate-800 mt-0.5">
                ₹{employee.dailyRate || 800}
              </div>
            </div>
          </div>

          {/* Assigned Tasks History Table */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Assigned Tasks & Duty History</h3>
                <p className="text-xs text-slate-500">Log of all routes completed by {employee.name}</p>
              </div>
            </div>

            {trips.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                No trips logged for this employee yet.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-y border-slate-200">
                      <tr>
                        <th className="py-3 px-3">Trip #</th>
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Client</th>
                        <th className="py-3 px-3">Route / Location</th>
                        <th className="py-3 px-3">Trip Fee</th>
                        <th className="py-3 px-3">Employee Payout</th>
                        <th className="py-3 px-3">Payment</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentTrips.map((trip) => (
                        <tr key={trip._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">{trip.tripNumber}</td>
                          <td className="py-3 px-3">{new Date(trip.tripDate).toLocaleDateString('en-IN')}</td>
                          <td className="py-3 px-3 font-medium text-slate-900">{trip.clientName}</td>
                          <td className="py-3 px-3">{trip.pickupLocation} → {trip.dropLocation || 'City'}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">₹{trip.tripAmount}</td>
                          <td className="py-3 px-3 font-bold text-emerald-700">₹{trip.employeePayout}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              trip.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {trip.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full font-medium text-[10px] bg-slate-100 text-slate-800">
                              {trip.tripStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination Footer */}
                <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>
                      Showing <strong className="text-slate-900 font-bold">{indexOfFirstItem + 1}</strong> to{' '}
                      <strong className="text-slate-900 font-bold">{Math.min(indexOfLastItem, trips.length)}</strong> of{' '}
                      <strong className="text-slate-900 font-bold">{trips.length}</strong> duty logs
                    </span>

                    <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
                      <span className="text-slate-400">Rows per page:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
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

                    <div className="px-3 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg">
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

        </div>

      </div>
    </>
  );
};

export default EmployeeProfilePage;
