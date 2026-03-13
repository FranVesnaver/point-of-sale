import { describe, expect, it } from "vitest"
import { normalizeProduct, normalizeProducts } from "../../domain/product.js"

describe("product domain", () => {
    it("normalizes a product", () => {
        const input = {
            id: "1",
            name: 123,
            barcode: 999,
            price: "5000",
            stock: "2",
            minStock: "1",
            category: "OTHER"
        }
        const normalized = normalizeProduct(input)
        expect(normalized).toEqual({
            ...input,
            id: 1,
            name: "123",
            barcode: "999",
            price: 5000,
            stock: 2,
            minStock: 1,
            category: "OTHER"
        })
    })

    it("normalizes a list of products", () => {
        const result = normalizeProducts([{ id: "1" }, { id: 2 }])
        expect(result[0].id).toBe(1)
        expect(result[1].id).toBe(2)
    })
})
