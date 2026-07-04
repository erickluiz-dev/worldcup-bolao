import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

interface AdminRouteProps {
    children: ReactNode;
}

export default function AdminRoute({
    children,
}: AdminRouteProps) {
    const {
        user,
        loading,
        isAuthenticated,
    } = useAuth();

    // Aguarda a restauração da sessão
    if (loading) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                }}
            >
                Carregando...
            </div>
        );
    }

    // Usuário não autenticado
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // Usuário autenticado, mas sem permissão de administrador
    if (user?.role !== "admin") {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return <>{children}</>;
}