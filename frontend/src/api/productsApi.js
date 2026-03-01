import { request } from "./apiUtils.js";

const API_URL = "http://localhost:8080/api/products";

export async function getProducts() {
    return request(API_URL, {
        method: 'GET',
    }, "Error getting products")
}