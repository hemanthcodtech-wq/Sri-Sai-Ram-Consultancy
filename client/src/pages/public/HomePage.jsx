import { Link } from 'react-router-dom';
import { 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Users,
  HeartHandshake,
  Star
} from 'lucide-react';
import SEOHead from '../../components/public/SEOHead';
import Typewriter from '../../components/public/Typewriter';
import bannerBg from '../../assets/banner_bg_clean.png';
import driverIcon from '../../assets/icon_driver.png';
import captainIcon from '../../assets/icon_captain.png';
import helperIcon from '../../assets/icon_helper.png';

const HomePage = () => {
  const phoneRaw = import.meta.env.VITE_COMPANY_PHONE_RAW || '9505151527';
  const whatsappRaw = import.meta.env.VITE_COMPANY_WHATSAPP || '919505151527';

  return (
    <>
      <SEOHead
        title="Sri Sai Ram Consultancy - Premium Captain, Driver & Helper Staffing"
        description="Sri Sai Ram Consultancy: Verified Drivers, Helpers, and Captain Chauffeurs in Hyderabad LB Nagar. Call +91 95051 51527."
      />

      {/* ═══════════════════════════════════════════
          1. HERO BANNER — Panoramic Width with Reactive Typewriter
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#FFFDF9] overflow-hidden border-b border-[#F0E5D5]">
        <div className="w-full max-w-[1440px] mx-auto px-1.5 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-3">
          <div className="relative overflow-hidden sm:rounded-2xl md:rounded-3xl border-0 sm:border border-[#F0E0C8] shadow-sm sm:shadow-md bg-white aspect-[2.1/1] sm:aspect-[2.25/1] w-full">
            
            {/* Background Image (Original Mockup with 4 Staff & Gold Ribbons) */}
            <img
              src={bannerBg}
              alt="Sri Sai Ram Consultancy - Professional Staffing"
              className="absolute inset-0 w-full h-full object-cover object-[center_right] sm:object-right z-0 pointer-events-none"
            />

            {/* Subtle Gradient Backing on Left for Crisp Typography */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9]/95 via-[#FFFDF9]/70 to-transparent sm:from-[#FFFDF9]/90 sm:via-[#FFFDF9]/40 sm:to-transparent z-1 pointer-events-none max-w-[85%] sm:max-w-[54%]" />

            {/* Banner Foreground Content */}
            <div className="relative z-10 flex flex-col justify-center h-full pl-3.5 sm:pl-7 md:pl-11 lg:pl-16 pr-1 py-1 sm:py-3 max-w-[58%] sm:max-w-[52%] md:max-w-[48%]">
              
              {/* Tagline */}
              <p className="text-[7.5px] sm:text-xs md:text-sm font-black uppercase tracking-wider text-[#081C36]/85 mb-0.5 sm:mb-1.5 md:mb-2 leading-tight">
                TRUSTED PEOPLE FOR A BETTER TOMORROW
              </p>

              {/* Main Heading with Typewriter */}
              <h1 className="text-lg sm:text-3xl md:text-5xl lg:text-6xl font-black leading-[1.08] mb-1 sm:mb-2 md:mb-3">
                <span className="text-[#081C36] block">Your Needs</span>
                <span className="block min-h-[1.2em]">
                  <Typewriter
                    phrases={['Our People', 'Expert Drivers', 'Elite Captains', 'Verified Helpers']}
                    className="text-[#C8960C]"
                  />
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-[8px] sm:text-xs md:text-sm lg:text-base font-medium leading-tight sm:leading-relaxed max-w-[180px] sm:max-w-sm md:max-w-md lg:max-w-lg mb-1.5 sm:mb-3 md:mb-5">
                Reliable Drivers, Captains &amp; Helpers for Your Personal and Professional Needs.
              </p>

              {/* Get Started Pill Button */}
              <div className="flex items-center">
                <a
                  href={`tel:${phoneRaw}`}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-5 sm:py-2.5 md:px-7 md:py-3 rounded-full bg-gradient-to-r from-[#D98E04] to-[#C8960C] hover:from-[#EAA00A] hover:to-[#D98E04] text-white font-black text-[8.5px] sm:text-xs md:text-sm lg:text-base shadow-md shadow-amber-400/25 transition-all duration-300 hover:scale-[1.03] active:scale-95 whitespace-nowrap"
                >
                  Get Started <ArrowRight className="w-2.5 h-2.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </a>
              </div>

              {/* Carousel Indicators (1 Navy, 2 Grey) */}
              <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-3 md:mt-4">
                <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-[#081C36]" />
                <span className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-slate-300" />
                <span className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-slate-300" />
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          2. OUR SERVICES (Drivers, Captains, Helpers) — Rich Cards with Icons
          ═══════════════════════════════════════════ */}
      <section className="py-10 sm:py-14 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 sm:mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#C8960C] block mb-1">
                Verified Staffing Solutions
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#081C36] tracking-tight">
                Our Services
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#081C36] hover:text-[#C8960C] transition-colors"
            >
              <span>Explore All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3 Services Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">

            {/* 1. PROFESSIONAL DRIVERS */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-200 hover:border-[#C8960C] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-50/60 p-1 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <img src={driverIcon} alt="Professional Drivers" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-[#081C36] group-hover:text-[#C8960C] transition-colors">
                    Professional Driver
                  </h3>
                  <p className="text-xs text-[#C8960C] font-extrabold uppercase tracking-wider mt-0.5">
                    Steers with Responsibility
                  </p>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Carefully vetted drivers with extensive experience handling hatchbacks, luxury sedans, and SUVs. Ideal for city commutes, airport drops, and outstation tasks.
                </p>

                <ul className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Valid Commercial / Transport License</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Thorough Police Verification &amp; KYC</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Full-Day, Night Duty &amp; Monthly Contracts</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                <a
                  href={`tel:${phoneRaw}`}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#081C36] hover:bg-[#0c294e] text-white font-black text-xs shadow-md transition-all hover:scale-105"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent('Hello! I want to hire a Driver via Sri Sai Ram Consultancy.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs shadow-md transition-all hover:scale-105"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* 2. DEDICATED HELPERS */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-200 hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50/60 p-1 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <img src={helperIcon} alt="Dedicated Helpers" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
                    Verified Manpower
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-[#081C36] group-hover:text-emerald-700 transition-colors">
                    Dedicated Helper
                  </h3>
                  <p className="text-xs text-emerald-700 font-extrabold uppercase tracking-wider mt-0.5">
                    Supports with Dedication
                  </p>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Trained, energetic manpower for warehouse freight loading/unloading, household relocation packing, event setups, and logistics tasks.
                </p>

                <ul className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Heavy Goods &amp; Fragile Handling Trained</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Reliable &amp; Verified ID Documents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Shift-Based &amp; Daily Wage Deployments</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                <a
                  href={`tel:${phoneRaw}`}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#081C36] hover:bg-emerald-950 text-white font-black text-xs shadow-md transition-all hover:scale-105"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent('Hello! I want to hire a Helper via Sri Sai Ram Consultancy.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs shadow-md transition-all hover:scale-105"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* 3. CAPTAIN CHAUFFEURS */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border-2 border-amber-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between relative group h-full">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#D98E04] to-[#C8960C] text-white font-black text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                VIP Choice
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-50 p-1 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <img src={captainIcon} alt="Captain Chauffeurs" className="w-full h-full object-contain" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-[#081C36] group-hover:text-[#C8960C] transition-colors">
                    Captain Chauffeur
                  </h3>
                  <p className="text-xs text-[#C8960C] font-extrabold uppercase tracking-wider mt-0.5">
                    Leads with Confidence
                  </p>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Premium executive chauffeurs for corporate executives, celebrities, long-distance luxury tours, and VIP motorcades. Punctual, uniformed, and discreet.
                </p>

                <ul className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>8+ Years Luxury Fleet Experience</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>VIP Protocol &amp; Route Navigation Master</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Bilingual, Professional Attire Guaranteed</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                <a
                  href={`tel:${phoneRaw}`}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-[#D98E04] to-[#C8960C] hover:from-[#EAA00A] hover:to-[#D98E04] text-white font-black text-xs shadow-md transition-all hover:scale-105"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent('Hello! I want to hire an Executive Captain via Sri Sai Ram Consultancy.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs shadow-md transition-all hover:scale-105"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ═══════════════════════════════════════════
          3. STATS STRIP (Clean Card)
          ═══════════════════════════════════════════ */}
      <section className="py-2 bg-white">
        <div className="max-w-5xl mx-auto px-3.5 sm:px-6">
          <div className="bg-white rounded-2xl p-2.5 sm:p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <div className="grid grid-cols-4 gap-1.5 sm:gap-4 items-center">

              {/* 1000+ Professionals */}
              <div className="flex items-center gap-1 sm:gap-2.5">
                <div className="shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7" fill="#C8960C">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <div className="text-[11px] sm:text-base font-black text-[#081C36]">1000+</div>
                  <p className="text-[7.5px] sm:text-[11px] text-slate-500 font-semibold leading-none mt-0.5">Professionals</p>
                </div>
              </div>

              {/* 500+ Happy Clients */}
              <div className="flex items-center gap-1 sm:gap-2.5">
                <div className="shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7" fill="#C8960C">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <div className="text-[11px] sm:text-base font-black text-[#081C36]">500+</div>
                  <p className="text-[7.5px] sm:text-[11px] text-slate-500 font-semibold leading-none mt-0.5">Happy Clients</p>
                </div>
              </div>

              {/* 95% Satisfaction */}
              <div className="flex items-center gap-1 sm:gap-2.5">
                <div className="shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7" fill="#C8960C">
                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <div className="text-[11px] sm:text-base font-black text-[#081C36]">95%</div>
                  <p className="text-[7.5px] sm:text-[11px] text-slate-500 font-semibold leading-none mt-0.5">Satisfaction</p>
                </div>
              </div>

              {/* Multiple Cities */}
              <div className="flex items-center gap-1 sm:gap-2.5">
                <div className="shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7" fill="#C8960C">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <div className="text-[11px] sm:text-base font-black text-[#081C36]">Multiple</div>
                  <p className="text-[7.5px] sm:text-[11px] text-slate-500 font-semibold leading-none mt-0.5">Cities</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          4. WHY CHOOSE US?
          ═══════════════════════════════════════════ */}
      <section className="py-5 sm:py-8 bg-white">
        <div className="max-w-5xl mx-auto px-3.5 sm:px-6">

          {/* Heading */}
          <h2 className="text-lg sm:text-2xl font-black text-[#081C36] mb-3.5 sm:mb-5 tracking-tight">
            Why Choose Us?
          </h2>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-4 md:gap-5">

            {/* 1. Trusted & Verified */}
            <div className="bg-white rounded-2xl p-2 sm:p-4 border border-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.03)] text-center flex flex-col items-center justify-center gap-1 sm:gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="#C8960C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span className="text-[8px] sm:text-xs font-bold text-[#081C36] leading-tight">
                Trusted &amp; Verified
              </span>
            </div>

            {/* 2. Quality Service */}
            <div className="bg-white rounded-2xl p-2 sm:p-4 border border-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.03)] text-center flex flex-col items-center justify-center gap-1 sm:gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-8 sm:h-8" fill="#C8960C">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-[8px] sm:text-xs font-bold text-[#081C36] leading-tight">
                Quality Service
              </span>
            </div>

            {/* 3. Quick Hiring */}
            <div className="bg-white rounded-2xl p-2 sm:p-4 border border-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.03)] text-center flex flex-col items-center justify-center gap-1 sm:gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="#C8960C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="text-[8px] sm:text-xs font-bold text-[#081C36] leading-tight">
                Quick Hiring
              </span>
            </div>

            {/* 4. 24/7 Support */}
            <div className="bg-white rounded-2xl p-2 sm:p-4 border border-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.03)] text-center flex flex-col items-center justify-center gap-1 sm:gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="#C8960C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
              <span className="text-[8px] sm:text-xs font-bold text-[#081C36] leading-tight">
                24/7 Support
              </span>
            </div>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          5. PEOPLE YOU CAN TRUST BANNER
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#EDF3FA]">
        
        {/* City skyline illustration background */}
        <div
          className="absolute inset-0 bg-repeat-x bg-bottom opacity-25 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 200' fill='%236080A0'%3E%3Cpath d='M0 200V130h20v-30h15v-40h10v-20h5v-15h2v-10h2v10h2v15h5v20h10v40h15v30h20v-50h30v-60h15v-30h10v30h15v60h30v50h15v-70h25v-40h10v-30h2v-15h2v15h2v30h10v40h25v70h20v-40h15v-60h20v-50h10v-20h2v-10h2v10h2v20h10v50h20v60h15v40h20v-80h30v-40h15v40h30v80h10v-50h20v-60h25v-30h10v30h25v60h20v50h20v-90h30v-50h15v-30h2v-10h2v10h2v30h15v50h30v90h15v-40h25v-60h20v60h25v40h10v-70h30v-50h15v50h30v70h15v-45h20v-55h15v-35h5v-15h2v-10h2v10h2v15h5v35h15v55h20v45h25v-60h30v60h100V200H0z'/%3E%3C/svg%3E")`,
            backgroundSize: '800px 140px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-9 flex flex-row items-center justify-between gap-3">

          {/* Left Text */}
          <div>
            <h2 className="text-base sm:text-2xl lg:text-3xl font-black text-[#081C36] mb-0.5">
              People You Can Trust
            </h2>
            <p className="text-slate-600 text-[10px] sm:text-sm font-medium mb-2">
              For Homes, Offices and Beyond
            </p>
            {/* Gold bar underline */}
            <div className="w-9 sm:w-14 h-1 bg-[#C8960C] rounded-full" />
          </div>

          {/* Right Quote Badge */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-xl py-2 px-3 sm:py-3 sm:px-6 border border-amber-200 shadow-sm text-right shrink-0">
            <span
              className="text-[#081C36] font-bold leading-tight block"
              style={{
                fontFamily: "'Caveat', 'Dancing Script', cursive",
                fontSize: 'clamp(0.9rem, 2.8vw, 1.5rem)'
              }}
            >
              "Your Comfort<br />Our Priority"
            </span>
          </div>

        </div>
      </section>

      {/* Spacing for mobile bottom nav */}
      <div className="h-16 md:hidden" />
    </>
  );
};

export default HomePage;
