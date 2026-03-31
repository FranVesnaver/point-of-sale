import { request } from "./apiUtils.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const API_URL = `${API_BASE_URL}/users`;

export async function createUser(username, password, admin) {
    return request(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, admin }),
    }, "Error creating user");
}
