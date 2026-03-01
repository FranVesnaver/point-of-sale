import {request} from "./apiUtils.js";

const API_URL = "http://localhost:8080/api/sales";

export async function getSales() {
    return request(API_URL, {
        method: 'GET',
    }, "Error getting sale history")
}

export async function createSale() {
    return request(API_URL, {
        method: 'POST',
    }, "Error creating sale");
}

export async function addItemToSale(saleId, barcode, quantity = 1) {
    return request(`${API_URL}/${saleId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode, quantity }),
    }, "Error adding item");
}

export async function finalizeSale(saleId) {
    return request(`${API_URL}/${saleId}/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    }, "Error finalizing sale");
}
