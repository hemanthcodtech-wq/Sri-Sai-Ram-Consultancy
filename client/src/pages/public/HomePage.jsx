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
import ComparisonTable from '../../components/public/ComparisonTable';
import ScrollReveal from '../../components/public/ScrollReveal';

// High-Definition 3D Visual Assets (Porter / Rapido / NxtWave Style)
import ssrcHeroLuxury from '../../assets/ssrc_hero_luxury.jpg';
import ssrcMobileTeam from '../../assets/ssrc_mobile_team.jpg';
import visualDriver from '../../assets/visual_driver.jpg';
import visualHelper from '../../assets/visual_helper.jpg';
import visualCaptain from '../../assets/visual_captain.jpg';
import visualSafety from '../../assets/visual_safety.jpg';

const HomePage = () => {
  const phoneRaw = import.meta.env.VITE_COMPANY_PHONE_RAW || '9505151527';
  const whatsappRaw = import.meta.env.VITE_COMPANY_WHATSAPP || '919505151527';

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
        title="Sri Sai Ram Consultancy | Premium Captain, Driver & Helper Staffing Services"
        description="Sri Sai Ram Consultancy (SSRC): 100% Background-verified Drivers, Logistics Helpers, and Captain Chauffeurs in Hyderabad LB Nagar. Call +91 95051 51527 for instant dispatch."
        keywords="Sri Sai Ram Consultancy, 9505151527, Driver hiring Hyderabad, Helper staffing LB Nagar, Captain chauffeurs Hyderabad, corporate driver services, household drivers LB Nagar, verified helper staffing"
        canonical="https://srisairamconsultancy.com/"
        schema={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              '@id': 'https://srisairamconsultancy.com/#website',
              'url': 'https://srisairamconsultancy.com/',
              'name': 'Sri Sai Ram Consultancy',
              'description': 'Premium Captain, Driver & Helper Staffing Services in Hyderabad',
              'publisher': {
                '@id': 'https://srisairamconsultancy.com/#agency',
              },
            },
            {
              '@type': 'EmploymentAgency',
              '@id': 'https://srisairamconsultancy.com/#agency',
              'name': 'Sri Sai Ram Consultancy',
              'url': 'https://srisairamconsultancy.com',
              'logo': 'https://srisairamconsultancy.com/favicon.svg',
              'image': 'https://srisairamconsultancy.com/og-image.png',
              'telephone': '+91 95051 51527',
              'email': 'info@srisairamconsultancy.com',
              'address': {
                '@type': 'PostalAddress',
                'streetAddress': 'Beside Reliance Market, Jama Thota Sagar Ring Road, LB Nagar',
                'addressLocality': 'Hyderabad',
                'addressRegion': 'Telangana',
                'postalCode': '500074',
                'addressCountry': 'IN',
              },
              'priceRange': '₹₹',
              'areaServed': ['Hyderabad', 'Secunderabad', 'Telangana'],
            },
          ],
        }}
      />

      {/* ═══════════════════════════════════════════
          1. HERO BANNER — Luxury Reference Typography & Perfectly Balanced Layout
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#FAF8F5] overflow-hidden border-b border-[#F0E5D5]">
        <div className="w-full max-w-[1440px] mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-6">
          
          {/* ──── MOBILE VIEW (< md) ──── */}
          <div className="block md:hidden">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#F0E0C8] shadow-lg bg-[#FFFDF9] p-4.5 sm:p-6 flex flex-col justify-between">
              
              {/* Tagline */}
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#0A2540] leading-snug mb-1">
                TRUSTED PEOPLE FOR A BETTER TOMORROW
              </p>

              {/* Main Heading with Typewriter */}
              <h1 className="text-3xl font-black leading-[1.08] tracking-tight">
                <span className="text-[#0A2540] block">Your Needs</span>
                <span className="block min-h-[1.2em]">
                  <Typewriter
                    phrases={['Elite Captains', 'Expert Drivers', 'Verified Helpers', 'Our People']}
                    className="text-[#C88A1A]"
                  />
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 font-medium text-xs leading-relaxed mt-1 mb-3">
                Reliable Drivers, Captains &amp; Helpers for Your Personal and Professional Needs.
              </p>

              {/* Visual Banner Showcase */}
              <div className="relative rounded-2xl overflow-hidden my-1 border border-[#ECDCC4] shadow-md aspect-[16/9] bg-slate-100">
                <img
                  src={ssrcMobileTeam}
                  alt="Sri Sai Ram Consultancy - Professional Staffing"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm text-[#0A2540] text-[10px] font-black px-2.5 py-1 rounded-full shadow border border-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>4.9 / 5.0 Rating</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-[#0A2540] text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>100% Police Verified</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3">
                <a
                  href={`tel:${phoneRaw}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#D98E04] to-[#C88A1A] hover:from-[#EAA00A] hover:to-[#D98E04] text-white font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all text-center whitespace-nowrap"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </a>

                <a
                  href={`https://wa.me/${whatsappRaw}?text=Hi%20Sri%20Sai%20Ram%20Consultancy,%20I%20need%20staffing%20assistance.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center justify-center gap-2 pt-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0A2540]" />
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="w-2 h-2 rounded-full bg-slate-300" />
              </div>

            </div>
          </div>

          {/* ──── DESKTOP / LAPTOP VIEW (>= md) ──── */}
          <div className="hidden md:flex relative overflow-hidden rounded-3xl border border-[#F0E0C8] shadow-xl bg-[#FFFDF9] min-h-[480px] lg:min-h-[540px] items-center">
            
            {/* Background Image / Team Graphic */}
            <img
              src={ssrcHeroLuxury}
              alt="Sri Sai Ram Consultancy - Professional Staffing"
              className="absolute inset-0 w-full h-full object-cover object-right z-0 pointer-events-none"
            />

            {/* Crisp Gradient Backing to preserve clear text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/95 to-transparent z-[1] pointer-events-none w-full max-w-[56%]" />

            {/* Banner Foreground Content */}
            <div className="relative z-10 flex flex-col justify-center h-full pl-10 md:pl-14 lg:pl-16 pr-4 py-10 md:py-14 max-w-[54%] space-y-4 md:space-y-5">
              
              {/* Tagline */}
              <p className="text-xs md:text-sm font-extrabold uppercase tracking-[0.18em] text-[#0A2540] leading-snug">
                TRUSTED PEOPLE FOR A BETTER TOMORROW
              </p>

              {/* Main Heading with Typewriter */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-[#0A2540]">
                <span>Your Needs</span>
                <span className="block min-h-[1.2em]">
                  <Typewriter
                    phrases={['Elite Captains', 'Expert Drivers', 'Verified Helpers', 'Our People']}
                    className="text-[#C88A1A]"
                  />
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 font-medium text-sm md:text-base lg:text-lg leading-relaxed max-w-md md:max-w-lg">
                Reliable Drivers, Captains &amp; Helpers for Your Personal and Professional Needs in Hyderabad &amp; LB Nagar.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={`tel:${phoneRaw}`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#D98E04] to-[#C88A1A] hover:from-[#EAA00A] hover:to-[#D98E04] text-white font-black text-base shadow-lg shadow-amber-500/25 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </a>

                <a
                  href={`https://wa.me/${whatsappRaw}?text=Hi%20Sri%20Sai%20Ram%20Consultancy,%20I%20need%20staffing%20assistance.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center gap-2 pt-2">
                <span className="w-3 h-3 rounded-full bg-[#0A2540]" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. 3D VISUAL SERVICE CATEGORIES (Porter / Rapido Style)
          ═══════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <ScrollReveal direction="up" duration={600}>
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
          3. HOW IT WORKS (3-Step Rapid Workflow)
          ═══════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal direction="up" duration={600}>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-[#7C5200] border border-amber-300 text-xs font-black uppercase tracking-wider mb-2">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Effortless Booking
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#081C36] tracking-tight">
                How Sri Sai Ram Consultancy Works
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                From inquiry to verified personnel at your doorstep in 3 seamless steps.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">
            {steps.map((step, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 150} duration={600} className="h-full">
                <div
                  className="p-6 rounded-2xl border-2 bg-slate-50/80 border-slate-200 hover:border-[#C8960C] hover:bg-amber-50/40 hover:shadow-lg transition-all h-full flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-[#081C36] text-amber-400 font-black text-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        {step.num}
                      </div>
                      <span className="text-[11px] font-bold bg-amber-200/80 text-amber-950 px-3 py-1 rounded-full border border-amber-300">
                        {step.badge}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#081C36] text-lg mb-2">
                        {step.title}
                      </h4>
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
            <div className="mt-10 flex items-center justify-center gap-3">
              <a
                href={`tel:${phoneRaw}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <Phone className="w-4 h-4 text-slate-950" />
                <span>Call to Book Now</span>
              </a>
            </div>
          </ScrollReveal>

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
