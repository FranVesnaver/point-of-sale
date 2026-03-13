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

export function filterProducts(products, searchTerm, selectedCategory) {
    const normalizedSearch = (searchTerm ?? "").toLowerCase()
    return products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(normalizedSearch) ||
            product.barcode?.includes(searchTerm ?? "")
        const matchesCategory = selectedCategory === "ALL" || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })
}

export function getLowStock(products) {
    return products.filter(product => product.stock <= product.minStock)
}
