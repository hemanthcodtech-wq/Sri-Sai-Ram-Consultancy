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
      <section className="bg-gradient-to-r from-[#081C36] via-[#0B2545] to-[#081C36] text-white py-16 border-b-2 border-amber-500/30 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="down" duration={700}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-widest mb-4">
              ✦ Our Heritage & Commitment ✦
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              About Sri Sai Ram Consultancy
            </h1>
            <p className="text-amber-300 font-serif italic text-lg sm:text-xl mt-2 font-medium">
              "Your Dreams... Our Guidance..."
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Story & Background */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <ScrollReveal direction="right" duration={700}>
                <span className="text-amber-600 font-extrabold text-xs uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  Company Background
                </span>
                
                <h2 className="text-3xl sm:text-4xl font-black text-[#0B2545] tracking-tight leading-tight mt-3">
                  Connecting Dignity, Trust & Professional Excellence
                </h2>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-4">
                  Sri Sai Ram Consultancy was established with a singular vision: to bridge the gap between conscientious employers looking for trustworthy staffing and skilled personnel seeking stable, dignified livelihoods.
                </p>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-4">
                  Whether steering a family luxury vehicle on outstation highways, supporting heavy warehouse logistical loading, or escorting corporate VIP executives as Captains, every member of our network is vetted, courteous, and committed to total accountability.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                    <div className="text-2xl font-black text-[#0B2545]">100%</div>
                    <div className="text-xs text-amber-900 font-bold mt-0.5">Police Verified Staff</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                    <div className="text-2xl font-black text-[#0B2545]">12,500+</div>
                    <div className="text-xs text-blue-900 font-bold mt-0.5">Successful Assignments</div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Visual Values Card */}
            <div className="lg:col-span-6">
              <ScrollReveal direction="left" duration={700} delay={150}>
                <div className="bg-[#081C36] rounded-3xl p-8 sm:p-10 text-white shadow-2xl border-2 border-amber-400/40 relative">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                        SSR
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-xl">Our Guiding Pillars</h3>
                        <p className="text-amber-400 text-xs font-semibold">Sri Sai Ram Consultancy</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-white text-sm">Integrity & Safety First</h4>
                          <p className="text-xs text-slate-300 mt-0.5">Multi-point credential check on every candidate before onboarding.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                        <HeartHandshake className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-white text-sm">Fair Wages & Dignity</h4>
                          <p className="text-xs text-slate-300 mt-0.5">Transparent payouts ensuring high motivation, zero absenteeism, and polite behavior.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                        <Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-white text-sm">24/7 Client Assurance</h4>
                          <p className="text-xs text-slate-300 mt-0.5">Immediate staff replacement support if any unforeseen issues arise.</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 text-center">
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-sm shadow-md hover:scale-[1.02] transition-transform"
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
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <ScrollReveal direction="up" delay={100}>
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 space-y-4 h-full">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-[#0B2545]">Our Mission</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  To provide seamless, on-demand, and transparent manpower staffing that elevates travel safety, home comfort, and industrial logistics across Hyderabad and surrounding regions.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={250}>
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 space-y-4 h-full">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-[#0B2545]">Our Vision</h3>
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

