import { createContext, useContext, useEffect, useState } from 'react'
import { getSales } from "../api/salesApi.js";
import { getProducts } from "../api/productsApi.js";
import { normalizeSales } from "../domain/sales.js";
import { normalizeProducts } from "../domain/product.js";
import {
    addToCart as addToCartDomain,
    removeFromCart as removeFromCartDomain,
    updateQuantity as updateQuantityDomain,
    clearCart as clearCartDomain,
    cartTotal as cartTotalDomain,
    updateStockAfterTransaction as updateStockAfterTransactionDomain
} from "../domain/cart.js";
import { categories } from "../domain/categories.js";

const Context = createContext(undefined);

export function ContextProvider({ children }) {
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState([])
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        let active = true;

        (async () => {
            try {
                const sales = await getSales();
                const products = await getProducts();
                if (active) {
                    setTransactions(normalizeSales(sales));
                    setProducts(normalizeProducts(products));
                }
            } catch (e) {
                throw new Error(e);
            }
        })();
        return () => {
            active = false;
        }
    }, []);

    const addToCart = (product, quantityToAdd = 1) => {
        setCart(prev => addToCartDomain(prev, product, quantityToAdd));
    }

    const removeFromCart = (productId) => {
        setCart(prev => removeFromCartDomain(prev, productId));
    }

    const updateQuantity = (productId, quantity) => {
        setCart(prev => updateQuantityDomain(prev, productId, quantity));
    }

    const clearCart = () => setCart(clearCartDomain());

    const cartTotal = cartTotalDomain(cart);

    const addTransaction = (transaction) => {
        setTransactions(prev => [transaction, ...prev]);
    }

    const updateStockAfterTransaction = (soldItems) => {
        setProducts(prev => updateStockAfterTransactionDomain(prev, soldItems));
    }

    const updateProductStock = (productId, newStock) => {
        setProducts(prev =>
            prev.map(p =>
                p.id === productId ? { ...p, stock: newStock } : p
            )
        );
    }

    return (
        <Context.Provider
            value={{
                products,
                setProducts,
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                transactions,
                addTransaction,
                updateStockAfterTransaction,
                updateProductStock,
                categories
            }}
        >
            {children}
        </Context.Provider>
    )
}

export function usePOS() {
    const context = useContext(Context);
    if (!context) {
        throw new Error('usePOS must be used within a ContextProvider');
    }
    return context;
}
