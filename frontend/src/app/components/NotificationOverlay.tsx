import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    X,
    Swords,
    Star,
    Check,
    CircleOff,
} from "lucide-react";

import { useNotification } from "../notification/NotificationContext";

import "./NotificationOverlay.css";

const CONFIG = {

    info: {

        icon: <Swords className="size-4" />,

        iconBg: "#003DA5",

        iconColor: "#fff",

        accentColor: "#00AEEF",

        title: "Nova Partida",

        subtitle: "Faça seu palpite antes do início da partida.",

    },

    success: {

        icon: <Star className="size-4" />,

        iconBg: "#FDC300",

        iconColor: "#000",

        accentColor: "#FDC300",

        title: "+3 Pontos",

        subtitle:
            "Aqui temos um Alpha! Você previu o placar correto.",

    },

    warning: {

        icon: <Check className="size-4" />,

        iconBg: "#00A550",

        iconColor: "#fff",

        accentColor: "#00A550",

        title: "+1 Ponto",

        subtitle:
            "Você acertou o vencedor da partida!",

    },

    error: {

        icon: <CircleOff className="size-4" />,

        iconBg: "#E8192C",

        iconColor: "#fff",

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

    useEffect(() => {

        if (!currentNotification)
            return;

        const timer = setTimeout(() => {

            nextNotification();

        }, 5000);

        return () => clearTimeout(timer);

    }, [currentNotification]);

    if (!currentNotification)
        return null;

    const cfg = CONFIG[currentNotification.type];

    return (

        <div className="notification-wrapper">

            <AnimatePresence mode="wait">

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

                        boxShadow: `0 8px 32px rgba(0,0,0,.5),
                        0 0 0 1px ${cfg.accentColor}15`,

                    }}

                >

                    <div

                        className="notification-accent"

                        style={{
                            background: cfg.accentColor,
                        }}

                    />

                    <div className="notification-content">

                        <div className="notification-icon"

                            style={{
                                background: cfg.iconBg,
                                color: cfg.iconColor,
                            }}

                        >

                            {cfg.icon}

                        </div>

                        <div className="notification-text">

                            <h2

                                style={{
                                    color: cfg.accentColor,
                                }}

                            >

                                {cfg.title}

                            </h2>

                            <p className="notification-message">

                                {currentNotification.message}

                            </p>

                            <p className="notification-subtitle">

                                {cfg.subtitle}

                            </p>

                        </div>

                        <button

                            className="notification-close"

                            onClick={nextNotification}

                        >

                            <X size={18} />

                        </button>

                    </div>

                </motion.div>

            </AnimatePresence>

        </div>

    );

}