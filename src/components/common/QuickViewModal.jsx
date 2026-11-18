import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  ShoppingBag, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles,
  Plus, 
  Minus,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { DEFAULT_PRODUCT_IMAGE, resolveImageUrl } from '../../utils/imageUrl';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const { addToCart } = useCart();
  const { getProductWhatsAppUrl } = useSettings();
  const [selectedImage, setSelectedImage] = useState(
    resolveImageUrl(product.images?.[0], DEFAULT_PRODUCT_IMAGE)
  );
  const [quantity, setQuantity] = useState(1);

  const images = product.images?.length
    ? product.images.map((image) => resolveImageUrl(image, DEFAULT_PRODUCT_IMAGE))
    : [selectedImage];
  const isOutOfStock = product.stockQuantity <= 0 || product.stockStatus === 'OUT_OF_STOCK';
  const isLowStock = !isOutOfStock && (product.stockQuantity <= (product.lowStockThreshold || 5) || product.stockStatus === 'LOW_STOCK');

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#EBDAD4] z-10 animate-fadeIn">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#8C7A77] hover:text-black hover:bg-[#F3ECE8] rounded-full z-20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery */}
            <div className="p-6 bg-[#FAF6F4] flex flex-col items-center justify-between">
              <div className="aspect-square w-full rounded-2xl overflow-hidden border border-[#E8D8D3] bg-white">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto w-full py-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImage === img ? 'border-[#B76E79] shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-bold text-[#B76E79] uppercase tracking-wider">
                    {product.categoryName || 'Jewellery'}
                  </span>
                  <span className="text-[#A89895]">•</span>
                  <span className="font-mono text-[#8C7A77]">SKU: {product.sku}</span>
                </div>

                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#352525] mt-1.5 leading-snug">
                  {product.name}
                </h2>

                {/* Stock status indicator */}
                <div className="mt-2.5">
                  {isOutOfStock ? (
                    <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Currently Out of Stock</span>
                    </span>
                  ) : isLowStock ? (
                    <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Low Stock – Only {product.stockQuantity} pieces remaining</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>In Stock – Ready for Immediate Pan-India Dispatch</span>
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline space-x-3 mt-4">
                  <span className="font-serif text-2xl font-bold text-[#8C3A48]">
                    ₹{product.sellingPrice}
                  </span>
                  {product.originalPrice > product.sellingPrice && (
                    <>
                      <span className="text-sm text-[#A89895] line-through">
                        ₹{product.originalPrice}
                      </span>
                      <span className="bg-[#B76E79]/10 text-[#9B4D5A] text-xs font-bold px-2 py-0.5 rounded-full">
                        {product.discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs text-[#6A5A57] mt-3 leading-relaxed line-clamp-3">
                  {product.description}
                </p>

                {/* Specs Pill Summary */}
                {product.specifications && (
                  <div className="mt-4 pt-3 border-t border-[#F0E6E1] text-[11px] space-y-1 text-[#6A5A57]">
                    {product.specifications.material && (
                      <p><strong>Material:</strong> {product.specifications.material}</p>
                    )}
                    {product.specifications.stoneType && (
                      <p><strong>Stone:</strong> {product.specifications.stoneType}</p>
                    )}
                    {product.specifications.plating && (
                      <p><strong>Plating:</strong> {product.specifications.plating}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-3 pt-2">
                {!isOutOfStock && (
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-semibold text-[#4A3E3D]">Quantity:</span>
                    <div className="flex items-center border border-[#D9C4BD] rounded-lg bg-white">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1.5 text-[#4A3E3D] hover:bg-[#F3ECE8] rounded-l"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stockQuantity || 99, quantity + 1))}
                        className="p-1.5 text-[#4A3E3D] hover:bg-[#F3ECE8] rounded-r"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-[#B76E79] hover:bg-[#A35964] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <a
                    href={getProductWhatsAppUrl(product, quantity)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>Order via WhatsApp</span>
                  </a>
                </div>

                <div className="text-center pt-1">
                  <Link
                    to={`/product/${product._id}`}
                    onClick={onClose}
                    className="inline-flex items-center space-x-1 text-xs text-[#B76E79] hover:underline font-semibold"
                  >
                    <span>View Complete Product Details & Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;

