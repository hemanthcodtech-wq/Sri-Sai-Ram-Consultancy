import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck, 
  Users, 
  HeartHandshake, 
  Star,
  Zap,
  Award,
  Sparkles,
  Clock,
  Car,
  Truck,
  Compass,
  MapPin,
  Check
} from 'lucide-react';
import SEOHead from '../../components/public/SEOHead';
import Typewriter from '../../components/public/Typewriter';
import TrustBadgeBar from '../../components/public/TrustBadgeBar';
import ComparisonTable from '../../components/public/ComparisonTable';
import ScrollReveal from '../../components/public/ScrollReveal';

// High-Definition 3D Visual Assets (Porter / Rapido / NxtWave Style)
import bannerBg from '../../assets/banner_bg_clean.png';
import visualDriver from '../../assets/visual_driver.jpg';
import visualHelper from '../../assets/visual_helper.jpg';
import visualCaptain from '../../assets/visual_captain.jpg';
import visualSafety from '../../assets/visual_safety.jpg';
import visualProcess from '../../assets/visual_process.jpg';

const HomePage = () => {
  const phoneRaw = import.meta.env.VITE_COMPANY_PHONE_RAW || '9505151527';
  const whatsappRaw = import.meta.env.VITE_COMPANY_WHATSAPP || '919505151527';

  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Quick Call or WhatsApp Inquiry',
      desc: 'Tell us your requirement — Driver, Helper, or Captain — with duty hours (4hr, 8hr, 12hr or monthly).',
      badge: 'Takes < 60 Seconds',
    },
    {
      num: '02',
      title: 'Verified Staff Profile Matching',
      desc: 'We match background-verified, police-cleared personnel suited to your vehicle model and specific task.',
      badge: '100% Background Verified',
    },
    {
      num: '03',
      title: 'Punctual Dispatch & 5-Star Service',
      desc: 'Staff arrives on time with uniform and ID credentials. Enjoy peaceful, safe, and professional assistance.',
      badge: 'Zero Hidden Charges',
    },
  ];

  return (
    <>
      <SEOHead
        title="Sri Sai Ram Consultancy - Premium Captain, Driver & Helper Staffing"
        description="Sri Sai Ram Consultancy (SSRC): 100% Verified Drivers, Logistics Helpers, and Captain Chauffeurs in Hyderabad LB Nagar. Call +91 95051 51527."
      />

      {/* ═══════════════════════════════════════════
          1. HERO BANNER — Panoramic Width with Reactive Typewriter & Floating Badges
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#FFFDF9] overflow-hidden border-b border-[#F0E5D5]">
        <div className="w-full max-w-[1440px] mx-auto px-1.5 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3">
          <div className="relative overflow-hidden sm:rounded-2xl md:rounded-3xl border-0 sm:border border-[#F0E0C8] shadow-sm sm:shadow-md bg-white aspect-[2.1/1] sm:aspect-[2.25/1] w-full">
            
            {/* Background Image */}
            <img
              src={bannerBg}
              alt="Sri Sai Ram Consultancy - Professional Staffing"
              className="absolute inset-0 w-full h-full object-cover object-[center_right] sm:object-right z-0 pointer-events-none"
            />

            {/* Subtle Gradient Backing for Crisp Typography */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9]/95 via-[#FFFDF9]/75 to-transparent sm:from-[#FFFDF9]/90 sm:via-[#FFFDF9]/45 sm:to-transparent z-1 pointer-events-none max-w-[85%] sm:max-w-[55%]" />

            {/* Banner Foreground Content */}
            <div className="relative z-10 flex flex-col justify-center h-full pl-3.5 sm:pl-7 md:pl-11 lg:pl-16 pr-1 py-1 sm:py-3 max-w-[58%] sm:max-w-[52%] md:max-w-[48%]">
              
              {/* Tagline */}
              <div className="inline-flex items-center gap-1.5 mb-1 sm:mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[7.5px] sm:text-xs md:text-sm font-black uppercase tracking-wider text-[#081C36]/85 leading-tight">
                  TRUSTED PEOPLE FOR A BETTER TOMORROW
                </p>
              </div>

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
              <p className="text-slate-600 text-[8px] sm:text-xs md:text-sm lg:text-base font-medium leading-tight sm:leading-relaxed max-w-[190px] sm:max-w-sm md:max-w-md lg:max-w-lg mb-2 sm:mb-3 md:mb-5">
                Reliable Drivers, Captains &amp; Helpers for Personal, Commercial and VIP Corporate Needs in Hyderabad.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href={`tel:${phoneRaw}`}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2.5 md:px-7 md:py-3 rounded-full bg-gradient-to-r from-[#D98E04] to-[#C8960C] hover:from-[#EAA00A] hover:to-[#D98E04] text-white font-black text-[8.5px] sm:text-xs md:text-sm lg:text-base shadow-md shadow-amber-400/25 transition-all duration-300 hover:scale-[1.03] active:scale-95 whitespace-nowrap"
                >
                  <Phone className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                  <span>Call 9505151527</span>
                </a>

                <a
                  href={`https://wa.me/${whatsappRaw}?text=Hello%20SSRC,%20I%20need%20staffing%20assistance.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs md:text-sm shadow-md transition-all hover:scale-[1.03] active:scale-95 whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Trust Ticker Bar */}
      <TrustBadgeBar />

      {/* ═══════════════════════════════════════════
          2. 3D VISUAL SERVICE CATEGORIES (Porter / Rapido Style)
          ═══════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <ScrollReveal direction="down" duration={650}>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#7C5200] border border-amber-300 text-xs font-black uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                On-Demand &amp; Monthly Staffing
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#081C36] tracking-tight">
                Choose Your Required Staffing Service
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Background-checked, skilled, and punctual personnel ready for instant deployment across Hyderabad &amp; LB Nagar.
              </p>
            </div>
          </ScrollReveal>

          {/* 3 Visual Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Card 1: DRIVERS */}
            <ScrollReveal direction="up" delay={0} duration={650} className="h-full">
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-slate-100 hover:border-amber-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group h-full">
                <div className="p-2 sm:p-3 bg-gradient-to-b from-blue-50 to-white">
                  <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-100">
                    <img
                      src={visualDriver}
                      alt="Professional Chauffeur Driver"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                      Most Popular
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-[#081C36] text-xs font-black px-3 py-1.5 rounded-xl shadow-lg border border-slate-200">
                      ⚡ Verified &amp; On-Demand
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Car className="w-5 h-5 text-blue-600" />
                      <h3 className="text-2xl font-black text-[#081C36] group-hover:text-[#C8960C] transition-colors">
                        Professional Drivers
                      </h3>
                    </div>
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      Steers with Responsibility
                    </p>
                    <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
                      Verified drivers for hatchbacks, luxury sedans, and SUVs. Ideal for daily office commutes, night driving, outstation trips, and airport transfers.
                    </p>

                    <div className="space-y-2 pt-3 text-xs text-slate-700 font-semibold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Valid Commercial/LMV Badge &amp; Clean Record</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Automatic &amp; Manual Transmission Mastery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>4-Hr, 8-Hr, 12-Hr &amp; Monthly Retainers</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                    <a
                      href={`tel:${phoneRaw}`}
                      className="flex-1 py-3 rounded-xl bg-[#081C36] hover:bg-[#0B2545] text-white text-xs font-black text-center shadow-md transition-all"
                    >
                      Call to Book
                    </a>
                    <a
                      href={`https://wa.me/${whatsappRaw}?text=Hi%20SSRC,%20I%20want%20to%20hire%20a%20Driver.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 text-xs font-black text-center transition-all flex items-center justify-center gap-1"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2: HELPERS */}
            <ScrollReveal direction="up" delay={150} duration={650} className="h-full">
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-slate-100 hover:border-amber-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group h-full">
                <div className="p-2 sm:p-3 bg-gradient-to-b from-emerald-50 to-white">
                  <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-100">
                    <img
                      src={visualHelper}
                      alt="Verified All-Purpose Helpers"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                      All-Purpose Support
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-[#081C36] text-xs font-black px-3 py-1.5 rounded-xl shadow-lg border border-slate-200">
                      ⚡ Flexible Shifts &amp; Monthly
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-2xl font-black text-[#081C36] group-hover:text-[#C8960C] transition-colors">
                        Helpers
                      </h3>
                    </div>
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      Supports with Dedication
                    </p>
                    <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
                      Reliable manpower for all types of needs — household &amp; domestic help, house shifting &amp; relocation, office assistance, godown loading/unloading, event setup, and general tasks.
                    </p>

                    <div className="space-y-2 pt-3 text-xs text-slate-700 font-semibold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Household, Domestic &amp; Moving Assistance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Office, Store &amp; Warehouse Floor Support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Individual Helpers or Dedicated Crew Teams</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                    <a
                      href={`tel:${phoneRaw}`}
                      className="flex-1 py-3 rounded-xl bg-[#081C36] hover:bg-[#0B2545] text-white text-xs font-black text-center shadow-md transition-all"
                    >
                      Call to Book
                    </a>
                    <a
                      href={`https://wa.me/${whatsappRaw}?text=Hi%20SSRC,%20I%20need%20Helpers%20assistance.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 text-xs font-black text-center transition-all flex items-center justify-center gap-1"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3: CAPTAINS */}
            <ScrollReveal direction="up" delay={300} duration={650} className="h-full">
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-slate-100 hover:border-amber-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group h-full">
                <div className="p-2 sm:p-3 bg-gradient-to-b from-amber-50 to-white">
                  <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-100">
                    <img
                      src={visualCaptain}
                      alt="Executive Chauffeur Captain"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Executive VIP</span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-[#081C36] text-xs font-black px-3 py-1.5 rounded-xl shadow-lg border border-slate-200">
                      ⚡ Executive Protocol Chauffeur
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Compass className="w-5 h-5 text-amber-600" />
                      <h3 className="text-2xl font-black text-[#081C36] group-hover:text-[#C8960C] transition-colors">
                        Executive Captains
                      </h3>
                    </div>
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      Leads with Confidence
                    </p>
                    <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
                      Elite corporate chauffeurs for CEOs, VIP delegations, luxury hotel guest escorts, and outstation executive trips. Impeccably groomed and protocol-trained.
                    </p>

                    <div className="space-y-2 pt-3 text-xs text-slate-700 font-semibold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>8+ Years Flawless Executive Driving Record</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Corporate Etiquette, Multilingual &amp; Discreet</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Mercedes, BMW, Audi, Fortuner Luxury Handling</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                    <a
                      href={`tel:${phoneRaw}`}
                      className="flex-1 py-3 rounded-xl bg-[#081C36] hover:bg-[#0B2545] text-white text-xs font-black text-center shadow-md transition-all"
                    >
                      Call to Book
                    </a>
                    <a
                      href={`https://wa.me/${whatsappRaw}?text=Hi%20SSRC,%20I%20need%20an%20Executive%20Captain%20Chauffeur.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 text-xs font-black text-center transition-all flex items-center justify-center gap-1"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. HOW IT WORKS (Visual 3-Step Rapid Workflow)
          ═══════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left 3D Visual Graphic */}
            <div className="lg:col-span-6">
              <ScrollReveal direction="right" duration={700}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300/60 bg-white group">
                  <img
                    src={visualProcess}
                    alt="SSRC 3-Step Rapid Staffing Process"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-[#081C36]/90 backdrop-blur-md text-amber-300 border border-amber-400/40 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg">
                    ⚡ 15-Minute Fast Matching
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Steps Flow */}
            <div className="lg:col-span-6 space-y-6">
              <ScrollReveal direction="left" duration={650}>
                <div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-[#7C5200] border border-amber-300 text-xs font-black uppercase tracking-wider mb-2">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Effortless Booking
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#081C36] tracking-tight">
                    How Sri Sai Ram Consultancy Works
                  </h2>
                  <p className="text-slate-600 text-sm mt-2">
                    From inquiry to verified personnel at your doorstep in 3 seamless steps.
                  </p>
                </div>
              </ScrollReveal>

              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <ScrollReveal key={idx} direction="left" delay={idx * 120} duration={600}>
                    <div
                      onClick={() => setActiveStep(idx)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                        activeStep === idx
                          ? 'bg-amber-50/70 border-[#C8960C] shadow-md'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                            activeStep === idx
                              ? 'bg-[#081C36] text-amber-400 shadow-md'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {step.num}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-[#081C36] text-base">
                              {step.title}
                            </h4>
                            <span className="text-[10px] font-bold bg-amber-200/80 text-amber-950 px-2.5 py-0.5 rounded-full">
                              {step.badge}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal direction="up" delay={360} duration={600}>
                <div className="pt-2 flex items-center gap-3">
                  <a
                    href={`tel:${phoneRaw}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
                  >
                    <Phone className="w-4 h-4 text-slate-950" />
                    <span>Call to Book Now</span>
                  </a>
                </div>
              </ScrollReveal>

            </div>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. 5-STAR SAFETY & VERIFICATION SHOWCASE
          ═══════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-gradient-to-br from-[#081C36] via-[#0B2545] to-[#081C36] text-white relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <ScrollReveal direction="left" duration={650}>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  100% Background Check Guarantee
                </span>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mt-3">
                  Your Safety &amp; Trust Are Our Non-Negotiable Standard
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-2">
                  Before any driver, helper, or captain is assigned to your family or business, they undergo a stringent 4-level credential check.
                </p>
              </ScrollReveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <ScrollReveal direction="up" delay={0} duration={600}>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 h-full">
                    <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                      1
                    </div>
                    <h4 className="font-extrabold text-white text-sm">Police &amp; Court Records</h4>
                    <p className="text-xs text-slate-300">Criminal history, court verification &amp; clean police record check.</p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={120} duration={600}>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 h-full">
                    <div className="w-8 h-8 rounded-lg bg-blue-400 text-slate-950 flex items-center justify-center font-black">
                      2
                    </div>
                    <h4 className="font-extrabold text-white text-sm">Aadhaar &amp; Address KYC</h4>
                    <p className="text-xs text-slate-300">Biometric Aadhaar confirmation with verified local residence proof.</p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={240} duration={600}>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 h-full">
                    <div className="w-8 h-8 rounded-lg bg-emerald-400 text-slate-950 flex items-center justify-center font-black">
                      3
                    </div>
                    <h4 className="font-extrabold text-white text-sm">Practical Driving &amp; Skill Test</h4>
                    <p className="text-xs text-slate-300">Rigorous road evaluation in heavy traffic and highway maneuvering.</p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={360} duration={600}>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 h-full">
                    <div className="w-8 h-8 rounded-lg bg-purple-400 text-slate-950 flex items-center justify-center font-black">
                      4
                    </div>
                    <h4 className="font-extrabold text-white text-sm">Protocol &amp; Grooming Code</h4>
                    <p className="text-xs text-slate-300">Strict zero-alcohol tolerance, polite demeanor &amp; client privacy code.</p>
                  </div>
                </ScrollReveal>
              </div>

            </div>

            {/* Right 3D Visual */}
            <div className="lg:col-span-6">
              <ScrollReveal direction="right" duration={700}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400/40 bg-white/5 backdrop-blur-md group">
                  <img
                    src={visualSafety}
                    alt="100% Background Check Guarantee"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. PORTER-STYLE COMPARISON TABLE
          ═══════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" duration={700}>
            <ComparisonTable />
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. HIGH-CONVERSION CTA BAR
          ═══════════════════════════════════════════ */}
      <section className="py-12 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 shadow-xl border-y border-amber-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" duration={650}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 bg-amber-300/80 px-3 py-1 rounded-full border border-amber-600/20">
                  ⚡ Need Staff Today?
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 mt-2 tracking-tight">
                  Call Now for Instant Matching &amp; Fast Dispatch
                </h3>
                <p className="text-slate-900 font-semibold text-xs sm:text-sm mt-1">
                  Beside Reliance Market, Jama Thota Sagar Ring Road, LB Nagar, Hyderabad.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={`tel:${phoneRaw}`}
                  className="px-6 py-3.5 rounded-2xl bg-[#081C36] hover:bg-[#0B2545] text-white font-black text-sm shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call +91 95051 51527</span>
                </a>
                <a
                  href={`https://wa.me/${whatsappRaw}?text=Hi%20SSRC,%20I%20need%20urgent%20staffing%20assistance.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
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
