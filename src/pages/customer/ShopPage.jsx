import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  Sparkles,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import api from '../../services/api';
import ProductCard from '../../components/common/ProductCard';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 6000 });
  const [currentMaxPrice, setCurrentMaxPrice] = useState(6000);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Handle special filters from URL query (e.g. ?filter=new or ?filter=bestseller)
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    const catParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    if (filterParam === 'bestseller') setSortBy('bestseller');
    if (filterParam === 'new') setSortBy('newest');
    if (catParam) setSelectedCategory(catParam);
    if (searchParam) setSearch(searchParam);
  }, [searchParams]);

  // Load categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.categories) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
        if (sortBy) params.append('sortBy', sortBy);
        if (inStockOnly) params.append('inStockOnly', 'true');
        if (currentMaxPrice < 6000) params.append('maxPrice', currentMaxPrice);

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data?.products) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error('Failed to fetch shop products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, selectedCategory, sortBy, inStockOnly, currentMaxPrice]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSortBy('newest');
    setInStockOnly(false);
    setCurrentMaxPrice(6000);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Page Title & Breadcrumb */}
      <div className="mb-8 text-center sm:text-left">
        <span className="text-xs font-bold tracking-widest text-[#B76E79] uppercase">
          Authentic Fashion Jewellery
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#352525] mt-1">
          {selectedCategory === 'All' ? 'All Jewellery Collections' : selectedCategory}
        </h1>
        <p className="text-xs text-[#8C7A77] mt-1">
          Showing {products.length} {products.length === 1 ? 'handcrafted design' : 'handcrafted designs'} with pan-India delivery
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-[#EBDAD4] h-fit">
          <div className="flex items-center justify-between border-b border-[#F0E6E1] pb-3">
            <h3 className="font-serif font-bold text-base text-[#352525] flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-[#B76E79]" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#B76E79] hover:underline flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-xs font-semibold text-[#4A3E3D] mb-1.5">
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Product name, SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
              />
              <Search className="w-3.5 h-3.5 text-[#A89895] absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <label className="block text-xs font-semibold text-[#4A3E3D] mb-2">
              Categories
            </label>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === 'All' 
                    ? 'bg-[#B76E79] text-white font-bold' 
                    : 'text-[#5A4D4B] hover:bg-[#FAF5F2]'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === cat.name 
                      ? 'bg-[#B76E79] text-white font-bold' 
                      : 'text-[#5A4D4B] hover:bg-[#FAF5F2]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#4A3E3D] mb-1.5">
              <span>Max Price</span>
              <span className="text-[#8C3A48] font-bold">Up to ₹{currentMaxPrice}</span>
            </div>
            <input
              type="range"
              min="500"
              max="6000"
              step="100"
              value={currentMaxPrice}
              onChange={(e) => setCurrentMaxPrice(Number(e.target.value))}
              className="w-full accent-[#B76E79] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C7A77] mt-1">
              <span>₹500</span>
              <span>₹6,000+</span>
            </div>
          </div>

          {/* In Stock Only Toggle */}
          <div className="pt-2 border-t border-[#F0E6E1]">
            <label className="flex items-center space-x-2 text-xs font-medium text-[#4A3E3D] cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-[#B76E79] w-4 h-4 cursor-pointer"
              />
              <span>In-Stock Products Only</span>
            </label>
          </div>
        </aside>

        {/* Main Products Grid & Top Bar */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Sort and Mobile Filter Bar */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EBDAD4] flex flex-wrap items-center justify-between gap-3">
            
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center space-x-1.5 text-xs font-semibold bg-[#FAF5F2] text-[#4A3E3D] px-3 py-2 rounded-xl border border-[#E0D0CB]"
            >
              <Filter className="w-3.5 h-3.5 text-[#B76E79]" />
              <span>Filters</span>
            </button>

            {/* In-Stock Chip */}
            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  inStockOnly ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-[#FAF7F5] border-[#E0D0CB] text-[#6A5A57]'
                }`}
              >
                {inStockOnly ? '✓ In Stock Only' : 'Show All Stock'}
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-xs text-[#8C7A77] font-medium hidden sm:inline">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#B76E79] text-[#4A3E3D] font-medium"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="bestseller">Best Selling</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>

          </div>

          {/* Active Filter Pills */}
          {(selectedCategory !== 'All' || search || inStockOnly || currentMaxPrice < 6000) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#8C7A77]">Active filters:</span>
              {selectedCategory !== 'All' && (
                <span className="bg-[#F8E2E5] text-[#9B4D5A] px-2.5 py-1 rounded-full flex items-center space-x-1 font-medium">
                  <span>{selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('All')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {search && (
                <span className="bg-[#FAF0F2] text-[#9B4D5A] px-2.5 py-1 rounded-full flex items-center space-x-1 font-medium">
                  <span>"{search}"</span>
                  <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {inStockOnly && (
                <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full flex items-center space-x-1 font-medium">
                  <span>In Stock Only</span>
                  <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {currentMaxPrice < 6000 && (
                <span className="bg-[#FFF9E6] text-[#8C6D1F] px-2.5 py-1 rounded-full flex items-center space-x-1 font-medium">
                  <span>Under ₹{currentMaxPrice}</span>
                  <button onClick={() => setCurrentMaxPrice(6000)}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#B76E79] hover:underline font-semibold ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl p-4 border border-[#EBDAD4] space-y-3">
                  <div className="bg-[#F0E6E1] aspect-square rounded-xl w-full" />
                  <div className="h-4 bg-[#F0E6E1] rounded w-3/4" />
                  <div className="h-4 bg-[#F0E6E1] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#EBDAD4] p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF5F2] flex items-center justify-center text-[#B76E79] mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#352525]">No Jewellery Products Found</h3>
              <p className="text-xs text-[#8C7A77] max-w-sm mx-auto">
                We couldn't find matching designs for your selected criteria. Try adjusting the filters or search term.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2 bg-[#B76E79] text-white text-xs font-semibold rounded-full hover:bg-[#A35964]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative min-h-screen flex items-end">
            <div className="w-full bg-white rounded-t-3xl p-6 space-y-5 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif font-bold text-lg text-[#352525]">Filter Jewellery</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                  <X className="w-5 h-5 text-[#8C7A77]" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3E3D] mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-3 py-1.5 rounded-lg text-xs ${selectedCategory === 'All' ? 'bg-[#B76E79] text-white font-bold' : 'bg-[#FAF5F2]'}`}
                  >
                    All
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => setSelectedCategory(c.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs ${selectedCategory === c.name ? 'bg-[#B76E79] text-white font-bold' : 'bg-[#FAF5F2]'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3E3D] mb-1">Max Price: ₹{currentMaxPrice}</label>
                <input
                  type="range"
                  min="500"
                  max="6000"
                  step="100"
                  value={currentMaxPrice}
                  onChange={(e) => setCurrentMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#B76E79]"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-xs">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-[#B76E79]"
                  />
                  <span>In-Stock Products Only</span>
                </label>
              </div>

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#B76E79] text-white rounded-xl text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShopPage;

