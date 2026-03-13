import { describe, expect, it } from "vitest"
import {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    updateStockAfterTransaction
} from "../../domain/cart.js"

describe("cart domain", () => {
    const productA = { id: 1, name: "A", price: 1000, stock: 3, barcode: "111" }
    const productB = { id: 2, name: "B", price: 500, stock: 10, barcode: "222" }

    it("adds new products to cart", () => {
        const cart = addToCart([], productA, 2)
        expect(cart).toHaveLength(1)
        expect(cart[0].quantity).toBe(2)
    })

    it("increments quantity for existing product", () => {
        const cart = addToCart([{ ...productA, quantity: 1 }], productA, 2)
        expect(cart[0].quantity).toBe(3)
    })

    it("prevents adding beyond stock", () => {
        const initial = [{ ...productA, quantity: 3 }]
        const cart = addToCart(initial, productA, 1)
        expect(cart).toBe(initial)
    })

    it("removes product from cart", () => {
        const cart = removeFromCart([{ ...productA, quantity: 1 }], productA.id)
        expect(cart).toHaveLength(0)
    })

    it("updates quantity and removes when zero", () => {
        const cart = updateQuantity([{ ...productA, quantity: 1 }], productA.id, 0)
        expect(cart).toHaveLength(0)
    })

    it("clears cart", () => {
        expect(clearCart()).toEqual([])
    })

    it("calculates total", () => {
        const cart = [
            { ...productA, quantity: 2 },
            { ...productB, quantity: 1 }
        ]
        expect(cartTotal(cart)).toBe(2500)
    })

    it("updates stock after transaction by barcode", () => {
        const products = [
            { id: 1, stock: 10, barcode: "111" },
            { id: 2, stock: 5, barcode: "222" }
        ]
        const soldItems = [
            { barcode: "111", quantity: 2 },
            { barcode: "111", quantity: 1 },
            { barcode: "222", quantity: 5 }
        ]
        const updated = updateStockAfterTransaction(products, soldItems)
        expect(updated[0].stock).toBe(7)
        expect(updated[1].stock).toBe(0)
    })
})
