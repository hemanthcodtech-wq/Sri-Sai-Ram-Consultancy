import { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Navigation,
  ExternalLink,
} from 'lucide-react';
import SEOHead from '../../components/public/SEOHead';
import ScrollReveal from '../../components/public/ScrollReveal';
import api from '../../utils/api';

const ContactPage = () => {
  const phoneDisplay = import.meta.env.VITE_COMPANY_PHONE || '+91 95051 51527';
  const phoneRaw = import.meta.env.VITE_COMPANY_PHONE_RAW || '9505151527';
  const whatsappRaw = import.meta.env.VITE_COMPANY_WHATSAPP || '919505151527';
  const address =
    import.meta.env.VITE_COMPANY_ADDRESS ||
    'Beside Reliance Market, Jama Thota Sagar Ring Road, Hyderabad LB Nagar';
  const mapDirectionsUrl =
    'https://maps.google.com/?q=Reliance+Market+Jama+Thota+Sagar+Ring+Road+LB+Nagar+Hyderabad';

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: 'General Inquiry',
    pickupLocation: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/inquiries', form);
      setSuccess(true);
      const waText = encodeURIComponent(
        `*New Website Inquiry*\nName: ${form.name}\nPhone: ${form.phone}\nService: ${form.serviceType}\nLocation: ${form.pickupLocation || 'Hyderabad'}\nNotes: ${form.message || 'None'}`
      );
      setTimeout(() => {
        window.open(`https://wa.me/${whatsappRaw}?text=${waText}`, '_blank');
      }, 1000);
      setForm({ name: '', phone: '', email: '', serviceType: 'General Inquiry', pickupLocation: '', message: '' });
    } catch (err) {
      console.error(err);
      alert('Error sending. Please call or WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Contact Us - Sri Sai Ram Consultancy"
        description="Get in touch with Sri Sai Ram Consultancy in LB Nagar, Hyderabad. Contact us via Call or WhatsApp for Captain, Driver, and Helper staffing."
      />

      {/* ─── Hero ─── */}
      <section className="bg-[#081C36] text-white py-10 sm:py-16 text-center relative overflow-hidden border-b-2 border-amber-500/30">
        <div className="absolute inset-0 bg-gradient-to-br from-[#040D1A] via-[#081C36] to-[#0B2545] pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <span className="inline-flex items-center gap-1.5 text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-amber-500/15 px-3 py-1 rounded-full border border-amber-400/30">
            <Sparkles className="w-3 h-3" />
            24/7 Helpline &amp; Placement Desk
          </span>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white mt-3 leading-tight">
            Connect With Sri Sai Ram Consultancy
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Need a Driver, Helper, or Captain? Reach our coordinator desk instantly.
          </p>
        </div>
      </section>

      {/* ─── Main Section ─── pb-24 ensures content clears the mobile bottom nav */}
      <section className="bg-slate-50 py-5 sm:py-10 pb-24">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">

          {/* ── 3 Quick Contact Buttons ── */}
          <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-3">
            
            {/* Call */}
            <a
              href={`tel:${phoneRaw}`}
              className="flex items-center gap-3 bg-white rounded-2xl p-3.5 sm:p-5 border-2 border-blue-100 hover:border-blue-400 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</div>
                <div className="text-sm sm:text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight truncate">{phoneDisplay}</div>
                <div className="text-[10px] sm:text-xs font-semibold text-blue-500">Call 24/7</div>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent('Hello Sri Sai Ram Consultancy! I need staffing services.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white rounded-2xl p-3.5 sm:p-5 border-2 border-emerald-100 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp</div>
                <div className="text-sm sm:text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">Chat Now</div>
                <div className="text-[10px] sm:text-xs font-semibold text-emerald-500">&lt; 5 min response</div>
              </div>
            </a>

            {/* Location */}
            <a
              href={mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white rounded-2xl p-3.5 sm:p-5 border-2 border-amber-100 hover:border-amber-400 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</div>
                <div className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors leading-tight line-clamp-2">LB Nagar, Hyderabad</div>
                <div className="text-[10px] sm:text-xs font-semibold text-amber-600">Get Directions →</div>
              </div>
            </a>

          </div>

          {/* ── Office Info + Form — single col on mobile, 2-col on lg+ ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Office Info */}
            <div className="bg-[#081C36] rounded-2xl p-5 sm:p-7 text-white border border-amber-400/20 shadow-lg flex flex-col gap-4">
              <div>
                <span className="text-amber-400 text-[9px] font-bold uppercase tracking-widest block">Sri Sai Ram Consultancy</span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">Office Information</h2>
                <p className="text-slate-400 text-xs mt-0.5">Visit our Placement &amp; Dispatch office.</p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-[9px] font-bold uppercase block">Address</span>
                    <p className="font-semibold text-white mt-0.5 leading-relaxed">{address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-[9px] font-bold uppercase block">Working Hours</span>
                    <p className="font-semibold text-white mt-0.5">Mon – Sun: 6:00 AM – 11:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-[9px] font-bold uppercase block">Email</span>
                    <p className="font-semibold text-white mt-0.5 break-all">info@srisairamconsultancy.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300 font-semibold">100% Background Check &amp; Police Clearance</span>
                </div>
              </div>
            </div>

            {/* Staffing Requirement Form */}
            <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-lg border border-slate-200 flex flex-col gap-4">
              <div>
                <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  ⚡ Direct Booking
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#0B2545] mt-2">Send Your Requirement</h2>
                <p className="text-slate-500 text-xs mt-0.5">Connect directly with our placement coordinator.</p>
              </div>

              {success && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Requirement logged! Opening WhatsApp with coordinator…</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text" required placeholder="e.g. Ramesh Varma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel" required placeholder="e.g. 98480 12345"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Service Required *</label>
                    <select
                      value={form.serviceType}
                      onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                    >
                      <option value="Driver">Driver</option>
                      <option value="Helper">Helper</option>
                      <option value="Captain">Captain</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Duty Location</label>
                    <input
                      type="text" placeholder="e.g. LB Nagar / Hitec City"
                      value={form.pickupLocation}
                      onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message / Requirements</label>
                  <textarea
                    rows="3"
                    placeholder="Describe your need (e.g. driver for outstation, warehouse helper)…"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-400/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>{loading ? 'Submitting…' : '⚡ Send & Connect on WhatsApp'}</span>
                </button>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex-wrap gap-1">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <ShieldCheck className="w-3 h-3" /> Verified &amp; Police Cleared Staff
                  </span>
                  <span>Fast Response Guaranteed</span>
                </div>

              </form>
            </div>
          </div>

          {/* ── Full-Width Google Map ── */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
              <div>
                <span className="text-amber-600 text-[9px] font-bold uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  📍 Office Location
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-2">LB Nagar Head Office</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Beside Reliance Market, Sagar Ring Road, Jama Thota, LB Nagar, Hyderabad 500074
                </p>
              </div>
              <a
                href={mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow transition-all hover:scale-[1.02] shrink-0 self-start sm:self-center"
              >
                <Navigation className="w-3.5 h-3.5" />
                Open in Google Maps
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Responsive map height */}
            <div className="w-full h-[250px] sm:h-[360px] lg:h-[420px]">
              <iframe
                title="Sri Sai Ram Consultancy LB Nagar Office Map"
                src="https://maps.google.com/maps?q=Reliance+Market+Jama+Thota+Sagar+Ring+Road+LB+Nagar+Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default ContactPage;
