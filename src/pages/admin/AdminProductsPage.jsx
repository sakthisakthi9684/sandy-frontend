import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Flame, 
  AlertTriangle,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import api from '../../services/api';
import { DEFAULT_PRODUCT_IMAGE, resolveImageUrl } from '../../utils/imageUrl';

const AdminProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const initialForm = {
    name: '',
    sku: '',
    category: '',
    categoryName: 'Necklace Sets',
    description: '',
    images: [''],
    purchasePrice: '',
    sellingPrice: '',
    originalPrice: '',
    stockQuantity: 10,
    lowStockThreshold: 5,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    specifications: {
      material: 'Premium Brass & Copper Alloy',
      stoneType: 'AAA+ Cubic Zirconia / AD Stones',
      plating: 'High-Polish Rose Gold / 22K Micro Gold Plating',
      weight: 'Lightweight & Comfortable',
      occasion: 'Festivals, Weddings, Parties, Everyday Elegance',
      careInstructions: 'Avoid direct moisture, perfume and harsh chemicals. Store in ziplock pouch.',
      packaging: 'Signature Santhiya Style Stone Velvet Box'
    }
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter) params.append('category', categoryFilter);
      if (stockFilter) params.append('stockStatus', stockFilter);

      const res = await api.get(`/products/admin/all?${params.toString()}`);
      if (res.data?.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories?all=true');
      if (res.data?.categories) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [search, categoryFilter, stockFilter]);

  // Check if opened with ?action=add
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      openCreateModal();
      setSearchParams({});
    }
  }, [searchParams]);

  const generateSku = () => {
    const prefix = 'SSS';
    const catCode = formData.categoryName?.substring(0, 3)?.toUpperCase() || 'JWL';
    const random = Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ ...prev, sku: `${prefix}-${catCode}-${random}` }));
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    const newForm = { ...initialForm };
    const prefix = 'SSS';
    const random = Math.floor(1000 + Math.random() * 9000);
    newForm.sku = `${prefix}-JWL-${random}`;
    setFormData(newForm);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      purchasePrice: product.purchasePrice || 0,
      images: product.images && product.images.length > 0 ? product.images : [''],
      specifications: product.specifications || initialForm.specifications
    });
    setModalOpen(true);
  };

  const handleImageChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData({ ...formData, images: updated });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updated.length ? updated : [''] });
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('images', files[i]);
    }

    setUploadingImage(true);
    try {
      const res = await api.post('/upload/multiple', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.urls) {
        const cleanExisting = formData.images.filter(Boolean);
        setFormData({ ...formData, images: [...cleanExisting, ...res.data.urls] });
      }
    } catch (err) {
      alert('Failed to upload image(s)');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanImages = formData.images.filter(img => img && img.trim() !== '');
      const payload = {
        ...formData,
        images: cleanImages.length > 0 ? cleanImages : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
        sellingPrice: Number(formData.sellingPrice),
        originalPrice: Number(formData.originalPrice) || Number(formData.sellingPrice),
        purchasePrice: Number(formData.purchasePrice) || 0,
        stockQuantity: Number(formData.stockQuantity) || 0,
        lowStockThreshold: Number(formData.lowStockThreshold) || 5
      };

      if (editingProduct) {
        await api.put(`/products/admin/${editingProduct._id}`, payload);
      } else {
        await api.post('/products/admin', payload);
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/admin/${id}`);
      setDeleteConfirmId(null);
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/products/admin/${id}/toggle-status`);
      fetchProducts();
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#352525]">
            Product Management
          </h1>
          <p className="text-xs text-[#8C7A77]">
            Add, update prices, inventory thresholds, specifications, and visibility
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#B76E79] hover:bg-[#A35964] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Jewellery</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EBDAD4] grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search name, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
          />
          <Search className="w-3.5 h-3.5 text-[#A89895] absolute left-2.5 top-2.5" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#B76E79]"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#B76E79]"
        >
          <option value="">All Stock Levels</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="LOW_STOCK">Low Stock Alert</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-[#EBDAD4] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF5F2] border-b border-[#EBDAD4] text-[#6A5A57] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Purchase (Cost)</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E6E1]">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-[#8C7A77]">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-[#8C7A77]">No products found matching filters.</td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-[#FCFAF8] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={resolveImageUrl(prod.images?.[0], DEFAULT_PRODUCT_IMAGE)}
                          alt=""
                          className="w-12 h-12 object-cover rounded-xl border border-[#EBDAD4] shrink-0"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                          }}
                        />
                        <div>
                          <p className="font-serif font-bold text-[#352525] line-clamp-1">{prod.name}</p>
                          <p className="text-[10px] text-[#8C7A77] font-mono">{prod.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-[#5D4E4C] font-medium">
                      {prod.categoryName || 'General'}
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-[#6A5A57]">
                      ₹{prod.purchasePrice || 0}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-[#8C3A48]">₹{prod.sellingPrice}</div>
                      {prod.originalPrice > prod.sellingPrice && (
                        <div className="text-[10px] text-[#A89895] line-through">₹{prod.originalPrice}</div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        prod.stockQuantity <= 0 
                          ? 'bg-red-100 text-red-800' 
                          : prod.stockQuantity <= (prod.lowStockThreshold || 5)
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {prod.stockQuantity} units
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {prod.isBestSeller && <span className="bg-[#FFF9E6] text-[#B58E22] text-[9px] font-bold px-1.5 py-0.5 rounded">Best</span>}
                        {prod.isNewArrival && <span className="bg-[#FAF0F2] text-[#9B4D5A] text-[9px] font-bold px-1.5 py-0.5 rounded">New</span>}
                        {prod.isFeatured && <span className="bg-blue-50 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded">Featured</span>}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(prod._id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                          prod.isActive ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {prod.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 text-[#5D4E4C] hover:text-[#B76E79] hover:bg-[#FAF5F2] rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(prod._id)}
                          className="p-1.5 text-[#5D4E4C] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#EBDAD4] space-y-5 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif text-xl font-bold text-[#352525]">
                  {editingProduct ? 'Edit Jewellery Product' : 'Add New Jewellery Product'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-[#8C7A77]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5 text-xs">
                
                {/* 1. Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[#4A3E3D] mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Kundan & Emerald Choker Set"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A3E3D] mb-1 flex items-center justify-between">
                      <span>Product SKU *</span>
                      <button
                        type="button"
                        onClick={generateSku}
                        className="text-[10px] text-[#B76E79] hover:underline"
                      >
                        Auto-generate
                      </button>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 font-mono bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>
                </div>

                {/* 2. Category & Description */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-[#4A3E3D] mb-1">Category *</label>
                    <select
                      value={formData.categoryName}
                      onChange={(e) => {
                        const sel = categories.find(c => c.name === e.target.value);
                        setFormData({
                          ...formData,
                          categoryName: e.target.value,
                          category: sel?._id || ''
                        });
                      }}
                      className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[#4A3E3D] mb-1">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Details on stones, polish, necklace length, matching earrings, etc."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>
                </div>

                {/* 3. Pricing & Stock */}
                <div className="p-4 bg-[#FAF6F4] rounded-2xl border border-[#EBDAD4] grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block font-semibold text-[#4A3E3D] mb-1">
                      Purchase Price <span className="text-[10px] text-red-600">(Admin)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 800"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A3E3D] mb-1">Selling Price *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1899"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A3E3D] mb-1">Original Price</label>
                    <input
                      type="number"
                      placeholder="e.g. 2799"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A3E3D] mb-1">Stock Units *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A3E3D] mb-1">Low Stock Alert</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.lowStockThreshold}
                      onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>
                </div>

                {/* 4. Images (URLs and Multer File Upload) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-[#4A3E3D]">Product Images</label>
                    <label className="cursor-pointer text-[11px] font-semibold text-[#B76E79] flex items-center space-x-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Photos (Multer)'}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {formData.images.map((img, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Image URL (or upload via button above)"
                        value={img}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none"
                      />
                      {img && (
                        <img
                          src={resolveImageUrl(img)}
                          alt=""
                          className="w-8 h-8 object-cover rounded-lg border border-[#EBDAD4]"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                          }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeImageField(idx)}
                        className="p-1.5 text-[#8C7A77] hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-[11px] text-[#B76E79] font-semibold hover:underline"
                  >
                    + Add Another Image URL
                  </button>
                </div>

                {/* 5. Specifications */}
                <div className="p-4 bg-[#FAF7F5] rounded-2xl border border-[#EBDAD4] space-y-3">
                  <h4 className="font-semibold text-[#352525]">Specifications Table</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#6A5A57]">Base Material</label>
                      <input
                        type="text"
                        value={formData.specifications.material}
                        onChange={(e) => setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, material: e.target.value }
                        })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E0D0CB] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#6A5A57]">Stone Type</label>
                      <input
                        type="text"
                        value={formData.specifications.stoneType}
                        onChange={(e) => setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, stoneType: e.target.value }
                        })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E0D0CB] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#6A5A57]">Plating / Polish</label>
                      <input
                        type="text"
                        value={formData.specifications.plating}
                        onChange={(e) => setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, plating: e.target.value }
                        })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E0D0CB] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#6A5A57]">Weight</label>
                      <input
                        type="text"
                        value={formData.specifications.weight}
                        onChange={(e) => setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, weight: e.target.value }
                        })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E0D0CB] rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Product Status & Badges */}
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="accent-[#B76E79] w-4 h-4"
                    />
                    <span className="font-semibold text-[#4A3E3D]">Product Active (Visible on Store)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="accent-[#B76E79] w-4 h-4"
                    />
                    <span className="font-semibold text-[#4A3E3D]">Featured Collection</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="accent-[#B76E79] w-4 h-4"
                    />
                    <span className="font-semibold text-[#4A3E3D]">New Arrival</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="accent-[#B76E79] w-4 h-4"
                    />
                    <span className="font-semibold text-[#4A3E3D]">Best Seller</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-[#D9C4BD] text-[#4A3E3D] rounded-xl hover:bg-[#FAF5F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#B76E79] hover:bg-[#A35964] text-white rounded-xl font-bold shadow-xs"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 text-center z-10 border border-[#EBDAD4]">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#352525]">Delete Product?</h3>
            <p className="text-xs text-[#8C7A77]">
              Are you sure you want to delete this jewellery item? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-[#D9C4BD] rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProductsPage;

