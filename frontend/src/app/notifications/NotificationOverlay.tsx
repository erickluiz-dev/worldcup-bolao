import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "motion/react";

import {
    X,
    Swords,
    Star,
    Check,
    CircleOff,
} from "lucide-react";

import "./NotificationOverlay.css";

import { useNotification } from "./NotificationContext";

import { getTeams } from "../services/teamService";

import { getMatches } from "../services/matchService";

import type { Team } from "../types/Team";

const CONFIG = {

    info: {

        icon: <Swords className="size-4" />,

        iconBg: "#003DA5",

        iconColor: "#FFFFFF",

        accentColor: "#00AEEF",

        title: "Nova Partida",

        subtitle:
            "Faça seu palpite antes do início da partida.",

    },

    success: {

        icon: <Star className="size-4" />,

        iconBg: "#FDC300",

        iconColor: "#000000",

        accentColor: "#FDC300",

        title: "+3 Pontos",

        subtitle:
            "Aqui temos um Alpha! Você previu o placar correto.",

    },

    warning: {

        icon: <Check className="size-4" />,

        iconBg: "#00A550",

        iconColor: "#FFFFFF",

        accentColor: "#00A550",

        title: "+1 Ponto",

        subtitle:
            "Você acertou o vencedor da partida!",

    },

    error: {

        icon: <CircleOff className="size-4" />,

        iconBg: "#E8192C",

        iconColor: "#FFFFFF",

        accentColor: "#E8192C",

        title: "+0 Pontos",

        subtitle:
            "Brutal! Acabou pro Beta. Seu palpite não acertou dessa vez.",

    },

} as const;

export default function NotificationOverlay() {

    const {

        currentNotification,

        nextNotification,

    } = useNotification();

    const [visible, setVisible] =
        useState(false);

    const [teams, setTeams] = useState<Team[]>([]);

    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {

        if (!currentNotification)
            return;

        setVisible(true);

        const timer = setTimeout(() => {

            closeNotification();

        }, 5000);

        return () => clearTimeout(timer);

    }, [currentNotification, nextNotification]);

    useEffect(() => {

        async function loadData() {

            try {

                const [teamsData, matchesData] = await Promise.all([

                    getTeams(),

                    getMatches(),

                ]);

                setTeams(teamsData);

                setMatches(matchesData);

            } catch (error) {

                console.error(error);

            }

        }

        loadData();

    }, []);

    function closeNotification() {

        setVisible(false);

        setTimeout(() => {

            nextNotification();

        }, 350);

    }

    if (!currentNotification) {

        return null;

    }

    const cfg =
        CONFIG[currentNotification.type as keyof typeof CONFIG];

    if (!cfg) {

        return null;

    }

    const match = matches.find(

        m => m.id === currentNotification.match_id

    );

    const homeTeam = teams.find(

        t => t.id === match?.home_team.id

    );

    const awayTeam = teams.find(

        t => t.id === match?.away_team.id

    );

return (

    <div className="notification-wrapper">

        <AnimatePresence mode="wait">

            {visible && (

                <motion.div

                    key={currentNotification.id}

                    layout

                    initial={{
                        opacity: 0,
                        x: 64,
                        scale: 0.92,
                    }}

                    animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                    }}

                    exit={{
                        opacity: 0,
                        x: 64,
                        scale: 0.92,
                    }}

                    transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 28,
                    }}

                    className="notification-card"

                    style={{

                        border: `1px solid ${cfg.accentColor}30`,

                        boxShadow: `

                            0 8px 32px rgba(0,0,0,.50),

                            0 0 0 1px ${cfg.accentColor}15

                        `,

                    }}

                >

                    {/* Barra superior */}

                    <div

                        className="notification-accent"

                        style={{

                            backgroundColor:
                                cfg.accentColor,

                        }}

                    />

                    <div className="notification-content">

                        {/* Ícone */}

                        <div

                            className="notification-icon"

                            style={{

                                background:
                                    cfg.iconBg,

                                color:
                                    cfg.iconColor,

                            }}

                        >

                            {cfg.icon}

                        </div>

                        {/* Texto */}

                        <div className="notification-text">

                            <p

                                className="notification-title"

                                style={{

                                    color:
                                        cfg.accentColor,

                                }}

                            >

                                {cfg.title}

                            </p>

                            <div className="notification-body">

                                {currentNotification.type === "info" ? (

                                    <div className="notification-match-row">

                                        <div className="notification-team">

                                            {homeTeam && (

                                                <img
                                                    src={`/flags/${homeTeam.flag}`}
                                                    alt={homeTeam.name}
                                                    className="notification-flag"
                                                />

                                            )}

                                            <span>{homeTeam?.name}</span>

                                        </div>

                                        <span className="notification-vs">

                                            VS

                                        </span>

                                        <div className="notification-team">

                                            <span>{awayTeam?.name}</span>

                                            {awayTeam && (

                                                <img
                                                    src={`/flags/${awayTeam.flag}`}
                                                    alt={awayTeam.name}
                                                    className="notification-flag"
                                                />

                                            )}

                                        </div>

                                    </div>

                                ) : (

                                    <>
                                        <p className="notification-description">

                                            {cfg.subtitle}

                                        </p>

                                        <p className="notification-match">

                                            {currentNotification.message}

                                        </p>
                                    </>

                                )}

                            </div>

                        </div>

                        {/* Botão Fechar */}

                        <button

                            onClick={closeNotification}

                            className="notification-close"

                            aria-label="Fechar notificação"

                        >

                            <X className="size-4" />

                        </button>

                    </div>

                </motion.div>

                )}

            </AnimatePresence>

        </div>

    );

    }