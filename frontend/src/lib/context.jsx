import { createContext, useContext, useEffect, useState } from 'react'
import { getSales } from "../api/salesApi.js";
import { getProducts } from "../api/productsApi.js";

const Context = createContext(undefined);

export function ContextProvider({ children }) {
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState([])
    const [transactions, setTransactions] = useState([])

    const normalizeSaleItems = (saleItems) => {
        return saleItems.map((saleItem) => {
            return {
                ...saleItem,
                productName: String(saleItem.productName),
                quantity: Number(saleItem.quantity),
                unitPrice: Number(saleItem.unitPrice),
                subtotal: Number(saleItem.subtotal)
            }
        });
    }

    const normalizeSales = (sales) => {
        return sales.map((sale) => {
            return {
                ...sale,
                id: String(sale.id),
                total: Number(sale.total),
                items: normalizeSaleItems(sale.items),
                date: sale.date
            }
        });
    }

    const normalizeProducts = (products) => {
        return products.map((product) => {
            return {
                ...product,
                id: String(product.id),
                name: String(product.name),
                barcode: String(product.barcode),
                price: Number(product.price),
                stock: Number(product.stock)
            };
        });
    }

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

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) {
                if (existing.quantity >= product.stock) return prev
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, { ...product, quantity: 1 }]
        })
    }

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId))
    }

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }
        setCart(prev =>
            prev.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        )
    }

    const clearCart = () => setCart([])

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const addTransaction = (transaction) => {
        setTransactions(prev => [transaction, ...prev])
        // Update stock
        for (const item of transaction.items) {
            setProducts(prev =>
                prev.map(p =>
                    p.id === item.id
                        ? { ...p, stock: p.stock - item.quantity }
                        : p
                )
            )
        }
    }

    const updateProductStock = (productId, newStock) => {
        setProducts(prev =>
            prev.map(p =>
                p.id === productId ? { ...p, stock: newStock } : p
            )
        )
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
                updateProductStock,
            }}
        >
            {children}
        </Context.Provider>
    )
}

export function usePOS() {
    const context = useContext(Context)
    if (!context) {
        throw new Error('usePOS must be used within a ContextProvider')
    }
    return context
}
