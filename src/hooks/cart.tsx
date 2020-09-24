import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  removeFromCart(id: string): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      //* TODO LOAD ITEMS FROM ASYNC STORAGE
      // const keys = await AsyncStorage.getAllKeys();
      // await AsyncStorage.multiRemove(keys);

      const storedProducts = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );

      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    }

    loadProducts();
  }, []);

  const increment = useCallback(
    async id => {
      //* TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      const updatedProducts = products.map(product => {
        if (product.id === id) {
          return { ...product, quantity: product.quantity + 1 };
        }

        return product;
      });

      setProducts(updatedProducts);

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(updatedProducts),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      //* TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const updatedProducts = products.map(product => {
        if (product.id === id) {
          return { ...product, quantity: product.quantity - 1 };
        }

        return product;
      });

      setProducts(updatedProducts);

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(updatedProducts),
      );
    },
    [products],
  );

  const addToCart = useCallback(
    async (product: Product) => {
      //* TODO ADD A NEW ITEM TO THE CART
      const findProductWithSameId = products.findIndex(
        p => p.id === product.id,
      );

      if (findProductWithSameId < 0) {
        setProducts([...products, { ...product, quantity: 1 }]);

        await AsyncStorage.setItem(
          '@GoMarketplace:products',
          JSON.stringify(products),
        );
      } else {
        await increment(product.id);
      }
    },
    [increment, products],
  );

  const removeFromCart = useCallback(
    async id => {
      const updatedProducts = products.filter(product => product.id !== id);

      setProducts(updatedProducts);
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, removeFromCart, increment, decrement, products }),
    [products, addToCart, removeFromCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
