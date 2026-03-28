const AUTH_STORAGE_KEY = "superpos.auth";

export function getStoredAuth() {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw);
        if (!parsed?.token) {
            return null;
        }

        if (parsed.expiresAt && Number(parsed.expiresAt) * 1000 < Date.now()) {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            return null;
        }

        return parsed;
    } catch {
        return null;
    }
}

export function storeAuth(authData) {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
}

export function clearAuth() {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getAuthToken() {
    return getStoredAuth()?.token ?? null;
}
