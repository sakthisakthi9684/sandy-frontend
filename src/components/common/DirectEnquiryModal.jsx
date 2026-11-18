import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

const DirectEnquiryModal = ({ isOpen, onClose, product = null, cartItems = [], totalAmount = 0 }) => {
  const { settings, getWhatsAppUrl } = useSettings();
  const [formData, setFormData] = useState({
    customerName: '',
    whatsappNumber: '',
    email: '',
    city: '',
    address: '',
    customerMessage: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.whatsappNumber.trim()) {
      setError('Please provide your name and WhatsApp number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        customerName: formData.customerName,
        whatsappNumber: formData.whatsappNumber,
        email: formData.email,
        city: formData.city,
        address: formData.address,
        customerMessage: formData.customerMessage,
        productId: product ? product._id : null,
        productDetails: product ? {
          name: product.name,
          sku: product.sku,
          price: product.sellingPrice,
          image: (product.images && product.images[0]) || ''
        } : null,
        cartItems: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          sku: item.sku,
          price: item.sellingPrice,
          quantity: item.quantity,
          image: item.image
        })),
        quantity: product ? 1 : cartItems.reduce((s, i) => s + i.quantity, 0),
        totalAmount: product ? product.sellingPrice : totalAmount
      };

      await api.post('/enquiries', payload);
      setSuccess(true);

      // Also construct WhatsApp prefill message and launch in new tab
      let waMessage = `Hi ${settings.businessName || 'Santhiya Style Stone'},

I have submitted an enquiry/order from your website.

Customer Name: ${formData.customerName}
WhatsApp: ${formData.whatsappNumber}
City: ${formData.city || 'India'}
${product ? `Product: ${product.name} (${product.sku}) - ₹${product.sellingPrice}\n` : ''}
${cartItems.length > 0 ? `Total Items: ${cartItems.length} | Amount: ₹${totalAmount}\n` : ''}
Message: ${formData.customerMessage || 'Please share availability and dispatch time.'}`;

      const waUrl = getWhatsAppUrl(waMessage);
      window.open(waUrl, '_blank');

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit enquiry. Please message us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#EBDAD4] z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#8C7A77] hover:text-black hover:bg-[#F3ECE8] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#352525]">Enquiry Received!</h3>
              <p className="text-xs text-[#6A5A57] max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{formData.customerName}</strong>! Your jewellery enquiry has been recorded in our system. A WhatsApp window has also been opened to connect with our styling team directly.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-[#B76E79] text-white rounded-xl text-xs font-semibold hover:bg-[#A35964]"
              >
                Close Window
              </button>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <h3 className="font-serif text-2xl font-bold text-[#352525]">Direct Store Enquiry</h3>
                <p className="text-xs text-[#8C7A77] mt-1">
                  Connect directly with Santhiya Style Stone for order confirmation & dispatch
                </p>
                {product && (
                  <div className="mt-3 p-2.5 bg-[#FAF6F4] rounded-xl flex items-center space-x-3 text-left border border-[#F0E4E0]">
                    <img 
                      src={(product.images && product.images[0]) || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80'} 
                      alt="" 
                      className="w-12 h-12 object-cover rounded-lg border border-[#E8D8D3]"
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#352525] line-clamp-1">{product.name}</p>
                      <p className="text-[11px] text-[#B76E79] font-bold">₹{product.sellingPrice} • {product.sku}</p>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3E3D] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sundaram"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3E3D] mb-1">
                      City / Pin Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chennai, 600040"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3E3D] mb-1">
                    Delivery Address (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="House/Street, Area"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3E3D] mb-1">
                    Message or Custom Request
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ask about live videos, matching bangles, express shipping, etc."
                    value={formData.customerMessage}
                    onChange={(e) => setFormData({ ...formData, customerMessage: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 bg-[#B76E79] hover:bg-[#A35964] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting Enquiry...' : 'Submit & Connect on WhatsApp'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectEnquiryModal;

