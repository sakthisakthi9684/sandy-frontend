import React from 'react';
import { Sparkles, ShieldCheck, Heart, Truck, Phone } from 'lucide-react';
import InstagramIcon from '../../components/common/InstagramIcon';
import { useSettings } from '../../context/SettingsContext';

const AboutUsPage = () => {
  const { settings, getWhatsAppUrl } = useSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Hero section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold tracking-widest text-[#B76E79] uppercase">
          Crafting Affordable Elegance
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#352525]">
          {settings.aboutUsTitle || 'The Story of Santhiya Style Stone'}
        </h1>
        <p className="text-xs sm:text-base text-[#6A5A57] leading-relaxed">
          {settings.aboutUsText || 'Santhiya Style Stone was founded with a passion to bring royal, trendy, and high-quality fashion jewellery within reach of every woman across India.'}
        </p>
      </div>

      {/* Brand Visual Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-xl border border-[#EBDAD4]">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80"
            alt="Jewellery Craftsmanship"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B76E79]">Our Promise</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#352525]">
              Trendy • Elegant • Affordable
            </h2>
            <p className="text-xs sm:text-sm text-[#5A4D4B] leading-relaxed">
              We understand that modern women love to vary their jewellery with each outfit and occasion without compromising on the royal weight, brilliance, and finish of traditional heirloom jewellery.
            </p>
            <p className="text-xs sm:text-sm text-[#5A4D4B] leading-relaxed">
              Each piece in our catalogue is curated from seasoned artisans, meticulously inspected for stone stability, micro-plating luster, and comfort, ensuring that you shine brightly throughout weddings, festivals, temple rituals, and cocktail evenings.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[#FAF6F4] rounded-2xl border border-[#EBDAD4]">
              <Sparkles className="w-6 h-6 text-[#D4AF37] mb-2" />
              <h4 className="font-serif font-bold text-sm text-[#352525]">AAA+ Quality Stones</h4>
              <p className="text-[11px] text-[#8C7A77] mt-1">Swiss cut CZ, Austrian crystals, and authentic Kempu stones.</p>
            </div>
            <div className="p-4 bg-[#FAF6F4] rounded-2xl border border-[#EBDAD4]">
              <Truck className="w-6 h-6 text-[#B76E79] mb-2" />
              <h4 className="font-serif font-bold text-sm text-[#352525]">Across India Delivery</h4>
              <p className="text-[11px] text-[#8C7A77] mt-1">Insured, secure express parcel dispatched to all pin codes.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social & Contact CTA */}
      <div className="bg-[#FAF0F2] rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4 border border-[#F0D5DA]">
        <span className="text-xs font-bold text-[#9B4D5A] uppercase tracking-wider">
          Connect With Our Stylists
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#352525]">
          Have a Custom Requirement or Wedding Order?
        </h3>
        <p className="text-xs sm:text-sm text-[#6A5A57] max-w-xl mx-auto">
          We are just a WhatsApp message away. Send us your outfit photo, and our team will share matching jewellery recommendations and live videos.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <a
            href={getWhatsAppUrl(`Hi ${settings.businessName}, I would like bridal/styling advice for my upcoming event.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold rounded-full shadow-md flex items-center space-x-2"
          >
            <Phone className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
          <a
            href={settings.instagramUrl || "https://www.instagram.com/santhiya_style_stone/"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white text-xs font-bold rounded-full shadow-md flex items-center space-x-2"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow @santhiya_style_stone</span>
          </a>
        </div>
      </div>

    </div>
  );
};

export default AboutUsPage;
