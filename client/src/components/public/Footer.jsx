import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Shield, ArrowUpRight, MessageCircle } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const Footer = () => {
  const phoneDisplay = import.meta.env.VITE_COMPANY_PHONE || '+91 95051 51527';
  const phoneRaw = import.meta.env.VITE_COMPANY_PHONE_RAW || '9505151527';
  const whatsappRaw = import.meta.env.VITE_COMPANY_WHATSAPP || '919505151527';
  const address = import.meta.env.VITE_COMPANY_ADDRESS || 'Beside Reliance Market, Jama Thota Sagar Ring Road, Hyderabad LB Nagar';

  return (
    <footer className="bg-[#020617] text-slate-300 pt-16 pb-12 border-t-2 border-amber-500/40 relative overflow-hidden">
      
      {/* Background Ambient Accents */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Company Column */}
          <div className="space-y-4">
            <Link to="/" className="inline-block group">
              <div className="h-14 px-4 py-2 rounded-2xl bg-white shadow-lg border border-amber-400/80 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <img src={`${logoImg}?v=4`} alt="Sri Sai Ram Consultancy Official Logo" className="h-10 w-auto max-w-[260px] object-contain" />
              </div>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed">
              Your Dreams... Our Guidance. Connecting households, corporate fleets, and businesses with thoroughly verified Drivers, Helpers, and Captain Chauffeurs.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20">
              <Shield className="w-4 h-4 shrink-0 text-amber-400" />
              <span>100% Background & Police Verified Staff</span>
            </div>
          </div>

          {/* Quick Services */}
          <div>
            <h4 className="text-white font-black text-base uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2.5">
              Our Staffing Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services#driver" className="hover:text-amber-400 transition-all duration-200 hover:translate-x-1 inline-flex items-center justify-between w-full group">
                  <span>Professional Drivers</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
              </li>
              <li>
                <Link to="/services#helper" className="hover:text-amber-400 transition-all duration-200 hover:translate-x-1 inline-flex items-center justify-between w-full group">
                  <span>Dedicated Helpers</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
              </li>
              <li>
                <Link to="/services#captain" className="hover:text-amber-400 transition-all duration-200 hover:translate-x-1 inline-flex items-center justify-between w-full group">
                  <span>Executive Captain Chauffeurs</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-400 transition-all duration-200 hover:translate-x-1 inline-flex items-center justify-between w-full group">
                  <span>On-Demand Daily Staffing</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black text-base uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2.5">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-all duration-200 hover:translate-x-1 inline-block">Home Page</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-all duration-200 hover:translate-x-1 inline-block">About SSRC</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-400 transition-all duration-200 hover:translate-x-1 inline-block">Service Offerings</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-all duration-200 hover:translate-x-1 inline-block">Contact Us</Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-amber-400/90 hover:text-amber-300 transition-all font-semibold flex items-center gap-1">
                  <span>Admin Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3.5 text-sm">
            <h4 className="text-white font-black text-base uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2.5">
              Contact & Location
            </h4>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
              <span className="text-slate-300 leading-snug">{address}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <a href={`tel:${phoneRaw}`} className="text-white hover:text-amber-400 transition-colors font-extrabold text-base">
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
                Chat on WhatsApp (+91 {phoneRaw})
              </a>
            </div>

            <div className="flex items-center gap-3 pt-1 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Available 24/7 for Direct Calls & WhatsApp</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Sri Sai Ram Consultancy. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built with Trust & Excellence</span>
            <span className="text-amber-400 font-bold">Your Dreams... Our Guidance...</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
