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
  Award
} from 'lucide-react';
import SEOHead from '../../components/public/SEOHead';
import ScrollReveal from '../../components/public/ScrollReveal';

const ServicesPage = () => {
  const phoneRaw = import.meta.env.VITE_COMPANY_PHONE_RAW || '9505151527';
  const whatsappRaw = import.meta.env.VITE_COMPANY_WHATSAPP || '919505151527';

  const services = [
    {
      id: 'driver',
      title: 'Professional Driver Services',
      tagline: 'Steers with Responsibility',
      icon: Car,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border-blue-600',
      description:
        'Experienced, background-verified personal and commercial drivers for local city travel, night driving, airport drops, and outstation family trips. Skilled in driving all manual and automatic vehicle categories.',
      highlights: [
        'Expert driving across Sedans, SUVs, Hatchbacks & Luxury cars',
        'Valid LMV/Commercial badge & Clean driving record',
        'Zero alcohol tolerance with background verification',
        'Familiar with all routes, GPS systems, and traffic shortcuts',
        'Available for 4-Hour, 8-Hour, 12-Hour shifts and monthly contracts',
      ],
      idealFor: 'Daily office commutes, weekend getaways, medical emergency standby, family events.',
      category: 'Driver',
    },
    {
      id: 'helper',
      title: 'Dedicated Helper & Logistics Support',
      tagline: 'Supports with Dedication',
      icon: Truck,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-600',
      description:
        'Energetic and trustworthy manpower for household relocation, cargo loading/unloading, commercial warehouse sorting, shop floor packaging, and logistics dispatch assistance.',
      highlights: [
        'Trained in careful loading, fragile packing, and unloading',
        'Warehouse inventory, carton movement, and dispatch assistance',
        'Punctual, physically fit, and hard-working personnel',
        'Verified Aadhaar and residential credentials on file',
        'Available on individual daily hire or dedicated monthly workforce teams',
      ],
      idealFor: 'House shifting, retail godowns, transport hubs, event setup, material supply chains.',
      category: 'Helper',
    },
    {
      id: 'captain',
      title: 'Executive Captain Chauffeur Services',
      tagline: 'Leads with Confidence',
      icon: Compass,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border-amber-600',
      description:
        'Elite chauffeurs trained for corporate leadership, VIP delegates, luxury hotel guest transport, and long-distance inter-state executive journeys. Discreet, impeccably groomed, and courteous.',
      highlights: [
        '8 to 15+ years of flawless executive driving record',
        'Fluent in English, Hindi, and regional languages with corporate etiquette',
        'Mastery of high-end luxury vehicles (Mercedes, BMW, Audi, Fortuner, etc.)',
        'VIP protocol, defensive driving, and security escort awareness',
        'Available for executive fleet management and personal corporate retainers',
      ],
      idealFor: 'CEOs, VIP delegations, luxury weddings, business summits, outstation VIP escorts.',
      category: 'Captain',
    },
  ];

  return (
    <>
      <SEOHead
        title="Services - Driver, Helper & Captain Staffing | SSRC"
        description="Explore Driver, Helper, and Captain Chauffeur staffing services in Hyderabad LB Nagar. Contact us via Call or WhatsApp for instant dispatch."
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#081C36] via-[#0B2545] to-[#081C36] text-white py-14 border-b-2 border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal direction="down" duration={700}>
            <span className="inline-block px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-widest mb-3">
              ✦ Certified Staffing Solutions ✦
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Our Staffing Services
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-3">
              Specialized recruitment and on-demand staffing designed for highest safety, punctuality, and complete peace of mind.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <ScrollReveal key={service.id} direction="up" delay={index * 150} duration={700}>
                <div
                  id={service.id}
                  className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80 hover:border-amber-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Details */}
                    <div className="lg:col-span-8 space-y-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-2xl ${service.iconBg} border-2 flex items-center justify-center shrink-0`}>
                          <Icon className={`w-9 h-9 ${service.iconColor}`} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">
                            {service.tagline}
                          </span>
                          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight mt-0.5">
                            {service.title}
                          </h2>
                        </div>
                      </div>

                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                        {service.description}
                      </p>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Key Responsibilities & Qualifications:
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {service.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                        <span className="font-bold text-[#0B2545]">Ideal For: </span>
                        {service.idealFor}
                      </div>
                    </div>

                    {/* Right Column: Quick Action Box without price */}
                    <div className="lg:col-span-4 bg-[#081C36] rounded-2xl p-6 text-white border-2 border-amber-400/40 flex flex-col justify-between space-y-6">
                      <div>
                        <div className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                          Direct Assistance Desk
                        </div>
                        <div className="text-xl font-black text-white mt-1">
                          Hire {service.category} Staff
                        </div>
                        <div className="text-xs text-slate-300 mt-1">
                          Verified candidates ready for immediate deployment.
                        </div>
                      </div>

                      {/* CTAs */}
                      <div className="space-y-3">
                        <a
                          href={`tel:${phoneRaw}`}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-md transition-all hover:scale-[1.02]"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Call Now to Hire</span>
                        </a>

                        <a
                          href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent(`Hello! I want to hire a ${service.category} via Sri Sai Ram Consultancy.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp Us Directly</span>
                        </a>

                        <Link
                          to={`/contact?service=${service.category}`}
                          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all text-center"
                        >
                          <span>Send Online Message</span>
                        </Link>
                      </div>

                      <div className="pt-3 border-t border-white/10 text-[11px] text-slate-300 text-center">
                        ✓ Instant Dispatch • Verified Documents
                      </div>

                    </div>

                  </div>
                </div>
              </ScrollReveal>
            );
          })}

        </div>
      </section>
    </>
  );
};

export default ServicesPage;

