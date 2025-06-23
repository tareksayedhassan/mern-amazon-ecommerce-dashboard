import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("product")) || [];
    setCart(stored);
  }, []);

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("product", JSON.stringify(updatedCart));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
