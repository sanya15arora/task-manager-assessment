import { API_PATHS } from "@/lib/apiPath";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
    accessToken = token;
}

export function getAccessToken() {
    return accessToken;
}

async function refreshAccessToken(): Promise<string | null> {
    try {
        const res = await fetch(API_PATHS.AUTH.REFRESH, {
            method: "POST",
            credentials: "include", // include cookies
        });

        if (!res.ok) return null;

        const data = await res.json();
        if (!data.accessToken) return null;

        accessToken = data.accessToken;
        return accessToken;
    } catch (err) {
        console.error("Refresh token request failed:", err);
        return null;
    }
}

export async function apiFetch(
    input: RequestInfo,
    init: RequestInit = {},
    retry: boolean = true
): Promise<Response> {
    const headers = new Headers(init.headers);

    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);

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
