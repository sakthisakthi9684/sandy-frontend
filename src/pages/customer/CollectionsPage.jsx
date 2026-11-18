import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import api from '../../services/api';

const CollectionsPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.categories) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold tracking-widest text-[#B76E79] uppercase">
          Royal Heritage & Modern Glitz
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#352525]">
          Jewellery Collections
        </h1>
        <p className="text-xs sm:text-sm text-[#8C7A77] leading-relaxed">
          From opulent bridal neckpieces and antique South Indian temple jewellery to lightweight Cubic Zirconia party studs, discover our handpicked range designed for every festive moment.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-[#F0E6E1] rounded-3xl h-72 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-3xl overflow-hidden border border-[#EBDAD4] bg-white aspect-4/5 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-end p-6"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              <div className="relative z-10 text-white space-y-2">
                <div className="inline-flex items-center space-x-1 text-[#F8E2B2] text-[11px] font-semibold tracking-wider uppercase">
                  <Sparkles className="w-3 h-3" />
                  <span>Santhiya Curated</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#F8E2B2] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-white/80 line-clamp-2 font-light">
                  {cat.description || 'Trendy, elegant and affordable fashion jewellery handcrafted with premium stones.'}
                </p>
                <div className="pt-2 flex items-center space-x-2 text-xs font-bold text-[#F8E2B2]">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;

