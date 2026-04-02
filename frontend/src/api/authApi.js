import { request } from "./apiUtils.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const LOGIN_API_URL = `${API_BASE_URL}/auth/login`;
const LOGOUT_API_URL = `${API_BASE_URL}/auth/logout`;
const BOOTSTRAP_API_URL = `${API_BASE_URL}/auth/bootstrap`;

export async function login(username, password) {
    return request(LOGIN_API_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
    }, "Failed to login");
}

export async function logout() {
    return request(LOGOUT_API_URL, {
        method: "POST",
    }, "Failed to logout");
}

export async function bootstrap() {
    return request(BOOTSTRAP_API_URL, {
        method: "GET",
    }, "Failed to get bootstrap status");
}
