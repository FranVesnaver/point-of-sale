import { describe, expect, it } from "vitest";
import { normalizeProduct, normalizeProducts, filterProducts, formatQuantity, getLowStock } from "../../domain/product.js";

describe("product domain", () => {
    const products = [
        { id: 1, name: "Leche Entera", barcode: "111", category: "DAIRY", stock: 5, minStock: 3 },
        { id: 2, name: "Pan", barcode: "222", category: "BAKERY", stock: 1, minStock: 2 },
        { id: 3, name: "Jabon", barcode: "333", category: "HYGIENE", stock: 10, minStock: 2 }
    ];

    it("normalizes a product", () => {
        const input = {
            id: "1",
            name: 123,
            barcode: 999,
            price: "5000",
            stock: "2",
            minStock: "1",
            category: "OTHER",
            allowFractionalSale: true
        };
        const normalized = normalizeProduct(input);
        expect(normalized).toEqual({
            ...input,
            id: 1,
            name: "123",
            barcode: "999",
            price: 5000,
            stock: 2,
            minStock: 1,
            category: "OTHER",
            allowFractionalSale: true
        });
    })

    it("normalizes a list of products", () => {
        const result = normalizeProducts([{ id: "1" }, { id: 2 }]);
        expect(result[0].id).toBe(1);
        expect(result[1].id).toBe(2);
    })

    it("filters by search term and category", () => {
        const result = filterProducts(products, "pan", "BAKERY");
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(2);
    })

    it("matches barcode in search", () => {
        const result = filterProducts(products, "333", "ALL");
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(3);
    })

    it("returns all when empty search and ALL category", () => {
        const result = filterProducts(products, "", "ALL");
        expect(result).toHaveLength(3);
    })

    it("detects low stock", () => {
        const lowStock = getLowStock(products);
        expect(lowStock).toHaveLength(1);
        expect(lowStock[0].id).toBe(2);
    })

    it("formats fractional quantities without trailing zeroes", () => {
        expect(formatQuantity(0.5)).toBe("0.5")
        expect(formatQuantity(2)).toBe("2")
    })
})
