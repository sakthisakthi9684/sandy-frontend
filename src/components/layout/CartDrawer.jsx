import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight,
  Send,
  Truck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import DirectEnquiryModal from '../common/DirectEnquiryModal';

const CartDrawer = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    getCartWhatsAppUrl,
    clearCart
  } = useCart();
  const { settings } = useSettings();
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const diffToFree = freeShippingThreshold - subtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#EBDAD4] flex items-center justify-between bg-[#FDFBF9]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#B76E79]" />
              <h2 className="font-serif text-lg font-bold text-[#352525]">Your Jewellery Cart</h2>
              <span className="bg-[#F8E2E5] text-[#9B4D5A] text-xs font-semibold px-2 py-0.5 rounded-full">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#8C7A77] hover:text-black rounded-lg hover:bg-[#F3ECE8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pan-India Free Shipping Progress Bar */}
          <div className="bg-[#FAF6F4] px-5 py-3 border-b border-[#EBDAD4]">
            <div className="flex items-center justify-between text-xs font-medium text-[#4A3E3D] mb-1.5">
              <span className="flex items-center space-x-1.5">
                <Truck className="w-3.5 h-3.5 text-[#B76E79]" />
                {subtotal >= freeShippingThreshold ? (
                  <span className="text-emerald-700 font-bold">✨ You unlocked FREE Pan-India Shipping!</span>
                ) : (
                  <span>Add <strong className="text-[#B76E79]">₹{diffToFree}</strong> more for FREE Pan-India Shipping</span>
                )}
              </span>
              <span className="font-bold text-[#B76E79]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#E5D7D2] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#B76E79] to-[#D4AF37] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#FBF4F2] flex items-center justify-center text-[#B76E79]/60">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#352525]">Your Cart is Empty</h3>
                  <p className="text-xs text-[#8C7A77] mt-1 max-w-xs">
                    Explore our trendy, elegant, and affordable fashion jewellery collections!
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-[#B76E79] text-white rounded-full text-xs font-semibold hover:bg-[#A35964] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item._id} className="flex gap-3.5 p-3 rounded-xl border border-[#F0E4E0] bg-[#FFFDFB] hover:shadow-xs transition-shadow">
                  {/* Thumbnail */}
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg border border-[#EBDAD4] shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-semibold text-[#352525] line-clamp-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-[#B5A5A1] hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-[#8C7A77] mt-0.5 font-mono">
                        SKU: {item.sku}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-1 text-sm font-bold text-[#8C3A48]">
                        <span>₹{item.sellingPrice}</span>
                        {item.originalPrice > item.sellingPrice && (
                          <span className="text-[10px] text-[#A89895] line-through font-normal">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center border border-[#E0D0CB] rounded-md bg-white">
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="p-1 text-[#4A3E3D] hover:bg-[#F3ECE8] rounded-l transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#352525]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
                          className="p-1 text-[#4A3E3D] hover:bg-[#F3ECE8] rounded-r transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#EBDAD4] bg-[#FDFBF9] space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6D5D5A]">Subtotal</span>
                <span className="font-serif text-lg font-bold text-[#352525]">₹{subtotal}</span>
              </div>
              <p className="text-[11px] text-[#8C7A77]">
                Shipping calculated at checkout. Direct WhatsApp order verification with video preview available.
              </p>

              {/* Order on WhatsApp Button */}
              <a
                href={getCartWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20BD5A] text-white py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <span>Checkout via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Direct Enquiry Button */}
              <button
                onClick={() => setEnquiryModalOpen(true)}
                className="w-full flex items-center justify-center space-x-2 bg-white border border-[#B76E79] text-[#9B4D5A] hover:bg-[#FDF0F2] py-2.5 rounded-xl text-xs font-semibold transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Order / Enquiry to Store</span>
              </button>

              <div className="flex justify-between items-center pt-1 text-[11px] text-[#8C7A77]">
                <button
                  onClick={clearCart}
                  className="hover:text-red-600 transition-colors underline"
                >
                  Clear Cart
                </button>
                <span>Pan-India Delivery</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Direct Enquiry Modal */}
      {enquiryModalOpen && (
        <DirectEnquiryModal
          isOpen={enquiryModalOpen}
          onClose={() => setEnquiryModalOpen(false)}
          cartItems={cartItems}
          totalAmount={subtotal}
        />
      )}
    </div>
  );
};

export default CartDrawer;

