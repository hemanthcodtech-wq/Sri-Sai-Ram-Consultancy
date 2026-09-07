import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, MessageCircle, Menu, X, Bell } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const phoneDisplay = import.meta.env.VITE_COMPANY_PHONE || '+91 95051 51527';
  const phoneRaw = import.meta.env.VITE_COMPANY_PHONE_RAW || '9505151527';
  const whatsappRaw = import.meta.env.VITE_COMPANY_WHATSAPP || '919505151527';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home',       path: '/' },
    { name: 'Services',   path: '/services' },
    { name: 'About Us',   path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-md shadow-md border-b border-[#F0E0C8] py-2'
          : 'bg-[#FFFDF8] py-3 border-b border-[#F0E0C8]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">

          {/* ── Logo (Prominent branding) ── */}
          <Link to="/" className="flex items-center group shrink-0 py-0.5">
            <img
              src={`${logoImg}?v=5`}
              alt="Sri Sai Ram Consultancy"
              className="h-14 sm:h-16 md:h-20 lg:h-22 w-auto max-w-[210px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[380px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 relative ${
                  isActive(link.path)
                    ? 'text-[#C8960C] font-bold'
                    : 'text-[#333] hover:text-[#C8960C]'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-[#C8960C] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* ── Desktop CTA Buttons ── */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <a
              href={`tel:${phoneRaw}`}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#081C36] bg-[#F5F0E8] hover:bg-[#EDE5D5] border border-[#E0D0B8] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C8960C]" />
              {phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent('Hello Sri Sai Ram Consultancy! I need Driver/Helper/Captain staffing service.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#C8960C] to-[#E8A900] hover:from-[#E8A900] hover:to-[#C8960C] shadow-md shadow-amber-400/30 transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Now
            </a>
          </div>

          {/* ── Mobile: Bell + Hamburger ── */}
          <div className="md:hidden flex items-center gap-1.5">
            <a
              href={`tel:${phoneRaw}`}
              className="p-2 rounded-xl text-[#081C36] hover:bg-slate-100 transition-colors"
              aria-label="Notifications / Call"
            >
              <Bell className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#081C36] hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#C8960C]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile Drawer Menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#F0E0C8] px-4 pt-3 pb-6 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isActive(link.path)
                  ? 'bg-amber-50 text-[#C8960C] font-bold border-l-4 border-[#C8960C]'
                  : 'text-[#333] hover:bg-[#F5F0E8] hover:text-[#C8960C]'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 border-t border-[#F0E0C8] flex flex-col gap-2.5">
            <a
              href={`tel:${phoneRaw}`}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-[#081C36] bg-[#F5F0E8] border border-[#E0D0B8]"
            >
              <Phone className="w-4 h-4 text-[#C8960C]" />
              Call: {phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent('Hello Sri Sai Ram Consultancy! I need staffing service.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#C8960C] to-[#E8A900] shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
