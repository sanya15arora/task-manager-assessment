import { API_PATHS } from "@/lib/apiPath";

let accessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

export function setAccessToken(token: string | null) {
    accessToken = token;
}

export function getAccessToken() {
    return accessToken;
}

function onRefreshed(token: string | null) {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string | null) => void) {
    refreshSubscribers.push(callback);
}

async function refreshAccessToken(): Promise<string | null> {
    if (isRefreshing) {
        return new Promise((resolve) => {
            addRefreshSubscriber((token) => {
                resolve(token);
            });
        });
    }

    isRefreshing = true;

    try {
        const res = await fetch(API_PATHS.AUTH.REFRESH, {
            method: "POST",
            credentials: "include", // include cookies
        });

        if (!res.ok) {
            onRefreshed(null);
            return null;
        }

        const data = await res.json();
        if (!data.accessToken) {
            onRefreshed(null);
            return null;
        }

        accessToken = data.accessToken;
        onRefreshed(accessToken);
        return accessToken;
    } catch (err) {
        console.error("Refresh token request failed:", err);
        onRefreshed(null);
        return null;
    } finally {
        isRefreshing = false;
    }
}

export async function apiFetch(
    input: RequestInfo | URL,
    init: RequestInit = {},
    retry: boolean = true
): Promise<Response> {
    const headers = new Headers(init.headers);

    const token = getAccessToken();
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    if (init.body && !(init.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    let res = await fetch(input, {
        ...init,
        headers,
        credentials: "include",
    });

    if (res.status === 401 && retry) {
        const newToken = await refreshAccessToken();

        if (!newToken) {
            setAccessToken(null);
            return res;
        }

        const retryHeaders = new Headers(init.headers);
        retryHeaders.set("Authorization", `Bearer ${newToken}`);

        if (init.body && !(init.body instanceof FormData)) {
            retryHeaders.set("Content-Type", "application/json");
        }

        res = await fetch(input, {
            ...init,
            headers: retryHeaders,
            credentials: "include",
        });
    }

    return res;
}

export function clearAuth() {
    setAccessToken(null);
    isRefreshing = false;
    refreshSubscribers = [];
}