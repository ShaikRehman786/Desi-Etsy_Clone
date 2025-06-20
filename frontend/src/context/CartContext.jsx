import { createContext, useContext, useEffect, useState } from 'react';
import * as cartService from '../services/cart';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const getToken = () => localStorage.getItem('token');

  const refreshCart = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token found");
      const items = await cartService.getCartItems(token);
      setCartItems(items);
    } catch (err) {
      console.error("Failed to refresh cart:", err);
    }
  };

  useEffect(() => {
    refreshCart(); // auto-load on mount
  }, []);

  const addToCart = async (product) => {
    const token = getToken();
    if (!token) throw new Error("No token found. Please log in.");
    await cartService.addToCart(product._id, token);
    await refreshCart(); // 👈 update local state
  };

  const removeFromCart = async (cartItemId) => {
    const token = getToken();
    if (!token) throw new Error("No token found. Please log in.");
    await cartService.removeFromCart(cartItemId, token);
    await refreshCart();
  };

  const updateCartItemQuantity = async (cartItemId, action) => {
    const token = getToken();
    if (!token) throw new Error("No token found. Please log in.");
    await cartService.updateCartItemQuantity(cartItemId, action, token);
    await refreshCart();
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      if (!item.product) return total;
      return total + item.product.price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        getTotal,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
