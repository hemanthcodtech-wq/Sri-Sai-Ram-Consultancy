import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, Info, Phone, MessageCircle } from 'lucide-react';

const PublicBottomNav = () => {
  const location = useLocation();
  const whatsappRaw = import.meta.env.VITE_COMPANY_WHATSAPP || '919505151527';

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Services', path: '/services', icon: Briefcase },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    /* Fixed bottom bar — only visible on mobile, hidden md+ */
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#081C36] border-t-2 border-amber-500/40 shadow-[0_-4px_24px_rgba(0,0,0,0.3)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-[60px]">

        {/* 4 Navigation links */}
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold uppercase tracking-wide transition-all duration-200 relative ${
                active ? 'text-amber-400' : 'text-slate-500'
              }`}
            >
              {/* Gold top line for active */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-[2px] bg-amber-400 rounded-full" />
              )}
              <Icon
                className={`w-[18px] h-[18px] transition-transform duration-200 ${
                  active ? 'scale-110 text-amber-400' : 'text-slate-500'
                }`}
              />
              <span>{link.name}</span>
            </Link>
          );
        })}

        {/* WhatsApp CTA — amber standout button */}
        <a
          href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent('Hello Sri Sai Ram Consultancy! I need staffing service.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[9px] font-black uppercase tracking-wide bg-amber-400 text-slate-950 active:bg-amber-300 transition-colors"
        >
          <MessageCircle className="w-[18px] h-[18px]" />
          <span>WhatsApp</span>
        </a>

      </div>
    </nav>
  );
};

export default PublicBottomNav;
