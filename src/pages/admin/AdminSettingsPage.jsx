import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import InstagramIcon from '../../components/common/InstagramIcon';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

const AdminSettingsPage = () => {
  const { refreshSettings } = useSettings();
  const [formData, setFormData] = useState({
    businessName: 'Santhiya Style Stone',
    tagline: 'Trendy • Elegant • Affordable',
    whatsappNumber: '919876543210',
    displayPhone: '+91 98765 43210',
    email: 'santhiyastylestone@gmail.com',
    address: 'Madurai & Chennai, Tamil Nadu, India',
    instagramUrl: 'https://www.instagram.com/santhiya_style_stone/',
    facebookUrl: 'https://facebook.com',
    announcementText: '✨ Special Festive Offer: Free Express Shipping Across India on Orders Above ₹999 | Direct WhatsApp Ordering Available',
    shippingInfo: 'Pan-India Express Shipping: Dispatched with insured luxury packing. Delivered within 3-7 business days across all states.',
    aboutUsTitle: 'Santhiya Style Stone – Trendy • Elegant • Affordable Fashion Jewellery',
    aboutUsText: 'At Santhiya Style Stone, we believe every woman deserves to radiate confidence and royalty without an exorbitant price tag. Specializing in high-grade CZ, American Diamond, antique matte finish, temple jewellery, and daily wear elegance.',
    heroBanners: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data?.settings) {
          setFormData({
            ...res.data.settings,
            heroBanners: res.data.settings.heroBanners || []
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleBannerChange = (index, field, value) => {
    const updated = [...formData.heroBanners];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, heroBanners: updated });
  };

  const addBanner = () => {
    const newBanner = {
      title: 'New Royal Jewellery Collection',
      subtitle: 'Handcrafted Elegance For Special Celebrations',
      badge: 'Exclusive Design',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=80',
      buttonText: 'Shop Collection',
      buttonLink: '/shop'
    };
    setFormData({ ...formData, heroBanners: [...formData.heroBanners, newBanner] });
  };

  const removeBanner = (index) => {
    const updated = formData.heroBanners.filter((_, i) => i !== index);
    setFormData({ ...formData, heroBanners: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await api.put('/settings', formData);
      setSuccess(true);
      refreshSettings();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-[#B76E79] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#352525]">
            Website Settings & Brand Profile
          </h1>
          <p className="text-xs text-[#8C7A77]">
            Configure store info, WhatsApp numbers, Instagram links, banners, and announcement texts
          </p>
        </div>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Website settings updated successfully! Changes are live on the customer store.</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* 1. Brand Identity */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBDAD4] space-y-4 shadow-xs">
          <h3 className="font-serif font-bold text-base text-[#352525] border-b border-[#F0E6E1] pb-2">
            1. Brand Identity & Tagline
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#4A3E3D] mb-1">Business Name *</label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3E3D] mb-1">Brand Tagline *</label>
              <input
                type="text"
                required
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
              />
            </div>
          </div>
        </div>

        {/* 2. WhatsApp & Social Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBDAD4] space-y-4 shadow-xs">
          <h3 className="font-serif font-bold text-base text-[#352525] border-b border-[#F0E6E1] pb-2 flex items-center space-x-2">
            <Phone className="w-4 h-4 text-[#25D366]" />
            <span>2. WhatsApp Ordering & Contact Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#4A3E3D] mb-1">
                WhatsApp Order Number (Digits with Country Code, no spaces/+) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 919876543210"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
                className="w-full px-3 py-2 font-mono bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
              />
              <p className="text-[10px] text-[#8C7A77] mt-1">This number receives all 1-click WhatsApp orders and enquiries.</p>
            </div>

            <div>
              <label className="block font-semibold text-[#4A3E3D] mb-1">
                Display Phone Number (Formatted for site visitors)
              </label>
              <input
                type="text"
                value={formData.displayPhone}
                onChange={(e) => setFormData({ ...formData, displayPhone: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3E3D] mb-1">
                Instagram URL *
              </label>
              <input
                type="url"
                required
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3E3D] mb-1">Support Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#4A3E3D] mb-1">Store / Business Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
            />
          </div>
        </div>

        {/* 3. Announcement Bar & Shipping */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBDAD4] space-y-4 shadow-xs">
          <h3 className="font-serif font-bold text-base text-[#352525] border-b border-[#F0E6E1] pb-2 flex items-center space-x-2">
            <Truck className="w-4 h-4 text-[#B76E79]" />
            <span>3. Top Announcement & Shipping Policy</span>
          </h3>

          <div>
            <label className="block font-semibold text-[#4A3E3D] mb-1">Top Announcement Bar Text</label>
            <textarea
              rows={2}
              value={formData.announcementText}
              onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
              className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#4A3E3D] mb-1">Pan-India Shipping Policy Details</label>
            <textarea
              rows={2}
              value={formData.shippingInfo}
              onChange={(e) => setFormData({ ...formData, shippingInfo: e.target.value })}
              className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
            />
          </div>
        </div>

        {/* 4. About Us Content */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBDAD4] space-y-4 shadow-xs">
          <h3 className="font-serif font-bold text-base text-[#352525] border-b border-[#F0E6E1] pb-2">
            4. About Us Page Content
          </h3>

          <div>
            <label className="block font-semibold text-[#4A3E3D] mb-1">About Us Title</label>
            <input
              type="text"
              value={formData.aboutUsTitle}
              onChange={(e) => setFormData({ ...formData, aboutUsTitle: e.target.value })}
              className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#4A3E3D] mb-1">Story & Heritage Text</label>
            <textarea
              rows={4}
              value={formData.aboutUsText}
              onChange={(e) => setFormData({ ...formData, aboutUsText: e.target.value })}
              className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
            />
          </div>
        </div>

        {/* 5. Hero Banners */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBDAD4] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F0E6E1] pb-2">
            <h3 className="font-serif font-bold text-base text-[#352525]">
              5. Homepage Hero Banners ({formData.heroBanners.length})
            </h3>
            <button
              type="button"
              onClick={addBanner}
              className="text-xs font-semibold text-[#B76E79] hover:underline flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slide</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.heroBanners.map((banner, idx) => (
              <div key={idx} className="p-4 bg-[#FAF7F5] rounded-xl border border-[#EBDAD4] space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeBanner(idx)}
                  className="absolute top-3 right-3 text-[#A89895] hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                  <div>
                    <label className="block font-semibold text-[#4A3E3D] mb-0.5">Headline Title</label>
                    <input
                      type="text"
                      value={banner.title}
                      onChange={(e) => handleBannerChange(idx, 'title', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E0D0CB] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#4A3E3D] mb-0.5">Badge Pill</label>
                    <input
                      type="text"
                      value={banner.badge}
                      onChange={(e) => handleBannerChange(idx, 'badge', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E0D0CB] rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#4A3E3D] mb-0.5">Subtitle</label>
                  <input
                    type="text"
                    value={banner.subtitle}
                    onChange={(e) => handleBannerChange(idx, 'subtitle', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E0D0CB] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#4A3E3D] mb-0.5">Background Image URL</label>
                  <input
                    type="text"
                    value={banner.image}
                    onChange={(e) => handleBannerChange(idx, 'image', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E0D0CB] rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#B76E79] hover:bg-[#A35964] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Website Settings...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default AdminSettingsPage;
