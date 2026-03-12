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
                id: Number(sale.id),
                total: Number(sale.total),
                items: normalizeSaleItems(sale.items),
                paymentMethod: String(sale.paymentMethod),
                date: sale.date
            }
        });
    }

    const normalizeProducts = (products) => {
        return products.map((product) => {
            return {
                ...product,
                id: Number(product.id),
                name: String(product.name),
                barcode: String(product.barcode),
                price: Number(product.price),
                stock: Number(product.stock),
                minStock: Number(product.minStock)
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

    const addToCart = (product, quantityToAdd = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) {
                if (existing.quantity + quantityToAdd > product.stock) return prev
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantityToAdd }
                        : item
                )
            }
            return [...prev, { ...product, quantity: quantityToAdd }]
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
    }

    const updateStockAfterTransaction = (soldItems) => {
        const quantitiesByBarcode = new Map()
        for (const item of soldItems) {
            quantitiesByBarcode.set(item.barcode, (quantitiesByBarcode.get(item.barcode) ?? 0) + item.quantity);
        }

        setProducts(prev =>
            prev.map(p => {
                const qty = quantitiesByBarcode.get(p.barcode)
                return qty ? { ...p, stock: p.stock - qty } : p
            })
        )
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
                updateStockAfterTransaction,
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
