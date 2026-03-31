import { request } from "./apiUtils.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const API_URL = `${API_BASE_URL}/auth/login`;

export async function login(username, password) {
    return request(API_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
    }, "Failed to login");
}
