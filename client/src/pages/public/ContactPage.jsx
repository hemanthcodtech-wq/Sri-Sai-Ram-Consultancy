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
  UserCheck,
  Navigation,
  ExternalLink
} from 'lucide-react';
import SEOHead from '../../components/public/SEOHead';
import ScrollReveal from '../../components/public/ScrollReveal';
import api from '../../utils/api';

const ContactPage = () => {
  const phoneDisplay = import.meta.env.VITE_COMPANY_PHONE || '+91 95051 51527';
  const phoneRaw = import.meta.env.VITE_COMPANY_PHONE_RAW || '9505151527';
  const whatsappRaw = import.meta.env.VITE_COMPANY_WHATSAPP || '919505151527';
  const address = import.meta.env.VITE_COMPANY_ADDRESS || 'Beside Reliance Market, Jama Thota Sagar Ring Road, Hyderabad LB Nagar';
  const mapDirectionsUrl = "https://maps.google.com/?q=Reliance+Market+Jama+Thota+Sagar+Ring+Road+LB+Nagar+Hyderabad";

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

      // Open WhatsApp directly
      const waText = encodeURIComponent(
        `*New Website Contact Inquiry*\nName: ${form.name}\nPhone: ${form.phone}\nService Needed: ${form.serviceType}\nLocation: ${form.pickupLocation || 'Hyderabad'}\nNotes: ${form.message || 'None'}`
      );
      setTimeout(() => {
        window.open(`https://wa.me/${whatsappRaw}?text=${waText}`, '_blank');
      }, 1000);

      setForm({
        name: '',
        phone: '',
        email: '',
        serviceType: 'General Inquiry',
        pickupLocation: '',
        message: '',
      });
    } catch (err) {
      console.error(err);
      alert('Error sending inquiry. Please call or WhatsApp us directly.');
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

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#040D1A] via-[#081C36] to-[#040D1A] text-white py-14 sm:py-20 border-b-2 border-amber-500/30 text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal direction="down" duration={700}>
            <span className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-widest bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-400/30 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>24/7 Helpline & Placement Desk</span>
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mt-4 tracking-tight leading-tight">
              Connect With Sri Sai Ram Consultancy
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-3">
              Have a requirement for a Driver, Helper, or Executive Captain? Connect directly with our LB Nagar Hyderabad coordinator desk.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-12 sm:py-16 bg-slate-50 pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Quick Action Contact Cards Strip - Equal Height & Size */}
          <ScrollReveal direction="up" duration={700}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              
              {/* Phone Card */}
              <a
                href={`tel:${phoneRaw}`}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border-2 border-blue-500/20 hover:border-blue-600 transition-all duration-300 flex items-center justify-between group h-full min-h-[110px]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Direct Phone Line</span>
                    <div className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                      {phoneDisplay}
                    </div>
                    <div className="text-xs font-semibold text-blue-600 mt-0.5">
                      Call 24/7 Helpline
                    </div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:translate-x-1 transition-transform hidden sm:block shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
              </a>

              {/* WhatsApp Card */}
              <a
                href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent('Hello Sri Sai Ram Consultancy! I would like to inquire about staffing services.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border-2 border-emerald-500/20 hover:border-emerald-600 transition-all duration-300 flex items-center justify-between group h-full min-h-[110px]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Instant WhatsApp</span>
                    <div className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                      Chat on WhatsApp
                    </div>
                    <div className="text-xs font-semibold text-emerald-600 mt-0.5">
                      Fast Response (&lt; 5 mins)
                    </div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:translate-x-1 transition-transform hidden sm:block shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>

              {/* Address Card */}
              <a
                href={mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border-2 border-amber-500/20 hover:border-amber-500 transition-all duration-300 flex items-center justify-between group h-full min-h-[110px]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                    <MapPin className="w-7 h-7 text-slate-950" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Head Office Location</span>
                    <div className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors leading-snug line-clamp-1">
                      {address}
                    </div>
                    <div className="text-xs font-semibold text-amber-600 mt-0.5">
                      Open Google Directions
                    </div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:translate-x-1 transition-transform hidden sm:block shrink-0">
                  <Navigation className="w-4 h-4" />
                </div>
              </a>

            </div>
          </ScrollReveal>

          {/* 2-Column Layout Above Map: Left Office Details | Right Requirement Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Office Details Card */}
            <div className="lg:col-span-5 h-full">
              <ScrollReveal direction="right" delay={150} duration={700} className="h-full">
                <div className="bg-[#081C36] rounded-3xl p-6 sm:p-8 text-white shadow-xl border-2 border-amber-400/30 space-y-6 h-full flex flex-col justify-between">
                  <div>
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block">
                      Sri Sai Ram Consultancy
                    </span>
                    <h3 className="text-2xl font-extrabold text-white mt-1">Office Information</h3>
                    <p className="text-slate-300 text-xs mt-0.5">Visit our Placement & Dispatch office in Hyderabad.</p>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm">
                    
                    <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 block text-xs font-semibold">Address:</span>
                        <div className="font-bold text-white leading-relaxed mt-0.5">
                          {address}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-xs font-semibold">Working Hours:</span>
                        <div className="font-bold text-white mt-0.5">Monday – Sunday: 6:00 AM – 11:00 PM</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-xs font-semibold">Email Inquiry:</span>
                        <div className="font-bold text-white mt-0.5">info@srisairamconsultancy.com</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>100% Background Check & Police Clearance Guaranteed</span>
                    </div>

                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Premium Requirement Form */}
            <div className="lg:col-span-7 h-full">
              <ScrollReveal direction="left" delay={250} duration={700} className="h-full">
                <div className="bg-white rounded-3xl p-7 sm:p-10 shadow-xl border border-slate-200 space-y-6 h-full flex flex-col justify-between">
                  
                  <div>
                    <div className="mb-6">
                      <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        ⚡ Direct Booking Dispatch
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] mt-3">
                        Send Your Staffing Requirement
                      </h2>
                      <p className="text-slate-600 text-xs sm:text-sm mt-1">
                        Fill in your staff requirement details to immediately connect with our placement coordinator.
                      </p>
                    </div>

                    {success && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-400 text-emerald-800 text-sm flex items-center gap-2 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>Your requirement has been logged successfully! Opening WhatsApp with our coordinator...</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh Varma"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone Number *</label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. 98480 12345"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Service Required *</label>
                          <select
                            value={form.serviceType}
                            onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                          >
                            <option value="Driver">Driver (Steers Responsibly)</option>
                            <option value="Helper">Helper (Supports Dedicatedly)</option>
                            <option value="Captain">Captain (Leads with Confidence)</option>
                            <option value="General Inquiry">General Staffing Inquiry</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Duty Location / Area</label>
                          <input
                            type="text"
                            placeholder="e.g. LB Nagar / Dilsukhnagar / Hitec City"
                            value={form.pickupLocation}
                            onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Your Requirements / Message</label>
                        <textarea
                          rows="3"
                          placeholder="Describe your specific requirement (e.g. Innova car driver for outstation travel, full-day warehouse helper, corporate fleet captain)..."
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2.5 mt-2"
                      >
                        <Send className="w-5 h-5 text-slate-950" />
                        <span>{loading ? 'Submitting Inquiry...' : '⚡ Send Requirement & Connect on WhatsApp'}</span>
                      </button>

                    </form>
                  </div>

                  {/* Trust Footer */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Verified & Police Cleared Staff</span>
                    </div>
                    <span>Fast Response Guaranteed</span>
                  </div>

                </div>
              </ScrollReveal>
            </div>

          </div>

          {/* Full-Width Interactive Google Map Section */}
          <ScrollReveal direction="up" duration={700}>
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-amber-600 text-xs font-bold uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    📍 Office Location Map
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-tight">
                    Sri Sai Ram Consultancy - LB Nagar Head Office
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Beside Reliance Market, Sagar Ring Road, Jama Thota, LB Nagar, Hyderabad, Telangana 500074
                  </p>
                </div>

                <a
                  href={mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] shrink-0 self-start sm:self-auto"
                >
                  <Navigation className="w-4 h-4 text-slate-950" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Full-Width Map Frame */}
              <div className="w-full h-96 sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                <iframe
                  title="Sri Sai Ram Consultancy LB Nagar Office Full Map"
                  src="https://maps.google.com/maps?q=Reliance+Market+Jama+Thota+Sagar+Ring+Road+LB+Nagar+Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>
    </>
  );
};

export default ContactPage;

