import { createContext, useContext, useState, ReactNode } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: "lanaia" | "ok-glacons";
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const products: Product[] = [
  // Lanaïa
  { id: "lanaia-tubes", name: "Mouchoirs Lanaïa - Tubes", price: 1000, unit: "tube", category: "lanaia" },
  { id: "lanaia-paquets", name: "Mouchoirs Lanaïa - Paquets", price: 500, unit: "paquet", category: "lanaia" },
  { id: "lanaia-poches", name: "Mouchoirs Lanaïa - Poches", price: 100, unit: "poche", category: "lanaia" },
  
  // OK Glaçons
  { id: "glacons-verres", name: "Verres de Glaçons", price: 500, unit: "verre", category: "ok-glacons" },
  { id: "glacons-5kg", name: "Glaçons (Sac 5kg)", price: 1000, unit: "sac", category: "ok-glacons" },
  { id: "blocs-ancienne", name: "Blocs à l'ancienne", price: 100, unit: "unité", category: "ok-glacons" },
  { id: "glace-carbonique", name: "Glace Carbonique", price: 7000, unit: "kg", category: "ok-glacons" },
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

