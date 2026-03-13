export function addToCart(cart, product, quantityToAdd = 1) {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
        if (existing.quantity + quantityToAdd > product.stock) return cart
        return cart.map(item =>
            item.id === product.id
                ? { ...item, quantity: item.quantity + quantityToAdd }
                : item
        )
    }
    return [...cart, { ...product, quantity: quantityToAdd }]
}

export function removeFromCart(cart, productId) {
    return cart.filter(item => item.id !== productId)
}

export function updateQuantity(cart, productId, quantity) {
    if (quantity <= 0) {
        return removeFromCart(cart, productId)
    }
    return cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
    )
}

export function clearCart() {
    return []
}

export function cartTotal(cart) {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function updateStockAfterTransaction(products, soldItems) {
    const quantitiesByBarcode = new Map()
    for (const item of soldItems) {
        quantitiesByBarcode.set(
            item.barcode,
            (quantitiesByBarcode.get(item.barcode) ?? 0) + item.quantity
        )
    }

    return products.map(p => {
        const qty = quantitiesByBarcode.get(p.barcode)
        return qty ? { ...p, stock: p.stock - qty } : p
    })
}
