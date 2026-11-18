import React, { useState, useEffect } from 'react';
import { 
  MessageSquareText, 
  Search, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Truck, 
  PackageCheck, 
  XCircle, 
  Edit3, 
  Filter,
  Save,
  ShoppingBag
} from 'lucide-react';
import api from '../../services/api';

const AdminEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Editing notes state
  const [activeNotesId, setActiveNotesId] = useState(null);
  const [currentNotes, setCurrentNotes] = useState('');

  const statuses = ['New', 'Contacted', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await api.get(`/enquiries?${params.toString()}`);
      if (res.data?.enquiries) {
        setEnquiries(res.data.enquiries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter, search]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/enquiries/${id}/status`, { orderStatus: newStatus });
      setEnquiries(prev => prev.map(e => e._id === id ? { ...e, orderStatus: newStatus } : e));
    } catch (err) {
      alert('Failed to update enquiry status');
    }
  };

  const saveNotes = async (id) => {
    try {
      await api.patch(`/enquiries/${id}/status`, { adminNotes: currentNotes });
      setEnquiries(prev => prev.map(e => e._id === id ? { ...e, adminNotes: currentNotes } : e));
      setActiveNotesId(null);
    } catch (err) {
      alert('Failed to save admin notes');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Contacted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Shipped':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#352525]">
            Customer Enquiries & Orders
          </h1>
          <p className="text-xs text-[#8C7A77]">
            Manage orders, update dispatch statuses, add courier tracking notes, and reply on WhatsApp
          </p>
        </div>

        <div className="text-xs font-semibold text-[#8C7A77]">
          Total Enquiries: <strong className="text-[#352525]">{enquiries.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EBDAD4] grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <input
            type="text"
            placeholder="Search customer name, phone number, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79]"
          />
          <Search className="w-3.5 h-3.5 text-[#A89895] absolute left-2.5 top-2.5" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#B76E79]"
        >
          <option value="">All Order Statuses</option>
          {statuses.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-[#8C7A77] border border-[#EBDAD4]">
            Loading customer enquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-[#8C7A77] border border-[#EBDAD4] space-y-2">
            <MessageSquareText className="w-10 h-10 mx-auto text-[#B76E79]/50" />
            <h3 className="font-serif font-bold text-base text-[#352525]">No enquiries found</h3>
            <p className="text-xs">No records matched the selected status or search query.</p>
          </div>
        ) : (
          enquiries.map((enq) => {
            const cleanWa = (enq.whatsappNumber || '').replace(/[^0-9]/g, '');
            const waReplyText = encodeURIComponent(
              `Hi ${enq.customerName}, this is Santhiya Style Stone regarding your jewellery enquiry.`
            );
            const waReplyLink = `https://wa.me/${cleanWa}?text=${waReplyText}`;

            return (
              <div 
                key={enq._id} 
                className="bg-white rounded-2xl border border-[#EBDAD4] p-5 shadow-xs hover:shadow-md transition-shadow space-y-4"
              >
                
                {/* Top customer line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0E6E1] pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-serif font-bold text-base text-[#352525]">
                        {enq.customerName}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(enq.orderStatus)}`}>
                        {enq.orderStatus}
                      </span>
                    </div>

                    <p className="text-xs text-[#6A5A57] mt-0.5">
                      WhatsApp: <strong className="font-mono text-[#352525]">{enq.whatsappNumber}</strong>
                      {enq.city && <span> • {enq.city}</span>}
                      {enq.email && <span> • {enq.email}</span>}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] text-[#8C7A77] font-mono">
                      {new Date(enq.createdAt).toLocaleString()}
                    </span>

                    {/* Direct WhatsApp button */}
                    <a
                      href={waReplyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Reply on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Details Content: Product / Cart / Message */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                  
                  {/* Selected Product / Items */}
                  <div className="lg:col-span-2 space-y-2 bg-[#FAF7F5] p-3.5 rounded-xl border border-[#EBDAD4]">
                    <span className="font-semibold text-[#4A3E3D] block">Items in Enquiry:</span>
                    
                    {enq.productDetails ? (
                      <div className="flex items-center space-x-3 bg-white p-2 rounded-lg border border-[#E8D8D3]">
                        <img 
                          src={enq.productDetails.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80'} 
                          alt="" 
                          className="w-12 h-12 object-cover rounded-md border shrink-0"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-[#352525]">{enq.productDetails.name}</p>
                          <p className="text-[10px] text-[#8C7A77] font-mono">{enq.productDetails.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#8C3A48]">₹{enq.productDetails.price}</p>
                          <p className="text-[10px] text-[#8C7A77]">Qty: {enq.quantity || 1}</p>
                        </div>
                      </div>
                    ) : enq.cartItems && enq.cartItems.length > 0 ? (
                      <div className="space-y-1.5">
                        {enq.cartItems.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-[#E8D8D3]">
                            <div>
                              <p className="font-semibold text-[#352525]">{item.name}</p>
                              <p className="text-[10px] text-[#8C7A77] font-mono">{item.sku}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-[#8C3A48]">₹{item.price}</p>
                              <p className="text-[10px] text-[#8C7A77]">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#8C7A77] italic">General jewellery inquiry without specific cart items.</p>
                    )}

                    {enq.totalAmount > 0 && (
                      <div className="flex items-center justify-between pt-1 border-t border-[#E8D8D3] font-bold text-xs">
                        <span>Total Enquiry Value:</span>
                        <span className="text-[#8C3A48] text-sm">₹{enq.totalAmount}</span>
                      </div>
                    )}

                    {enq.customerMessage && (
                      <div className="pt-2 text-[11px] text-[#5A4D4B]">
                        <strong>Customer Note:</strong> "{enq.customerMessage}"
                      </div>
                    )}
                    {enq.address && (
                      <div className="text-[11px] text-[#5A4D4B]">
                        <strong>Address:</strong> {enq.address}
                      </div>
                    )}
                  </div>

                  {/* Order Status & Admin Tracking Notes */}
                  <div className="space-y-3 bg-[#FAF7F5] p-3.5 rounded-xl border border-[#EBDAD4] flex flex-col justify-between">
                    <div>
                      <label className="block font-semibold text-[#4A3E3D] mb-1">Update Status</label>
                      <select
                        value={enq.orderStatus}
                        onChange={(e) => handleStatusUpdate(enq._id, e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-[#E0D0CB] rounded-lg font-semibold text-xs focus:outline-none focus:border-[#B76E79]"
                      >
                        {statuses.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-[#4A3E3D]">Admin Notes & Tracking</label>
                        {activeNotesId !== enq._id ? (
                          <button
                            onClick={() => {
                              setActiveNotesId(enq._id);
                              setCurrentNotes(enq.adminNotes || '');
                            }}
                            className="text-[11px] text-[#B76E79] hover:underline flex items-center space-x-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Notes</span>
                          </button>
                        ) : null}
                      </div>

                      {activeNotesId === enq._id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            value={currentNotes}
                            onChange={(e) => setCurrentNotes(e.target.value)}
                            placeholder="Add courier tracking number, payment confirmation, customer call notes..."
                            className="w-full px-2.5 py-1.5 bg-white border border-[#E0D0CB] rounded-lg text-xs"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setActiveNotesId(null)}
                              className="px-2.5 py-1 text-[11px] border border-[#D9C4BD] rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => saveNotes(enq._id)}
                              className="px-3 py-1 text-[11px] bg-[#B76E79] text-white rounded-lg font-bold flex items-center space-x-1"
                            >
                              <Save className="w-3 h-3" />
                              <span>Save Note</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[#6A5A57] bg-white p-2 rounded-lg border border-[#E8D8D3] italic min-h-[44px]">
                          {enq.adminNotes || 'No internal notes added yet.'}
                        </p>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default AdminEnquiriesPage;

