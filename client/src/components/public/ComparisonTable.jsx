import { CheckCircle2, XCircle, ShieldCheck, Sparkles, Award } from 'lucide-react';

const ComparisonTable = () => {
  const rows = [
    {
      feature: 'Background & Police Verification',
      ssrc: '100% Police, Aadhaar & Court Records Verified',
      unorganized: 'Unverified / Verbal claims only',
      advantage: true,
    },
    {
      feature: 'Driver & Equipment Skill Testing',
      ssrc: 'Rigorous highway, automatic/manual test drives',
      unorganized: 'No structured skill validation',
      advantage: true,
    },
    {
      feature: 'Pricing Transparency',
      ssrc: 'Clear daily & monthly rate card with zero cuts',
      unorganized: 'Arbitrary commissions & inflated surge rates',
      advantage: true,
    },
    {
      feature: 'Backup & Replacement Guarantee',
      ssrc: 'Immediate free replacement if staff is on leave',
      unorganized: 'No replacement or extra charges',
      advantage: true,
    },
    {
      feature: 'Customer Support & Dispatch Hotline',
      ssrc: 'Dedicated direct WhatsApp & Call helpline (6 AM - 11 PM)',
      unorganized: 'Unreachable broker numbers',
      advantage: true,
    },
    {
      feature: 'Corporate Grooming & Etiquette',
      ssrc: 'Professional demeanor, VIP protocol & clean attire',
      unorganized: 'Inconsistent discipline & conduct',
      advantage: true,
    },
  ];

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-200">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#7C5200] border border-amber-300 text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          The SSRC Difference
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[#081C36] tracking-tight">
          Why 2,500+ Clients Choose SSRC Over Local Brokers
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm mt-2">
          Transparent, background-vetted, and structured staffing vs unorganized random agents.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b-2 border-slate-200 text-xs uppercase font-black tracking-wider text-slate-500">
              <th className="py-4 px-4 sm:px-6 w-2/5">Key Parameter</th>
              <th className="py-4 px-4 sm:px-6 w-3/10 bg-amber-50/80 rounded-t-2xl text-[#081C36] border-x border-t border-amber-300">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xs">
                    ★
                  </div>
                  <span>Sri Sai Ram Consultancy</span>
                </div>
              </th>
              <th className="py-4 px-4 sm:px-6 w-3/10 text-slate-400">Unorganized Local Market</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-4 px-4 sm:px-6 font-bold text-[#081C36]">
                  {row.feature}
                </td>
                <td className="py-4 px-4 sm:px-6 bg-amber-50/50 border-x border-amber-200/80 font-bold text-[#081C36]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{row.ssrc}</span>
                  </div>
                </td>
                <td className="py-4 px-4 sm:px-6 text-slate-500">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{row.unorganized}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
