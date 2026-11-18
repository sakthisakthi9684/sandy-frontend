import React, { useState, useEffect } from 'react';
import { 
  FolderTree, 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  Check, 
  X, 
  Image as ImageIcon,
  ArrowUpDown
} from 'lucide-react';
import api from '../../services/api';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const initialForm = {
    name: '',
    slug: '',
    description: '',
    image: '',
    isActive: true,
    displayOrder: 0
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories?all=true');
      if (res.data?.categories) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      ...initialForm,
      displayOrder: categories.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug || '',
      description: cat.description || '',
      image: cat.image || '',
      isActive: cat.isActive !== false,
      displayOrder: cat.displayOrder || 0
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploadingImage(true);
    try {
      const res = await api.post('/upload/single', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.url) {
        setFormData({ ...formData, image: res.data.url });
      }
    } catch (err) {
      alert('Failed to upload category image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        displayOrder: Number(formData.displayOrder) || 0
      };

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, payload);
      } else {
        await api.post('/categories', payload);
      }

      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setDeleteConfirmId(null);
      fetchCategories();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#352525]">
            Category Management
          </h1>
          <p className="text-xs text-[#8C7A77]">
            Organize collections (Necklaces, Bridal, Earrings, Bangles, Stone Jewellery)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#B76E79] hover:bg-[#A35964] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-[#8C7A77]">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[#8C7A77]">No categories created yet.</div>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="bg-white rounded-2xl border border-[#EBDAD4] overflow-hidden shadow-xs flex flex-col justify-between">
              
              <div className="relative aspect-4/3 bg-[#FAF6F4] overflow-hidden">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-2.5 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                }`}>
                  {cat.isActive ? 'Active' : 'Disabled'}
                </span>
                <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                  Order: {cat.displayOrder || 0}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#352525]">{cat.name}</h3>
                  <p className="text-[10px] text-[#8C7A77] font-mono">slug: {cat.slug}</p>
                  <p className="text-xs text-[#6A5A57] mt-1.5 line-clamp-2">{cat.description || 'No description provided.'}</p>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#F0E6E1]">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-[#5D4E4C] hover:text-[#B76E79] hover:bg-[#FAF5F2] rounded-lg transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(cat._id)}
                    className="p-1.5 text-[#5D4E4C] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 z-10 border border-[#EBDAD4]">
            
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-[#352525]">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#8C7A77]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#4A3E3D] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traditional Temple Jewellery"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4A3E3D] mb-1">Slug (URL identifier)</label>
                <input
                  type="text"
                  placeholder="e.g. traditional-temple-jewellery (auto-generated if empty)"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 font-mono bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4A3E3D] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short tagline or summary for the category card"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none"
                />
              </div>

              {/* Image Input and Upload */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-[#4A3E3D]">Category Cover Image</label>
                  <label className="cursor-pointer text-[11px] font-semibold text-[#B76E79] flex items-center space-x-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Enter image URL or upload above"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none"
                />
                {formData.image && (
                  <img src={formData.image} alt="" className="mt-2 w-20 h-14 object-cover rounded-lg border" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-[#4A3E3D] mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="accent-[#B76E79] w-4 h-4"
                    />
                    <span className="font-semibold text-[#4A3E3D]">Active in Store</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#D9C4BD] rounded-xl font-semibold text-[#4A3E3D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B76E79] hover:bg-[#A35964] text-white rounded-xl font-bold shadow-xs"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>

            </form>

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
            <h3 className="font-serif font-bold text-lg text-[#352525]">Delete Category?</h3>
            <p className="text-xs text-[#8C7A77]">
              Are you sure you want to delete this category?
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

export default AdminCategoriesPage;

