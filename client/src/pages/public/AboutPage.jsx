import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  HeartHandshake, 
  Star, 
  Award, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Target,
  Eye,
  Compass,
  Building,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Zap,
  BadgeCheck
} from 'lucide-react';
import SEOHead from '../../components/public/SEOHead';
import ScrollReveal from '../../components/public/ScrollReveal';

// 3D Trust & Security Verified Badge Asset
import visualSafety from '../../assets/visual_safety.jpg';

const AboutPage = () => {
  const phoneRaw = import.meta.env.VITE_COMPANY_PHONE_RAW || '9505151527';
  const whatsappRaw = import.meta.env.VITE_COMPANY_WHATSAPP || '919505151527';

  const verificationLifecycle = [
    {
      step: '01',
      title: 'Aadhaar & Biometric Authentication',
      desc: 'Government biometric ID verification with permanent address and family reference validation.',
      color: 'from-amber-400 to-amber-500',
    },
    {
      step: '02',
      title: 'Police & Judicial Record Check',
      desc: 'Criminal history screening, court records verification, and driving license validation.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      step: '03',
      title: 'Practical Road & Task Skill Test',
      desc: 'Hands-on highway driving, automatic/manual transmission mastery, and task handling tests.',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      step: '04',
      title: 'Protocol, Grooming & SSRC ID Badge',
      desc: 'Training in polite etiquette, punctuality, client privacy, and official SSRC ID badge issuance.',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <>
      <SEOHead
        title="About Us - Sri Sai Ram Consultancy"
        description="Learn about Sri Sai Ram Consultancy, our mission, 4-stage verification standard, and how we empower skilled drivers, helpers, and captains in Hyderabad."
      />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#FFFDF8] to-[#FAF6EE] text-[#081C36] py-14 sm:py-20 border-b-2 border-[#C8960C] text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C8960C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-[#7C5200] border border-amber-300 text-xs font-black uppercase tracking-widest mb-3">
              ✦ Our Heritage &amp; Commitment ✦
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#081C36]">
              About Sri Sai Ram Consultancy
            </h1>
            <p className="text-[#C8960C] font-serif italic text-xl sm:text-2xl font-bold mt-2">
              "Your Dreams... Our Guidance..."
            </p>
          </div>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Empowering individuals with honorable livelihoods while providing households and businesses with 100% verified, reliable drivers, helpers, and captain chauffeurs across Hyderabad.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MAIN STORY & 3D VERIFIED TRUST SHOWCASE
          ═══════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Story Text */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[#7C5200] font-extrabold text-xs uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                Company Background &amp; Mission
              </span>
              
              <h2 className="text-3xl sm:text-4xl font-black text-[#081C36] tracking-tight leading-tight">
                Bridging Dignity, Safety &amp; Professional Staffing Excellence
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Sri Sai Ram Consultancy was established with a singular vision: to eliminate the risks and uncertainty associated with unorganized local hiring agents by establishing a structured, 100% background-checked staffing ecosystem.
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Whether it is navigating family vehicles on city roads and outstation highways, supporting any household, moving, or office helper tasks, or escorting corporate VIPs as Executive Captains, every member of our network is vetted, disciplined, and courteous.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-white border-2 border-amber-300 shadow-md text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#C8960C]">100%</div>
                  <div className="text-[11px] text-slate-700 font-extrabold mt-1">Police &amp; KYC Verified</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border-2 border-blue-200 shadow-md text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#081C36]">12,500+</div>
                  <div className="text-[11px] text-slate-700 font-extrabold mt-1">Assignments Fulfilled</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border-2 border-emerald-200 shadow-md text-center col-span-2 sm:col-span-1">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600">4.9 ★</div>
                  <div className="text-[11px] text-slate-700 font-extrabold mt-1">Average Client Rating</div>
                </div>
              </div>
            </div>

            {/* Right 3D Verified Trust Badge Graphic */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400/80 bg-white group">
                <img
                  src={visualSafety}
                  alt="Sri Sai Ram Consultancy 100% Verified Trust & Security Standard"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-[#081C36]/90 backdrop-blur-md text-amber-300 border border-amber-400/40 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Background-Vetted Standard</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4-STAGE VERIFICATION LIFECYCLE ROADMAP
          ═══════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              Rigorous Onboarding Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#081C36] tracking-tight mt-2">
              Our 4-Stage Candidate Vetting Lifecycle
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Only candidates who successfully pass all 4 checkpoints are inducted into the active Sri Sai Ram Consultancy fleet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {verificationLifecycle.map((stage, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] rounded-3xl p-6 shadow-lg border-2 border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stage.color} text-white font-black text-lg flex items-center justify-center shadow-md`}>
                    {stage.step}
                  </div>
                  <h3 className="text-lg font-black text-[#081C36]">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Checkpoint</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          GUIDING PILLARS (Dark Theme 5-Star Card)
          ═══════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-[#081C36] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
              Core Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
              Our Guiding Pillars &amp; Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4 hover:border-amber-400/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">Integrity &amp; Safety First</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Zero compromises on safety. We verify all identity records and driving licenses before deploying staff to your home or office.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4 hover:border-amber-400/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-400 text-slate-950 flex items-center justify-center font-black">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">Dignity of Labor</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We believe in fair wages, respect, and career advancement for every driver, helper, and captain in our family.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4 hover:border-amber-400/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-slate-950 flex items-center justify-center font-black">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">Community Trust</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Proudly rooted in Hyderabad LB Nagar, delivering dependable local staffing solutions with a 24/7 dedicated support team.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          VISIT / CALL US CTA
          ═══════════════════════════════════════════ */}
      <section className="py-14 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Visit Our LB Nagar Hyderabad Office
            </h3>
            <p className="text-slate-900 font-semibold text-xs sm:text-sm flex items-center gap-1.5 justify-center md:justify-start">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Beside Reliance Market, Jama Thota Sagar Ring Road, LB Nagar, Hyderabad - 500074.</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:${phoneRaw}`}
              className="px-6 py-3.5 rounded-2xl bg-[#081C36] hover:bg-[#0B2545] text-white font-black text-sm shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call +91 95051 51527</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
