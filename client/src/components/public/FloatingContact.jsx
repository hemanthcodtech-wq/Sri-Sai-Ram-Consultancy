import { Phone, MessageCircle } from 'lucide-react';

const FloatingContact = () => {
  const whatsappNumber = import.meta.env.VITE_COMPANY_WHATSAPP || '919505151527';
  const phoneNumber = import.meta.env.VITE_COMPANY_PHONE_RAW || '9505151527';
  const defaultMessage = encodeURIComponent(
    'Hello Sri Sai Ram Consultancy! I would like to hire Driver / Helper / Captain services.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 items-end">
      
      {/* Click to Call Floating Button */}
      <a
        href={`tel:${phoneNumber}`}
        className="group flex items-center gap-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl shadow-blue-600/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-white/20"
        title="Call 9505151527"
        aria-label="Call Sri Sai Ram Consultancy"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <Phone className="w-5 h-5 text-white animate-bounce" />
        </div>
        <span className="hidden sm:inline-block font-bold text-xs tracking-wide">
          Call: {phoneNumber}
        </span>
      </a>

      {/* Click to WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl shadow-green-600/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-white/20"
        title="Chat on WhatsApp"
        aria-label="WhatsApp Sri Sai Ram Consultancy"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <span className="hidden sm:inline-block font-bold text-xs tracking-wide">
          WhatsApp Us
        </span>
      </a>

    </div>
  );
};

export default FloatingContact;
