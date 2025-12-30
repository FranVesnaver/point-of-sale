const API_URL = "http://localhost:8080/api/sales";

export async function createSale() {
    const response = await fetch(API_URL, {
        method: 'POST',
    })

    if (!response.ok) throw new error("Error creating sale");
    return response.json();
}

export async function addItemToSale(saleId, barcode, quantity = 1) {
    const response = await fetch(`${API_URL}/${saleId}/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode, quantity }),
    });

    if (!response.ok) throw new error("Error adding item");
    return response.json();
}

export async function finalizeSale(saleId) {
    const response = await fetch(`${API_URL}/${saleId}/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    
    if (!response.ok) throw new error("Error finalizing sale");
    return response.json();
}