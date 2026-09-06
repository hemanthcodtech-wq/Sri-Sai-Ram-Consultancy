import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Users, 
  HeartHandshake, 
  Star, 
  CheckCircle2, 
  Award,
  Sparkles,
  Clock,
  Car,
  Truck,
  Compass,
  MapPin,
  Check,
  Zap,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import SEOHead from '../../components/public/SEOHead';
import Typewriter from '../../components/public/Typewriter';
import CounterAnimation from '../../components/public/CounterAnimation';
import HeroRelativeGraphic from '../../components/public/HeroRelativeGraphic';
import ScrollReveal from '../../components/public/ScrollReveal';

const HomePage = () => {
  const phoneRaw = import.meta.env.VITE_COMPANY_PHONE_RAW || '9505151527';
  const whatsappRaw = import.meta.env.VITE_COMPANY_WHATSAPP || '919505151527';
  const address = import.meta.env.VITE_COMPANY_ADDRESS || 'Beside Reliance Market, Jama Thota Sagar Ring Road, Hyderabad LB Nagar';

  const defaultWhatsappMsg = encodeURIComponent(
    'Hello Sri Sai Ram Consultancy! I would like to inquire about Driver / Helper / Captain services.'
  );

  return (
    <>
      <SEOHead
        title="Sri Sai Ram Consultancy - Premium Captain, Driver & Helper Staffing"
        description="Sri Sai Ram Consultancy: Verified Drivers, Helpers, and Captain Chauffeurs in Hyderabad LB Nagar. Contact us via Call or WhatsApp for instant service."
      />

      {/* HERO BANNER SECTION - CONTAINED CARD LAYOUT WITH RELATIVE GRAPHIC */}
      <section className="bg-[#FAF6EF] py-8 sm:py-12 border-b border-[#EADFCF] relative overflow-hidden">
        
        {/* Subtle ambient decorative glows */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-amber-200/35 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100/50 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <ScrollReveal direction="zoom" duration={800}>
            {/* Main Hero Contained Card Box */}
            <div className="bg-[#FFFDFA] rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#EFE5D5] shadow-2xl shadow-amber-900/5 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              
              {/* Left Content Side */}
              <div className="flex-1 text-left space-y-5 sm:space-y-6 max-w-2xl">
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/70 text-[#92400E] text-xs sm:text-sm font-extrabold tracking-wide shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#D97706] animate-spin-slow" />
                  <span>Sri Sai Ram Consultancy • LB Nagar, Hyderabad</span>
                </div>

                {/* Typewriter Banner Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B1E36] tracking-tight leading-[1.12]">
                  Everything Your <br />
                  <Typewriter 
                    phrases={[
                      'Driver Staffing,',
                      'Helper Manpower,',
                      'Executive Captains,',
                      'Staffing Needs,'
                    ]}
                    speed={90}
                    deleteSpeed={45}
                    pause={2000}
                  /> <br />
                  Near You!
                </h1>

                <p className="text-slate-600 text-sm sm:text-base lg:text-lg font-medium leading-relaxed max-w-xl">
                  Hire 100% police-verified Drivers, dedicated Helpers, and executive Captain Chauffeurs. Fast dispatch, complete reliability & zero stress near you.
                </p>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                  <a
                    href={`tel:${phoneRaw}`}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E59800] via-amber-400 to-[#E59800] hover:from-[#d48c00] hover:to-[#d48c00] text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] inline-flex items-center gap-2.5"
                  >
                    <Phone className="w-5 h-5 text-slate-950" />
                    <span>Call Now</span>
                  </a>

                  <a
                    href={`https://wa.me/${whatsappRaw}?text=${defaultWhatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-600/25 transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] inline-flex items-center gap-2.5"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp Us</span>
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-600 font-semibold">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>100% Police Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>4.9 / 5 Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>15 Mins Dispatch</span>
                  </div>
                </div>

              </div>

              {/* Right Visual Relative Graphic Frame */}
              <div className="flex-1 w-full max-w-lg">
                <HeroRelativeGraphic />
              </div>

            </div>
          </ScrollReveal>

          {/* Quick Location Bar below */}
          <ScrollReveal direction="up" delay={200}>
            <div className="mt-4 bg-[#FFFDFA] rounded-2xl p-4 border border-[#EFE5D5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-700 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2.5 text-center sm:text-left">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">Office Location: </span>
                  <span>{address}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-amber-700">
                <a href={`tel:${phoneRaw}`} className="hover:underline flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Call Helpline
                </a>
              </div>
            </div>
          </ScrollReveal>

        </div>

      </section>

      {/* STATS STRIP SECTION - COUNTING NUMBERS RIGHT BELOW HERO BANNER */}
      <section className="bg-[#FFFBF0] text-slate-900 py-12 border-b-2 border-amber-300/80 relative z-10 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" duration={600}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              
              <div className="p-5 bg-white rounded-3xl border border-amber-200/90 shadow-md shadow-amber-900/5 hover:border-amber-400 hover:scale-105 transition-all duration-300">
                <div className="text-3xl sm:text-4xl font-black text-[#D97706]">
                  <CounterAnimation end={500} suffix="+" />
                </div>
                <p className="text-xs text-slate-800 font-extrabold uppercase tracking-wider mt-2">
                  Verified Candidates
                </p>
              </div>

              <div className="p-5 bg-white rounded-3xl border border-amber-200/90 shadow-md shadow-amber-900/5 hover:border-amber-400 hover:scale-105 transition-all duration-300">
                <div className="text-3xl sm:text-4xl font-black text-[#D97706]">
                  <CounterAnimation end={12500} suffix="+" />
                </div>
                <p className="text-xs text-slate-800 font-extrabold uppercase tracking-wider mt-2">
                  Tasks & Duties Logged
                </p>
              </div>

              <div className="p-5 bg-white rounded-3xl border border-amber-200/90 shadow-md shadow-amber-900/5 hover:border-amber-400 hover:scale-105 transition-all duration-300">
                <div className="text-3xl sm:text-4xl font-black text-[#D97706]">
                  <CounterAnimation end={4.9} decimals={1} suffix=" ★" />
                </div>
                <p className="text-xs text-slate-800 font-extrabold uppercase tracking-wider mt-2">
                  Client Satisfaction
                </p>
              </div>

              <div className="p-5 bg-white rounded-3xl border border-amber-200/90 shadow-md shadow-amber-900/5 hover:border-amber-400 hover:scale-105 transition-all duration-300">
                <div className="text-3xl sm:text-4xl font-black text-[#D97706]">
                  <CounterAnimation end={15} suffix=" Mins" />
                </div>
                <p className="text-xs text-slate-800 font-extrabold uppercase tracking-wider mt-2">
                  Quick Response Desk
                </p>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CORE SERVICE CATEGORIES SECTION - WITH ZOOM & HOVER SCALE TRANSITIONS */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal direction="down">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-amber-600 font-extrabold text-xs uppercase tracking-widest bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300">
                Staffing Services
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0B2545] mt-3">
                Our Service Offerings
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Select your required category below and connect directly with our coordinator desk for verified candidate dispatch.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Driver Card with Zoom Effects */}
            <ScrollReveal direction="up" delay={100}>
              <div className="bg-white rounded-3xl p-7 shadow-lg border border-slate-200 hover:border-blue-500 hover:shadow-2xl hover:-translate-y-2.5 transition-all duration-500 ease-out flex flex-col justify-between group h-full">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border-2 border-blue-600 flex items-center justify-center text-blue-700 transition-transform duration-500 group-hover:scale-110">
                    <Car className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                      Professional Driver
                    </h3>
                    <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mt-0.5">
                      Steers with Responsibility
                    </p>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    Carefully vetted drivers with extensive experience handling hatchbacks, luxury sedans, and SUVs. Ideal for city commutes, airport drops, and outstation tasks.
                  </p>

                  <ul className="space-y-2 pt-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Valid Commercial / Transport License</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Thorough Police Verification & KYC</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Full-Day, Night Duty & Monthly Contracts</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${phoneRaw}`}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#0B2545] hover:bg-blue-900 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent('Hello! I want to hire a Driver via Sri Sai Ram Consultancy.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all hover:scale-105"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Helper Card with Zoom Effects */}
            <ScrollReveal direction="up" delay={250}>
              <div className="bg-white rounded-3xl p-7 shadow-lg border border-slate-200 hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-2.5 transition-all duration-500 ease-out flex flex-col justify-between group h-full">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center text-emerald-700 transition-transform duration-500 group-hover:scale-110">
                    <Truck className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      Dedicated Helper
                    </h3>
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mt-0.5">
                      Supports with Dedication
                    </p>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    Trained, energetic manpower for warehouse freight loading/unloading, household relocation packing, event setups, and logistics tasks.
                  </p>

                  <ul className="space-y-2 pt-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Heavy Goods & Fragile Handling Trained</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Reliable & Verified ID Documents</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Shift-Based & Daily Wage Deployments</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${phoneRaw}`}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#0B2545] hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent('Hello! I want to hire a Helper via Sri Sai Ram Consultancy.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all hover:scale-105"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Captain Card with Zoom Effects */}
            <ScrollReveal direction="up" delay={400}>
              <div className="bg-white rounded-3xl p-7 shadow-lg border-2 border-amber-400 hover:shadow-2xl hover:-translate-y-2.5 transition-all duration-500 ease-out flex flex-col justify-between relative group h-full">
                <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  VIP Choice
                </div>

                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border-2 border-amber-600 flex items-center justify-center text-amber-700 transition-transform duration-500 group-hover:scale-110">
                    <Compass className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Captain Chauffeur
                    </h3>
                    <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mt-0.5">
                      Leads with Confidence
                    </p>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    Premium executive chauffeurs for corporate executives, celebrities, long-distance luxury tours, and VIP motorcades. Punctual, uniformed, and discreet.
                  </p>

                  <ul className="space-y-2 pt-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>8+ Years Luxury Fleet Experience</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>VIP Protocol & Route Navigation Master</span>
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
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all hover:scale-105"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent('Hello! I want to hire an Executive Captain via Sri Sai Ram Consultancy.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all hover:scale-105"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* ABOUT SRI SAI RAM CONSULTANCY - LIGHT WARM GOLD CONTRAST SECTION BEFORE FOOTER */}
      <section className="bg-gradient-to-r from-[#FFFBF0] via-[#FAF6EF] to-[#FFFBF0] text-slate-900 py-16 border-t-2 border-amber-400/80 relative overflow-hidden shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal direction="up" duration={700}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-700 shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0B2545]">
                    About Sri Sai Ram Consultancy
                  </h2>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
                  A trusted placement service provider in LB Nagar, Hyderabad, dedicated to connecting skilled and responsible candidates with the right opportunities. Honest guidance, background verification, and dependable support.
                </p>
              </div>

              <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-white border border-amber-200/90 shadow-sm hover:border-amber-400 hover:scale-105 transition-all duration-300">
                  <ShieldCheck className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                  <h5 className="text-xs font-bold text-slate-900">Trusted Service</h5>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-amber-200/90 shadow-sm hover:border-amber-400 hover:scale-105 transition-all duration-300">
                  <Users className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                  <h5 className="text-xs font-bold text-slate-900">Skilled Candidates</h5>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-amber-200/90 shadow-sm hover:border-amber-400 hover:scale-105 transition-all duration-300">
                  <HeartHandshake className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                  <h5 className="text-xs font-bold text-slate-900">100% Support</h5>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-amber-200/90 shadow-sm hover:border-amber-400 hover:scale-105 transition-all duration-300">
                  <Star className="w-5 h-5 mx-auto text-amber-600 mb-1 fill-amber-400" />
                  <h5 className="text-xs font-bold text-slate-900">Your Growth</h5>
                </div>
              </div>

              <div className="lg:col-span-3 text-center lg:text-right space-y-2.5">
                <span className="text-xl font-serif italic text-amber-800 font-bold block">
                  Let's Build Your Future Together
                </span>
                <a
                  href={`tel:${phoneRaw}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
                >
                  <Phone className="w-4 h-4 text-slate-950" />
                  <span>Call Us Today</span>
                </a>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default HomePage;
