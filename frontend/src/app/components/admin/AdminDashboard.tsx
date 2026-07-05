import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./AdminDashboard.css";

import NotificationOverlay from "../notifications/NotificationOverlay";

export default function AdminDashboard() {
    const { user } = useAuth();

    const cards = [
        {
            title: "Seleções",
            description: "Cadastrar, editar e remover seleções.",
            path: "/admin/teams",
            icon: "🌍",
        },
        {
            title: "Estádios",
            description: "Gerenciar os estádios da competição.",
            path: "/admin/stadiums",
            icon: "🏟️",
        },
        {
            title: "Jogos",
            description: "Cadastrar e editar partidas.",
            path: "/admin/matches",
            icon: "⚽",
        },
        {
            title: "Resultados",
            description: "Informar resultados oficiais.",
            path: "/admin/results",
            icon: "🥅",
        },
        {
            title: "Usuários",
            description: "Gerenciar usuários e administradores.",
            path: "/admin/users",
            icon: "👥",
        },
        {
            title: "Ranking",
            description: "Visualizar a classificação do bolão.",
            path: "/ranking",
            icon: "🏆",
        },
    ];

   const [showNotification, setShowNotification] = useState(true);

    return (
        <div className="admin-dashboard">

            <header className="dashboard-header">

                <div>

                    <h1>
                        Painel Administrativo
                    </h1>

                    <p>
                        Bem-vindo, <strong>{user?.name}</strong>.
                    </p>

                </div>

            </header>

            <section className="dashboard-summary">

                <div className="summary-card">
                    <span>⚽</span>
                    <h3>Jogos</h3>
                    <p>Gerencie todas as partidas da Copa.</p>
                </div>

                <div className="summary-card">
                    <span>🌍</span>
                    <h3>Seleções</h3>
                    <p>Cadastre e edite as seleções.</p>
                </div>

                <div className="summary-card">
                    <span>🏟️</span>
                    <h3>Estádios</h3>
                    <p>Organize os estádios oficiais.</p>
                </div>

                <div className="summary-card">
                    <span>🏆</span>
                    <h3>Bolão</h3>
                    <p>Atualize resultados e ranking.</p>
                </div>

            </section>

            <section className="dashboard-actions">

                {cards.map((card) => (

                    <Link
                        key={card.path}
                        to={card.path}
                        className="dashboard-card"
                    >

                        <div className="dashboard-icon">
                            {card.icon}
                        </div>

                        <h2>{card.title}</h2>

                        <p>
                            {card.description}
                        </p>

                    </Link>

                ))}

            </section>

        </div>
    );
}