import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Phone, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import InstagramIcon from '../common/InstagramIcon';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { settings, getWhatsAppUrl } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    // { name: 'All Jewellery', path: '/shop' },
    // { name: 'New Arrivals', path: '/shop?filter=new' },
    // { name: 'Best Sellers', path: '/shop?filter=bestseller' },
    { name: 'Collections', path: '/collections' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F0E6E1] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#8C3A48] via-[#B76E79] to-[#8C3A48] text-white py-1.5 px-4 text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <Sparkles className="w-3.5 h-3.5 text-[#F8E2B2] shrink-0 animate-pulse" />
            <span className="truncate">{settings.announcementText}</span>
          </div>
          <div className="hidden sm:flex items-center space-x-4 shrink-0 text-[11px]">
            <a 
              href={settings.instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center space-x-1 hover:text-[#F8E2B2] transition-colors"
            >
              <InstagramIcon className="w-3 h-3" />
              <span>@santhiya_style_stone</span>
            </a>
            <span className="text-[#F8E2B2]/50">|</span>
            <a 
              href={getWhatsAppUrl('Hi Santhiya Style Stone, I would like to enquire about jewellery.')}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F8E2B2] transition-colors font-semibold"
            >
              WhatsApp: {settings.displayPhone || '+91 98765 43210'}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4A3E3D] hover:text-[#B76E79] focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo & Name */}
          <Link to="/" className="flex flex-col items-center group text-center py-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#B76E79]"></span>
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-[#352525] group-hover:text-[#B76E79] transition-colors">
                {settings.businessName || 'Santhiya Style Stone'}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#B76E79]"></span>
            </div>
            <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#937C78] uppercase font-medium mt-0.5">
              {settings.tagline || 'Trendy • Elegant • Affordable'}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm tracking-wide font-medium transition-colors hover:text-[#B76E79] relative py-1 ${
                    isActive ? 'text-[#B76E79] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#B76E79]' : 'text-[#4A3E3D]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Search Trigger */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#4A3E3D] hover:text-[#B76E79] hover:bg-[#FAF5F2] rounded-full transition-colors"
                title="Search jewellery"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Search Dropdown / Input */}
              {searchOpen && (
                <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-white shadow-xl rounded-xl border border-[#EBDAD4] p-3 z-50 animate-fadeIn">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      placeholder="Search necklace, earrings, bangles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full pl-9 pr-9 py-2 text-sm bg-[#FAF7F5] border border-[#EADBD5] rounded-lg focus:outline-none focus:border-[#B76E79] focus:bg-white"
                    />
                    <Search className="w-4 h-4 text-[#A89895] absolute left-3 top-2.5" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-2.5 text-[#A89895] hover:text-black"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </form>
                </div>
              )}
            </div>

            {/* Shopping Cart Drawer Trigger
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#4A3E3D] hover:text-[#B76E79] hover:bg-[#FAF5F2] rounded-full transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B76E79] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalItems}
                </span>
              )}
            </button> */}

            {/* WhatsApp Quick Order button */}
            <a
              href={getWhatsAppUrl(`Hi ${settings.businessName}, I would like to enquire about jewellery.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center space-x-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold px-3.5 py-2 rounded-full shadow-sm hover:shadow-md transition-all"
            >
              <span>Order on WhatsApp</span>
            </a>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#F0E6E1] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search jewellery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#FAF7F5] border border-[#EADBD5] rounded-lg focus:outline-none focus:border-[#B76E79]"
            />
            <Search className="w-4 h-4 text-[#A89895] absolute left-3 top-2.5" />
          </form>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#FDF0F2] text-[#B76E79] font-bold' : 'text-[#4A3E3D] hover:bg-[#FAF5F2]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-t border-[#F0E6E1] flex flex-col space-y-2">
            <a
              href={getWhatsAppUrl(`Hi ${settings.businessName}, I would like to enquire about your jewellery collection.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 bg-[#25D366] text-white py-2.5 rounded-lg text-sm font-semibold"
            >
              <span>Order via WhatsApp</span>
            </a>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white py-2 rounded-lg text-sm font-medium"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Follow @santhiya_style_stone</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
