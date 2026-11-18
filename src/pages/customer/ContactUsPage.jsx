import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import InstagramIcon from '../../components/common/InstagramIcon';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

const ContactUsPage = () => {
  const { settings, getWhatsAppUrl } = useSettings();
  const [formData, setFormData] = useState({
    customerName: '',
    whatsappNumber: '',
    email: '',
    city: '',
    customerMessage: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.whatsappNumber.trim()) {
      setError('Please provide your name and WhatsApp number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/enquiries', {
        ...formData,
        orderStatus: 'New',
        customerMessage: formData.customerMessage || 'General enquiry from Contact Us page.'
      });

      setSuccess(true);
      // Also open WhatsApp
      const waMsg = `Hi ${settings.businessName},

My Name: ${formData.customerName}
WhatsApp: ${formData.whatsappNumber}
City: ${formData.city || 'India'}
Message: ${formData.customerMessage || 'I would like to get in touch with Santhiya Style Stone.'}`;

      window.open(getWhatsAppUrl(waMsg), '_blank');

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit enquiry. Please WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold tracking-widest text-[#B76E79] uppercase">
          We Are Here To Help
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#352525]">
          Contact Santhiya Style Stone
        </h1>
        <p className="text-xs sm:text-sm text-[#8C7A77]">
          Connect with us for custom jewellery orders, bridal consultations, delivery tracking, and wholesale enquiries across India.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact info cards */}
        <div className="space-y-4">
          
          {/* WhatsApp Card */}
          <div className="p-6 bg-[#E8F8EE] rounded-3xl border border-[#C5ECD2] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#1E3B27]">Direct WhatsApp Support</h3>
              <p className="text-xs text-[#2A5E3A] mt-0.5">
                Fastest response for video previews, price confirmation, and immediate ordering.
              </p>
            </div>
            <a
              href={getWhatsAppUrl(`Hi ${settings.businessName}, I would like to enquire about jewellery.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Open WhatsApp Chat
            </a>
          </div>

          {/* Instagram Card */}
          <div className="p-6 bg-[#FAF0F2] rounded-3xl border border-[#F3D5D9] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white flex items-center justify-center shadow-md">
              <InstagramIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#352525]">Instagram Official</h3>
              <p className="text-xs text-[#6A5A57] mt-0.5">
                Browse our reels, customer reviews, and new design reveals daily.
              </p>
            </div>
            <a
              href={settings.instagramUrl || "https://www.instagram.com/santhiya_style_stone/"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              @santhiya_style_stone
            </a>
          </div>

          {/* Business Details */}
          <div className="p-6 bg-white rounded-3xl border border-[#EBDAD4] space-y-4">
            <div className="flex items-start space-x-3 text-xs">
              <MapPin className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#352525] block">Location</strong>
                <span className="text-[#6A5A57]">{settings.address || 'Madurai & Chennai, Tamil Nadu, India'}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs">
              <Mail className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#352525] block">Email Support</strong>
                <span className="text-[#6A5A57]">{settings.email || 'santhiyastylestone@gmail.com'}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs">
              <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#352525] block">Working Hours</strong>
                <span className="text-[#6A5A57]">Monday – Saturday: 9:30 AM to 8:30 PM IST</span>
              </div>
            </div>
          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-10 border border-[#EBDAD4] shadow-sm">
          {success ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#352525]">Message Received!</h3>
              <p className="text-xs text-[#6A5A57] max-w-md mx-auto leading-relaxed">
                Thank you for reaching out, <strong>{formData.customerName}</strong>. Your enquiry has been received and saved. Our styling executive will reply via WhatsApp shortly.
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  setFormData({ customerName: '', whatsappNumber: '', email: '', city: '', customerMessage: '' });
                }}
                className="mt-4 px-6 py-2.5 bg-[#B76E79] text-white rounded-xl text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#352525] mb-1">
                Send Us a Message
              </h2>
              <p className="text-xs text-[#8C7A77] mb-6">
                Fill this quick form and we will connect with you with product availability and real photographs.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3E3D] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Rao"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3E3D] mb-1">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9840123456"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3E3D] mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. ananya@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3E3D] mb-1">
                      City / Pin Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Madurai / Bangalore"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3E3D] mb-1">
                    Your Jewellery Inquiry / Requirement
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us what you are looking for (e.g. wedding bridal choker set, antique jhumkas, delivery timeline, etc.)"
                    value={formData.customerMessage}
                    onChange={(e) => setFormData({ ...formData, customerMessage: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#B76E79] hover:bg-[#A35964] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting Enquiry...' : 'Submit Enquiry & Chat on WhatsApp'}</span>
                </button>
              </form>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default ContactUsPage;
