import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Sparkles, 
  Lock
} from 'lucide-react';
import InstagramIcon from '../common/InstagramIcon';
import { useSettings } from '../../context/SettingsContext';

const Footer = () => {
  const { settings, getWhatsAppUrl } = useSettings();

  return (
    <footer className="bg-[#241C1B] text-[#D8CECA] border-t border-[#3D3230]">
      {/* Trust & Guarantees Bar */}
      {/* <div className="border-b border-[#3D3230] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-3.5">
            <div className="w-12 h-12 rounded-full bg-[#B76E79]/20 flex items-center justify-center text-[#B76E79] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Shipping Across India</h4>
              <p className="text-xs text-[#A89895]">Safe, express courier delivery to all pin codes</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-3.5">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#E5C158] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Premium Quality AD & Stones</h4>
              <p className="text-xs text-[#A89895]">Handcrafted finish with enduring polish</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-3.5">
            <div className="w-12 h-12 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Instant WhatsApp Orders</h4>
              <p className="text-xs text-[#A89895]">Direct chat, real product photos & videos</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-3.5">
            <div className="w-12 h-12 rounded-full bg-[#B76E79]/20 flex items-center justify-center text-[#B76E79] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Secure Packaging</h4>
              <p className="text-xs text-[#A89895]">Bubble-wrapped velvet boxes for safe transit</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#B76E79]"></span>
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                {settings.businessName || 'Santhiya Style Stone'}
              </span>
            </div>
            <p className="text-xs tracking-widest text-[#B76E79] uppercase font-semibold">
              {settings.tagline || 'Trendy • Elegant • Affordable'}
            </p>
            <p className="text-sm text-[#B4A6A2] leading-relaxed max-w-sm">
              Your premier destination for stunning fashion jewellery. From regal bridal chokers and American Diamond solitaires to temple jhumkas, we bring timeless luxury to every celebration across India.
            </p>
            
            {/* Social Follow */}
            <div className="pt-2 flex items-center space-x-3">
              <a
                href={settings.instagramUrl || 'https://www.instagram.com/santhiya_style_stone/'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white px-3.5 py-1.5 rounded-full text-xs font-medium shadow-md transition-all"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Follow on Instagram</span>
              </a>
              <a
                href={getWhatsAppUrl('Hi Santhiya Style Stone, I would like to chat regarding your jewellery collections.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-md transition-all"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-semibold text-base tracking-wide border-b border-[#3D3230] pb-2">
              Explore Collections
            </h4>
            <ul className="space-y-2 text-sm text-[#B4A6A2]">
              <li><Link to="/shop?category=Necklace Sets" className="hover:text-[#B76E79] transition-colors">Necklace Sets</Link></li>
              <li><Link to="/shop?category=Earrings %26 Jhumkas" className="hover:text-[#B76E79] transition-colors">Earrings & Jhumkas</Link></li>
              <li><Link to="/shop?category=Bridal Jewellery" className="hover:text-[#B76E79] transition-colors">Bridal Jewellery</Link></li>
              <li><Link to="/shop?category=Bangles %26 Bracelets" className="hover:text-[#B76E79] transition-colors">Bangles & Bracelets</Link></li>
              <li><Link to="/shop?category=Stone Jewellery" className="hover:text-[#B76E79] transition-colors">Stone Jewellery</Link></li>
              <li><Link to="/shop?category=Traditional Temple Jewellery" className="hover:text-[#B76E79] transition-colors">Temple Jewellery</Link></li>
              <li><Link to="/shop?category=Combo Sets" className="hover:text-[#B76E79] transition-colors">Festive Combo Sets</Link></li>
            </ul>
          </div>

          {/* Customer Navigation */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-semibold text-base tracking-wide border-b border-[#3D3230] pb-2">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm text-[#B4A6A2]">
              <li><Link to="/shop?filter=new" className="hover:text-[#B76E79] transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?filter=bestseller" className="hover:text-[#B76E79] transition-colors">Best Sellers</Link></li>
              <li><Link to="/about" className="hover:text-[#B76E79] transition-colors">About Our Brand</Link></li>
              <li><Link to="/contact" className="hover:text-[#B76E79] transition-colors">Contact & Enquiries</Link></li>
              <li><a href="#shipping" className="hover:text-[#B76E79] transition-colors">Pan-India Delivery Policy</a></li>
              <li>
                <Link to="/admin/login" className="inline-flex items-center space-x-1 text-xs text-[#8C7A77] hover:text-[#B76E79] pt-2">
                  <Lock className="w-3 h-3" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-semibold text-base tracking-wide border-b border-[#3D3230] pb-2">
              Get in Touch
            </h4>
            <div className="space-y-2.5 text-xs text-[#B4A6A2]">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
                <span>{settings.address || 'Madurai & Chennai, Tamil Nadu, India'}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#B76E79] shrink-0" />
                <a href={`tel:${settings.displayPhone}`} className="hover:text-white transition-colors">
                  {settings.displayPhone || '+91 98765 43210'}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#B76E79] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors truncate">
                  {settings.email || 'santhiyastylestone@gmail.com'}
                </a>
              </div>
              <div className="flex items-center space-x-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>WhatsApp Support: 9:00 AM – 9:00 PM</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#322827] py-4 bg-[#1E1716] text-center text-xs text-[#8C7A77]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} {settings.businessName || 'Santhiya Style Stone'}. All rights reserved.</p>
          <p className="flex items-center space-x-2">
            <span>Trendy • Elegant • Affordable Fashion Jewellery</span>
            <span>•</span>
            <span className="text-[#B76E79]">Shipping Across India</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
