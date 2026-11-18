import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { settings, getWhatsAppUrl } = useSettings();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('santhiya_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('santhiya_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item._id === product._id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        // Don't exceed available stock
        const maxStock = product.stockQuantity || 99;
        updated[existingIndex].quantity = Math.min(newQty, maxStock);
        return updated;
      } else {
        const itemQty = Math.min(quantity, product.stockQuantity || 99);
        return [...prev, {
          _id: product._id,
          name: product.name,
          sku: product.sku,
          sellingPrice: product.sellingPrice,
          originalPrice: product.originalPrice,
          image: (product.images && product.images[0]) || '',
          categoryName: product.categoryName || '',
          stockQuantity: product.stockQuantity,
          quantity: itemQty > 0 ? itemQty : 1
        }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item._id === productId) {
          const maxStock = item.stockQuantity || 99;
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return {
            ...item,
            quantity: Math.min(newQty, maxStock)
          };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);

  // Generate WhatsApp order message for complete cart
  const getCartWhatsAppUrl = (customerName = '', deliveryCity = '') => {
    if (cartItems.length === 0) return '#';

    let itemsList = cartItems.map((item, idx) => 
      `${idx + 1}. ${item.name} (${item.sku})\n   Qty: ${item.quantity} x ₹${item.sellingPrice} = ₹${item.quantity * item.sellingPrice}`
    ).join('\n\n');

    let msg = `Hi ${settings.businessName || 'Santhiya Style Stone'},

I would like to place an order for the following jewellery items:

${itemsList}

--------------------------
Subtotal: ₹${subtotal}
Estimated Delivery: All Across India
${customerName ? `Customer Name: ${customerName}\n` : ''}${deliveryCity ? `Delivery City/Pincode: ${deliveryCity}\n` : ''}
Please confirm availability and share payment/UPI details. Thank you!`;

    return getWhatsAppUrl(msg);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      totalItems,
      subtotal,
      getCartWhatsAppUrl
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

