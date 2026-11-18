import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Phone, 
  Send, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronRight, 
  Plus, 
  Minus,
  Share2,
  Heart
} from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import ProductCard from '../../components/common/ProductCard';
import { DEFAULT_PRODUCT_IMAGE, resolveImageUrl } from '../../utils/imageUrl';
import DirectEnquiryModal from '../../components/common/DirectEnquiryModal';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { settings, getProductWhatsAppUrl, getWhatsAppUrl } = useSettings();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data?.product) {
          setProduct(res.data.product);
          setActiveImage(resolveImageUrl(res.data.product.images?.[0], DEFAULT_PRODUCT_IMAGE));
          if (res.data.related) {
            setRelated(res.data.related);
          }
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#B76E79] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-[#8C7A77] mt-3">Loading royal jewellery details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#352525]">Product Not Found</h2>
        <p className="text-xs text-[#8C7A77]">The jewellery item you are looking for is currently unavailable or inactive.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-[#B76E79] text-white rounded-full text-xs font-semibold">
          Browse All Collections
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0 || product.stockStatus === 'OUT_OF_STOCK';
  const isLowStock = !isOutOfStock && (product.stockQuantity <= (product.lowStockThreshold || 5) || product.stockStatus === 'LOW_STOCK');

  const images = product.images?.length
    ? product.images.map((image) => resolveImageUrl(image, DEFAULT_PRODUCT_IMAGE))
    : [activeImage];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-[#8C7A77]">
        <Link to="/" className="hover:text-[#B76E79]">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-[#B76E79]">Jewellery</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/shop?category=${encodeURIComponent(product.categoryName)}`} className="hover:text-[#B76E79]">
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#352525] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        
        {/* Left: Interactive Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-3xl overflow-hidden bg-[#FAF6F4] border border-[#EBDAD4] shadow-md relative group">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
              }}
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 bg-[#B76E79] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === img ? 'border-[#B76E79] shadow-md scale-95' : 'border-[#EBDAD4] opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="bg-[#FAF6F4] p-4 rounded-2xl border border-[#EBDAD4] grid grid-cols-2 gap-4 text-xs text-[#5A4D4B]">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#B76E79] shrink-0" />
              <span>Pan-India Dispatch in 24-48 hrs</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Premium Luxury Packaging</span>
            </div>
          </div>
        </div>

        {/* Right: Product Details, Stock, Pricing & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Category & SKU */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B76E79]">
                {product.categoryName}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-[#8C7A77]">SKU: {product.sku}</span>
                <button
                  onClick={handleShare}
                  className="p-1.5 text-[#8C7A77] hover:text-[#B76E79] hover:bg-[#FAF5F2] rounded-full transition-colors"
                  title="Share product link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                {copiedLink && (
                  <span className="text-[10px] text-emerald-600 font-semibold">Copied!</span>
                )}
              </div>
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#352525] leading-snug">
              {product.name}
            </h1>

            {/* Stock status indicator */}
            <div>
              {isOutOfStock ? (
                <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  <XCircle className="w-4 h-4" />
                  <span>Currently Out of Stock – Contact for Reorder</span>
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Hurry! Only {product.stockQuantity} items left in stock</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>In Stock – Available for Immediate Pan-India Delivery</span>
                </span>
              )}
            </div>

            {/* Price section */}
            <div className="flex items-baseline space-x-3 pt-2">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#8C3A48]">
                ₹{product.sellingPrice}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <>
                  <span className="text-base text-[#A89895] line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="bg-[#FAF0F2] text-[#9B4D5A] text-xs font-bold px-2.5 py-0.5 rounded-full">
                    Save {product.discountPercentage}%
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-[#8C7A77]">
              Inclusive of all taxes. Free express shipping on orders above ₹999 across all Indian pin codes.
            </p>

            {/* Description */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A3E3D] mb-1.5">
                Description
              </h3>
              <p className="text-xs sm:text-sm text-[#5A4D4B] leading-relaxed">
                {product.description || 'Stunning fashion jewellery handcrafted with premium stones and long-lasting polish. Perfect for elevating your ethnic and festive look.'}
              </p>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center space-x-4 pt-2">
                <span className="text-xs font-semibold text-[#4A3E3D]">Select Quantity:</span>
                <div className="flex items-center border border-[#D9C4BD] rounded-xl bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-[#4A3E3D] hover:bg-[#F3ECE8] rounded-l-xl transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-[#352525]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity || 99, quantity + 1))}
                    className="p-2 text-[#4A3E3D] hover:bg-[#F3ECE8] rounded-r-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="pt-4 space-y-3">
              {/* WhatsApp Order Button */}
              <a
                href={getProductWhatsAppUrl(product, quantity)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20BD5A] text-white py-3.5 px-6 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Order on WhatsApp (Instant Response)</span>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Add to Cart */}
                <button
                  onClick={() => addToCart(product, quantity)}
                  disabled={isOutOfStock}
                  className="flex items-center justify-center space-x-2 py-3 px-4 bg-[#B76E79] hover:bg-[#A35964] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Cart</span>
                </button>

                {/* Direct Enquiry Modal Trigger */}
                <button
                  onClick={() => setEnquiryModalOpen(true)}
                  className="flex items-center justify-center space-x-2 py-3 px-4 bg-white border border-[#B76E79] text-[#9B4D5A] hover:bg-[#FAF0F2] rounded-xl text-xs font-bold transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Direct Store Enquiry</span>
                </button>
              </div>
            </div>

          </div>

          {/* Specifications Table */}
          {product.specifications && (
            <div className="pt-6 border-t border-[#EBDAD4] space-y-3">
              <h3 className="font-serif font-bold text-base text-[#352525]">
                Product Specifications
              </h3>
              <div className="bg-[#FAF7F5] rounded-2xl border border-[#EBDAD4] overflow-hidden text-xs">
                <table className="w-full">
                  <tbody className="divide-y divide-[#EBDAD4]">
                    {product.specifications.material && (
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-[#6A5A57] w-1/3 bg-[#F5ECE8]">Base Material</td>
                        <td className="py-2.5 px-4 text-[#352525]">{product.specifications.material}</td>
                      </tr>
                    )}
                    {product.specifications.stoneType && (
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-[#6A5A57] bg-[#F5ECE8]">Stone Type</td>
                        <td className="py-2.5 px-4 text-[#352525]">{product.specifications.stoneType}</td>
                      </tr>
                    )}
                    {product.specifications.plating && (
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-[#6A5A57] bg-[#F5ECE8]">Plating / Polish</td>
                        <td className="py-2.5 px-4 text-[#352525]">{product.specifications.plating}</td>
                      </tr>
                    )}
                    {product.specifications.weight && (
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-[#6A5A57] bg-[#F5ECE8]">Approx Weight</td>
                        <td className="py-2.5 px-4 text-[#352525]">{product.specifications.weight}</td>
                      </tr>
                    )}
                    {product.specifications.occasion && (
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-[#6A5A57] bg-[#F5ECE8]">Ideal For</td>
                        <td className="py-2.5 px-4 text-[#352525]">{product.specifications.occasion}</td>
                      </tr>
                    )}
                    {product.specifications.packaging && (
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-[#6A5A57] bg-[#F5ECE8]">Packaging</td>
                        <td className="py-2.5 px-4 text-[#352525]">{product.specifications.packaging}</td>
                      </tr>
                    )}
                    {product.specifications.careInstructions && (
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-[#6A5A57] bg-[#F5ECE8]">Care Guide</td>
                        <td className="py-2.5 px-4 text-[#352525]">{product.specifications.careInstructions}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Related Products in Same Category */}
      {related.length > 0 && (
        <section className="pt-12 border-t border-[#EBDAD4] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B76E79]">
                You May Also Adore
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#352525] mt-0.5">
                Related {product.categoryName} Designs
              </h2>
            </div>
            <Link
              to={`/shop?category=${encodeURIComponent(product.categoryName)}`}
              className="text-xs font-semibold text-[#B76E79] hover:underline"
            >
              View More
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {related.map((rel) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Direct Enquiry Modal */}
      {enquiryModalOpen && (
        <DirectEnquiryModal
          isOpen={enquiryModalOpen}
          onClose={() => setEnquiryModalOpen(false)}
          product={product}
        />
      )}

    </div>
  );
};

export default ProductDetailPage;

