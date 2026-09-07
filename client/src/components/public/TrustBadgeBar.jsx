import { ShieldCheck, Zap, Award, CheckCircle2, Clock, MapPin, RefreshCw, ThumbsUp } from 'lucide-react';

const TrustBadgeBar = () => {
  const items = [
    { icon: ShieldCheck, text: '100% Police & Court Verified', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    { icon: Zap, text: 'Instant Dispatch across Hyderabad & LB Nagar', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { icon: CheckCircle2, text: 'Zero Hidden Charges & Direct Rates', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    { icon: RefreshCw, text: 'Free Instant Replacement Guarantee', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
    { icon: Award, text: '4.9/5 Star Rated Chauffeurs & Helpers', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    { icon: Clock, text: 'Flexible Shifts: 4Hr, 8Hr, 12Hr & Monthly', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
  ];

  return (
    <div className="bg-gradient-to-r from-[#081C36] via-[#0B2545] to-[#081C36] border-y border-amber-400/20 py-3.5 px-4 overflow-hidden relative shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-md text-white text-xs font-bold transition-all hover:scale-105 duration-200"
            >
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                <Icon className="w-3 h-3 stroke-[2.5]" />
              </span>
              <span className="tracking-tight text-slate-100">{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrustBadgeBar;
