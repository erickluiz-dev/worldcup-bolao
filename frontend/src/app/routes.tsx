import { createBrowserRouter } from "react-router-dom";

/* ==========================================================
 * Layouts
 * ========================================================== */

import { Layout } from "./components/Layout";

import AdminLayout from "./components/admin/AdminLayout";

/* ==========================================================
 * Autenticação
 * ========================================================== */

import Login from "./components/Login";
import Register from "./components/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/admin/AdminRoute";

/* ==========================================================
 * Páginas públicas
 * ========================================================== */

import { Home } from "./components/Home";
import { Ranking } from "./components/Ranking";
import { MyPredictions } from "./components/MyPredictions";

/* ==========================================================
 * Painel Administrativo
 * ========================================================== */

import AdminDashboard from "./components/admin/AdminDashboard";
import TeamsAdmin from "./components/admin/TeamsAdmin";
import StadiumsAdmin from "./components/admin/StadiumsAdmin";
import MatchesAdmin from "./components/admin/MatchesAdmin";
import ResultsAdmin from "./components/admin/ResultsAdmin";
import UsersAdmin from "./components/admin/UsersAdmin";

/*
 * Próximos módulos
 */



/* ==========================================================
 * Router
 * ========================================================== */

export const router =
    createBrowserRouter([

        /* ==============================================
         * Rotas públicas
         * ============================================== */

        {
            path: "/login",
            Component: Login,
        },

        {
            path: "/register",
            Component: Register,
        },

        /* ==============================================
         * Área do usuário
         * ============================================== */

        {
            path: "/",

            element: (

                <ProtectedRoute>

                    <Layout />

                </ProtectedRoute>

            ),

            children: [

                {
                    index: true,
                    Component: Home,
                },

                {
                    path: "ranking",
                    Component: Ranking,
                },

                {
                    path: "meus-palpites",
                    Component: MyPredictions,
                },

            ],

        },

        /* ==============================================
         * Painel Administrativo
         * ============================================== */

        {
            path: "/admin",

            element: (

                <AdminRoute>

                    <AdminLayout />

                </AdminRoute>

            ),

            children: [

                {
                    index: true,
                    Component: AdminDashboard,
                },

                {
                    path: "teams",
                    Component: TeamsAdmin,
                },

                {
                    path: "stadiums",
                    Component: StadiumsAdmin,
                },

                {
                    path: "matches",
                    Component: MatchesAdmin,
                },

                {
                    path: "results",
                    Component: ResultsAdmin,
                },

                {
                    path: "users",
                    Component: UsersAdmin,
                },

            ],

        },

        /* ==============================================
         * Página não encontrada
         * ============================================== */

        {
            path: "*",

            element: (

                <h1
                    style={{
                        textAlign: "center",
                        marginTop: 80,
                    }}
                >
                    404 - Página não encontrada
                </h1>

            ),

        },

    ]);