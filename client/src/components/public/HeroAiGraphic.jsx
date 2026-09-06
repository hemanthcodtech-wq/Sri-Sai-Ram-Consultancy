import { 
  ShieldCheck, 
  Car, 
  Truck, 
  Compass, 
  Zap, 
  CheckCircle2, 
  Award,
  Users,
  MapPin,
  Clock
} from 'lucide-react';

const HeroGraphic = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto flex justify-center items-center">
      
      {/* Ambient Background Glowing Accents */}
      <div className="absolute -top-8 -right-8 w-64 h-64 bg-amber-400/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Staffing Network Card */}
      <div className="w-full bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF9] to-[#FAF5EB] rounded-3xl p-6 sm:p-8 border border-amber-300/60 shadow-2xl shadow-amber-950/10 relative overflow-hidden">
        
        {/* Background Mesh Grid Pattern SVG */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="gridPatternHero" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#000" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#gridPatternHero)" />
          </svg>
        </div>

        {/* Top Header Strip */}
        <div className="flex items-center justify-between border-b border-amber-200/60 pb-4 mb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-[#0B2545] rounded-[9px] flex items-center justify-center text-amber-400 font-black text-sm">
                SSR
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-black text-xs sm:text-sm text-slate-900 tracking-tight">
                  Verified Staffing Network
                </h4>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-800 text-[10px] font-extrabold uppercase border border-amber-300">
                  Verified Desk
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">LB Nagar, Hyderabad Central Hub</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300/80 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Active Desk</span>
          </span>
        </div>

        {/* Center SVG Interactive Network Visual */}
        <div className="relative w-full h-[260px] flex items-center justify-center my-2">
          
          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 260">
            <defs>
              <linearGradient id="svgLineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0.75" />
              </linearGradient>

              <linearGradient id="svgLineGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0.75" />
              </linearGradient>

              <radialGradient id="svgCenterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Concentric Vector Circles */}
            <circle cx="200" cy="130" r="115" fill="url(#svgCenterGlow)" stroke="#F59E0B" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="6 6" />
            <circle cx="200" cy="130" r="75" fill="none" stroke="#D97706" strokeOpacity="0.25" strokeWidth="1.5" className="animate-spin-slow" strokeDasharray="4 8" />
            <circle cx="200" cy="130" r="38" fill="none" stroke="#F59E0B" strokeOpacity="0.35" strokeWidth="2" />

            {/* Connecting Vector Lines */}
            <line x1="200" y1="130" x2="80" y2="60" stroke="url(#svgLineGrad1)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
            <line x1="200" y1="130" x2="320" y2="60" stroke="url(#svgLineGrad2)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
            <line x1="200" y1="130" x2="200" y2="215" stroke="url(#svgLineGrad1)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
          </svg>

          {/* Central Hub Core Node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-tr from-[#0B2545] via-[#081C36] to-[#0F2D54] border-2 border-amber-400 shadow-xl shadow-amber-500/30 flex flex-col items-center justify-center text-center p-2 z-20 group transition-transform duration-300 hover:scale-110">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 mb-0.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-[10px] font-black text-amber-300 leading-none">SSR Hub</span>
            <span className="text-[8px] font-bold text-slate-300 uppercase">Dispatch</span>
          </div>

          {/* Node 1: Driver Fleet (Top Left) */}
          <div className="absolute top-[20px] left-[25px] bg-white rounded-2xl p-2.5 shadow-lg border border-blue-200 flex items-center gap-2 z-20 transition-all duration-300 hover:scale-105 hover:border-blue-400">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 leading-tight">Drivers</div>
              <div className="text-[10px] text-blue-700 font-bold">Vetted & Licensed</div>
            </div>
          </div>

          {/* Node 2: Helper Fleet (Top Right) */}
          <div className="absolute top-[20px] right-[25px] bg-white rounded-2xl p-2.5 shadow-lg border border-emerald-200 flex items-center gap-2 z-20 transition-all duration-300 hover:scale-105 hover:border-emerald-400">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 leading-tight">Helpers</div>
              <div className="text-[10px] text-emerald-700 font-bold">Logistics & Support</div>
            </div>
          </div>

          {/* Node 3: Captain Chauffeurs (Bottom Center) */}
          <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 bg-white rounded-2xl p-2.5 shadow-lg border border-amber-300 flex items-center gap-2 z-20 transition-all duration-300 hover:scale-105 hover:border-amber-500">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-300 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 leading-tight">Captain Chauffeur</div>
              <div className="text-[10px] text-amber-700 font-bold">VIP Executive Chauffeur</div>
            </div>
          </div>

        </div>

        {/* Bottom Feature Badges Bar */}
        <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-semibold text-slate-700 relative z-10">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-800">100% Police & Biometric Verified</span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-700 font-extrabold bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-300">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            <span>15-Min Fast Dispatch</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default HeroGraphic;
