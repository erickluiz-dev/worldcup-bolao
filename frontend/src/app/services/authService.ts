const API_URL = "http://localhost:8000/api/auth";

/* ==========================================================
 * Interfaces
 * ========================================================== */

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    avatar: number;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;

    avatar: number;

    role: string;

    active: boolean;

    created_at: string;

    last_login: string | null;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user: AuthUser;
}

/* ==========================================================
 * Login
 * ========================================================== */

export async function login(
    credentials: LoginRequest
): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const error = await response.json();

        throw new Error(
            error.detail ?? "Erro ao realizar login."
        );
    }

    return await response.json();
}

/* ==========================================================
 * Cadastro
 * ========================================================== */

export async function register(
    data: RegisterRequest
): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();

        throw new Error(
            error.detail ??
                "Erro ao realizar cadastro."
        );
    }

    return await response.json();
}

/* ==========================================================
 * Refresh Token
 * ========================================================== */

export async function refreshToken(): Promise<string> {
    const refresh = getRefreshToken();

    if (!refresh) {
        throw new Error(
            "Refresh Token não encontrado."
        );
    }

    const response = await fetch(
        `${API_URL}/refresh`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
            },
            body: JSON.stringify({
                refresh_token: refresh,
            }),
        }
    );

    if (!response.ok) {
        clearTokens();

        throw new Error("Sessão expirada.");
    }

    const data = await response.json();

    saveTokens(
        data.access_token,
        data.refresh_token
    );

    return data.access_token;
}

/* ==========================================================
 * Usuário autenticado
 * ========================================================== */

export async function getCurrentUser(): Promise<AuthUser> {
    let token = getAccessToken();

    if (!token) {
        throw new Error(
            "Usuário não autenticado."
        );
    }

    let response = await fetch(
        `${API_URL}/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (response.status === 401) {
        token = await refreshToken();

        response = await fetch(
            `${API_URL}/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    }

    if (!response.ok) {
        throw new Error(
            "Erro ao obter usuário autenticado."
        );
    }

    return await response.json();
}

/* ==========================================================
 * Armazenamento dos Tokens
 * (continua na Parte 2)
 * ========================================================== */

/* ==========================================================
 * Armazenamento dos Tokens
 * ========================================================== */

export function saveTokens(
    accessToken: string,
    refreshToken: string
): void {
    localStorage.setItem(
        "access_token",
        accessToken
    );

    localStorage.setItem(
        "refresh_token",
        refreshToken
    );
}

export function getAccessToken(): string | null {
    return localStorage.getItem(
        "access_token"
    );
}

export function getRefreshToken(): string | null {
    return localStorage.getItem(
        "refresh_token"
    );
}

export function clearTokens(): void {
    localStorage.removeItem(
        "access_token"
    );

    localStorage.removeItem(
        "refresh_token"
    );
}

export function isAuthenticated(): boolean {
    return getAccessToken() !== null;
}

/* ==========================================================
 * Logout
 * ========================================================== */

export async function logout(): Promise<void> {
    try {
        await fetch(`${API_URL}/logout`, {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
            },
        });
    } catch {
        // Ignora erros de rede durante o logout
    } finally {
        clearTokens();
    }
}

/* ==========================================================
 * Fetch autenticado
 * ========================================================== */

export async function authenticatedFetch(
    input: RequestInfo | URL,
    init: RequestInit = {}
): Promise<Response> {
    let token = getAccessToken();

    const executeRequest = async (
        accessToken: string | null
    ) => {
        const headers = new Headers(
            init.headers ?? {}
        );

        if (accessToken) {
            headers.set(
                "Authorization",
                `Bearer ${accessToken}`
            );
        }

        if (
            !headers.has("Content-Type")
        ) {
            headers.set(
                "Content-Type",
                "application/json"
            );
        }

        return fetch(input, {
            ...init,
            headers,
        });
    };

    let response = await executeRequest(
        token
    );

    if (response.status !== 401) {
        return response;
    }

    try {
        token = await refreshToken();

        response = await executeRequest(
            token
        );

        return response;
    } catch (error) {
        clearTokens();

        throw error;
    }
}
