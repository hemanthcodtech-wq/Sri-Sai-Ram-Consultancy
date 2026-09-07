import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Shield, ArrowUpRight, MessageCircle } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const Footer = () => {
  const phoneDisplay = import.meta.env.VITE_COMPANY_PHONE || '+91 95051 51527';
  const phoneRaw = import.meta.env.VITE_COMPANY_PHONE_RAW || '9505151527';
  const whatsappRaw = import.meta.env.VITE_COMPANY_WHATSAPP || '919505151527';
  const address =
    import.meta.env.VITE_COMPANY_ADDRESS ||
    'Beside Reliance Market, Jama Thota Sagar Ring Road, Hyderabad LB Nagar';

  return (
    <footer className="bg-[#081C36] text-slate-300 pt-14 pb-10 border-t-4 border-[#C8960C] relative overflow-hidden">

      {/* Ambient glows */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-[#C8960C]/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-72 h-72 bg-blue-600/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">

          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <div className="bg-white rounded-2xl px-4 py-2 shadow-md border border-[#C8960C]/30 inline-flex items-center">
                <img
                  src={`${logoImg}?v=4`}
                  alt="Sri Sai Ram Consultancy"
                  className="h-10 w-auto max-w-[200px] object-contain"
                />
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed">
              Your Dreams... Our Guidance. Connecting households, corporate fleets, and businesses with
              thoroughly verified Drivers, Helpers, and Captain Chauffeurs.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#F5C842] bg-[#C8960C]/12 px-3 py-2 rounded-xl border border-[#C8960C]/20">
              <Shield className="w-4 h-4 shrink-0 text-[#C8960C]" />
              <span>100% Background &amp; Police Verified Staff</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-wider mb-4 border-l-2 border-[#C8960C] pl-2.5">
              Our Staffing Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Professional Drivers', href: '/services#driver' },
                { label: 'Dedicated Helpers', href: '/services#helper' },
                { label: 'Executive Captains', href: '/services#captain' },
                { label: 'On-Demand Staffing', href: '/services' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="hover:text-[#C8960C] transition-all duration-200 hover:translate-x-1 inline-flex items-center justify-between w-full group"
                  >
                    <span>{label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#C8960C]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-wider mb-4 border-l-2 border-[#C8960C] pl-2.5">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home Page', href: '/' },
                { label: 'About SSRC', href: '/about' },
                { label: 'Service Offerings', href: '/services' },
                { label: 'Contact Us', href: '/contact' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link to={href} className="hover:text-[#C8960C] transition-all duration-200 hover:translate-x-1 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/admin/login" className="text-[#C8960C] hover:text-[#F5C842] transition-all font-semibold flex items-center gap-1">
                  Admin Portal <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3.5 text-sm">
            <h4 className="text-white font-black text-sm uppercase tracking-wider mb-4 border-l-2 border-[#C8960C] pl-2.5">
              Contact &amp; Location
            </h4>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#C8960C] shrink-0 mt-1" />
              <span className="text-slate-300 leading-snug text-xs">{address}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#C8960C] shrink-0" />
              <a href={`tel:${phoneRaw}`} className="text-white hover:text-[#C8960C] transition-colors font-extrabold text-base">
                {phoneDisplay}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <a
                href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent('Hello Sri Sai Ram Consultancy!')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-bold text-xs"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-[#C8960C] shrink-0" />
              <span>Available 24/7 for Calls &amp; WhatsApp</span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Sri Sai Ram Consultancy. All Rights Reserved.</p>
          <div className="flex items-center gap-5">
            <span>Built with Trust &amp; Excellence</span>
            <span className="text-[#C8960C] font-bold">Your Dreams... Our Guidance...</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
