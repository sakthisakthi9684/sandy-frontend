import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  Plus, 
  Minus, 
  History, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  Search, 
  Filter,
  ArrowUpDown,
  Calendar,
  X
} from 'lucide-react';
import api from '../../services/api';

const AdminInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'history'

  // Adjustment Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustType, setAdjustType] = useState('add'); // 'add' | 'reduce' | 'set'
  const [quantity, setQuantity] = useState(5);
  const [reason, setReason] = useState('Restock from Artisan/Supplier');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reasons = [
    'Restock from Artisan/Supplier',
    'Customer Sale / WhatsApp Order fulfilled',
    'Damaged / Defective Stone piece',
    'Customer Return / Exchange',
    'Inventory Count Audit & Correction',
    'Promotional / Influencer Sample dispatch',
    'Other'
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, histRes] = await Promise.all([
        api.get('/products/admin/all?limit=200'),
        api.get('/stock/history?limit=150')
      ]);

      if (prodRes.data?.products) setProducts(prodRes.data.products);
      if (histRes.data?.history) setHistory(histRes.data.history);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdjustModal = (product, defaultType = 'add') => {
    setSelectedProduct(product);
    setAdjustType(defaultType);
    setQuantity(defaultType === 'set' ? product.stockQuantity : 5);
    setReason(defaultType === 'reduce' ? 'Customer Sale / WhatsApp Order fulfilled' : 'Restock from Artisan/Supplier');
    setNotes('');
    setModalOpen(true);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setSubmitting(true);
    try {
      await api.post('/stock/adjust', {
        productId: selectedProduct._id,
        type: adjustType,
        quantity: Number(quantity),
        reason,
        notes
      });

      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to adjust stock');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.categoryName || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredHistory = history.filter(h =>
    (h.productName || '').toLowerCase().includes(search.toLowerCase()) ||
    (h.productSku || '').toLowerCase().includes(search.toLowerCase()) ||
    (h.reason || '').toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = products.filter(p => p.stockStatus === 'LOW_STOCK').length;
  const outOfStockCount = products.filter(p => p.stockStatus === 'OUT_OF_STOCK').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#352525]">
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-[#8C7A77]">
            Real-time stock audits, replenishment entries, and complete movement logs
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-[#EBDAD4] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'inventory' ? 'bg-[#B76E79] text-white shadow-xs' : 'text-[#6A5A57] hover:bg-[#FAF5F2]'
            }`}
          >
            Current Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'history' ? 'bg-[#B76E79] text-white shadow-xs' : 'text-[#6A5A57] hover:bg-[#FAF5F2]'
            }`}
          >
            Movement Audit History ({history.length})
          </button>
        </div>
      </div>

      {/* Stock Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#EBDAD4] flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#8C7A77]">Total Stock Units</p>
            <p className="font-serif text-xl font-bold text-[#352525]">
              {products.reduce((s, p) => s + (p.stockQuantity || 0), 0)} pieces
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EBDAD4] flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#8C7A77]">Low Stock Alerts</p>
            <p className="font-serif text-xl font-bold text-amber-800">
              {lowStockCount} items
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EBDAD4] flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#8C7A77]">Out of Stock</p>
            <p className="font-serif text-xl font-bold text-red-800">
              {outOfStockCount} items
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-2xl border border-[#EBDAD4]">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder={activeTab === 'inventory' ? 'Search product or SKU...' : 'Search stock history...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
          />
          <Search className="w-3.5 h-3.5 text-[#A89895] absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* TAB 1: Current Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-[#EBDAD4] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5F2] border-b border-[#EBDAD4] text-[#6A5A57] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Jewellery Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Selling Price</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Alert Threshold</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Stock Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E6E1]">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-[#8C7A77]">Loading inventory...</td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-[#8C7A77]">No inventory items found.</td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-[#FCFAF8] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={(p.images && p.images[0]) || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80'}
                            alt=""
                            className="w-12 h-12 object-cover rounded-xl border border-[#EBDAD4] shrink-0"
                          />
                          <div>
                            <p className="font-serif font-bold text-[#352525] line-clamp-1">{p.name}</p>
                            <p className="text-[10px] text-[#8C7A77] font-mono">{p.sku}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#5D4E4C]">
                        {p.categoryName || 'General'}
                      </td>

                      <td className="py-3 px-4 font-bold text-[#8C3A48]">
                        ₹{p.sellingPrice}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-serif text-base font-bold text-[#352525]">
                          {p.stockQuantity}
                        </span>
                        <span className="text-[10px] text-[#8C7A77] ml-1">units</span>
                      </td>

                      <td className="py-3 px-4 text-[#6A5A57]">
                        ≤ {p.lowStockThreshold || 5} units
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.stockQuantity <= 0 
                            ? 'bg-red-100 text-red-800' 
                            : p.stockQuantity <= (p.lowStockThreshold || 5)
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.stockQuantity <= 0 ? 'Out of Stock' : p.stockQuantity <= (p.lowStockThreshold || 5) ? 'Low Stock' : 'Optimal'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openAdjustModal(p, 'add')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold flex items-center space-x-1"
                            title="Add stock"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                          <button
                            onClick={() => openAdjustModal(p, 'reduce')}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-semibold flex items-center space-x-1"
                            title="Reduce stock"
                          >
                            <Minus className="w-3 h-3" />
                            <span>Reduce</span>
                          </button>
                          <button
                            onClick={() => openAdjustModal(p, 'set')}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-[#4A3E3D] rounded-lg text-[11px] font-semibold"
                            title="Set exact stock count"
                          >
                            Set
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
      )}

      {/* TAB 2: Movement Audit History Table */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-[#EBDAD4] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5F2] border-b border-[#EBDAD4] text-[#6A5A57] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Product Name & SKU</th>
                  <th className="py-3 px-4">Previous</th>
                  <th className="py-3 px-4">Change</th>
                  <th className="py-3 px-4">New Stock</th>
                  <th className="py-3 px-4">Adjustment Reason</th>
                  <th className="py-3 px-4">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E6E1]">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-[#8C7A77]">Loading movement audit history...</td>
                  </tr>
                ) : filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-[#8C7A77]">No stock movement records found.</td>
                  </tr>
                ) : (
                  filteredHistory.map((item) => (
                    <tr key={item._id} className="hover:bg-[#FCFAF8] transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-[#6A5A57] whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#352525]">{item.productName}</p>
                        <p className="text-[10px] text-[#8C7A77] font-mono">{item.productSku}</p>
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-[#6A5A57]">
                        {item.previousStock}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block font-mono font-bold text-xs px-2 py-0.5 rounded ${
                          item.changeQuantity > 0 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.changeQuantity > 0 ? `+${item.changeQuantity}` : item.changeQuantity}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-[#352525]">
                        {item.currentStock}
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-medium text-[#4A3E3D]">{item.reason}</p>
                        {item.notes && <p className="text-[10px] text-[#8C7A77] italic">{item.notes}</p>}
                      </td>

                      <td className="py-3 px-4 text-[#8C7A77]">
                        {item.adminUser || 'Admin'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-md w-full space-y-4 z-10 border border-[#EBDAD4]">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#352525]">Adjust Jewellery Stock</h3>
                <p className="text-xs text-[#8C7A77] font-mono">{selectedProduct.sku}</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#8C7A77]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#FAF7F5] rounded-xl border border-[#EBDAD4] text-xs">
              <p className="font-bold text-[#352525]">{selectedProduct.name}</p>
              <p className="text-[#6A5A57] mt-0.5">
                Current On-Hand Stock: <strong className="text-[#8C3A48] text-sm">{selectedProduct.stockQuantity}</strong> units
              </p>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
              
              {/* Type selector */}
              <div>
                <label className="block font-semibold text-[#4A3E3D] mb-1.5">Action Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('add')}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      adjustType === 'add' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-[#FAF5F2] text-[#4A3E3D]'
                    }`}
                  >
                    + Add Units
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('reduce')}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      adjustType === 'reduce' ? 'bg-amber-600 text-white shadow-xs' : 'bg-[#FAF5F2] text-[#4A3E3D]'
                    }`}
                  >
                    - Reduce Units
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('set')}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      adjustType === 'set' ? 'bg-[#B76E79] text-white shadow-xs' : 'bg-[#FAF5F2] text-[#4A3E3D]'
                    }`}
                  >
                    = Set Exact
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block font-semibold text-[#4A3E3D] mb-1">
                  {adjustType === 'set' ? 'New Exact Stock Level *' : 'Quantity to Adjust *'}
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl font-bold text-sm focus:outline-none focus:border-[#B76E79]"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block font-semibold text-[#4A3E3D] mb-1">Reason for Stock Modification *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
                >
                  {reasons.map((r, i) => (
                    <option key={i} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-[#4A3E3D] mb-1">Invoice / Order Reference Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Lot #492 from Madurai artisan workshop"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#D9C4BD] rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#B76E79] hover:bg-[#A35964] text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  {submitting ? 'Recording Movement...' : 'Save & Record History'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminInventoryPage;

