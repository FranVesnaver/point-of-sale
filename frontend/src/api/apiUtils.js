import { getAuthToken } from "../lib/auth.js";

export async function request(url, options = {}, fallbackMessage) {
    const headers = { ...(options.headers ?? {}) };
    const token = getAuthToken();

    if (token && !headers.Authorization) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let message = fallbackMessage
        try {
            const errorData = await response.json()
            if (errorData?.message) {
                message = errorData.message
            }
        } catch {
            // Keep fallback message when backend response is not JSON.
        }
        throw new Error(message)
    }

    return response.json();
}
