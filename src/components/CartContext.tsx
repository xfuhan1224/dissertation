import axios from "axios";
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface NFT {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}

interface CartContextType {
  cartItems: NFT[];
  addToCart: (nft: NFT) => void;
  removeFromCart: (nftId: number) => void;
}

const defaultState: CartContextType = {
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
};

export const CartContext = createContext<CartContextType>(defaultState);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<NFT[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const addToCart = (nft: NFT) => {
    setCartItems((prevItems) => {
      const newItems = [...prevItems, nft];
      localStorage.setItem("cart", JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeFromCart = (nftId: number) => {
    setCartItems((prevItems) => {
      const filteredItems = prevItems.filter((item) => item.id !== nftId);
      localStorage.setItem("cart", JSON.stringify(filteredItems));
      return filteredItems;
    });
  };

  // 将购物车数据持久化到localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
