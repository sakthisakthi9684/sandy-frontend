import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import FloatingWhatsApp from '../common/FloatingWhatsApp';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF8]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
    </div>
  );
};

export default CustomerLayout;

