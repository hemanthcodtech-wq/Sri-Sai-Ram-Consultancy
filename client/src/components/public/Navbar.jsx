import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, MessageCircle, Menu, X, ShieldCheck } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const phoneDisplay = import.meta.env.VITE_COMPANY_PHONE || '+91 95051 51527';
  const phoneRaw = import.meta.env.VITE_COMPANY_PHONE_RAW || '9505151527';
  const whatsappRaw = import.meta.env.VITE_COMPANY_WHATSAPP || '919505151527';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-[#081C36]/95 backdrop-blur-md shadow-lg shadow-black/20 py-2 border-b border-amber-500/20'
        : 'bg-[#0B2545] py-3.5 border-b border-amber-500/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Text-Only Logo Brand (No Icon, No Verified Tag) */}
          <Link to="/" className="flex items-center group">
            <div className="h-12 sm:h-14 px-4 py-2 rounded-2xl bg-white shadow-xl border-2 border-amber-400/90 flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.03] shrink-0">
              <img src={`${logoImg}?v=4`} alt="Sri Sai Ram Consultancy" className="h-9 sm:h-11 w-auto max-w-[240px] sm:max-w-[320px] object-contain" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  isActive(link.path)
                    ? 'text-amber-400 font-semibold bg-white/10'
                    : 'text-slate-200 hover:text-amber-300 hover:bg-white/5'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Header Action Buttons (Call Now & WhatsApp) */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${phoneRaw}`}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>{phoneDisplay}</span>
            </a>

            <a
              href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent('Hello Sri Sai Ram Consultancy! I need Driver/Helper/Captain staffing service.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 text-slate-950" />
              <span>WhatsApp Now</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#081C36] border-b border-amber-500/30 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-amber-500/20 text-amber-400 font-semibold border-l-4 border-amber-400'
                  : 'text-slate-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <a
              href={`tel:${phoneRaw}`}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-blue-600/40 border border-blue-400/40"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call Helpline: {phoneDisplay}</span>
            </a>
            <a
              href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent('Hello Sri Sai Ram Consultancy! I need staffing service.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 shadow-md shadow-amber-500/25"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
