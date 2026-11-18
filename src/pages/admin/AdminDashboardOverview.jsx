import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Gem, 
  FolderTree, 
  Boxes, 
  AlertTriangle, 
  XCircle, 
  MessageSquareText, 
  IndianRupee,
  Plus, 
  ExternalLink,
  Phone,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

const AdminDashboardOverview = () => {
  const { getWhatsAppUrl } = useSettings();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/settings/analytics');
      if (res.data?.analytics) {
        setAnalytics(res.data.analytics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      await api.patch(`/enquiries/${enquiryId}/status`, { orderStatus: newStatus });
      fetchAnalytics();
    } catch (err) {
      alert('Failed to update enquiry status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-[#B76E79] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Products', val: analytics?.totalProducts || 0, icon: Gem, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Total Categories', val: analytics?.totalCategories || 0, icon: FolderTree, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Available Stock Units', val: analytics?.totalStock || 0, icon: Boxes, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Low Stock Products', val: analytics?.lowStockCount || 0, icon: AlertTriangle, color: 'text-amber-700', bg: 'bg-amber-100/70', alert: true },
    { label: 'Out of Stock', val: analytics?.outOfStockCount || 0, icon: XCircle, color: 'text-red-700', bg: 'bg-red-50', alert: true },
    { label: 'Total Enquiries', val: analytics?.totalEnquiries || 0, icon: MessageSquareText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Enquiry Valuation', val: `₹${analytics?.totalEnquiryValue || 0}`, icon: IndianRupee, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Title & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#352525]">
            Store Overview & Operations
          </h1>
          <p className="text-xs text-[#8C7A77] mt-0.5">
            Real-time analytics, stock levels, and customer order pipeline
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/products?action=add"
            className="flex items-center space-x-1.5 px-4 py-2 bg-[#B76E79] hover:bg-[#A35964] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>

          <Link
            to="/admin/inventory"
            className="flex items-center space-x-1.5 px-4 py-2 bg-white border border-[#D9C4BD] text-[#4A3E3D] hover:bg-[#FAF5F2] rounded-xl text-xs font-semibold transition-colors"
          >
            <Boxes className="w-3.5 h-3.5 text-[#B76E79]" />
            <span>Adjust Stock</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all ${
                card.alert && card.val > 0 
                  ? 'border-amber-300 bg-amber-50/40 shadow-xs' 
                  : 'border-[#EBDAD4] bg-white shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6A5A57]">{card.label}</span>
                <div className={`w-9 h-9 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="font-serif text-2xl font-bold text-[#352525] mt-3">
                {card.val}
              </p>
            </div>
          );
        })}
      </div>

      {/* Low / Out of Stock Alert Banner */}
      {(analytics?.lowStockCount > 0 || analytics?.outOfStockCount > 0) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                Inventory Attention Required
              </h4>
              <p className="text-xs text-amber-800">
                You have {analytics.lowStockCount} items below threshold and {analytics.outOfStockCount} items out of stock.
              </p>
            </div>
          </div>
          <Link
            to="/admin/inventory"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shrink-0 text-center transition-colors"
          >
            Manage Inventory
          </Link>
        </div>
      )}

      {/* Tables Row: Recent Customer Enquiries & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Customer Enquiries */}
        <div className="bg-white rounded-2xl border border-[#EBDAD4] p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F0E6E1] pb-3">
            <h3 className="font-serif font-bold text-base text-[#352525]">
              Recent Customer Enquiries
            </h3>
            <Link to="/admin/enquiries" className="text-xs font-semibold text-[#B76E79] hover:underline">
              View All ({analytics?.totalEnquiries || 0})
            </Link>
          </div>

          <div className="space-y-3">
            {analytics?.recentEnquiries?.length === 0 ? (
              <p className="text-xs text-[#8C7A77] py-6 text-center">No customer enquiries received yet.</p>
            ) : (
              analytics?.recentEnquiries?.map((enq) => (
                <div key={enq._id} className="p-3.5 rounded-xl border border-[#F0E4E0] bg-[#FAF7F5] space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#352525]">{enq.customerName}</h4>
                      <p className="text-[11px] text-[#6A5A57]">
                        WhatsApp: <strong className="font-mono text-[#352525]">{enq.whatsappNumber}</strong> {enq.city && `• ${enq.city}`}
                      </p>
                    </div>

                    {/* WhatsApp Reply Button */}
                    <a
                      href={`https://wa.me/${enq.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${enq.customerName}, this is Santhiya Style Stone regarding your jewellery enquiry.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-[#25D366] hover:bg-[#20BD5A] text-white text-[10px] font-bold rounded-lg flex items-center space-x-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {enq.productDetails && (
                    <div className="flex items-center space-x-2 text-[11px] text-[#4A3E3D] bg-white p-1.5 rounded-lg border border-[#EBDAD4]">
                      <span className="font-semibold truncate">{enq.productDetails.name}</span>
                      <span className="font-bold text-[#8C3A48] shrink-0">₹{enq.productDetails.price}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-[#8C7A77]">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </span>

                    {/* Status Select */}
                    <select
                      value={enq.orderStatus}
                      onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                      className="text-[10px] font-semibold bg-white border border-[#D9C4BD] rounded-md px-2 py-0.5 focus:outline-none"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Jewellery Products */}
        <div className="bg-white rounded-2xl border border-[#EBDAD4] p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F0E6E1] pb-3">
            <h3 className="font-serif font-bold text-base text-[#352525]">
              Recent Catalogue Items
            </h3>
            <Link to="/admin/products" className="text-xs font-semibold text-[#B76E79] hover:underline">
              View All ({analytics?.totalProducts || 0})
            </Link>
          </div>

          <div className="space-y-3">
            {analytics?.recentProducts?.map((prod) => (
              <div key={prod._id} className="flex items-center justify-between p-2.5 rounded-xl border border-[#F0E4E0] hover:bg-[#FAF7F5] transition-colors">
                <div className="flex items-center space-x-3">
                  <img
                    src={(prod.images && prod.images[0]) || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80'}
                    alt=""
                    className="w-12 h-12 object-cover rounded-lg border border-[#EBDAD4] shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#352525] line-clamp-1">{prod.name}</h4>
                    <p className="text-[10px] text-[#8C7A77] font-mono">
                      {prod.sku} • Stock: <strong className={prod.stockQuantity <= 0 ? 'text-red-600' : 'text-emerald-700'}>{prod.stockQuantity}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-[#8C3A48]">₹{prod.sellingPrice}</p>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${prod.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>
                    {prod.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboardOverview;

