import { 
  Compass, 
  Car, 
  Truck, 
  ShieldCheck, 
  Star, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Zap
} from 'lucide-react';

const HeroShowcase = () => {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      
      {/* Background Ambient Glow Accents */}
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-amber-400/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Stacked Interactive Card Showcase Deck */}
      <div className="relative space-y-4">
        
        {/* Floating Top Pill Badge */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-300/80 shadow-lg shadow-amber-950/5 relative z-20">
          <div className="flex items-center gap-2 text-xs font-black text-slate-900">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Sri Sai Ram Dispatch Desk • LB Nagar</span>
          </div>
          <span className="text-[11px] font-extrabold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
            100% Verified
          </span>
        </div>

        {/* Card 1: Executive Captain Chauffeur */}
        <div className="bg-gradient-to-r from-[#0B2545] via-[#081C36] to-[#0B2545] text-white p-5 rounded-3xl border-2 border-amber-400 shadow-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] group">
          <div className="absolute -top-3 -right-3 w-20 h-20 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-[#081C36] rounded-[14px] flex items-center justify-center text-amber-400">
                  <Compass className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-base text-white group-hover:text-amber-300 transition-colors">
                    Executive Captain
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-950 bg-amber-400 px-2 py-0.5 rounded-full">
                    VIP Choice
                  </span>
                </div>
                <p className="text-xs text-amber-300/90 font-medium mt-0.5">
                  Corporate Chauffeur & Outstation VIP Escort
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-400 text-xs font-black">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>5.0 Rating</span>
              </div>
              <span className="text-[10px] text-slate-300 font-semibold block mt-0.5">8+ Yrs Exp</span>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bilingual & Uniformed</span>
            </span>
            <span className="text-amber-300 font-bold">Immediate Dispatch</span>
          </div>
        </div>

        {/* Card 2: Professional Driver */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-400 group">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    Professional Driver
                  </h4>
                  <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Vetted
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Hatchback, Sedan, SUV & Commercial LMV
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>4.9 Rating</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Police Verified</span>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Aadhaar & License Verified</span>
            </span>
            <span className="text-blue-600 font-bold">City & Outstation</span>
          </div>
        </div>

        {/* Card 3: Dedicated Helper */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-emerald-400 group">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-base text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Dedicated Helper
                  </h4>
                  <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Manpower
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  House Shifting, Warehouse Cargo & Packing
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>4.8 Rating</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Trained Support</span>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Heavy Goods & Fragile Trained</span>
            </span>
            <span className="text-emerald-700 font-bold">Daily & Shift Hire</span>
          </div>
        </div>

        {/* Bottom Floating Fast Dispatch Pill */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Need Candidate Staff Urgently?</span>
          </div>
          <span className="bg-slate-950 text-amber-400 text-[10px] uppercase font-black px-2.5 py-1 rounded-lg">
            15-Min Response Desk
          </span>
        </div>

      </div>

    </div>
  );
};

export default HeroShowcase;
