import { request } from "./apiUtils.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const API_URL = `${API_BASE_URL}/products`;

export async function getProducts() {
    return request(API_URL, {
        method: 'GET',
    }, "Error getting products")
}

export async function addProduct(name, price, stock, minStock, barcode) {
    return request(API_URL, {
        method: 'POST',
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, price, stock, minStock, barcode })
    }, "Error adding product")
}

export async function updateProduct(productId, name, price, stock, minStock, barcode) {
    return request(`${API_URL}/${productId}`, {
        method: 'PUT',
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, price, stock, minStock, barcode })
    }, "Error updating product")
}
