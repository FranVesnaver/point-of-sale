import { request } from "./apiUtils.js";

const API_URL = "http://localhost:8080/api/products";

export async function getProducts() {
    return request(API_URL, {
        method: 'GET',
    }, "Error getting products")
}

export async function addProduct(name, price, stock, barcode) {
    return request(API_URL, {
        method: 'POST',
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, price, stock, barcode })
    }, "Error adding product")
}