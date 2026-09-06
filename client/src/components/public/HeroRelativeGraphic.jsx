import { 
  ShieldCheck, 
  Car, 
  Truck, 
  Compass, 
  Star, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Award,
  Users
} from 'lucide-react';

const HeroRelativeGraphic = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto py-4">
      
      {/* Glowing background ambient lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-amber-400/25 to-orange-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Relative Display Frame with Smooth Zoom Hover */}
      <div className="relative bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF9] to-[#FAF5EB] rounded-3xl p-8 border border-amber-300/70 shadow-2xl shadow-amber-950/10 overflow-hidden group transition-all duration-500 hover:scale-[1.02]">
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="relativeGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#000" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#relativeGrid)" />
          </svg>
        </div>

        {/* Floating Top Badge */}
        <div className="absolute top-4 right-4 z-20 transition-transform duration-300 group-hover:translate-y-[-2px]">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold border border-emerald-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Verified Desk</span>
          </span>
        </div>

        {/* Central Graphic Composition */}
        <div className="relative z-10 py-6 text-center space-y-6">
          


          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Sri Sai Ram Staffing Network
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Verified Captains • Drivers • Helpers in LB Nagar
            </p>
          </div>

          {/* 3 Interactive Service Fleet Nodes */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            
            {/* Driver Badge */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-md hover:border-blue-500 hover:shadow-lg transition-all duration-300 group/card">
              <div className="w-9 h-9 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 transition-transform duration-300 group-hover/card:scale-110">
                <Car className="w-5 h-5" />
              </div>
              <div className="text-xs font-black text-slate-900">Drivers</div>
              <div className="text-[10px] text-blue-600 font-bold">Vetted LMV</div>
            </div>

            {/* Helper Badge */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-md hover:border-emerald-500 hover:shadow-lg transition-all duration-300 group/card">
              <div className="w-9 h-9 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 transition-transform duration-300 group-hover/card:scale-110">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-xs font-black text-slate-900">Helpers</div>
              <div className="text-[10px] text-emerald-600 font-bold">Logistics</div>
            </div>

            {/* Captain Badge */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-md hover:border-amber-500 hover:shadow-lg transition-all duration-300 group/card">
              <div className="w-9 h-9 mx-auto rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5 transition-transform duration-300 group-hover/card:scale-110">
                <Compass className="w-5 h-5" />
              </div>
              <div className="text-xs font-black text-slate-900">Captains</div>
              <div className="text-[10px] text-amber-600 font-bold">VIP Escort</div>
            </div>

          </div>

          {/* Bottom Trust Indicators */}
          <div className="pt-4 border-t border-amber-200/60 flex items-center justify-between text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Police Verified</span>
            </div>
            <div className="flex items-center gap-1 text-amber-700 font-extrabold bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
              <Zap className="w-3.5 h-3.5 fill-amber-500" />
              <span>15-Min Dispatch</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default HeroRelativeGraphic;
