export function normalizeProduct(product) {
    return {
        ...product,
        id: Number(product.id),
        name: String(product.name),
        barcode: String(product.barcode),
        price: Number(product.price),
        stock: Number(product.stock),
        minStock: Number(product.minStock),
        category: String(product.category),
    }
}

export function normalizeProducts(products) {
    return products.map(normalizeProduct)
}
