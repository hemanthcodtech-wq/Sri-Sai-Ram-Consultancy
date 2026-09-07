import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, User, Phone } from 'lucide-react';

const PublicBottomNav = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home',     path: '/',        icon: Home },
    { name: 'Services', path: '/services', icon: LayoutGrid },
    { name: 'About',    path: '/about',    icon: User },
    { name: 'Contact',  path: '/contact',  icon: Phone },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#F0E0C8] shadow-[0_-2px_16px_rgba(0,0,0,0.07)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-[62px]">
        {navLinks.map(({ name, path, icon: Icon }) => {
          const active = isActive(path);
          return (
            <Link
              key={name}
              to={path}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all duration-200"
            >
              {/* Active amber pill background */}
              {active && (
                <span className="absolute inset-x-1.5 inset-y-1.5 rounded-2xl bg-amber-50 border border-amber-200" />
              )}

              <Icon
                className={`w-5 h-5 relative z-10 transition-all duration-200 ${
                  active ? 'text-[#C8960C] scale-110' : 'text-slate-400'
                }`}
              />
              <span
                className={`text-[10px] font-bold relative z-10 tracking-wide transition-colors ${
                  active ? 'text-[#C8960C]' : 'text-slate-400'
                }`}
              >
                {name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default PublicBottomNav;
