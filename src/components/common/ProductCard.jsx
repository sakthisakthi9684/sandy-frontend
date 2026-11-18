import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Eye, 
  Sparkles, 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import QuickViewModal from './QuickViewModal';
import { DEFAULT_PRODUCT_IMAGE, resolveImageUrl } from '../../utils/imageUrl';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { getProductWhatsAppUrl } = useSettings();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = resolveImageUrl(product.images?.[0], DEFAULT_PRODUCT_IMAGE);
  const secondaryImage = resolveImageUrl(product.images?.[1], primaryImage);

  const isOutOfStock = product.stockQuantity <= 0 || product.stockStatus === 'OUT_OF_STOCK';
  const isLowStock = !isOutOfStock && (product.stockQuantity <= (product.lowStockThreshold || 5) || product.stockStatus === 'LOW_STOCK');

  return (
    <>
      <div 
        className="group relative bg-white rounded-2xl border border-[#EFE5E0] hover:border-[#D6B5AF] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container with Badges */}
        <div className="relative aspect-square w-full overflow-hidden bg-[#FAF6F4]">
          <Link to={`/product/${product._id}`}>
            <img
              src={isHovered ? secondaryImage : primaryImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
              onError={(event) => {
                if (event.currentTarget.src !== DEFAULT_PRODUCT_IMAGE) {
                  event.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                }
              }}
            />
          </Link>

          {/* Badges Stack */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {product.discountPercentage > 0 && (
              <span className="bg-[#B76E79] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs tracking-wider">
                {product.discountPercentage}% OFF
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-[#D4AF37] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs flex items-center space-x-1">
                <Flame className="w-3 h-3" />
                <span>Best Seller</span>
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-[#2D2424] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#F8E2B2]" />
                <span>New</span>
              </span>
            )}
          </div>

          {/* Stock Status Badge */}
          <div className="absolute top-2.5 right-2.5 z-10">
            {isOutOfStock ? (
              <span className="bg-red-500/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-xs">
                <XCircle className="w-3 h-3" />
                <span>Out of Stock</span>
              </span>
            ) : isLowStock ? (
              <span className="bg-amber-600/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-xs animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                <span>Only {product.stockQuantity} left</span>
              </span>
            ) : (
              <span className="bg-emerald-600/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-xs">
                <CheckCircle2 className="w-3 h-3" />
                <span>In Stock</span>
              </span>
            )}
          </div>

          {/* Floating Quick Action Overlay */}
          <div className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button
              onClick={() => setQuickViewOpen(true)}
              className="bg-white/95 backdrop-blur-xs hover:bg-[#B76E79] hover:text-white text-[#352525] p-2.5 rounded-full shadow-md transition-colors"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
            {!isOutOfStock && (
              <button
                onClick={() => addToCart(product, 1)}
                className="bg-white/95 backdrop-blur-xs hover:bg-[#B76E79] hover:text-white text-[#352525] p-2.5 rounded-full shadow-md transition-colors"
                title="Add to Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content details */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Category & SKU */}
            <div className="flex items-center justify-between text-[11px] text-[#8C7A77] mb-1">
              <span className="uppercase tracking-wider font-semibold text-[#B76E79]">
                {product.categoryName || 'Jewellery'}
              </span>
              <span className="font-mono text-[10px]">
                {product.sku}
              </span>
            </div>

            {/* Product Title */}
            <Link to={`/product/${product._id}`}>
              <h3 className="font-serif text-sm font-semibold text-[#352525] hover:text-[#B76E79] line-clamp-2 transition-colors leading-snug">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="pt-3">
            {/* Price section */}
            <div className="flex items-baseline space-x-2">
              <span className="font-serif text-lg font-bold text-[#8C3A48]">
                ₹{product.sellingPrice}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <span className="text-xs text-[#A89895] line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                to={`/product/${product._id}`}
                className="w-full text-center py-2 px-2 text-xs font-semibold rounded-xl border border-[#D9C4BD] text-[#4A3E3D] hover:bg-[#F8EFEA] hover:border-[#B76E79] transition-colors"
              >
                View Details
              </Link>

              {/* WhatsApp Order Button */}
              <a
                href={getProductWhatsAppUrl(product, 1)}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center space-x-1 py-2 px-2 text-xs font-semibold rounded-xl transition-all ${
                  isOutOfStock 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none' 
                    : 'bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xs hover:shadow-md'
                }`}
              >
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <QuickViewModal
          product={product}
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
};

export default ProductCard;

