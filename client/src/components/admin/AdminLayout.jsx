import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  ClipboardList, 
  TrendingUp, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  Shield,
  Bell,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      name: 'Employee Biodata',
      path: '/admin/employees',
      icon: Users,
    },
    {
      name: 'Task Management',
      path: '/admin/tasks',
      icon: ClipboardList,
    },
    {
      name: 'Earnings',
      path: '/admin/earnings',
      icon: TrendingUp,
    },
    {
      name: 'Website Inquiries',
      path: '/admin/inquiries',
      icon: Bell,
    },
  ];

  // Bottom bar items — shorter labels for mobile
  const bottomNavItems = [
    { name: 'Dashboard', shortName: 'Dash', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Employees', shortName: 'Staff', path: '/admin/employees', icon: Users },
    { name: 'Tasks', shortName: 'Tasks', path: '/admin/tasks', icon: ClipboardList },
    { name: 'Earnings', shortName: 'Money', path: '/admin/earnings', icon: TrendingUp },
    { name: 'Inquiries', shortName: 'Inbox', path: '/admin/inquiries', icon: Bell },
  ];

  const isActive = (path) => {
    return location.pathname === path || (path !== '/admin/dashboard' && location.pathname.startsWith(path));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#081C36] text-white p-4 flex items-center justify-between border-b border-amber-500/30 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-[#081C36] font-black flex items-center justify-center text-xs">
            SSR
          </div>
          <div>
            <div className="font-extrabold text-sm leading-tight">Sri Sai Ram</div>
            <div className="text-[10px] text-amber-400 font-bold uppercase">Admin Panel</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Logout button on mobile header */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white/10 text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar for Desktop & Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#081C36] text-slate-200 z-50 flex flex-col justify-between border-r-2 border-amber-500/30 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <Link to="/admin/dashboard" className="w-full group">
              <div className="h-12 px-3 py-1.5 rounded-xl bg-white shadow-md border border-amber-400/80 flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]">
                <img src={`${logoImg}?v=4`} alt="Sri Sai Ram Admin" className="h-9 w-auto max-w-[190px] object-contain" />
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <div className="p-4 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 mb-1">
              Management
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      active ? 'bg-slate-950 text-amber-400' : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Info & Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors border border-white/10"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>View Public Website</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name[0] : 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@ssrc.com'}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </aside>

      {/* Overlay when mobile sidebar is open */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Navbar (Desktop only) */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 hidden md:flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-900">SSRC Central Admin</span>
            <span>/</span>
            <span className="capitalize text-amber-700 font-medium">
              {location.pathname.replace('/admin/', '').replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Online</span>
            </span>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-900 block">{user?.name || 'Admin User'}</span>
              <span className="text-[10px] text-slate-500 block capitalize">{user?.role || 'Super Admin'}</span>
            </div>
          </div>
        </header>

        {/* Page Inner Container — extra bottom padding on mobile for bottom bar */}
        <div className="p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <Outlet />
        </div>

      </main>

      {/* ── Mobile Sticky Bottom Nav Bar (Admin) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#081C36]/98 backdrop-blur-lg border-t-2 border-amber-500/40 shadow-[0_-4px_24px_rgba(0,0,0,0.3)]">
        <div className="flex items-stretch h-16">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold uppercase tracking-wide transition-all duration-200 relative ${
                  active ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {/* Active top indicator */}
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                )}
                {/* Active background pill */}
                {active && (
                  <span className="absolute inset-x-1 inset-y-1 rounded-xl bg-amber-500/10 border border-amber-400/20" />
                )}
                <Icon
                  className={`w-5 h-5 relative z-10 transition-transform duration-200 ${
                    active ? 'scale-110 text-amber-400' : 'text-slate-500'
                  }`}
                />
                <span className="relative z-10">{item.shortName}</span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
};

export default AdminLayout;
