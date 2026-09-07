import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEOHead from '../../components/public/SEOHead';
import Typewriter from '../../components/public/Typewriter';
import heroStaff from '../../assets/hero_staff.jpg';
import driverIcon from '../../assets/icon_driver.png';
import captainIcon from '../../assets/icon_captain.png';
import helperIcon from '../../assets/icon_helper.png';

const HomePage = () => {
  const phoneRaw = import.meta.env.VITE_COMPANY_PHONE_RAW || '9505151527';

  return (
    <>
      <SEOHead
        title="Sri Sai Ram Consultancy - Premium Captain, Driver & Helper Staffing"
        description="Sri Sai Ram Consultancy: Verified Drivers, Helpers, and Captain Chauffeurs in Hyderabad LB Nagar. Call +91 95051 51527."
      />

      {/* ═══════════════════════════════════════════
          1. HERO BANNER — Responsive Coded Banner with Typewriter
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#FFFDF9] overflow-hidden border-b border-[#F0E5D5]">
        <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 py-0 sm:py-3 md:py-4">
          <div className="relative overflow-hidden sm:rounded-2xl md:rounded-3xl bg-gradient-to-r from-[#F7FAFD] via-[#FCFDFE] to-[#F3F7FC] border-0 sm:border border-slate-100 shadow-sm sm:shadow-md">
            
            {/* Dynamic Gold Light Accents */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-row items-stretch min-h-[220px] sm:min-h-[300px] md:min-h-[380px] lg:min-h-[440px]">

              {/* ── Left Column: Text & Typewriter CTA ── */}
              <div className="w-[50%] sm:w-[48%] md:w-[46%] pl-3.5 pr-1.5 sm:pl-8 sm:pr-4 md:pl-12 py-3.5 sm:py-6 md:py-10 flex flex-col justify-center z-10">
                
                {/* Tagline */}
                <p className="text-[8px] sm:text-[11px] md:text-xs font-extrabold uppercase tracking-wider text-[#081C36]/80 mb-1 sm:mb-2 leading-tight">
                  TRUSTED PEOPLE FOR<br className="sm:hidden" /> A BETTER TOMORROW
                </p>

                {/* Main Heading with Typewriter */}
                <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black leading-[1.08] mb-1.5 sm:mb-3">
                  <span className="text-[#081C36] block">Your Needs</span>
                  <span className="block min-h-[1.2em]">
                    <Typewriter
                      phrases={['Our People', 'Expert Drivers', 'Elite Captains', 'Verified Helpers']}
                      className="text-[#C8960C]"
                    />
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-slate-600 text-[8.5px] sm:text-xs md:text-sm lg:text-base font-medium leading-snug sm:leading-relaxed max-w-[190px] sm:max-w-sm mb-2.5 sm:mb-5">
                  Reliable Drivers, Captains &amp; Helpers for Your Personal and Professional Needs.
                </p>

                {/* Get Started Pill Button */}
                <div className="flex items-center">
                  <a
                    href={`tel:${phoneRaw}`}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-6 sm:py-2.5 rounded-full bg-gradient-to-r from-[#D98E04] to-[#C8960C] hover:from-[#EAA00A] hover:to-[#D98E04] text-white font-bold text-[10px] sm:text-xs md:text-sm shadow-md shadow-amber-400/25 transition-all duration-300 hover:scale-[1.03] active:scale-95 whitespace-nowrap"
                  >
                    Get Started <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </a>
                </div>

                {/* Carousel Indicators (1 Navy, 2 Grey) */}
                <div className="flex items-center gap-1 sm:gap-1.5 mt-2.5 sm:mt-5">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#081C36]" />
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-300" />
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-300" />
                </div>
              </div>

              {/* ── Right Column: Hero Staff Photo with Golden Sweeping Ribbon Cut ── */}
              <div className="w-[50%] sm:w-[52%] md:w-[54%] relative overflow-hidden flex items-end justify-end">
                
                {/* Top-Right Golden Ribbon */}
                <div
                  className="absolute top-0 right-0 w-36 sm:w-72 h-36 sm:h-72 bg-gradient-to-bl from-amber-400/40 via-amber-200/25 to-transparent pointer-events-none z-10"
                  style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
                />

                {/* Diagonal Gold Ribbon separator on left of photo */}
                <div
                  className="absolute inset-y-0 left-0 w-10 sm:w-20 z-10 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom right, #F7FAFD 40%, rgba(200, 150, 12, 0.7) 45%, rgba(250, 220, 140, 0.9) 48%, transparent 54%)'
                  }}
                />

                {/* Staff Photo */}
                <img
                  src={heroStaff}
                  alt="Sri Sai Ram Consultancy Staffing Team"
                  className="w-full h-full object-cover object-top relative z-0"
                />

                {/* Bottom Diagonal Ribbon Sweep */}
                <div
                  className="absolute -bottom-3 -right-6 w-[120%] h-14 sm:h-20 md:h-24 z-20 pointer-events-none"
                  style={{
                    background: 'linear-gradient(174deg, transparent 25%, rgba(200, 150, 12, 0.95) 28%, #FFFFFF 42%)',
                    transform: 'rotate(-3deg)'
                  }}
                />

                {/* "Your Dreams... Our Guidance..." Script */}
                <div className="absolute bottom-1 right-2 sm:bottom-2 sm:right-5 z-30 text-right pointer-events-none">
                  <span
                    className="font-bold text-[#081C36] leading-none block drop-shadow-sm"
                    style={{
                      fontFamily: "'Caveat', 'Dancing Script', cursive",
                      fontSize: 'clamp(0.85rem, 2.5vw, 1.4rem)'
                    }}
                  >
                    Your Dreams...<br />Our Guidance...
                  </span>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          2. OUR SERVICES (Drivers, Captains, Helpers)
          ═══════════════════════════════════════════ */}
      <section className="py-5 sm:py-8 bg-white">
        <div className="max-w-5xl mx-auto px-3.5 sm:px-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-3.5 sm:mb-5">
            <h2 className="text-lg sm:text-2xl font-black text-[#081C36] tracking-tight">
              Our Services
            </h2>
            <Link
              to="/services"
              className="text-xs sm:text-sm font-bold text-[#081C36] hover:text-[#C8960C] flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3 Services Cards Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">

            {/* 1. DRIVERS */}
            <div className="bg-white rounded-2xl p-2.5 sm:p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center flex flex-col items-center justify-between hover:shadow-md transition-all group">
              
              <div className="mb-2 sm:mb-3 flex items-center justify-center">
                <img
                  src={driverIcon}
                  alt="Drivers"
                  className="w-14 h-14 sm:w-20 sm:h-20 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="mb-2 sm:mb-3">
                <h3 className="text-xs sm:text-base font-black text-[#081C36] mb-0.5">
                  Drivers
                </h3>
                <p className="text-[8.5px] sm:text-xs text-slate-500 font-medium leading-tight">
                  Safe &amp; Reliable<br />Drivers
                </p>
              </div>

              <Link
                to="/services"
                className="inline-flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-[#FEF7E6] hover:bg-[#FDECC8] text-[#B27500] font-bold text-[9px] sm:text-xs transition-colors w-full justify-center"
              >
                Know More <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </Link>
            </div>

            {/* 2. CAPTAINS */}
            <div className="bg-white rounded-2xl p-2.5 sm:p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center flex flex-col items-center justify-between hover:shadow-md transition-all group">
              
              <div className="mb-2 sm:mb-3 flex items-center justify-center">
                <img
                  src={captainIcon}
                  alt="Captains"
                  className="w-14 h-14 sm:w-20 sm:h-20 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="mb-2 sm:mb-3">
                <h3 className="text-xs sm:text-base font-black text-[#081C36] mb-0.5">
                  Captains
                </h3>
                <p className="text-[8.5px] sm:text-xs text-slate-500 font-medium leading-tight">
                  Experienced<br />Professionals
                </p>
              </div>

              <Link
                to="/services"
                className="inline-flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-[#FEF7E6] hover:bg-[#FDECC8] text-[#B27500] font-bold text-[9px] sm:text-xs transition-colors w-full justify-center"
              >
                Know More <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </Link>
            </div>

            {/* 3. HELPERS */}
            <div className="bg-white rounded-2xl p-2.5 sm:p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center flex flex-col items-center justify-between hover:shadow-md transition-all group">
              
              <div className="mb-2 sm:mb-3 flex items-center justify-center">
                <img
                  src={helperIcon}
                  alt="Helpers"
                  className="w-14 h-14 sm:w-20 sm:h-20 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="mb-2 sm:mb-3">
                <h3 className="text-xs sm:text-base font-black text-[#081C36] mb-0.5">
                  Helpers
                </h3>
                <p className="text-[8.5px] sm:text-xs text-slate-500 font-medium leading-tight">
                  Home &amp; Office<br />Support
                </p>
              </div>

              <Link
                to="/services"
                className="inline-flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-[#FEF7E6] hover:bg-[#FDECC8] text-[#B27500] font-bold text-[9px] sm:text-xs transition-colors w-full justify-center"
              >
                Know More <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </Link>
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
