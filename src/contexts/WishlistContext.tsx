import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { Product } from '../types/product';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  const { user } = useAuth();
  
  // Load wishlist from localStorage on mount and when user changes
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    
    const storageKey = `wishlist_${user.id}`;
    const storedItems = localStorage.getItem(storageKey);
    
    if (storedItems) {
      try {
        setItems(JSON.parse(storedItems));
      } catch (e) {
        console.error('Error parsing wishlist data:', e);
        setItems([]);
      }
    } else {
      setItems([]);
    }
  }, [user]);
  
  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (!user) return;
    
    const storageKey = `wishlist_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, user]);
  
  const addToWishlist = (product: Product) => {
    setItems(prevItems => {
      const exists = prevItems.some(item => item.id === product.id);
      if (exists) return prevItems;
      return [...prevItems, product];
    });
  };
  
  const removeFromWishlist = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.id === productId);
  };
  
  const clearWishlist = () => {
    setItems([]);
  };
  
  return (
    <WishlistContext.Provider value={{
      items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};