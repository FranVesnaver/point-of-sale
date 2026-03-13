export function normalizeSaleItems(saleItems) {
    return saleItems.map((saleItem) => {
        return {
            ...saleItem,
            productName: String(saleItem.productName),
            quantity: Number(saleItem.quantity),
            unitPrice: Number(saleItem.unitPrice),
            subtotal: Number(saleItem.subtotal)
        }
    })
}

export function normalizeSales(sales) {
    return sales.map((sale) => {
        return {
            ...sale,
            id: Number(sale.id),
            total: Number(sale.total),
            items: normalizeSaleItems(sale.items),
            paymentMethod: String(sale.paymentMethod),
            date: sale.date
        }
    })
}
