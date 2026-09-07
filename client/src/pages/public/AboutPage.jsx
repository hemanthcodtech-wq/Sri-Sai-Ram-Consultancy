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
  Compass
} from 'lucide-react';
import SEOHead from '../../components/public/SEOHead';
import ScrollReveal from '../../components/public/ScrollReveal';

const AboutPage = () => {
  return (
    <>
      <SEOHead
        title="About Us - Sri Sai Ram Consultancy"
        description="Learn about Sri Sai Ram Consultancy, our mission, verification standard, and how we empower skilled drivers, helpers, and captains."
      />

      {/* Hero Banner */}
      <section className="bg-[#FFFDF8] text-[#081C36] py-12 sm:py-16 border-b-2 border-[#C8960C] text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C8960C]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal direction="down" duration={700}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-[#7C5200] border border-amber-300 text-xs font-bold uppercase tracking-widest mb-4">
              ✦ Our Heritage &amp; Commitment ✦
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#081C36]">
              About Sri Sai Ram Consultancy
            </h1>
            <p className="text-[#C8960C] font-serif italic text-lg sm:text-xl mt-2 font-bold">
              "Your Dreams... Our Guidance..."
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Story & Background */}
      <section className="py-16 bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <ScrollReveal direction="right" duration={700}>
                <span className="text-[#7C5200] font-extrabold text-xs uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                  Company Background
                </span>
                
                <h2 className="text-3xl sm:text-4xl font-black text-[#081C36] tracking-tight leading-tight mt-3">
                  Connecting Dignity, Trust & Professional Excellence
                </h2>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-4">
                  Sri Sai Ram Consultancy was established with a singular vision: to bridge the gap between conscientious employers looking for trustworthy staffing and skilled personnel seeking stable, dignified livelihoods.
                </p>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-4">
                  Whether steering a family luxury vehicle on outstation highways, supporting heavy warehouse logistical loading, or escorting corporate VIP executives as Captains, every member of our network is vetted, courteous, and committed to total accountability.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <div className="text-2xl font-black text-[#C8960C]">100%</div>
                    <div className="text-xs text-[#7C5200] font-bold mt-0.5">Police Verified Staff</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#EEF2FF] border border-blue-200">
                    <div className="text-2xl font-black text-[#081C36]">12,500+</div>
                    <div className="text-xs text-blue-800 font-bold mt-0.5">Successful Assignments</div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Visual Values Card */}
            <div className="lg:col-span-6">
              <ScrollReveal direction="left" duration={700} delay={150}>
                <div className="bg-[#081C36] rounded-3xl p-8 sm:p-10 text-white shadow-2xl border-2 border-[#C8960C]/50 relative">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#C8960C]/20 text-[#C8960C] border border-[#C8960C]/30 flex items-center justify-center font-black">
                        SSR
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-xl">Our Guiding Pillars</h3>
                        <p className="text-[#C8960C] text-xs font-semibold">Sri Sai Ram Consultancy</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-[#C8960C] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-white text-sm">Integrity & Safety First</h4>
                          <p className="text-xs text-slate-300 mt-0.5">Multi-point credential check on every candidate before onboarding.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                        <HeartHandshake className="w-5 h-5 text-[#C8960C] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-white text-sm">Fair Wages & Dignity</h4>
                          <p className="text-xs text-slate-300 mt-0.5">Transparent payouts ensuring high motivation, zero absenteeism, and polite behavior.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                        <Star className="w-5 h-5 text-[#C8960C] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-white text-sm">24/7 Client Assurance</h4>
                          <p className="text-xs text-slate-300 mt-0.5">Immediate staff replacement support if any unforeseen issues arise.</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 text-center">
                      <Link
                        to="/contact"
                        className="btn-gold inline-flex text-sm"
                      >
                        <span>Hire Staff Through Us</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white border-t border-[#F0E0C8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <ScrollReveal direction="up" delay={100}>
              <div className="bg-[#FFF8F0] rounded-3xl p-8 shadow-md border border-[#F0E0C8] space-y-4 h-full">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#081C36] flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-[#081C36]">Our Mission</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  To provide seamless, on-demand, and transparent manpower staffing that elevates travel safety, home comfort, and industrial logistics across Hyderabad and surrounding regions.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={250}>
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 space-y-4 h-full">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C8960C] border border-amber-200 flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-[#081C36]">Our Vision</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  To become South India’s most dependable manpower staffing consultancy brand, recognized for uncompromised trust, technological convenience, and empowered candidates.
                </p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;

