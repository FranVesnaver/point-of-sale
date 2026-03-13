import { describe, expect, it } from "vitest"
import { normalizeSaleItems, normalizeSales } from "../../domain/sales.js"

describe("sales domain", () => {
    it("normalizes sale items", () => {
        const items = [{
            productName: 123,
            quantity: "2",
            unitPrice: "500",
            subtotal: "1000"
        }]
        const normalized = normalizeSaleItems(items)
        expect(normalized[0]).toEqual({
            ...items[0],
            productName: "123",
            quantity: 2,
            unitPrice: 500,
            subtotal: 1000
        })
    })

    it("normalizes sales", () => {
        const sales = [{
            id: "10",
            total: "50",
            items: [{ productName: "A", quantity: "1", unitPrice: "50", subtotal: "50" }],
            paymentMethod: "CASH",
            date: "2026-03-13T12:00:00Z"
        }]
        const normalized = normalizeSales(sales)
        expect(normalized[0].id).toBe(10)
        expect(normalized[0].total).toBe(50)
        expect(normalized[0].paymentMethod).toBe("CASH")
        expect(normalized[0].items[0].quantity).toBe(1)
    })
})
