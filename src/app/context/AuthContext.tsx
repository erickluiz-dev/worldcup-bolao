import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import {
    login as loginService,
    register as registerService,
    logout as logoutService,
    saveTokens,
    getCurrentUser,
    AuthUser,
    LoginRequest,
    RegisterRequest,
} from "../services/authService";

/* ==========================================================
 * Interface do Contexto
 * ========================================================== */

interface AuthContextType {
    user: AuthUser | null;

    loading: boolean;

    isAuthenticated: boolean;

    login: (
        credentials: LoginRequest
    ) => Promise<void>;

    register: (
        data: RegisterRequest
    ) => Promise<void>;

    logout: () => Promise<void>;

    refreshUser: () => Promise<void>;
}

/* ==========================================================
 * Context
 * ========================================================== */

const AuthContext = createContext<
    AuthContextType | undefined
>(undefined);

/* ==========================================================
 * Provider
 * ========================================================== */

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] =
        useState<AuthUser | null>(null);

    const [loading, setLoading] =
        useState(true);

    /* ======================================================
     * Restaurar sessão
     * ====================================================== */

    async function refreshUser() {
        try {
            const currentUser =
                await getCurrentUser();

            setUser(currentUser);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refreshUser();
    }, []);

    /* ======================================================
     * Login
     * ====================================================== */

    async function login(
        credentials: LoginRequest
    ) {
        setLoading(true);

        try {
            const response =
                await loginService(
                    credentials
                );

            saveTokens(
                response.access_token,
                response.refresh_token
            );

            setUser(response.user);
        } finally {
            setLoading(false);
        }
    }

    /* ======================================================
     * Cadastro
     * ====================================================== */

    async function register(
        data: RegisterRequest
    ) {
        setLoading(true);

        try {
            const response =
                await registerService(data);

            saveTokens(
                response.access_token,
                response.refresh_token
            );

            setUser(response.user);
        } finally {
            setLoading(false);
        }
    }

    /* ======================================================
     * Logout
     * ====================================================== */

    async function logout() {
        setLoading(true);

        try {
            await logoutService();

            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    /* ======================================================
     * Provider
     * ====================================================== */

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated:
                    user !== null,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/* ==========================================================
 * Hook
 * ========================================================== */

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth deve ser utilizado dentro de um AuthProvider."
        );
    }

    return context;
}
