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
  Bell,
  ChevronRight,
  Shield,
  Building2,
  Navigation,
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
      name: 'Route Management',
      path: '/admin/routes',
      icon: Navigation,
    },
    {
      name: 'Organizer Management',
      path: '/admin/organizers',
      icon: Building2,
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
    { name: 'Routes', shortName: 'Routes', path: '/admin/routes', icon: Navigation },
    { name: 'Organizers', shortName: 'Orgs', path: '/admin/organizers', icon: Building2 },
    { name: 'Tasks', shortName: 'Tasks', path: '/admin/tasks', icon: ClipboardList },
    { name: 'Earnings', shortName: 'Money', path: '/admin/earnings', icon: TrendingUp },
    { name: 'Inquiries', shortName: 'Inbox', path: '/admin/inquiries', icon: Bell },
  ];

  const isActive = (path) => {
    return location.pathname === path || (path !== '/admin/dashboard' && location.pathname.startsWith(path));
  };

  const currentPage = location.pathname.replace('/admin/', '').replace(/-/g, ' ') || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col md:flex-row">

      {/* ── Mobile Top Header (Light Theme with Full Brand Logo) ── */}
      <div className="md:hidden bg-[#FFFDF8] text-slate-800 px-4 py-2.5 flex items-center justify-between border-b border-[#F0E0C8] sticky top-0 z-40 shadow-sm">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <img
            src={`${logoImg}?v=5`}
            alt="Sri Sai Ram Consultancy"
            className="h-10 sm:h-12 w-auto max-w-[190px] sm:max-w-[240px] object-contain"
          />
          <span className="text-[9px] font-black uppercase tracking-wider bg-amber-100 text-[#B27500] border border-amber-300 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-[#F5F0E8] text-[#081C36] hover:bg-[#EDE5D5] border border-[#E0D0B8] transition-colors"
            aria-label="Toggle Sidebar Menu"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-[#C8960C]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Sidebar (Luxury Light Theme) ─────────────────── */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-68 bg-[#FFFDF8] text-slate-800 z-50 flex flex-col justify-between border-r border-[#F0E0C8] transition-transform duration-300 shadow-xl md:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        {/* Top Metallic Gold Accent Bar */}
        <div className="h-[3px] bg-gradient-to-r from-[#C8960C] via-[#F5C842] to-[#C8960C]" />

        <div className="flex-1 overflow-y-auto">
          {/* Brand Header & Logo */}
          <div className="p-4 border-b border-[#F0E0C8] flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex-1 group" onClick={() => setSidebarOpen(false)}>
              <div className="h-13 px-3 py-1.5 rounded-2xl bg-white shadow-sm border border-[#F0E0C8] flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]">
                <img src={`${logoImg}?v=5`} alt="Sri Sai Ram Admin" className="h-10 w-auto max-w-[200px] object-contain" />
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-500 hover:text-slate-800 ml-2 p-2 rounded-xl hover:bg-[#F5F0E8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Logged-in System Status indicator */}
          <div className="px-4 pt-3 pb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System Active
            </div>
            <span className="text-[10px] text-[#C8960C] font-black uppercase tracking-wider">Admin Portal</span>
          </div>

          {/* Nav Items */}
          <div className="p-3 space-y-1">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 py-1.5">
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${active
                      ? 'bg-gradient-to-r from-[#C8960C] to-[#E8A900] text-white shadow-md shadow-amber-500/25 font-bold'
                      : 'text-slate-700 hover:bg-[#F5F0E8] hover:text-[#C8960C]'
                    }`}
                >
                  {/* Active left gold marker */}
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-6 bg-white rounded-r-full shadow-sm" />
                  )}

                  <div className="flex items-center gap-3">
                    <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${active ? 'text-white' : 'text-[#C8960C]'}`} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${active
                        ? 'bg-white/25 text-white'
                        : 'bg-amber-100 text-[#B27500] border border-amber-300'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Info & Public Link Footer */}
        <div className="p-3 border-t border-[#F0E0C8] space-y-2 bg-[#FAF7F0]">

          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#F5F0E8] text-[#081C36] text-xs font-bold transition-all border border-[#E0D0B8] shadow-sm group"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#C8960C] group-hover:scale-110 transition-transform" />
              View Public Website
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <div className="p-3 rounded-2xl bg-white border border-[#E0D0B8] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C8960C] to-[#F5C842] text-[#081C36] flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-black text-[#081C36] truncate">{user?.name || 'Administrator'}</div>
                <div className="text-[10px] text-slate-500 font-semibold truncate">{user?.email || 'admin@ssrc.com'}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </aside>

      {/* Overlay when mobile sidebar is open */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main Content Area ────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#F9FBFE]">

        {/* Top Navbar (Desktop only) */}
        <header className="bg-white/98 backdrop-blur-md border-b border-[#F0E0C8] px-6 py-3.5 hidden md:flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield className="w-4 h-4 text-[#C8960C]" />
            <span className="font-extrabold text-[#081C36] tracking-tight">SSRC Admin Portal</span>
            <span className="text-slate-300">/</span>
            <span className="capitalize text-[#C8960C] font-bold bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
              {currentPage}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System Online
            </span>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C8960C] to-[#F5C842] text-[#081C36] flex items-center justify-center font-black text-xs shadow-xs">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-[#081C36] block leading-tight">{user?.name || 'Admin User'}</span>
                <span className="text-[10px] text-[#C8960C] font-bold block capitalize leading-none mt-0.5">{user?.role || 'Super Admin'}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all shadow-xs"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <Outlet />
        </div>

      </main>

      {/* ── Mobile Sticky Bottom Nav Bar (Light Theme) ──── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#F0E0C8] shadow-[0_-2px_16px_rgba(0,0,0,0.08)]">
        <div className="flex items-stretch h-[60px]">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold tracking-wide transition-all duration-200 relative"
              >
                {/* Active light amber pill background */}
                {active && (
                  <span className="absolute inset-x-1 inset-y-1.5 rounded-xl bg-amber-50 border border-amber-200" />
                )}
                {/* Active top amber line */}
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#C8960C] rounded-full" />
                )}
                <Icon
                  className={`w-5 h-5 relative z-10 transition-transform duration-200 ${active ? 'scale-110 text-[#C8960C]' : 'text-slate-400'
                    }`}
                />
                <span className={`relative z-10 ${active ? 'text-[#C8960C]' : 'text-slate-500'}`}>
                  {item.shortName}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
};

export default AdminLayout;
