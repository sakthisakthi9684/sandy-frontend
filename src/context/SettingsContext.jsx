import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    businessName: 'Santhiya Style Stone',
    tagline: 'Trendy • Elegant • Affordable',
    whatsappNumber: '919876543210',
    displayPhone: '+91 98765 43210',
    email: 'santhiyastylestone@gmail.com',
    address: 'Madurai & Chennai, Tamil Nadu, India',
    instagramUrl: 'https://www.instagram.com/santhiya_style_stone/',
    facebookUrl: 'https://facebook.com',
    announcementText: '✨ Special Festive Offer: Free Express Shipping Across India on Orders Above ₹999 | Direct WhatsApp Ordering Available',
    shippingInfo: 'Pan-India Express Shipping: Dispatched with insured luxury packing. Delivered within 3-7 business days across India.',
    aboutUsTitle: 'Santhiya Style Stone – Trendy • Elegant • Affordable Fashion Jewellery',
    aboutUsText: 'At Santhiya Style Stone, we believe every woman deserves to radiate confidence and royalty without an exorbitant price tag. Specializing in high-grade CZ, American Diamond, antique matte finish, temple jewellery, and daily wear elegance.',
    heroBanners: []
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data && res.data.settings) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      console.warn('Could not fetch settings, using defaults:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Format a WhatsApp URL with custom pre-filled text
  const getWhatsAppUrl = (messageText) => {
    const cleanNumber = (settings.whatsappNumber || '919876543210').replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(messageText);
    return `https://wa.me/${cleanNumber}?text=${encoded}`;
  };

  // Helper for single product order message required by prompt:
  // "Hi Santhiya Style Stone,
  //
  // I am interested in this jewellery product.
  //
  // Product: [Product Name]
  // Price: ₹[Selling Price]
  // Product Code: [SKU]
  // Quantity: [Quantity]
  //
  // Please share more details."
  const getProductWhatsAppUrl = (product, quantity = 1) => {
    const message = `Hi ${settings.businessName || 'Santhiya Style Stone'},

I am interested in this jewellery product.

Product: ${product.name}
Price: ₹${product.sellingPrice}
Product Code: ${product.sku || 'N/A'}
Quantity: ${quantity}

Please share more details.`;

    return getWhatsAppUrl(message);
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      loading,
      refreshSettings: fetchSettings,
      getWhatsAppUrl,
      getProductWhatsAppUrl
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

