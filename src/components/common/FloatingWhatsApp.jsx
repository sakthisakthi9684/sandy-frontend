import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const FloatingWhatsApp = () => {
  const { settings, getWhatsAppUrl } = useSettings();
  const [showTooltip, setShowTooltip] = useState(true);

  const defaultMessage = `Hi ${settings.businessName || 'Santhiya Style Stone'}, I am visiting your website and would like some assistance choosing jewellery.`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end flex-col space-y-2 pointer-events-auto">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="bg-white text-[#352525] p-3 rounded-2xl shadow-xl border border-[#EBDAD4] max-w-xs relative animate-bounce text-xs flex items-start space-x-2">
          <p className="leading-snug">
            ✨ Need help choosing the right necklace or bridal set? <strong>Chat with us directly on WhatsApp!</strong>
          </p>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-[#A89895] hover:text-black shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Button */}
      <a
        href={getWhatsAppUrl(defaultMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all group"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="sr-only">WhatsApp Chat</span>
      </a>
    </div>
  );
};

export default FloatingWhatsApp;

