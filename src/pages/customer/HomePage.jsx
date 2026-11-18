import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Phone, 
  Star, 
  ChevronRight, 
  ChevronLeft,
  Flame,
  CheckCircle2,
  Heart
} from 'lucide-react';
import InstagramIcon from '../../components/common/InstagramIcon';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import ProductCard from '../../components/common/ProductCard';

const HomePage = () => {
  const { settings, getWhatsAppUrl } = useSettings();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const heroBanners = (settings.heroBanners && settings.heroBanners.length > 0) ? settings.heroBanners : [
    {
      title: "Timeless Bridal & Festive Collections",
      subtitle: "Handpicked Royal Antique, Kundan & CZ Masterpieces",
      badge: "New Festive Arrivals",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=80",
      buttonText: "Explore Collections",
      buttonLink: "/collections"
    },
    {
      title: "Sparkling Everyday Glamour",
      subtitle: "Delicate Pendants, Stone Earrings & Designer Bangles",
      badge: "Trendy • Elegant • Affordable",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=80",
      buttonText: "Shop All Jewellery",
      buttonLink: "/shop"
    }
  ];

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [catRes, featRes, newRes, bestRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?featuredOnly=true&limit=8'),
          api.get('/products?newArrivalOnly=true&limit=8'),
          api.get('/products?bestSellerOnly=true&limit=8')
        ]);

        if (catRes.data?.categories) setCategories(catRes.data.categories);
        if (featRes.data?.products) setFeaturedProducts(featRes.data.products);
        if (newRes.data?.products) setNewArrivals(newRes.data.products);
        if (bestRes.data?.products) setBestSellers(bestRes.data.products);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // Banner rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex(prev => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  const testimonials = [
    {
      name: "Sangeetha Krishnan",
      city: "Chennai",
      review: "Ordered the royal Kundan choker for my sister's wedding. The quality and shine look just like authentic real gold jewellery! Safe packaging and fast delivery.",
      rating: 5,
      product: "Royal Kundan & Pearl Choker"
    },
    {
      name: "Meera Varma",
      city: "Bangalore",
      review: "WhatsApp ordering was so easy! They sent me a live video of the jhumkas before dispatching. Really impressed with the customer care and quality.",
      rating: 5,
      product: "Antique Peacock Jhumkas"
    },
    {
      name: "Ananya Deshmukh",
      city: "Mumbai",
      review: "Affordable luxury at its finest! The American diamond cocktail ring has brilliant sparkle. Everyone asked where I bought it from. Highly recommended!",
      rating: 5,
      product: "AD Solitaire Cocktail Ring"
    }
  ];

  const instagramPosts = [
    {
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
      caption: "Regal Kundan perfection ✨ Designed for unforgettable celebrations."
    },
    {
      image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80",
      caption: "Antique matte gold jhumkas that whisper South Indian heritage."
    },
    {
      image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80",
      caption: "Emerald bridal sets ready to dazzle your wedding reception."
    },
    {
      image: "https://images.unsplash.com/photo-1611591475883-9b9643db8e3a?auto=format&fit=crop&w=600&q=80",
      caption: "Dainty rose gold bangles with micro-pave Cubic Zirconia."
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Banner Slider */}
      <section className="relative overflow-hidden bg-[#1E1818] text-white">
        <div className="relative min-h-[460px] sm:min-h-[560px] lg:min-h-[620px] flex items-center">
          {heroBanners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === activeBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover object-center brightness-75 scale-105 transition-transform duration-10000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
            </div>
          ))}

          {/* Hero Content */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-2xl space-y-4 sm:space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-[#F8E2B2]" />
                <span className="text-xs font-semibold text-[#F8E2B2] tracking-wider uppercase">
                  {heroBanners[activeBannerIndex]?.badge || "Fashion Jewellery Collection"}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                {heroBanners[activeBannerIndex]?.title}
              </h1>

              <p className="text-sm sm:text-lg text-white/80 leading-relaxed font-light">
                {heroBanners[activeBannerIndex]?.subtitle}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to={heroBanners[activeBannerIndex]?.buttonLink || "/shop"}
                  className="px-7 py-3.5 bg-[#B76E79] hover:bg-[#9B4D5A] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 text-sm"
                >
                  <span>{heroBanners[activeBannerIndex]?.buttonText || "Shop Now"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={getWhatsAppUrl(`Hi ${settings.businessName}, I would like to see your latest jewellery catalogue.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-medium rounded-full border border-white/30 transition-all flex items-center space-x-2 text-sm"
                >
                  <Phone className="w-4 h-4 text-[#25D366]" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Banner Slider Controls */}
          {heroBanners.length > 1 && (
            <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-2">
              {heroBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveBannerIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === activeBannerIndex ? 'w-8 bg-[#B76E79]' : 'w-2 bg-white/50'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. Value Propositions Bar */}
      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-[#EBDAD4] p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0F2] text-[#B76E79] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#352525]">Pan-India Shipping</h4>
              <p className="text-[11px] text-[#8C7A77]">Free delivery on orders ₹999+</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF9E6] text-[#D4AF37] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#352525]">AAA+ Quality Stones</h4>
              <p className="text-[11px] text-[#8C7A77]">Cubic Zirconia & Kempu</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F8EE] text-[#25D366] flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#352525]">Direct WhatsApp Order</h4>
              <p className="text-[11px] text-[#8C7A77]">Instant support & live videos</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0F2] text-[#B76E79] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#352525]">Safe Velvet Box</h4>
              <p className="text-[11px] text-[#8C7A77]">Protective transit packing</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* 3. Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#B76E79] uppercase">
              Curated Masterpieces
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#352525] mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/collections"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-[#B76E79] hover:underline mt-2 sm:mt-0"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-2xl overflow-hidden border border-[#EBDAD4] bg-white aspect-4/5 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-serif text-base sm:text-lg font-bold group-hover:text-[#F8E2B2] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-white/70 line-clamp-1 mt-0.5">
                  {cat.description || 'Trendy & elegant designs'}
                </p>
                <div className="mt-2 inline-flex items-center space-x-1 text-[11px] font-semibold text-[#F8E2B2]">
                  <span>Explore</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-1 text-[#D4AF37] text-xs font-bold tracking-widest uppercase">
              <Flame className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#352525] mt-1">
              Best Selling Jewellery
            </h2>
          </div>
          <Link
            to="/shop?filter=bestseller"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-[#B76E79] hover:underline mt-2 sm:mt-0"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Special Festive Offer Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#8C3A48] via-[#B76E79] to-[#8C3A48] text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-[#F8E2B2] uppercase tracking-wider">
              Limited Festive Delight
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
              Flat 20% OFF on Royal Bridal & Antique Choker Sets
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-light">
              Elevate your celebration look with hand-selected temple motifs and high-brilliance American Diamond stones. Free express shipping across India on orders above ₹999.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/shop?category=Bridal Jewellery"
                className="px-6 py-2.5 bg-white text-[#8C3A48] hover:bg-[#FAF4F0] rounded-full text-xs font-bold transition-all shadow-md"
              >
                Shop Festive Bridal
              </Link>
              <a
                href={getWhatsAppUrl("Hi Santhiya Style Stone, I would like to enquire about your 20% OFF festive offer!")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full text-xs font-semibold transition-all shadow-md flex items-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Claim via WhatsApp</span>
              </a>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* 6. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-1 text-[#B76E79] text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresh Off The Workshop</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#352525] mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?filter=new"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-[#B76E79] hover:underline mt-2 sm:mt-0"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Customer Testimonials */}
      <section className="bg-[#FAF5F2] py-14 border-y border-[#EBDAD4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold tracking-widest text-[#B76E79] uppercase">
              Loved by Customers Across India
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#352525] mt-1">
              Words of Elegance & Trust
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-2xl border border-[#EBDAD4] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-1 text-[#D4AF37] mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#5D4E4C] italic leading-relaxed">
                    "{t.review}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#F0E4E0] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#352525]">{t.name}</h4>
                    <p className="text-[11px] text-[#8C7A77]">{t.city}, India</p>
                  </div>
                  <span className="text-[10px] text-[#B76E79] font-semibold bg-[#FDF0F2] px-2 py-0.5 rounded-full">
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Instagram Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#B76E79] uppercase tracking-widest">
            <InstagramIcon className="w-4 h-4" />
            <span>@santhiya_style_stone</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#352525] mt-1">
            Follow Our Instagram Journey
          </h2>
          <p className="text-xs text-[#8C7A77] mt-1">
            Tag us to get featured in our customer spotlight gallery
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {instagramPosts.map((post, idx) => (
            <a
              key={idx}
              href={settings.instagramUrl || "https://www.instagram.com/santhiya_style_stone/"}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden border border-[#EBDAD4] shadow-xs"
            >
              <img
                src={post.image}
                alt="Instagram jewellery post"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
                <div className="text-white space-y-2">
                  <InstagramIcon className="w-6 h-6 mx-auto text-[#F8E2B2]" />
                  <p className="text-[11px] text-white/90 line-clamp-2">
                    {post.caption}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-6">
          <a
            href={settings.instagramUrl || "https://www.instagram.com/santhiya_style_stone/"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>View More on Instagram</span>
          </a>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
