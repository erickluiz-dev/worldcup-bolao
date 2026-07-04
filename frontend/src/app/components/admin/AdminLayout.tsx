import { Outlet, NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./AdminLayout.css";

export default function AdminLayout() {
    const { user, logout } = useAuth();

    return (
        <div className="admin-layout">
            {/* ================= Sidebar ================= */}

            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h2>⚽ Bolão</h2>
                    <span>Painel Administrativo</span>
                </div>

                <nav className="admin-menu">
                    <NavLink to="/admin">
                        Dashboard
                    </NavLink>

                    <NavLink to="/admin/teams">
                        Seleções
                    </NavLink>

                    <NavLink to="/admin/stadiums">
                        Estádios
                    </NavLink>

                    <NavLink to="/admin/matches">
                        Jogos
                    </NavLink>

                    <NavLink to="/admin/results">
                        Resultados
                    </NavLink>

                    <NavLink to="/admin/users">
                        Usuários
                    </NavLink>

                    <NavLink to="/ranking">
                        Ranking
                    </NavLink>
                </nav>
            </aside>

            {/* ================= Conteúdo ================= */}

            <main className="admin-main">

                <header className="admin-header">

                    <div className="admin-user">

                        <img
                            src={`/avatars/avatar${user?.avatar}.png`}
                            alt={user?.name}
                            className="admin-avatar"
                        />

                        <div>

                            <strong>{user?.name}</strong>

                            <p>{user?.role}</p>

                        </div>

                    </div>

                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Sair
                    </button>

                </header>

                <section className="admin-content">
                    <Outlet />
                </section>

            </main>
        </div>
    );
}