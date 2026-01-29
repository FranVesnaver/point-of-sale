import { createContext, useContext, useState } from 'react'
import { sampleProducts, sampleTransactions } from './sample-data'

const Context = createContext(undefined);

export function ContextProvider({ children }) {
    const [products, setProducts] = useState(sampleProducts)
    const [cart, setCart] = useState([])
    const [transactions, setTransactions] = useState(sampleTransactions)

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
