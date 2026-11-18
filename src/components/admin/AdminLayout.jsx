import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Gem, 
  Boxes, 
  FolderTree, 
  MessageSquareText, 
  Settings, 
  LogOut, 
  ExternalLink,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useSettings } from '../../context/SettingsContext';

const AdminLayout = () => {
  const { admin, logout, isAuthenticated, loading } = useAdminAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F5]">
        <div className="w-8 h-8 border-4 border-[#B76E79] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Product Management', path: '/admin/products', icon: Gem },
    { name: 'Inventory & Stock History', path: '/admin/inventory', icon: Boxes },
    { name: 'Category Management', path: '/admin/categories', icon: FolderTree },
    { name: 'Enquiries & Orders', path: '/admin/enquiries', icon: MessageSquareText },
    { name: 'Website Settings', path: '/admin/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#2A2120] text-white">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#3F3331] flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#B76E79] flex items-center justify-center font-serif font-bold text-white shadow-xs">
            S
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm tracking-wide text-white">
              {settings.businessName || 'Santhiya Style Stone'}
            </h2>
            <p className="text-[10px] text-[#B76E79] font-medium tracking-wider uppercase">
              Admin Portal
            </p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#B76E79] text-white shadow-md'
                    : 'text-[#C5B8B5] hover:bg-[#382C2B] hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[#3F3331] space-y-2">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-[#C5B8B5] hover:bg-[#382C2B] hover:text-white transition-colors"
        >
          <span className="flex items-center space-x-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#B76E79]" />
            <span>View Live Website</span>
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F4F1] flex">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 shadow-xl z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
            onClick={() => setMobileSidebarOpen(false)} 
          />
          <div className="relative w-64 max-w-xs h-full z-10">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-[#EBDAD4] h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-[#4A3E3D] hover:text-[#B76E79]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-[#8C7A77] hidden sm:inline">
              Jewellery Management Dashboard
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center space-x-1.5 text-xs text-[#B76E79] font-bold bg-[#FAF0F2] px-3 py-1.5 rounded-full hover:bg-[#F5E2E5] transition-colors"
            >
              <span>Live Store</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="flex items-center space-x-2 pl-2 border-l border-[#EBDAD4]">
              <div className="w-8 h-8 rounded-full bg-[#B76E79]/20 text-[#8C3A48] font-bold text-xs flex items-center justify-center">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-[#352525] leading-none">{admin?.name || 'Admin'}</p>
                <p className="text-[10px] text-[#8C7A77] mt-0.5">{admin?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;

