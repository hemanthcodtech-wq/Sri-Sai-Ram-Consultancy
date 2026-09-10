import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Truck, 
  Compass, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  Star,
  Award,
  Zap,
  Sparkles,
  Calendar,
  Check,
  MapPin,
  BadgeCheck
} from 'lucide-react';
import SEOHead from '../../components/public/SEOHead';
import ScrollReveal from '../../components/public/ScrollReveal';
import ComparisonTable from '../../components/public/ComparisonTable';

// 3D Visual Assets
import visualDriver from '../../assets/visual_driver.jpg';
import visualHelper from '../../assets/visual_helper.jpg';
import visualCaptain from '../../assets/visual_captain.jpg';

const ServicesPage = () => {
  const phoneRaw = import.meta.env.VITE_COMPANY_PHONE_RAW || '9505151527';
  const whatsappRaw = import.meta.env.VITE_COMPANY_WHATSAPP || '919505151527';

  const [activeTab, setActiveTab] = useState('driver');

  const servicesData = {
    driver: {
      id: 'driver',
      title: 'Professional Driver Services',
      tagline: 'Steers with Responsibility',
      image: visualDriver,
      themeColor: 'blue',
      badge: '100% Background Verified',
      description:
        'Carefully vetted, background-verified personal and commercial drivers for local city travel, night driving, airport drops, and outstation trips across Telangana & Andhra Pradesh.',
      features: [
        'Sedans, SUVs, Hatchbacks & Luxury Car Handling',
        'Valid LMV/Commercial badge & 100% Clean driving record',
        'Zero alcohol tolerance with verified residential credentials',
        'Familiar with all Hyderabad routes, ORR & GPS traffic navigation',
        'Available for 4-Hour, 8-Hour, 12-Hour shifts and monthly retainers',
      ],
      idealFor: [
        'Daily office commutes & school drops',
        'Weekend outstation getaways with family',
        'Medical emergency standby & senior citizen assistance',
        'Corporate fleet driving & client airport pick-ups',
      ],
      shiftOptions: [
        { shift: '4-Hour Short Shift', time: 'Half Day (City Drive)', highlight: 'On-Demand Booking' },
        { shift: '8-Hour Standard Shift', time: 'Full Day Duty', highlight: 'Most Popular Shift' },
        { shift: '12-Hour Extended Shift', time: 'Long Duty / Outstation', highlight: 'Flexible Hours' },
        { shift: 'Monthly Dedicated Retainer', time: 'Dedicated Personal Driver', highlight: 'Backup Guarantee Included' },
      ],
    },
    helper: {
      id: 'helper',
      title: 'All-Purpose Helper Services',
      tagline: 'Supports with Dedication',
      image: visualHelper,
      themeColor: 'emerald',
      badge: 'All-Purpose Support',
      description:
        'Energetic, honest and background-verified manpower for any type of requirement — household domestic help, house shifting & moving, office & store support, godown loading/unloading, event assistance, and general errand tasks.',
      features: [
        'Versatile support for home, office, relocation & commercial tasks',
        'Trained in careful shifting, fragile furniture packing, and loading',
        'Office file handling, shop floor organization & inventory sorting',
        'Punctual, physically fit, disciplined and trustworthy personnel',
        'Available on individual daily shifts or dedicated monthly workforce teams',
      ],
      idealFor: [
        'House shifting & apartment domestic assistance',
        'Office boy, pantry & file movement support',
        'Retail store, godown & market loading/unloading',
        'Event setup, catering assistance & material coordination',
      ],
      shiftOptions: [
        { shift: '4-Hour Quick Task', time: 'Half Day (Domestic/Loading)', highlight: 'Quick Task Dispatch' },
        { shift: '8-Hour Standard Duty', time: 'Full Day Helper Duty', highlight: 'Full Day Assistance' },
        { shift: '12-Hour Extended Shift', time: 'Full Day Moving / Heavy Duty', highlight: 'Event & Bulk Operations' },
        { shift: 'Monthly Dedicated Helper', time: 'Dedicated Retainer Staff', highlight: 'Backup Guarantee Included' },
      ],
    },
    captain: {
      id: 'captain',
      title: 'Executive Captain Chauffeur Services',
      tagline: 'Leads with Confidence',
      image: visualCaptain,
      themeColor: 'amber',
      badge: 'Executive VIP Protocol',
      description:
        'Elite chauffeurs trained for corporate leadership, VIP delegates, luxury hotel guest transport, and long-distance inter-state executive journeys. Discreet, impeccably groomed, and courteous.',
      features: [
        '8 to 15+ years of flawless executive driving record',
        'Fluent in English, Hindi, and regional languages with corporate etiquette',
        'Mastery of high-end luxury vehicles (Mercedes, BMW, Audi, Fortuner, etc.)',
        'VIP protocol, defensive driving, and security escort awareness',
        'Available for executive fleet management and personal corporate retainers',
      ],
      idealFor: [
        'Managing Directors, CEOs & Board Executives',
        'VIP foreign delegations & embassy dignitaries',
        'Luxury destination weddings & high-profile events',
        'Outstation inter-state VIP motorcades',
      ],
      shiftOptions: [
        { shift: '8-Hour Executive Duty', time: 'VIP City Escort', highlight: 'Executive Protocol' },
        { shift: '12-Hour Protocol Duty', time: 'Full Day VIP Delegation', highlight: 'Delegation Escort' },
        { shift: 'Outstation Inter-State', time: 'Inter-State Journey', highlight: 'Highway Master Chauffeur' },
        { shift: 'Monthly Executive Retainer', time: 'Corporate Chauffeur Retainer', highlight: 'Full Retainer Service' },
      ],
    },
  };

  const current = servicesData[activeTab];

  return (
    <>
      <SEOHead
        title="Captain, Driver & Helper Staffing Services in Hyderabad"
        description="Hire 100% background-verified Drivers, Captain Chauffeurs, and Helpers in Hyderabad LB Nagar. Flexible duty shifts (8hr, 10hr, 12hr, 24/7) with transparent pricing. Call +91 95051 51527."
        keywords="driver staffing services Hyderabad, hire chauffeur Hyderabad, logistics helper LB Nagar, daily driver hire, monthly driver staffing, outstation driver Hyderabad, temporary driver SSRC"
        canonical="https://srisairamconsultancy.com/services"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': 'https://srisairamconsultancy.com/services#service',
          'name': 'Driver, Captain & Helper Staffing Services',
          'provider': {
            '@type': 'EmploymentAgency',
            'name': 'Sri Sai Ram Consultancy',
            'url': 'https://srisairamconsultancy.com',
            'telephone': '+91 95051 51527',
          },
          'areaServed': {
            '@type': 'City',
            'name': 'Hyderabad',
          },
          'hasOfferCatalog': {
            '@type': 'OfferCatalog',
            'name': 'SSRC Staffing Solutions',
            'itemListElement': [
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Service',
                  'name': 'Driver Staffing Service',
                  'description': 'Verified commercial, personal, and corporate drivers for daily or monthly duties.',
                },
              },
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Service',
                  'name': 'Captain Chauffeur Service',
                  'description': 'Premium, well-groomed VIP & executive chauffeur drivers for luxury vehicles.',
                },
              },
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Service',
                  'name': 'Helper & Loader Staffing Service',
                  'description': 'Reliable, physically fit logistics and warehouse helpers for smooth operations.',
                },
              },
            ],
          },
        }}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#FFFDF8] to-[#F8F5EE] text-[#081C36] py-12 sm:py-16 border-b border-[#C8960C]/30 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 text-[#7C5200] border border-amber-300 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Verified Staffing Solutions
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#081C36] tracking-tight">
            Our Staffing Solutions
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Select a category below to explore verified skills, shift options, and instant booking details.
          </p>

          {/* Interactive Category Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 pt-4 flex-wrap">
            <button
              onClick={() => setActiveTab('driver')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-sm ${
                activeTab === 'driver'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Professional Drivers</span>
            </button>

            <button
              onClick={() => setActiveTab('helper')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-sm ${
                activeTab === 'helper'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>All-Purpose Helpers</span>
            </button>

            <button
              onClick={() => setActiveTab('captain')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-sm ${
                activeTab === 'captain'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Executive Captains</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ACTIVE SERVICE DEEP DIVE SHOWCASE (Rapido / Porter Style)
          ═══════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal direction="up" duration={650}>
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left: 3D Visual Graphic */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-amber-300/80 bg-white group">
                  <img
                    src={current.image}
                    alt={current.title}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-[#081C36]/90 backdrop-blur-md text-amber-300 border border-amber-400/30 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg">
                    {current.tagline}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/95 text-[#081C36] text-xs font-black px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 flex items-center gap-1">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <span>{current.badge}</span>
                  </div>
                </div>
              </div>

              {/* Right: Service In-Depth Details */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                    Verified Category
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#081C36] tracking-tight mt-2">
                    {current.title}
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2">
                    {current.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Key Skills &amp; Qualifications
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {current.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-[#081C36]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best For Tags */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                    Ideal Use Cases
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    {current.idealFor.map((item, idx) => (
                      <span key={idx} className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
                        • {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3 flex-wrap">
                  <a
                    href={`tel:${phoneRaw}`}
                    className="px-6 py-3 rounded-xl bg-[#081C36] hover:bg-[#0B2545] text-white text-xs sm:text-sm font-black text-center shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>Call to Hire ({phoneRaw})</span>
                  </a>
                  <a
                    href={`https://wa.me/${whatsappRaw}?text=Hello%20SSRC,%20I%20want%20to%20hire%20${encodeURIComponent(current.title)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black text-center shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>

              </div>

            </div>
          </ScrollReveal>

          {/* ═══════════════════════════════════════════
              SHIFT & ENGAGEMENT OPTIONS
              ═══════════════════════════════════════════ */}
          <div className="mt-14">
            <ScrollReveal direction="up" duration={600}>
              <div className="text-center mb-8">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  Flexible Scheduling
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#081C36] mt-2">
                  {current.title} — Available Duty Shifts
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Customizable on-demand shifts and dedicated monthly staffing arrangements.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {current.shiftOptions.map((opt, idx) => (
                <ScrollReveal key={idx} direction="up" delay={idx * 100} duration={600} className="h-full">
                  <div
                    className="bg-white rounded-3xl p-6 shadow-lg border-2 border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all space-y-3 flex flex-col justify-between h-full"
                  >
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 font-black text-sm flex items-center justify-center">
                        0{idx + 1}
                      </div>
                      <h4 className="font-extrabold text-[#081C36] text-base">
                        {opt.shift}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {opt.time}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#7C5200] border border-amber-200 text-xs font-extrabold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>{opt.highlight}</span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          COMPARISON TABLE MATRIX
          ═══════════════════════════════════════════ */}
      <section className="py-14 sm:py-18 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" duration={700}>
            <ComparisonTable />
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BOTTOM CTA
          ═══════════════════════════════════════════ */}
      <section className="py-12 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" duration={650}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  Have Custom Fleet or Dedicated Workforce Requirements?
                </h3>
                <p className="text-slate-900 font-semibold text-xs sm:text-sm mt-1">
                  Speak directly with our staffing coordinators for customized monthly enterprise contracts.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={`tel:${phoneRaw}`}
                  className="px-6 py-3.5 rounded-2xl bg-[#081C36] hover:bg-[#0B2545] text-white font-black text-sm shadow-xl transition-all hover:scale-105"
                >
                  Call +91 95051 51527
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
